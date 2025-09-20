import { Request, Response } from 'express';
import { ServiceManager } from '../services/service-manager';

export class CardController {
  private serviceManager: ServiceManager;

  constructor() {
    this.serviceManager = ServiceManager.getInstance();
  }

  async drawCards(req: Request, res: Response): Promise<void> {
    try {
      const { spreadType, count, sessionId } = req.body;

      if (!spreadType || !count) {
        res.status(400).json({
          success: false,
          message: '스프레드 타입과 카드 개수를 입력해주세요다요!'
        });
        return;
      }

      if (count < 1 || count > 12) {
        res.status(400).json({
          success: false,
          message: '카드는 1장부터 12장까지만 뽑을 수 있다요!'
        });
        return;
      }

      const drawnCards = await this.serviceManager.cardService.drawCardsForSpread(spreadType, count, sessionId);

      res.json({
        success: true,
        data: {
          cards: drawnCards,
          spreadType,
          sessionId: sessionId || 'default',
          usedCardCount: this.serviceManager.cardService.getUsedCardCount(sessionId)
        },
        message: `${count}장의 카드를 뽑았다요!`
      });
    } catch (error) {
      console.error('카드 추출 실패:', error);
      res.status(500).json({
        success: false,
        message: '카드 뽑기에 실패했다요...'
      });
    }
  }

  async resetCards(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.body;
      this.serviceManager.cardService.resetUsedCards(sessionId);

      res.json({
        success: true,
        message: '카드 덱을 새로 섞었다요!'
      });
    } catch (error) {
      console.error('카드 리셋 실패:', error);
      res.status(500).json({
        success: false,
        message: '카드 리셋에 실패했다요...'
      });
    }
  }

  async getAllCards(req: Request, res: Response): Promise<void> {
    try {
      const cards = this.serviceManager.cardService.getAllCards();

      res.json({
        success: true,
        data: cards,
        count: cards.length,
        message: '모든 카드 정보를 불러왔다요!'
      });
    } catch (error) {
      console.error('카드 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '카드 목록 조회에 실패했다요...'
      });
    }
  }

  async getCardById(req: Request, res: Response): Promise<void> {
    try {
      const { cardId } = req.params;
      const id = parseInt(cardId);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '올바른 카드 ID를 입력해주세요다요!'
        });
        return;
      }

      const card = this.serviceManager.cardService.getCardById(id);

      if (!card) {
        res.status(404).json({
          success: false,
          message: '해당 카드를 찾을 수 없다요...'
        });
        return;
      }

      res.json({
        success: true,
        data: card,
        message: '카드 정보를 불러왔다요!'
      });
    } catch (error) {
      console.error('카드 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '카드 조회에 실패했다요...'
      });
    }
  }

  async createSession(req: Request, res: Response): Promise<void> {
    try {
      const newSessionId = this.serviceManager.cardService.generateSessionId();

      res.json({
        success: true,
        data: {
          sessionId: newSessionId
        },
        message: '새로운 세션을 생성했다요!'
      });
    } catch (error) {
      console.error('세션 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: '세션 생성에 실패했다요...'
      });
    }
  }

  async cleanupSessions(req: Request, res: Response): Promise<void> {
    try {
      this.serviceManager.cardService.cleanupOldSessions();

      res.json({
        success: true,
        message: '오래된 세션들을 정리했다요!'
      });
    } catch (error) {
      console.error('세션 정리 실패:', error);
      res.status(500).json({
        success: false,
        message: '세션 정리에 실패했다요...'
      });
    }
  }
}