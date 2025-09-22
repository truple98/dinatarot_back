import { Request, Response } from 'express';
import { CardService } from '../services/card.service';
import { SpreadService } from '../services/spread.service';

export class CardController {
  private cardService: CardService;
  private spreadService: SpreadService;

  constructor() {
    this.cardService = new CardService();
    this.spreadService = new SpreadService();
  }

  async drawCards(req: Request, res: Response): Promise<void> {
    try {
      const { spreadType, count } = req.body;

      if (!spreadType || !count) {
        res.status(400).json({
          success: false,
          message: '스프레드 타입과 카드 수를 제공해야 한다요!'
        });
        return;
      }

      const spread = await this.spreadService.getSpreadByType(spreadType);
      if (!spread) {
        res.status(404).json({
          success: false,
          message: '해당 스프레드를 찾을 수 없다요...'
        });
        return;
      }

      if (count !== spread.positions.length) {
        res.status(400).json({
          success: false,
          message: `${spreadType} 스프레드는 ${spread.positions.length}장의 카드가 필요하다요!`
        });
        return;
      }

      const drawnCards = this.cardService.drawRandomCards(count);

      drawnCards.forEach((drawnCard, index) => {
        drawnCard.positionName = spread.positions[index].nameKr;
      });

      res.json({
        success: true,
        data: {
          spread: spread,
          cards: drawnCards
        },
        message: '카드를 뽑았다요!'
      });
    } catch (error) {
      console.error('카드 추출을 실패했다요...:', error);
      res.status(500).json({
        success: false,
        message: '카드 추출에 실패했다요...'
      });
    }
  }

  async getAllCards(req: Request, res: Response): Promise<void> {
    try {
      const cards = this.cardService.getAllCards();

      res.json({
        success: true,
        data: cards,
        message: '모든 카드를 불러왔다요!'
      });
    } catch (error) {
      console.error('카드 목록 조회를 실패했다요...:', error);
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
          message: '올바른 카드 ID를 제공해야 한다요!'
        });
        return;
      }

      const card = this.cardService.getCardById(id);

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
      console.error('카드 조회를 실패했다요...:', error);
      res.status(500).json({
        success: false,
        message: '카드 조회를 실패했다요...'
      });
    }
  }
}