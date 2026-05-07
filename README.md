# LexiPeg

A letter-sequence and accuracy guessing game — Bulls and Cows meets Wordle.

## How to play

Guess the hidden word. After each guess, every tile reveals one of three results:

| Indicator | Meaning                          |
|-----------|----------------------------------|
| ✓         | Correct letter, correct position |
| ○         | Correct letter, wrong position   |
| ✕         | Letter not in the word           |

Use the feedback to narrow down the word in as few guesses as possible.

## Features

- **Daily mode** — one shared word per day, per word length
- **Freeplay** — unlimited random games
- **Word lengths** — 4, 5, 6, or 7 letters
- **Hard mode** — confirmed letters must be reused in subsequent guesses
- **Color modes** — default, deuteranopia, protanopia, high contrast
- **URL Word Source** — load words from any webpage (see below)

## URL Word Source

In Settings, paste any URL and click **Load Source**. LexiPeg will fetch the page, strip navigation and boilerplate, and extract contextually meaningful words of your chosen length — filtering out function words and common fillers using a stop-word list.

This is useful for demoing the game with words drawn from a specific article, blog, or topic. Words are cached for the session; start a new Freeplay game to use the loaded word pool.

> Fetching is routed through [allorigins.win](https://allorigins.win) to handle cross-origin restrictions.

## Running locally

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

1. Push to a GitHub repository
2. In the repo settings, go to **Pages → Source** and select **GitHub Actions**
3. Push to `main` — the included workflow builds and deploys automatically

The deploy workflow reads the repository name and sets the Vite base path automatically, so no manual config is needed.

## Tech stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [@slothluvchunk/pegkit](https://www.npmjs.com/package/@slothluvchunk/pegkit) — game engine

## License

MIT — see [LICENSE](LICENSE)
