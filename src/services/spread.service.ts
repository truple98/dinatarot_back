import fs from 'fs-extra';
import path from 'path';
import { SpreadType } from '../models/spread.model';

export class SpreadService {
  private spreadsPath = path.join(__dirname, '../../data/spreads');
  private spreads: Map<string, SpreadType> = new Map();

  async loadSpreads(): Promise<void> {
    const spreadFiles = ['three-card.json', 'celtic-cross.json', 'relationship.json', 'horoscope.json'];

    for (const file of spreadFiles) {
      const filePath = path.join(this.spreadsPath, file);
      if (await fs.pathExists(filePath)) {
        const spreadData = await fs.readJson(filePath);
        this.spreads.set(spreadData.type, spreadData);
      }
    }
  }

  async getSpreadByType(type: string): Promise<SpreadType | undefined> {
    if (this.spreads.size === 0) {
      await this.loadSpreads();
    }
    return this.spreads.get(type);
  }

  async getAllSpreads(): Promise<SpreadType[]> {
    if (this.spreads.size === 0) {
      await this.loadSpreads();
    }
    return Array.from(this.spreads.values());
  }

  async getSpreadById(spreadId: string): Promise<SpreadType | undefined> {
    const filePath = path.join(this.spreadsPath, `${spreadId}.json`);

    if (!await fs.pathExists(filePath)) {
      return undefined;
    }

    return await fs.readJson(filePath);
  }
}