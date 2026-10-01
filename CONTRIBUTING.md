# Contribuir

## Preparar el entorno

```bash
npm install   # instala dependencias y activa los hooks de Husky
npm run dev
```

## Antes de abrir una PR

```bash
npm run format:check && npm run lint && npm run typecheck && npm test
```

El hook `pre-commit` ejecuta ESLint y Prettier sobre los ficheros en staging.

## Mensajes de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org): `tipo(ámbito opcional): descripción`.

| Tipo                                                        | Efecto en la versión |
| ----------------------------------------------------------- | -------------------- |
| `feat`                                                      | minor                |
| `fix`, `perf`                                               | patch                |
| `feat!` / `BREAKING CHANGE:` en el cuerpo                   | major                |
| `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` | sin release          |

Ejemplos:

```
feat(queue): animate reroll
fix(timer): keep overtime counting after expire
docs: explain release flow
```

Haz commits pequeños y agrupados por funcionalidad. Las versiones y el `CHANGELOG.md` los genera semantic-release; no los edites a mano.

## Convenciones de código

- Componentes organizados por _atomic design_ (`atoms` → `molecules` → `organisms`), cada uno en su carpeta con su `.module.css` y, si procede, su test.
- La lógica de dominio vive en `features/`, los efectos del navegador en `services/` y las funciones puras en `utils/`.
- Prefiere funciones puras y hooks pequeños con una sola responsabilidad; testéalos junto al código (`*.test.ts[x]`).
