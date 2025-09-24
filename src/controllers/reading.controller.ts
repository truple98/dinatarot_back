import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { TarotCardsData, TarotCard ,DrawnCard } from '../models/card.model';
import { LLMService } from '../services/llm.service';
import { RAGService } from '../services/rag.service';

interface InterpretRequest {
  userName: string;
  userConcern: string;
  spreadType: string;
  drawnCards: DrawnCard[];
}

interface InterpretResponse {
  success: boolean;
  data?: {
    userName: string;
    userConcern: string;
    spreadType: string;
    drawnCards: DrawnCard[];
    interpretation: string;
  };
  message: string;
};

export class ReadingController {
  private llmService: LLMService;
  private ragService: RAGService;
  private cardsData: TarotCardsData | null = null;
  private dataLoadPromise: Promise<void> | null = null;

  constructor() {
    this.llmService = new LLMService();
    this.ragService = new RAGService();
    this.dataLoadPromise = this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const cardsPath = path.join(process.cwd(), 'data/cards/tarot-cards.json');
      this.cardsData = await fs.readJson(cardsPath) as TarotCardsData;

      // RAG 서비스 초기화
      await this.ragService.initialize();
      console.log('RAG 서비스 초기화 완료');
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      throw error;
    }
  }

  async interpretTarot(req: Request, res: Response): Promise<void> {
    try {
      if (this.dataLoadPromise) {
        await this.dataLoadPromise;
        this.dataLoadPromise = null;
      }

      const { userName, userConcern, spreadType, drawnCards }: InterpretRequest = req.body;


      if (!userName || !userConcern || !spreadType || !drawnCards) {
        const response : InterpretResponse = {
          success: false,
          message: '필수 정보가 누락되었다요!'
        };
        res.status(400).json(response);
        return;
      }

      if (!this.cardsData) {
        const response: InterpretResponse = {
          success: false,
          message: '카드 데이터 로딩에 실패했다요...'
        };
        res.status(500).json(response);
        return;
      }

      const drawnCardsWithDetails = drawnCards.map((drawn: DrawnCard) => {
        const card = this.cardsData!.cards.find((card: TarotCard) => card.id === drawn.cardId);
        if (!card) {
          throw new Error(`카드 ID ${drawn.cardId}를 찾을 수 없다요... 유효한 카드 ID(0-77)를 달라요!`);
        }
        return {
          cardId: drawn.cardId,
          position: drawn.position,
          positionName: drawn.positionName,
          isForward: drawn.isForward,
          card
        };
      });


      const interpretation = await this.llmService.generateTarotReading(
        userName,
        userConcern,
        drawnCardsWithDetails,
        spreadType
      );

      const response: InterpretResponse = {
        success: true,
        data: {
          userName,
          userConcern,
          spreadType,
          drawnCards,
          interpretation
        },
        message: '타로 해석이 완료되었다요!'
      };

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(response);

    } catch (error) {
      console.error('타로 해석 실패:', error);
      const response: InterpretResponse = {
        success: false,
        message: '타로 해석에 실패했다요...'
      };
      res.status(500).json(response);
    }
  }
}