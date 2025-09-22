import { Request, Response } from "express";
import fs from 'fs-extra';
import path from 'path';
import { CardService } from "../services/card.service";

export class CardController {
  private cardService: CardService;

  constructor() {
    this.cardService = new CardService();
  }

  async drawCards(req: Request, res: Response): Promise<void> {
    try {
      const { spreadType } = req.body;

      if (!spreadType) {
        res.status(400).json({
          success: false,
          message: '스프레드 타입을 제공해야 한다요!'
        });
        return;
      }

      const spreadPath = path.join(__dirname, '../../data/spreads', `${spreadType}.json`);

      if (!await fs.pathExists(spreadPath)) {
        res.status(404).json({
          success: false,
          message: '해당 스프레드를 찾을 수 없다요...'
        });
        return;
      }

      const spread = await fs.readJson(spreadPath);

      const allCards = await this.cardService.getAllCards();
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      const drawnCards = shuffled.slice(0, spread.cardCount);

      const cards = drawnCards.map((card, index) => ({
        card,
        position: index + 1,
        positionName: spread.positions[index].nameKr,
        isForward: Math.random() > 0.5
      }));

      res.json({
        success: true,
        data: {
          spread,
          cards
        },
        message: '카드를 뽑았다요!'
      });

    } catch (error) {
      console.error('카드 추출 실패:', error);
      res.status(500).json({
        success: false,
        message: '카드 추출에 실패했다요...'
      });
    }
  }
}