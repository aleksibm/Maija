import { createDeck, dealHands, determineTrump, shuffleDeck } from "./cards.ts";
import type { Card, GameState, PlayerState } from "./types.ts";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 5;
export const DEFAULT_HAND_SIZE = 5;

export function createGame(
  playerNames: readonly string[],
  rng: () => number = Math.random
): GameState {
  if (playerNames.length < MIN_PLAYERS || playerNames.length > MAX_PLAYERS) {
    throw new Error(
      `Maija supports ${MIN_PLAYERS}-${MAX_PLAYERS} players. Received ${playerNames.length}.`
    );
  }

  const deck = shuffleDeck(createDeck(), rng);
  const { players, stock: undealtStock } = dealHands(
    deck,
    playerNames,
    DEFAULT_HAND_SIZE
  );
  const trump = determineTrump(undealtStock);

  return {
    players,
    stock: trump.stock,
    discard: [],
    trumpSuit: trump.trumpSuit,
    trumpCard: trump.trumpCard,
    currentLeaderIndex: 0,
    phase: "lead",
    loserId: null,
    handSize: DEFAULT_HAND_SIZE,
    supportedPlayerRange: [MIN_PLAYERS, MAX_PLAYERS]
  };
}

export function createV1Game(rng: () => number = Math.random): GameState {
  return createGame(["Player 1", "Player 2"], rng);
}

export function getTurnOrderIndices(
  playerCount: number,
  startingIndex = 0
): number[] {
  return Array.from({ length: playerCount }, (_, offset) => {
    return (startingIndex + offset) % playerCount;
  });
}

export function refillHand(
  player: PlayerState,
  stock: readonly Card[],
  handSize = DEFAULT_HAND_SIZE
): { player: PlayerState; stock: Card[] } {
  const nextPlayer: PlayerState = {
    ...player,
    hand: [...player.hand]
  };
  const nextStock = [...stock];

  while (nextPlayer.hand.length < handSize && nextStock.length > 0) {
    nextPlayer.hand.push(nextStock.pop()!);
  }

  return { player: nextPlayer, stock: nextStock };
}

export function refillPlayers(
  players: readonly PlayerState[],
  stock: readonly Card[],
  startingIndex = 0,
  handSize = DEFAULT_HAND_SIZE
): { players: PlayerState[]; stock: Card[] } {
  const nextPlayers = players.map((player) => ({
    ...player,
    hand: [...player.hand]
  }));
  let nextStock = [...stock];

  for (const playerIndex of getTurnOrderIndices(nextPlayers.length, startingIndex)) {
    if (nextPlayers[playerIndex]!.isOut) {
      continue;
    }

    const refillResult = refillHand(
      nextPlayers[playerIndex]!,
      nextStock,
      handSize
    );

    nextPlayers[playerIndex] = refillResult.player;
    nextStock = refillResult.stock;
  }

  return {
    players: nextPlayers,
    stock: nextStock
  };
}

export function markOutPlayers(
  players: readonly PlayerState[],
  stock: readonly Card[]
): PlayerState[] {
  if (stock.length > 0) {
    return players.map((player) => ({
      ...player,
      hand: [...player.hand]
    }));
  }

  return players.map((player) => ({
    ...player,
    hand: [...player.hand],
    isOut: player.hand.length === 0
  }));
}
