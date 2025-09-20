import fs from 'fs-extra';
import path from 'path';
import { TarotCard, DrawnCard } from '../models/card.model';
import { SpreadType } from '../models/spread.model';

export class CardService {
  private cardsPath = path.join(__dirname, '../../data/cards/json/tarot-cards.json');
  private spreadsPath = path.join(__dirname, '../../data/spreads');
  private cards: TarotCard[] = [];
  private sessionCards: Map<string, Set<number>> = new Map();

  async loadCards(): Promise<void> {
    const data = await fs.readJson(this.cardsPath);
    this.cards = data.cards;
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

  async getSpreadById(spreadId: string): Promise<SpreadType> {
    const filePath = path.join(this.spreadsPath, `${spreadId}.json`);
    return await fs.readJson(filePath);
  }

  async drawCardsForSpread(spreadType: string, count: number, sessionId?: string): Promise<DrawnCard[]> {
    const spread = await this.getSpreadById(spreadType);
    const session = sessionId || 'default';

    if (!this.sessionCards.has(session)) {
      this.sessionCards.set(session, new Set());
    }

    const usedCardIds = this.sessionCards.get(session)!;
    const availableCards = this.cards.filter(card => !usedCardIds.has(card.id));

    if (availableCards.length < count) {
      this.resetUsedCards(session);
      return this.drawCardsForSpread(spreadType, count, sessionId);
    }

    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count);

    drawn.forEach(card => usedCardIds.add(card.id));

    return drawn.map((card, index) => ({
      card,
      position: index + 1,
      positionName: spread.positions[index]?.nameKr || `위치 ${index + 1}`,
      isReversed: Math.random() <= 0.5
    }));
  }

  resetUsedCards(sessionId?: string): void {
    const session = sessionId || 'default';
    this.sessionCards.set(session, new Set());
  }

  getUsedCardCount(sessionId?: string): number {
    const session = sessionId || 'default';
    return this.sessionCards.get(session)?.size || 0;
  }

  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  cleanupOldSessions(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    for (const sessionId of this.sessionCards.keys()) {
      if (sessionId.startsWith('session_')) {
        const timestamp = parseInt(sessionId.split('_')[1]);
        if (timestamp < oneHourAgo) {
          this.sessionCards.delete(sessionId);
        }
      }
    }
  }
}