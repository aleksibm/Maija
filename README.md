# Maija

A digital version of the card game **Maija / Black Maria** using a standard 52-card deck.

## First Goal

Build a **local hot-seat prototype** first:

- One shared device
- Turn-based play
- No online multiplayer yet
- V1 defaults to a `2-player adaptation`
- Engine supports `2-5` players so the traditional `3-5` player rules still fit
- Final target is at least `5` players

This is the fastest way to make the game playable and test the rules.

## Game Summary

- Use a standard 52-card deck
- Aces are high
- Deal 5 cards to each player
- The remaining cards form the face-down stock
- Reveal a trump card from the stock
- If the revealed card is a spade, put it back into the middle of the stock and reveal another card
- The Queen of Spades is **Maija**
- Players refill to 5 cards whenever they have fewer than 5 and stock remains
- On a turn, the active player leads 1 or more cards
- All led cards must be the same suit
- Maija counts as a spade for suit-matching
- The number of led cards cannot exceed the number of cards in the left player's hand
- The left player tries to beat the led cards
- A higher card of the same suit beats a lower card
- Any trump beats any non-trump card
- One defending card beats one attacking card
- Maija cannot be beaten and cannot beat other cards
- If all led cards are beaten, the defender becomes the next leader
- If not all cards are beaten, the defender picks up the remaining cards and the turn passes left
- Once the stock is empty, players who run out of cards are out
- The last player still holding cards loses

## Current Product Decisions

These are the decisions already locked for the first implementation:

1. `V1 player count`
   The first playable version is a `2-player adaptation`.

2. `Final player count`
   The engine and game state should support `2-5` players, with the final version targeting at least `5`.

3. `Failed defense cleanup`
   If the defender beats some cards but not all, the likely digital rule is:
   - beaten pairs are discarded
   - unbeaten attack cards are picked up by the defender

   If you want a different interpretation, we should lock that before coding the resolution step.

4. `Putting a spade back into the middle`
   For a digital version, the simplest rule is to insert that card at `floor(stock.length / 2)`.

## Recommended MVP

Start with these milestones in order:

1. Build a rules engine with no visuals
2. Build a simple text or browser UI for local play
3. Add clear card selection and trick resolution
4. Add polish after the rules feel correct

Do not start with networking. The rules already have enough complexity that the engine should be stable first.

## Core Data Model

### Card

- `id`
- `suit`: clubs, diamonds, hearts, spades
- `rank`: 2-14
- `isMaija`

### Player

- `id`
- `name`
- `hand`
- `isOut`

### Trick

- `attackerIndex`
- `defenderIndex`
- `attackCards`
- `defensePairs`

### Game State

- `players`
- `stock`
- `discard`
- `trumpSuit`
- `currentLeaderIndex`
- `phase`
- `winner` or `loser`

## Core Engine Functions

- `createDeck()`
- `shuffleDeck()`
- `dealHands(players, handSize)`
- `determineTrump(stock)`
- `refillHand(player, stock)`
- `canLeadCards(cards, defenderHandSize)`
- `canBeatCard(attackCard, defenseCard, trumpSuit)`
- `resolveDefense(trick)`
- `advanceTurn(gameState)`
- `removeOutPlayers(gameState)`
- `getLoser(gameState)`

## Suggested Build Order

1. Write the card and game-state types
2. Implement setup: deck, shuffle, deal, trump reveal
3. Implement hand refill logic
4. Implement lead validation
5. Implement defense validation
6. Implement trick resolution
7. Implement player elimination after stock is empty
8. Add a very plain UI

## Current Repo Status

The repo now contains a small TypeScript engine scaffold focused on setup and state:

- deck creation
- shuffle
- deal
- trump selection
- refill-to-five helpers
- a single-process smoke test script for the setup rules

## Running The Scaffold

With Node `24+`, you can run the current prototype without installing extra packages:

- `npm run dev`
- `npm test`

## Best Technical Starting Point

If you want to build this as a small digital game, the most practical first version is:

- `TypeScript`
- A small browser app
- Local turn-based play

That gives you quick iteration while keeping the rules logic easy to test.

## Next Step

The next concrete step should be one of these:

1. Scaffold a small TypeScript project for the game engine
2. Write the rules engine first in plain TypeScript
3. Build a simple browser prototype with clickable cards

If we continue from here, the best move is to start with the engine and encode the turn rules before any UI work.
