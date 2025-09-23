export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  suit: string | null;
  arcana: 'major' | 'minor';
  upright: {
    keywords: string[];
    meaning: string;
    description: string;
  };
  reversed: {
    keywords: string[];
    meaning: string;
    description: string;
  };
  imageFile: string;
  element?: string;
  planet?: string;
  zodiac?: string;
}

export interface TarotCardsData {
  cards: TarotCard[];
}

export interface DrawnCard {
  cardId: number;
  position: number;
  positionName: string;
  isForward: boolean;
}
