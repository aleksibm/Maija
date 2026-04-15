import { cardToString } from "./engine/cards.ts";
import { createV1Game } from "./engine/game.ts";

const game = createV1Game();

console.log("Maija v1 engine scaffold");
console.log(`Players: ${game.players.length}`);
console.log(`Trump: ${cardToString(game.trumpCard)} (${game.trumpSuit})`);
console.log(`Stock remaining: ${game.stock.length}`);

for (const player of game.players) {
  const handSummary = player.hand.map(cardToString).join(", ");
  console.log(`${player.name}: ${handSummary}`);
}
