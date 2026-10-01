# Daily Pack

Temporizador para dailies en el que cada turno es la apertura de un sobre de cartas: se abre el sobre, aparece la carta de quien habla y empieza su cuenta atrás. Si se pasa del aviso, la carta empieza a quemarse.

[![CI](https://github.com/javiguerra144/daily-pack/actions/workflows/ci.yml/badge.svg)](https://github.com/javiguerra144/daily-pack/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/commits-conventional-fe5196.svg)](https://www.conventionalcommits.org)

## Características

- Orden aleatorio (o fijo) del equipo, con **reroll** de quienes aún no han hablado.
- Tiempo por persona configurable, aviso previo, sonido, +30 s, pausa y "ausente".
- Cartas con ilustración generada a partir del nombre, o con tu propia imagen.
- Efecto holográfico, animación de apertura y carta que se quema al agotarse el tiempo.
- Configuración guardada en `localStorage`; sin backend.
- Atajos: `Espacio` abrir / siguiente · `P` pausa · `R` reroll.
- Respeta `prefers-reduced-motion`.

## Stack

React 19 · TypeScript · Vite · CSS Modules · Vitest + Testing Library · ESLint (flat config) · Prettier · Husky + lint-staged + commitlint · semantic-release · GitHub Actions.

## Empezar

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

## Scripts

| Script              | Descripción                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                        |
| `npm run build`     | Typecheck + build de producción en `dist/`    |
| `npm run preview`   | Sirve el build localmente                     |
| `npm run lint`      | ESLint (`lint:fix` para autocorregir)         |
| `npm run format`    | Prettier (`format:check` en CI)               |
| `npm run typecheck` | `tsc` sin emitir                              |
| `npm test`          | Tests una vez (`test:watch`, `test:coverage`) |

## Arquitectura

```
src/
├── components/
│   ├── atoms/       # Button, Panel, Pill, Avatar, TimeDisplay… (sin lógica de dominio)
│   ├── molecules/   # NumberField, QueueItem, TimerControls, TeamMemberRow…
│   └── organisms/   # Stage, TradingCard, PackSprite, TurnPanel, QueuePanel, SettingsPanel…
├── features/daily/  # Lógica de la daily: reducer de sesión, orquestación (useDaily), fases del escenario
├── hooks/           # Hooks genéricos: useTimer, useSettings, useShine, useBurn, useStageScale…
├── services/        # Efectos del navegador: localStorage, Web Audio, Wake Lock
├── utils/           # Funciones puras: formato, aleatoriedad, arte procedural, campo de quemado
├── constants/       # Roles, valores por defecto, rarezas
├── styles/          # Tokens de diseño y estilos globales
└── types/
```

Decisiones clave:

- **Estado de la sesión como reducer puro** (`sessionReducer`), fácil de testear.
- **Animación de apertura como máquina de fases** (`StagePhase`): `useDaily` avanza la fase y los componentes derivan sus clases CSS de ella; un contador de generación cancela secuencias abandonadas al reiniciar.
- **Temporizador sobre `requestAnimationFrame`** con el valor exacto en un ref y estado publicado cada 100 ms para no renderizar a 60 fps.
- **Efectos visuales intensivos** (brillo, quemado) escriben directamente en el DOM desde hooks dedicados.

## Flujo de contribución

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org) (validados con commitlint en un hook `commit-msg`). Lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Releases y despliegue

- **CI** (`ci.yml`): formato, lint, typecheck, tests con cobertura y build en cada PR y push a `main`; en PRs también valida los mensajes de commit.
- **Release** (`release.yml`): tras un CI verde en `main`, [semantic-release](https://semantic-release.gitbook.io) calcula la versión, actualiza `CHANGELOG.md`, crea el tag y la release de GitHub.
- **Deploy** (`deploy.yml`): publica `dist/` en GitHub Pages. Actívalo en _Settings → Pages → Source: GitHub Actions_.

## Licencia

[MIT](LICENSE)
