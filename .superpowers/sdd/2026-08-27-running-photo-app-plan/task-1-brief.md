# Task 1: Project Setup & Dependencies

**Context:** This is the foundation task for a React web app. All subsequent tasks depend on this being complete.

## Requirements

**Files to Create:**
- `package.json` — Node dependencies and scripts
- `vite.config.js` — Vite configuration
- `index.html` — HTML entry point
- `src/main.jsx` — React DOM root
- `.gitignore` — Standard ignores for Node/build

**Packages to Install:**
- `react@^18.0.0`
- `react-dom@^18.0.0`
- `zustand@^4.0.0`
- `leaflet@^1.9.0`
- `uuid@^9.0.0`
- `vite@^5.0.0` (dev)
- `@vitejs/plugin-react@^4.0.0` (dev)
- `@testing-library/react` (dev)
- `@testing-library/jest-dom` (dev)
- `vitest` (dev)

**Important:** Scaffold the project IN PLACE in the current working directory (`/Users/quindart/dev/paris-view/`), NOT in a subdirectory. The app structure should be:
```
src/
  components/
  store/
  utils/
  hooks/
  App.jsx
  App.css
  main.jsx
  index.css
package.json
vite.config.js
index.html
```

## Steps

1. Create `package.json` with all required dependencies and dev dependencies listed above
2. Create `vite.config.js` with React plugin
3. Create `index.html` with root div and script
4. Create `src/main.jsx` with React root render
5. Create `.gitignore` with Node/Vite patterns
6. Create empty directories: `src/components/`, `src/store/`, `src/utils/`, `src/hooks/`
7. Run `npm install` to verify all dependencies install without errors
8. Run `npm run dev` to verify dev server starts
9. Commit with message: "feat: initialize React + Vite project with Zustand, Leaflet, UUID"

## Testing

Run these commands and confirm:
- `npm install` → no errors, node_modules populated
- `npm run dev` → server starts on localhost:5173 (or similar)
- `npm run test` → test framework ready (will be 0 tests, that's fine)

All packages must be installable; dev server must start.
