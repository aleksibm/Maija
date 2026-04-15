export const SUITS = ["clubs", "diamonds", "hearts", "spades"] as const;
export const NON_SPADE_SUITS = ["clubs", "diamonds", "hearts"] as const;
export const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;
export const MAIJA_RANK = 12;

export type Suit = (typeof SUITS)[number];
export type TrumpSuit = (typeof NON_SPADE_SUITS)[number];
export type Rank = (typeof RANKS)[number];

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  isMaija: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  hand: Card[];
  isOut: boolean;
}

export type GamePhase = "lead" | "defense" | "game-over";

export interface TrumpSelection {
  trumpSuit: TrumpSuit;
  trumpCard: Card;
  stock: Card[];
  recycledSpades: Card[];
}

export interface GameState {
  players: PlayerState[];
  stock: Card[];
  discard: Card[];
  trumpSuit: TrumpSuit;
  trumpCard: Card;
  currentLeaderIndex: number;
  phase: GamePhase;
  loserId: string | null;
  handSize: number;
  supportedPlayerRange: readonly [number, number];
}
