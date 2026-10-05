# Live Artifact Builder — Reference

Lookup material the SKILL.md doesn't carry inline. Read on demand, not eagerly.

---

## 1. CDN URL Cheatsheet

| Library | CDN tag | Notes |
|---|---|---|
| React 18 (UMD) | `<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>` | Production build. For dev use `react.development.js`. |
| ReactDOM 18 (UMD) | `<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>` | Must match React's version exactly. |
| Babel standalone | `<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>` | Required for `<script type="text/babel">`. |
| Tailwind play CDN | `<script src="https://cdn.tailwindcss.com"></script>` | JIT included. Custom config via `tailwind.config = {...}` in an inline script. |
| Chart.js 4 | `<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>` | Global `window.Chart`. |
| D3 v7 | `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>` | Global `d3`. |
| Lucide icons | `<script src="https://unpkg.com/lucide@latest"></script>` then `lucide.createIcons()` | Works with vanilla; React variant needs build. |
| Framer Motion | Avoid — needs ESM bundling. Use CSS transitions instead. | |
| shadcn/ui (proper) | Not available as CDN. Use Tailwind utilities directly and copy small Radix-free component patterns inline. | |
| Recharts | Avoid — pulls D3 via npm. Use Chart.js instead. | |

---

## 2. Common Pitfalls

| Pitfall | Fix |
|---|---|
| `React.render is not a function` | React 18 uses `ReactDOM.createRoot(el).render(<App />)`, not `ReactDOM.render(<App />, el)`. |
| `Cannot read properties of undefined (reading 'createElement')` | React script failed to load — check the `<script>` order; React must come before Babel. |
| JSX inside `<script>` shows as raw text | `<script>` must have `type="text/babel"` AND Babel standalone must be loaded above it. |
| Tailwind classes not applied | Tailwind play CDN must load BEFORE any element that uses its classes is rendered. Place the `<script>` in `<head>`. |
| Custom Tailwind colours not working | The play CDN supports `tailwind.config = {...}` but the script tag setting the config must come AFTER the Tailwind CDN tag and BEFORE rendered HTML. |
| `Module not found` in vanilla script | Inline scripts can't `import` from npm. Use `<script type="module">` with full HTTPS URLs (e.g. `import { animate } from 'https://cdn.skypack.dev/motion'`). |
| Babel slow on first render | Expected — Babel compiles in-browser. ~200-500 ms on first paint. Don't worry below ~1000 lines of JSX. |
| `process is not defined` | You're using a Node-only API. Replace with browser equivalents (e.g. `process.env.X` → hard-coded const or `localStorage`). |
| `useState` resets every keystroke | Component is being re-defined inside another component. Hoist component definitions to the top level. |
| Chart.js double-renders / leaks | Always return `() => chart.destroy()` from the chart's `useEffect`. |

---

## 3. Accessibility Quick-Checks

| Concern | Minimum |
|---|---|
| Form inputs | Every `<input>`, `<select>`, `<textarea>` has a `<label htmlFor="id">` OR `aria-label`. |
| Buttons vs divs | If it's clickable AND looks like a button, use `<button>`. Don't `onClick` on a `<div>`. |
| Focus indicator | Don't strip the default focus ring without replacing it. Tailwind: `focus:outline-none focus:ring-2 focus:ring-blue-500`. |
| Headings | One `<h1>` per artifact. Headings descend (`h1 → h2 → h3`), no skipping. |
| Alt text | Every `<img>` has `alt=""` (decorative) or `alt="meaningful description"`. |
| Colour contrast | Body text ≥ 4.5:1 against background. Tailwind `text-slate-700 on bg-slate-50` is safe. |
| Live regions | Status messages that appear without user action go in `<div role="status" aria-live="polite">`. |
| Keyboard | Test with Tab/Shift+Tab — every interactive element must be reachable and operable. |

---

## 4. claude.ai Canvas vs Claude Cowork Preview

| Difference | claude.ai | Cowork preview |
|---|---|---|
| Iframe sandbox | Yes — no `top.location` access, no popups | Yes — same constraints |
| Network requests | Allowed to public origins; CORS-bound | Allowed; same CORS rules |
| `localStorage` | Scoped per artifact session | Scoped per preview window |
| Console output | Visible in claude.ai DevTools | Visible in Cowork's preview pane |
| Hot reload on artifact edit | Yes, full re-render | Yes, but state is lost |
| File downloads | `Blob` + `URL.createObjectURL` + `<a download>` works | Works |
| Camera/mic | Blocked | Blocked |

Both reject inline `<script src="http://...">` (HTTPS only).

---

## 5. State Persistence Patterns

### localStorage (most common)

```js
const STORAGE_KEY = "my-artifact-state";

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? defaults; }
  catch { return defaults; }
};

const save = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn("Quota exceeded or storage disabled:", e); }
};

function App() {
  const [state, setState] = useState(load);
  useEffect(() => save(state), [state]);
  // ...
}
```

### URL hash state (sharable links)

```js
const readHash = () => {
  try { return JSON.parse(decodeURIComponent(location.hash.slice(1))); }
  catch { return defaults; }
};
const writeHash = (state) => {
  history.replaceState(null, "", "#" + encodeURIComponent(JSON.stringify(state)));
};
```

---

## 6. Common Artifact Recipes (one-liner pointers)

| Need | Pattern |
|---|---|
| Form validation | Native `<form noValidate>` + `useState` per field + inline `<p class="text-red-600">` error messages. |
| Multi-step wizard | Single state object + `step` index. Each step is a component receiving `state` and `setState`. |
| Data table sort/filter | `useMemo` filtered+sorted derived from raw data; click handlers update the sort spec. |
| Drag and drop | HTML5 DnD: `draggable={true}` + `onDragStart` / `onDragOver` / `onDrop`. No library needed. |
| Dark mode | Tailwind: `class="dark:bg-slate-900 dark:text-slate-100"`. Toggle by adding/removing `class="dark"` on `<html>`. |
| Tabs | `<div role="tablist">` + `<button role="tab" aria-selected={...}>` + content panels with `role="tabpanel"`. |
| Modal | `<dialog>` element with `.showModal()` — built-in, no library needed. |
| Toast/notification | `useState` for visible toasts + `setTimeout` to auto-dismiss. `role="status" aria-live="polite"`. |

---

## 7. When to Hand Off

This skill stays in single-file land. If the user wants any of these, recommend `anthropic-skills:web-artifacts-builder` instead:

- Multi-file React project (Vite scaffold, multiple components in separate files)
- React Router with more than basic hash-routing
- shadcn/ui as a proper component library (requires Tailwind config + Radix)
- Server-side anything (Next.js, API routes, server components)
- TypeScript with full type-checking (we strip via Babel; no type errors surfaced)
- State management beyond `useState` / `useReducer` (Zustand, Redux, etc. need build)
- Test infrastructure (Vitest, Jest)

A clean handoff sentence: *"This needs `web-artifacts-builder` — single-file scope won't fit. Want me to hand off?"*
