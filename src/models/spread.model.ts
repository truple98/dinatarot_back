export interface SpreadPosition {
  id: number;
  name: string;
  nameKr: string;
  description: string;
  x?: number;
  y?: number;
}

export interface SpreadData {
  id: string;
  name: string;
  nameKr: string;
  cardCount: number;
  positions: string[];
}

export interface SpreadsData {
  [key: string]: SpreadData;
}