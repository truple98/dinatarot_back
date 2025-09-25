export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  suit: string | null;
  arcana: 'major' | 'minor';
  card_description: string;
  esoteric_interpretation: string | null;
  prime_elements: string | null;
  upright: {
    meaning: string;
    summary: string;
    keywords: string[];
  };
  reversed: {
    meaning: string;
    summary: string;
    keywords: string[];
  };
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
