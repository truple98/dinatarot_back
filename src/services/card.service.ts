import fs from 'fs-extra';
import path from 'path';
import { TarotCard, DrawnCard } from '../models/card.model';

export class CardService {
  private cardsPath = path.join(__dirname, '../../data/cards/json/tarot-cards.json');
  private cards: TarotCard[] = [];

  constructor() {
    this.loadCards();
  }

  async loadCards(): Promise<void> {
    try {
      const data = await fs.readJson(this.cardsPath);
      this.cards = data.cards;
    } catch (error) {
      console.error('카드 로드 실패다요:', error);
      this.cards = [];
    }
  }

  getAllCards(): TarotCard[] {
    return this.cards;
  }

  getCardById(id: number): TarotCard | undefined {
    return this.cards.find(card => card.id === id);
  }

  drawRandomCards(count: number): DrawnCard[] {
    const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count);

    return drawn.map((card, index) => ({
      card,
      position: index + 1,
      positionName: '',
      isReversed: Math.random() <= 0.5
    }));
  }
}