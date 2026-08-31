# Promptfrog

An Arabic-first prompt library containing **18 authored prompts** for ChatGPT, Claude, Midjourney, and Stable Diffusion. The first release prioritizes a small, inspectable catalog over generated filler or synthetic popularity signals.

![Catalog](https://img.shields.io/badge/authored_prompts-18-2563eb)
![CI](https://github.com/emanalshazly/promptfrog/actions/workflows/ci.yml/badge.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## What is implemented

- Search across titles, descriptions, content, and tags.
- Category and subcategory filters.
- Prompt preview with `{{variable}}` substitution.
- Favorites and folders stored in the browser.
- JSON import/export for local collections.
- Light and dark themes.

Promptfrog does not collect real usage analytics, publish ratings, or claim that the prompts have been benchmarked across models. Favorites and folders are local UI state, not adoption evidence.

## Catalog

The catalog currently contains 18 prompts:

| Area | Count |
|---|---:|
| Writing and content | 11 |
| Coding and debugging | 4 |
| UI/UX design | 1 |
| AI image generation | 2 |

`npm run validate:data` checks the catalog count, identifiers, categories, declared subcategory counts, and prompt variables.

## Run locally

Requirements: Node.js 20 and npm.

```bash
git clone https://github.com/emanalshazly/promptfrog.git
cd promptfrog
npm ci
npm test
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Validation boundary

- `npm test` is deterministic catalog validation.
- `npm run lint` checks source lint rules.
- `npm run build` proves that this revision compiles as a Next.js application.
- These checks do not establish prompt output quality, cultural quality, model compatibility, deployment status, adoption, or market demand.

## Project structure

```text
app/                 Next.js App Router
components/          UI and prompt editor
data/prompts.ts      Canonical 18-prompt catalog
lib/types.ts         Data contracts
scripts/             Deterministic catalog validation
store/               Local Zustand state
```

## Contributing

Add authored prompts to `data/prompts.ts` and update the relevant subcategory count. A contribution must pass `npm test`, lint, and build.

## License

MIT
