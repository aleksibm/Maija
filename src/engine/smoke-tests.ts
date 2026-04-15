import assert from "node:assert/strict";

import { cardToString, createDeck, determineTrump } from "./cards.ts";
import {
  createGame,
  createV1Game,
  markOutPlayers,
  refillPlayers
} from "./game.ts";
import type { Card, PlayerState } from "./types.ts";

function runTest(name: string, testFn: () => void): void {
  testFn();
  console.log(`PASS ${name}`);
}

runTest("createDeck builds a full 52-card deck with exactly one Maija", () => {
  const deck = createDeck();
  const maijaCards = deck.filter((card) => card.isMaija);

  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map((card) => card.id)).size, 52);
  assert.equal(maijaCards.length, 1);
  assert.equal(cardToString(maijaCards[0]!), "QS Maija");
});

runTest("determineTrump skips spades and puts the final trump under the stock", () => {
  const stock: Card[] = [
    { id: "2-clubs", suit: "clubs", rank: 2, isMaija: false },
    { id: "14-hearts", suit: "hearts", rank: 14, isMaija: false },
    { id: "12-spades", suit: "spades", rank: 12, isMaija: true }
  ];

  const trump = determineTrump(stock);

  assert.equal(trump.trumpSuit, "hearts");
  assert.equal(trump.trumpCard.id, "14-hearts");
  assert.deepEqual(
    trump.recycledSpades.map((card) => card.id),
    ["12-spades"]
  );
  assert.equal(trump.stock[0]!.id, "14-hearts");
  assert.equal(trump.stock.at(-1)!.id, "12-spades");
});

runTest("createGame supports a two-player v1 game and keeps five cards per player", () => {
  const game = createV1Game(() => 0.5);

  assert.equal(game.players.length, 2);
  assert.equal(game.players.every((player) => player.hand.length === 5), true);
  assert.notEqual(game.trumpSuit, "spades");
  assert.equal(game.stock.length, 42);
});

runTest("createGame validates the supported player range", () => {
  assert.throws(() => createGame(["Solo"]), /2-5 players/i);
  assert.throws(
    () => createGame(["1", "2", "3", "4", "5", "6"]),
    /2-5 players/i
  );
});

runTest("refillPlayers tops up hands in turn order until the stock runs out", () => {
  const deck = createDeck();
  const players: PlayerState[] = [
    {
      id: "player-1",
      name: "Player 1",
      hand: deck.slice(0, 3),
      isOut: false
    },
    {
      id: "player-2",
      name: "Player 2",
      hand: deck.slice(3, 4),
      isOut: false
    }
  ];
  const stock = deck.slice(4, 10);

  const result = refillPlayers(players, stock, 1);

  assert.equal(result.players[1]!.hand.length, 5);
  assert.equal(result.players[0]!.hand.length, 5);
  assert.equal(result.stock.length, 0);
});

runTest("markOutPlayers only eliminates empty-handed players after the stock is gone", () => {
  const deck = createDeck();
  const players: PlayerState[] = [
    {
      id: "player-1",
      name: "Player 1",
      hand: [],
      isOut: false
    },
    {
      id: "player-2",
      name: "Player 2",
      hand: [deck[0]!],
      isOut: false
    }
  ];

  const result = markOutPlayers(players, []);

  assert.equal(result[0]!.isOut, true);
  assert.equal(result[1]!.isOut, false);
});

console.log("All smoke tests passed.");
