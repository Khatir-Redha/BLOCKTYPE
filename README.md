# BlockType

Unofficial Minecraft personality quiz — discover your in-game archetype.

## Setup

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Build & Deploy

```sh
npm run build    # production build to dist/
npm test         # run vitest
npm run lint     # eslint
```

Deploy to Vercel: `npm run build` then `vercel --prod`. The included `vercel.json` provides SPA routing fallback.

## How it works

1. **Take the quiz** — 10 questions, pick the option that fits you best.
2. **Get your archetype** — Explorer, Builder, Miner, Redstone Engineer, or Agent of Chaos.
3. **Share your result** — A friend opens your link and takes the quiz to unlock a side-by-side comparison.
