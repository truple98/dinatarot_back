import { Request, Response } from 'express';
import { LLMService } from '../services/llm.service';

export class ReadingController {
  private llmService: LLMService;

  constructor() {
    this.llmService = new LLMService();
  }

  async generateReading(req: Request, res: Response): Promise<void> {
    try {
      const { cards, spread, question, userName, userConcern } = req.body;

      if (!cards || !Array.isArray(cards) || cards.length === 0) {
        res.status(400).json({
          success: false,
          message: '카드 정보를 제공해야 한다요!'
        });
        return;
      }

      if (!spread) {
        res.status(400).json({
          success: false,
          message: '스프레드 정보를 제공해야 한다요!'
        });
        return;
      }

      if (!userName) {
        res.status(400).json({
          success: false,
          message: '이름을 입력해야 한다요!'
        });
        return;
      }

      if (!userConcern) {
        res.status(400).json({
          success: false,
          message: '고민이나 질문을 입력해야 한다요!'
        });
        return;
      }

      const reading = await this.llmService.generateTarotReading(
        req.body.userName,
        req.body.userConcern,
        cards,
        spread.nameKr || spread.type,
        " "
      );

      res.json({
        success: true,
        data: {
          reading,
          cards,
          spread,
          question: question || null,
          timestamp: new Date().toISOString()
        },
        message: '타로 해석을 생성했다요!'
      });
    } catch (error) {
      console.error('타로 해석 생성을 실패했다요...:', error);
      res.status(500).json({
        success: false,
        message: '타로 해석 생성에 실패했다요...'
      });
    }
  }
}