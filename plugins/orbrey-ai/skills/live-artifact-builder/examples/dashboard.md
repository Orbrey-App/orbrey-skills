# Example: Tailwind Metrics Dashboard with Mock Data

**Concept brief:**
- Category: Dashboard
- Interactivity: Stateful (filter + sort)
- Styling: Tailwind CDN
- Library: React 18
- Persistence: URL hash (so a filtered view is shareable)

**Architecture sketch:**
- Component tree: `App → [SummaryStrip, FilterBar, MetricsTable]`
- State: `{ region: 'all', sort: { col, dir } }` (persisted in URL hash)
- Mock data: 8 region rows with revenue, conversion, churn
- Accessibility: table has proper `<th scope="col">`, sortable cells are `<button>` inside header cells, summary cards use `<dl>`/`<dt>`/`<dd>`

**Output:**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Regional Sales Dashboard</title>
  <!-- Regional Sales Dashboard — filter + sortable mock data, shareable via URL hash. -->
  <!-- Dependencies: React 18 (UMD), Babel standalone, Tailwind play CDN -->
  <!-- Data: sample data only — replace the ROWS array with your own. -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useMemo, useEffect } = React;

    const ROWS = [
      { region: "NSW", revenue: 184200, conversion: 0.043, churn: 0.021 },
      { region: "VIC", revenue: 156400, conversion: 0.039, churn: 0.024 },
      { region: "QLD", revenue: 98700, conversion: 0.041, churn: 0.019 },
      { region: "WA", revenue: 67300, conversion: 0.036, churn: 0.028 },
      { region: "SA", revenue: 42100, conversion: 0.044, churn: 0.017 },
      { region: "TAS", revenue: 18900, conversion: 0.038, churn: 0.022 },
      { region: "ACT", revenue: 31200, conversion: 0.048, churn: 0.015 },
      { region: "NT", revenue: 12400, conversion: 0.033, churn: 0.031 },
    ];

    const fmtAud = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
    const fmtPct = (n) => (n * 100).toFixed(1) + "%";

    const readHash = () => {
      try { return JSON.parse(decodeURIComponent(location.hash.slice(1))) || {}; }
      catch { return {}; }
    };
    const writeHash = (s) => history.replaceState(null, "", "#" + encodeURIComponent(JSON.stringify(s)));

    function App() {
      const initial = readHash();
      const [region, setRegion] = useState(initial.region || "all");
      const [sort, setSort] = useState(initial.sort || { col: "revenue", dir: "desc" });

      useEffect(() => writeHash({ region, sort }), [region, sort]);

      const filtered = useMemo(
        () => (region === "all" ? ROWS : ROWS.filter((r) => r.region === region)),
        [region]
      );

      const sorted = useMemo(() => {
        const out = [...filtered];
        out.sort((a, b) => (a[sort.col] - b[sort.col]) * (sort.dir === "asc" ? 1 : -1));
        return out;
      }, [filtered, sort]);

      const totals = useMemo(() => {
        const rev = sorted.reduce((s, r) => s + r.revenue, 0);
        const avgConv = sorted.reduce((s, r) => s + r.conversion, 0) / (sorted.length || 1);
        const avgChurn = sorted.reduce((s, r) => s + r.churn, 0) / (sorted.length || 1);
        return { rev, avgConv, avgChurn };
      }, [sorted]);

      const SortHeader = ({ col, children, numeric }) => {
        const active = sort.col === col;
        const nextDir = active && sort.dir === "desc" ? "asc" : "desc";
        return (
          <th scope="col" className={"px-4 py-3 " + (numeric ? "text-right" : "text-left")}>
            <button
              onClick={() => setSort({ col, dir: nextDir })}
              className="font-semibold text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
            >
              {children}
              <span className="ml-1 text-slate-400" aria-hidden="true">
                {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
              </span>
            </button>
          </th>
        );
      };

      return (
        <main className="mx-auto max-w-5xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Regional Sales — FY26 Q1</h1>
            <p className="text-sm text-slate-600">Sample dashboard. Filtered + sorted state is preserved in the URL — copy the link to share a view.</p>
          </header>

          <section aria-labelledby="summary" className="mb-6">
            <h2 id="summary" className="sr-only">Summary</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <dt className="text-sm text-slate-500">Total revenue</dt>
                <dd className="text-2xl font-semibold mt-1">{fmtAud(totals.rev)}</dd>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <dt className="text-sm text-slate-500">Avg conversion</dt>
                <dd className="text-2xl font-semibold mt-1">{fmtPct(totals.avgConv)}</dd>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <dt className="text-sm text-slate-500">Avg churn</dt>
                <dd className="text-2xl font-semibold mt-1">{fmtPct(totals.avgChurn)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="filter" className="mb-4 flex items-center gap-3">
            <label htmlFor="region" id="filter" className="text-sm font-medium text-slate-700">Region</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All regions</option>
              {ROWS.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
            </select>
            {region !== "all" && (
              <button
                onClick={() => setRegion("all")}
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Clear filter
              </button>
            )}
          </section>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <SortHeader col="region">Region</SortHeader>
                  <SortHeader col="revenue" numeric>Revenue</SortHeader>
                  <SortHeader col="conversion" numeric>Conversion</SortHeader>
                  <SortHeader col="churn" numeric>Churn</SortHeader>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.region} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{r.region}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtAud(r.revenue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtPct(r.conversion)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtPct(r.churn)}</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No rows match the filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
```

**Follow-up:**
Three summary cards, a region filter, and a sortable table — totals recompute from the filtered set. Sort state and filter persist in the URL hash, so copy the address bar to share a view. Column sort buttons use `aria-sort` so screen readers announce the active direction. Currency formatted as AUD, percentages to one decimal place. Replace the `ROWS` array with real data; the rest scales automatically.
