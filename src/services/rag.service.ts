import fs from 'fs-extra';
import path from 'path';
import pdf from 'pdf-parse';
import OpenAI from 'openai';

interface EmbeddingData {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    cardId?: number;
    section?: string;
  };
}

export class RAGService {
  private embeddingsPath = path.join(__dirname, '../../data/embeddings/embeddings.json');
  private embeddings: EmbeddingData[] = [];

  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }



  async initialize(): Promise<void> {
    await this.loadEmbeddings();
  }
  
  async processPDF(pdfPath: string): Promise<string[]> {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);

    return this.chunkText(data.text);
  }



  // CHUNK

  private chunkText(text: string, chunkSize: number = 1000): string[] {
    const sentences = text.split(/[.!?]+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length < chunkSize) {
        currentChunk += sentence + '. ';
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence + '. ';
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }




  // OpenAI Embedding :D

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('임베딩 생성을 실패했다요...:', error);
      throw new Error('임베딩 생성을 실패해버렸다요...');
    }
  }

  async createEmbeddings(chunks: string[], source: string): Promise<void> {
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await this.createEmbedding(chunks[i]);

      this.embeddings.push({
        id: `${source}_${i}`,
        text: chunks[i],
        embedding,
        metadata: {
          source,
          section: `chunk_${i}`
        }
      });
    }

    await this.saveEmbeddings();
  }

  async loadEmbeddings(): Promise<void> {
    try {
      if (await fs.pathExists(this.embeddingsPath)) {
        this.embeddings = await fs.readJson(this.embeddingsPath);
      }
    } catch (error) {
      console.error('임베딩 로드에 실패했다요: ', error);
      this.embeddings = [];
    }
  }

  async saveEmbeddings(): Promise<void> {
    await fs.ensureDir(path.dirname(this.embeddingsPath));
    await fs.writeJson(this.embeddingsPath, this.embeddings, { spaces: 2 });
  }



  // 코사인 유사도 계산식

  async searchSimilar(query: string, topK: number = 5): Promise<EmbeddingData[]> {
    const queryEmbedding = await this.createEmbedding(query);

    const similarities = this.embeddings.map(item => ({
      ...item,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding)
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }

  async getRelevantContext(userConcern: string, cardNames: string[]): Promise<string> {
    const searchQuery = `${userConcern} ${cardNames.join(' ')}`;
    const similarTexts = await this.searchSimilar(searchQuery, 3);

    return similarTexts.map(item => item.text).join('\n\n');
  }
}