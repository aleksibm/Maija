import {
  MAIJA_RANK,
  RANKS,
  SUITS,
  type Card,
  type PlayerState,
  type TrumpSelection
} from "./types.ts";

const RANK_LABELS: Record<number, string> = {
  11: "J",
  12: "Q",
  13: "K",
  14: "A"
};

function drawTopCard(stock: Card[]): Card {
  const card = stock.pop();

  if (!card) {
    throw new Error("Cannot draw from an empty stock.");
  }

  return card;
}

function insertIntoMiddle(stock: Card[], card: Card): void {
  const middleIndex = Math.floor(stock.length / 2);
  stock.splice(middleIndex, 0, card);
}

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
        isMaija: suit === "spades" && rank === MAIJA_RANK
      });
    }
  }

  return deck;
}

export function shuffleDeck(
  deck: readonly Card[],
  rng: () => number = Math.random
): Card[] {
  const shuffled = [...deck];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const currentCard = shuffled[index];

    shuffled[index] = shuffled[swapIndex]!;
    shuffled[swapIndex] = currentCard!;
  }

  return shuffled;
}

export function dealHands(
  deck: readonly Card[],
  playerNames: readonly string[],
  handSize = 5
): { players: PlayerState[]; stock: Card[] } {
  const stock = [...deck];
  const players: PlayerState[] = playerNames.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    hand: [],
    isOut: false
  }));

  for (let round = 0; round < handSize; round += 1) {
    for (const player of players) {
      player.hand.push(drawTopCard(stock));
    }
  }

  return { players, stock };
}

export function determineTrump(stock: readonly Card[]): TrumpSelection {
  const workingStock = [...stock];
  const recycledSpades: Card[] = [];
  let revealed = drawTopCard(workingStock);

  while (revealed.suit === "spades") {
    recycledSpades.push(revealed);
    insertIntoMiddle(workingStock, revealed);
    revealed = drawTopCard(workingStock);
  }

  // The revealed trump card sits under the stock and becomes the last card drawn.
  workingStock.unshift(revealed);

  return {
    trumpSuit: revealed.suit,
    trumpCard: revealed,
    stock: workingStock,
    recycledSpades
  };
}

export function cardToString(card: Card): string {
  const rankLabel = RANK_LABELS[card.rank] ?? String(card.rank);
  const suitLabel = card.suit.slice(0, 1).toUpperCase();
  const maijaLabel = card.isMaija ? " Maija" : "";

  return `${rankLabel}${suitLabel}${maijaLabel}`;
}
