import { Request, Response } from 'express';
import { ServiceManager } from '../services/service-manager';
import { DrawnCard } from '../models/card.model';

export class ReadingController {
  private serviceManager: ServiceManager;

  constructor() {
    this.serviceManager = ServiceManager.getInstance();
  }

  async interpretReading(req: Request, res: Response): Promise<void> {
    try {
      const { userName, userConcern, drawnCards, spreadType } = req.body;

      if (!userName || !userConcern || !drawnCards || !spreadType) {
        res.status(400).json({
          success: false,
          message: '모든 필수 정보를 입력해주세요다요! (이름, 고민, 카드, 스프레드 타입)'
        });
        return;
      }

      if (!Array.isArray(drawnCards) || drawnCards.length === 0) {
        res.status(400).json({
          success: false,
          message: '최소 1장의 카드가 필요하다요!'
        });
        return;
      }

      if (!this.serviceManager.ragService || !this.serviceManager.llmService) {
        res.status(503).json({
          success: false,
          message: 'AI 서비스가 설정되지 않았습니다. OPENAI_API_KEY를 설정해주세요다요!'
        });
        return;
      }

      const cardNames = drawnCards.map((dc: DrawnCard) => dc.card.nameKr);
      const relevantContext = await this.serviceManager.ragService.getRelevantContext(userConcern, cardNames);

      const interpretation = await this.serviceManager.llmService.generateTarotReading(
        userName,
        userConcern,
        drawnCards,
        spreadType,
        relevantContext
      );

      res.json({
        success: true,
        data: {
          interpretation,
          userName,
          userConcern,
          spreadType,
          cardCount: drawnCards.length,
          cards: drawnCards.map((dc: DrawnCard) => ({
            position: dc.position,
            positionName: dc.positionName,
            cardName: dc.card.nameKr,
            isReversed: dc.isReversed
          }))
        },
        message: '타로 해석이 완성되었다요!'
      });
    } catch (error) {
      console.error('타로 해석 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: '타로 해석 생성에 실패했다요...'
      });
    }
  }

  async getReadingHistory(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        data: [],
        message: '해석 히스토리 기능은 추후 구현 예정이다요!'
      });
    } catch (error) {
      console.error('히스토리 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '히스토리 조회에 실패했다요...'
      });
    }
  }
}