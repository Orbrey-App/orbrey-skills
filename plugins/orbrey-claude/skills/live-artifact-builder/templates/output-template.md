# Output Template

Pick one of the three preambles below based on the chosen stack. Replace the placeholders, then drop in the artifact body. Emit the result as **one fenced HTML block** with no surrounding prose other than the comment header.

---

## 1. React 18 + Tailwind CDN (default)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ARTIFACT_TITLE}}</title>
  <!-- {{ARTIFACT_TITLE}} — {{ONE_LINE_PURPOSE}} -->
  <!-- Dependencies: React 18 (UMD), ReactDOM 18, Babel standalone, Tailwind play CDN -->
  <!-- Render: paste into a claude.ai HTML artifact canvas, or open the file in a browser. -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useMemo, useRef, useCallback } = React;

    function App() {
      // {{COMPONENT_BODY}}
      return (
        <main className="mx-auto max-w-3xl p-6">
          {/* {{UI_BODY}} */}
        </main>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>
```

---

## 2. Vanilla JS + Tailwind CDN

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ARTIFACT_TITLE}}</title>
  <!-- {{ARTIFACT_TITLE}} — {{ONE_LINE_PURPOSE}} -->
  <!-- Dependencies: Tailwind play CDN only -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
  <main class="mx-auto max-w-3xl p-6">
    <!-- {{UI_MARKUP}} -->
  </main>
  <script type="module">
    // {{VANILLA_BODY}}
  </script>
</body>
</html>
```

---

## 3. React + Chart.js

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ARTIFACT_TITLE}}</title>
  <!-- {{ARTIFACT_TITLE}} — {{ONE_LINE_PURPOSE}} -->
  <!-- Dependencies: React 18, ReactDOM 18, Babel standalone, Tailwind play CDN, Chart.js 4 -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useRef } = React;

    function Chart({ type, data, options }) {
      const ref = useRef(null);
      useEffect(() => {
        const c = new window.Chart(ref.current, { type, data, options });
        return () => c.destroy();
      }, [type, data, options]);
      return <canvas ref={ref} aria-label="chart" />;
    }

    function App() {
      // {{COMPONENT_BODY}}
      return (
        <main className="mx-auto max-w-4xl p-6">
          {/* {{UI_BODY}} */}
        </main>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
```

---

## Preamble Comment Block

Every artifact starts with this comment immediately inside `<head>`:

```html
<!-- {{ARTIFACT_TITLE}} — {{ONE_LINE_PURPOSE}} -->
<!-- Dependencies: {{LIST_OF_CDNS}} -->
<!-- Render: paste into claude.ai HTML artifact canvas, or save as .html and open in a browser. -->
```

If the artifact uses `localStorage`, append:
```html
<!-- State: persists in localStorage under key "{{STORAGE_KEY}}" — clear via DevTools to reset. -->
```

If the artifact uses mock data, append:
```html
<!-- Data: sample data only — replace the {{DATA_CONST}} array with your own. -->
```
