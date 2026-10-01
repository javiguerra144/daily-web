# Daily Pack

A stand-up timer where every turn is a trading-card pack opening: the pack opens, the speaker's card appears and their countdown starts. If they run past the warning, the card starts to burn.

[![CI](https://github.com/javiguerra144/daily-web/actions/workflows/ci.yml/badge.svg)](https://github.com/javiguerra144/daily-web/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/commits-conventional-fe5196.svg)](https://www.conventionalcommits.org)

## Features

- Random (or fixed) team order, with a **reroll** for those who haven't spoken yet.
- Configurable time per person, early warning, sound, +30 s, pause and "absent".
- Cards with artwork generated from the name, or your own image.
- Holographic effect, opening animation and a card that burns when time runs out.
- Settings saved in `localStorage`; no backend.
- Shortcuts: `Space` open / next · `P` pause · `R` reroll.
- Respects `prefers-reduced-motion`.

## Stack

React 19 · TypeScript · Vite · CSS Modules · Vitest + Testing Library · ESLint (flat config) · Prettier · Husky + lint-staged + commitlint · semantic-release · GitHub Actions.

## Getting started

Requires Node.js 20 or higher.

```bash
npm install
npm run dev
```

## Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Development server                             |
| `npm run build`     | Typecheck + production build into `dist/`      |
| `npm run preview`   | Serve the build locally                        |
| `npm run lint`      | ESLint (`lint:fix` to autofix)                 |
| `npm run format`    | Prettier (`format:check` in CI)                |
| `npm run typecheck` | `tsc` without emitting                         |
| `npm test`          | Run tests once (`test:watch`, `test:coverage`) |

## Architecture

```
src/
├── components/
│   ├── atoms/       # Button, Panel, Pill, Avatar, TimeDisplay… (no domain logic)
│   ├── molecules/   # NumberField, QueueItem, TimerControls, TeamMemberRow…
│   └── organisms/   # Stage, TradingCard, PackSprite, TurnPanel, QueuePanel, SettingsPanel…
├── features/daily/  # Stand-up logic: session reducer, orchestration (useDaily), stage phases
├── hooks/           # Generic hooks: useTimer, useSettings, useShine, useBurn, useStageScale…
├── services/        # Browser effects: localStorage, Web Audio, Wake Lock
├── utils/           # Pure functions: formatting, randomness, procedural art, burn field
├── constants/       # Roles, defaults, rarities
├── styles/          # Design tokens and global styles
└── types/
```

Key decisions:

- **Session state as a pure reducer** (`sessionReducer`), easy to test.
- **Opening animation as a phase machine** (`StagePhase`): `useDaily` advances the phase and components derive their CSS classes from it; a generation counter cancels abandoned sequences on reset.
- **Timer on `requestAnimationFrame`** with the exact value in a ref and state published every 100 ms, so it doesn't render at 60 fps.
- **Heavy visual effects** (shine, burn) write directly to the DOM from dedicated hooks.

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (validated by commitlint in a `commit-msg` hook). See [CONTRIBUTING.md](CONTRIBUTING.md).

## Releases and deployment

- **CI** (`ci.yml`): format, lint, typecheck, tests with coverage and build on every PR and push to `main`; on PRs it also validates commit messages.
- **Release** (`release.yml`): after a green CI on `main`, [semantic-release](https://semantic-release.gitbook.io) computes the version, updates `CHANGELOG.md`, creates the tag and the GitHub release.
- **Deploy** (`deploy.yml`): publishes `dist/` to GitHub Pages. Enable it under _Settings → Pages → Source: GitHub Actions_.

## License

[MIT](LICENSE)
