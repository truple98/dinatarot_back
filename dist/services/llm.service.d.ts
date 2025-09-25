import { TarotCard } from "../models/card.model";
interface DrawnCardWithDetails {
    cardId: number;
    position: number;
    positionName: string;
    isForward: boolean;
    card: TarotCard;
    positionDescription: string;
}
export declare class LLMService {
    private openai;
    private getOpenAI;
    generateTarotReading(userName: string, userConcern: string, drawnCards: DrawnCardWithDetails[], spreadType: string, analysisPrompt?: string): Promise<string>;
}
export {};
//# sourceMappingURL=llm.service.d.ts.map