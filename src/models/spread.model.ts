export interface SpreadPosition {
  id: number;
  name: string;
  nameKr: string;
  description: string;
  x: number;
  y: number;
}

export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  cardCount: number;
  description: string;
  positions: SpreadPosition[];
}