import fs from 'fs-extra';
import path from 'path';
import { TarotCard } from '../models/card.model';

export class CardService {
  private cardsPath = path.join(__dirname, '../../data/cards/json/tarot-cards.json');
  private cards: TarotCard[] = [];
  private loaded = false;

  constructor() {
    this.loadCards();
  }

  async loadCards(): Promise<void> {
    try {
      const data = await fs.readJson(this.cardsPath);
      this.cards = data.cards;
      this.loaded = true;
    } catch (error) {
      console.error('카드 로드 실패다요:', error);
      this.cards = [];
      this.loaded = false;
    }
  }

  async getAllCards(): Promise<TarotCard[]> {
    if (!this.loaded) {
      await this.loadCards();
    }
    return this.cards;
  }

  getCardById(id: number): TarotCard | undefined {
    return this.cards.find(card => card.id === id);
  }
}