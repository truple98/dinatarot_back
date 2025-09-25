"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const openai_1 = __importDefault(require("openai"));
class RAGService {
    constructor() {
        this.embeddingsPath = path_1.default.join(__dirname, '../../data/embeddings/embeddings.json');
        this.embeddings = [];
        this.openai = null;
    }
    getOpenAI() {
        if (!this.openai) {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았다요!');
            }
            this.openai = new openai_1.default({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
        return this.openai;
    }
    async initialize() {
        await this.loadEmbeddings();
    }
    async processPDF(pdfPath) {
        const dataBuffer = await fs_extra_1.default.readFile(pdfPath);
        const data = await (0, pdf_parse_1.default)(dataBuffer);
        return this.chunkText(data.text);
    }
    // CHUNK
    chunkText(text, chunkSize = 1000) {
        const sentences = text.split(/[.!?]+/);
        const chunks = [];
        let currentChunk = '';
        for (const sentence of sentences) {
            if (currentChunk.length + sentence.length < chunkSize) {
                currentChunk += sentence + '. ';
            }
            else {
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
    async createEmbedding(text) {
        try {
            const openai = this.getOpenAI();
            const response = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
                encoding_format: 'float',
            });
            return response.data[0].embedding;
        }
        catch (error) {
            console.error('임베딩 생성을 실패했다요...:', error);
            throw new Error('임베딩 생성을 실패해버렸다요...');
        }
    }
    async createEmbeddings(chunks, source) {
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
    async loadEmbeddings() {
        try {
            if (await fs_extra_1.default.pathExists(this.embeddingsPath)) {
                this.embeddings = await fs_extra_1.default.readJson(this.embeddingsPath);
            }
        }
        catch (error) {
            console.error('임베딩 로드에 실패했다요: ', error);
            this.embeddings = [];
        }
    }
    async saveEmbeddings() {
        await fs_extra_1.default.ensureDir(path_1.default.dirname(this.embeddingsPath));
        await fs_extra_1.default.writeJson(this.embeddingsPath, this.embeddings, { spaces: 2 });
    }
    // 코사인 유사도 계산식
    async searchSimilar(query, topK = 5) {
        const queryEmbedding = await this.createEmbedding(query);
        const similarities = this.embeddings.map(item => ({
            ...item,
            similarity: this.cosineSimilarity(queryEmbedding, item.embedding)
        }));
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }
    cosineSimilarity(a, b) {
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
    async getRelevantContext(userConcern, cardNames) {
        const searchQuery = `${userConcern} ${cardNames.join(' ')}`;
        const similarTexts = await this.searchSimilar(searchQuery, 3);
        return similarTexts.map(item => item.text).join('\n\n');
    }
}
exports.RAGService = RAGService;
//# sourceMappingURL=rag.service.js.map