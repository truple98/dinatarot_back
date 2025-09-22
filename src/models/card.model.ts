import { SpreadType } from "./spread.model";

export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  suit?: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';
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
  element?: 'fire' | 'water' | 'air' | 'earth';
  planet?: string;
  zodiac?: string;
}

export interface DrawnCard {
  card: TarotCard;
  position: number;
  positionName: string;
  isForward: boolean;
}

export interface CardDrawResponse {
  success: boolean;
  data: {
    spread: SpreadType;
    cards: DrawnCard[];
  };
  message: string;
}

export interface CardDrawRequest {
  spreadType: string;
}