# Todo App

A simple React + TypeScript todo app built with Vite and configured for GitHub Pages deployment.

## Features

- Add, complete, delete, and clear todos
- Filter between all, active, and completed items
- Persist state in `localStorage`
- Build output uses relative asset paths so it works on GitHub Pages project sites

## Getting started

```bash
npm install
npm run dev
```

## Available scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build in `dist/`
- `npm run preview` - preview the production build locally
- `npm run deploy` - publish `dist/` to the `gh-pages` branch

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Run `npm run deploy`.
3. In the repository settings, open **Pages** and set the source to the `gh-pages` branch with the `/ (root)` folder if it is not already selected.

## License

MIT
