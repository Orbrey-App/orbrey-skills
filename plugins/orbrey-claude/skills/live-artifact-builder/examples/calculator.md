# Example: Stateful React Calculator

**Concept brief:**
- Category: Tool/Utility
- Interactivity: Stateful (one-screen)
- Styling: Tailwind CDN
- Library: React 18
- Persistence: None (intentional — calculator state is ephemeral)

**Architecture sketch:**
- Component tree: `App → [Display, Keypad]`
- State: `{ current: "0", previous: null, operator: null, justEvaluated: false }`
- Interactions: digit press appends; operator press latches and stores; equals evaluates; clear resets
- Accessibility: each key is a `<button>` with `aria-label` for symbols, keyboard input via `useEffect` listener on `window.keydown`

**Output:**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tiny Calculator</title>
  <!-- Tiny Calculator — basic 4-function arithmetic, keyboard-friendly. -->
  <!-- Dependencies: React 18 (UMD), Babel standalone, Tailwind play CDN -->
  <!-- Render: paste into a claude.ai HTML artifact canvas, or open the file in a browser. -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-slate-900 antialiased min-h-screen flex items-center justify-center">
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useCallback } = React;

    const OPS = { "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => b === 0 ? NaN : a / b };

    function App() {
      const [s, setS] = useState({ current: "0", previous: null, op: null, justEvaluated: false });

      const inputDigit = useCallback((d) => {
        setS((s) => {
          if (s.justEvaluated) return { current: d, previous: null, op: null, justEvaluated: false };
          const next = s.current === "0" ? d : s.current + d;
          return { ...s, current: next };
        });
      }, []);

      const inputDot = useCallback(() => {
        setS((s) => s.current.includes(".") ? s : { ...s, current: s.current + ".", justEvaluated: false });
      }, []);

      const inputOp = useCallback((op) => {
        setS((s) => ({
          current: "0",
          previous: s.previous !== null && s.op && !s.justEvaluated
            ? String(OPS[s.op](parseFloat(s.previous), parseFloat(s.current)))
            : s.current,
          op,
          justEvaluated: false,
        }));
      }, []);

      const evaluate = useCallback(() => {
        setS((s) => {
          if (s.previous === null || s.op === null) return s;
          const result = OPS[s.op](parseFloat(s.previous), parseFloat(s.current));
          return { current: Number.isFinite(result) ? String(result) : "Error", previous: null, op: null, justEvaluated: true };
        });
      }, []);

      const clear = useCallback(() => {
        setS({ current: "0", previous: null, op: null, justEvaluated: false });
      }, []);

      useEffect(() => {
        const onKey = (e) => {
          if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
          else if (e.key === ".") inputDot();
          else if (["+", "-", "*", "/"].includes(e.key)) inputOp(e.key);
          else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(); }
          else if (e.key === "Escape" || e.key.toLowerCase() === "c") clear();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, [inputDigit, inputDot, inputOp, evaluate, clear]);

      const Btn = ({ children, onClick, label, variant = "num" }) => (
        <button
          onClick={onClick}
          aria-label={label ?? String(children)}
          className={
            "h-14 rounded-lg text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition " +
            (variant === "op" ? "bg-blue-600 text-white hover:bg-blue-700"
            : variant === "clear" ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-white hover:bg-slate-50 border border-slate-200")
          }
        >
          {children}
        </button>
      );

      return (
        <main className="w-72 p-4 bg-slate-200 rounded-2xl shadow-lg">
          <h1 className="sr-only">Tiny Calculator</h1>
          <div
            role="status"
            aria-live="polite"
            className="bg-slate-900 text-white text-right text-3xl font-mono px-4 py-5 rounded-lg mb-3 truncate"
          >
            {s.current}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Btn variant="clear" onClick={clear} label="clear">AC</Btn>
            <Btn variant="op" onClick={() => inputOp("/")} label="divide">÷</Btn>
            <Btn variant="op" onClick={() => inputOp("*")} label="multiply">×</Btn>
            <Btn variant="op" onClick={() => inputOp("-")} label="subtract">−</Btn>
            <Btn onClick={() => inputDigit("7")}>7</Btn>
            <Btn onClick={() => inputDigit("8")}>8</Btn>
            <Btn onClick={() => inputDigit("9")}>9</Btn>
            <Btn variant="op" onClick={() => inputOp("+")} label="add">+</Btn>
            <Btn onClick={() => inputDigit("4")}>4</Btn>
            <Btn onClick={() => inputDigit("5")}>5</Btn>
            <Btn onClick={() => inputDigit("6")}>6</Btn>
            <Btn variant="op" onClick={evaluate} label="equals">=</Btn>
            <Btn onClick={() => inputDigit("1")}>1</Btn>
            <Btn onClick={() => inputDigit("2")}>2</Btn>
            <Btn onClick={() => inputDigit("3")}>3</Btn>
            <div className="row-span-2" />
            <Btn onClick={() => inputDigit("0")} label="zero">0</Btn>
            <Btn onClick={inputDot} label="decimal point">.</Btn>
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
A four-function calculator with full keyboard support — digits, `+`, `-`, `*`, `/`, `.`, Enter/`=` to evaluate, Esc/`C` to clear. Result region uses `aria-live="polite"` so screen readers announce updates. Division by zero shows "Error" without crashing. No persistence by design — refresh resets.
