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
export declare class RAGService {
    private embeddingsPath;
    private embeddings;
    private openai;
    private getOpenAI;
    initialize(): Promise<void>;
    processPDF(pdfPath: string): Promise<string[]>;
    private chunkText;
    createEmbedding(text: string): Promise<number[]>;
    createEmbeddings(chunks: string[], source: string): Promise<void>;
    loadEmbeddings(): Promise<void>;
    saveEmbeddings(): Promise<void>;
    searchSimilar(query: string, topK?: number): Promise<EmbeddingData[]>;
    private cosineSimilarity;
    getRelevantContext(userConcern: string, cardNames: string[]): Promise<string>;
}
export {};
//# sourceMappingURL=rag.service.d.ts.map