import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { SpreadType } from '../models/spread.model';

export class SpreadController {
  private spreadsPath = path.join(__dirname, '../../data/spreads');

  async getAllSpreads(req: Request, res: Response): Promise<void> {
    try {
      const spreadFiles = ['three-card.json', 'celtic-cross.json', 'relationship.json', 'horoscope.json'];
      const spreads: SpreadType[] = [];

      for (const file of spreadFiles) {
        const filePath = path.join(this.spreadsPath, file);
        const spreadData = await fs.readJson(filePath);
        spreads.push(spreadData);
      }

      res.json({
        success: true,
        data: spreads,
        count: spreads.length,
        message: '스프레드 목록을 불러왔다요!'
      });
    } catch (error) {
      console.error('스프레드 목록 조회를 실패했다요...:', error);
      res.status(500).json({
        success: false,
        message: '스프레드 목록 조회에 실패했다요...'
      });
    }
  }

  async getSpreadById(req: Request, res: Response): Promise<void> {
    try {
      const { spreadId } = req.params;
      const filePath = path.join(this.spreadsPath, `${spreadId}.json`);

      if (!await fs.pathExists(filePath)) {
        res.status(404).json({
          success: false,
          message: '해당 스프레드를 찾을 수 없다요...'
        });
        return;
      }

      const spreadData = await fs.readJson(filePath);

      res.json({
        success: true,
        data: spreadData,
        message: '스프레드 정보를 불러왔다요!'
      });
    } catch (error) {
      console.error('스프레드 조회를 실패했다요...:', error);
      res.status(500).json({
        success: false,
        message: '스프레드 조회에 실패했다요...'
      });
    }
  }
}