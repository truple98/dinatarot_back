export interface SpreadPosition {
    id: number;
    name: string;
    nameKr: string;
    description: string;
    x?: number;
    y?: number;
}
export interface SpreadData {
    id: string;
    name: string;
    nameKr: string;
    cardCount: number;
    description: string;
    positions: SpreadPosition[];
    summaryGuide: {
        title: string;
        description: string;
        analysisPrompt: string;
    };
}
export interface SpreadsData {
    [key: string]: SpreadData;
}
//# sourceMappingURL=spread.model.d.ts.map