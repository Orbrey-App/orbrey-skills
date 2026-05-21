# Example: Multi-Step Form with Validation + localStorage

**Concept brief:**
- Category: Form/Input
- Interactivity: Multi-screen (3-step wizard)
- Styling: Tailwind CDN
- Library: React 18
- Persistence: `localStorage` — survives reload, can be cleared via a "Reset" button

**Architecture sketch:**
- Component tree: `App → [Stepper, StepBody (1 of: AccountStep, AddressStep, ReviewStep), NavButtons]`
- State: `{ step: 0, data: { email, password, name, line1, suburb, postcode, state } }`
- Validation: per-field, run on blur and on Next-click; blocks Next until current step is valid
- Persistence: full state object serialised to `localStorage` under key `wizard-state-v1`
- Accessibility: stepper uses `aria-current="step"`, each field has a `<label>` + inline error with `aria-describedby`, focus moves to the first field on step change

**Output:**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Account Sign-up</title>
  <!-- Account Sign-up — 3-step wizard with validation and localStorage persistence. -->
  <!-- Dependencies: React 18 (UMD), Babel standalone, Tailwind play CDN -->
  <!-- State: persists in localStorage under key "wizard-state-v1" — Reset button clears it. -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased min-h-screen">
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useRef } = React;

    const STORAGE_KEY = "wizard-state-v1";
    const DEFAULT_STATE = {
      step: 0,
      data: { email: "", password: "", name: "", line1: "", suburb: "", postcode: "", state: "NSW" },
    };
    const STEPS = ["Account", "Address", "Review"];

    const load = () => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? DEFAULT_STATE; }
      catch { return DEFAULT_STATE; }
    };
    const save = (s) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
      catch (e) { console.warn("localStorage write failed:", e); }
    };

    const validators = {
      email: (v) => !v ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : null,
      password: (v) => !v ? "Password is required" : v.length < 8 ? "At least 8 characters" : null,
      name: (v) => !v.trim() ? "Name is required" : null,
      line1: (v) => !v.trim() ? "Street address is required" : null,
      suburb: (v) => !v.trim() ? "Suburb is required" : null,
      postcode: (v) => !/^\d{4}$/.test(v) ? "4-digit postcode" : null,
      state: () => null,
    };

    const STEP_FIELDS = [
      ["email", "password", "name"],
      ["line1", "suburb", "postcode", "state"],
      [],
    ];

    function App() {
      const [s, setS] = useState(load);
      const [touched, setTouched] = useState({});
      const [submitted, setSubmitted] = useState(false);
      const firstFieldRef = useRef(null);

      useEffect(() => save(s), [s]);
      useEffect(() => { firstFieldRef.current?.focus(); }, [s.step]);

      const setField = (k, v) => setS((s) => ({ ...s, data: { ...s.data, [k]: v } }));
      const setStep = (n) => setS((s) => ({ ...s, step: n }));

      const errors = Object.fromEntries(
        Object.keys(validators).map((k) => [k, validators[k](s.data[k])])
      );
      const stepErrors = STEP_FIELDS[s.step].filter((f) => errors[f]);
      const canAdvance = stepErrors.length === 0;

      const Field = ({ name, label, type = "text", autoComplete, refProp }) => {
        const errId = `${name}-err`;
        const err = (touched[name] || submitted) ? errors[name] : null;
        return (
          <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
              id={name}
              ref={refProp}
              type={type}
              autoComplete={autoComplete}
              value={s.data[name]}
              onChange={(e) => setField(name, e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, [name]: true }))}
              aria-invalid={err ? "true" : "false"}
              aria-describedby={err ? errId : undefined}
              className={
                "w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                (err ? "border-rose-500" : "border-slate-300")
              }
            />
            {err && <p id={errId} className="mt-1 text-sm text-rose-600">{err}</p>}
          </div>
        );
      };

      const reset = () => {
        localStorage.removeItem(STORAGE_KEY);
        setS(DEFAULT_STATE);
        setTouched({});
        setSubmitted(false);
      };

      const submit = () => {
        setSubmitted(true);
        if (Object.values(errors).some(Boolean)) return;
        alert("Submitted!\n\n" + JSON.stringify(s.data, null, 2));
        reset();
      };

      return (
        <main className="mx-auto max-w-xl p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Account Sign-up</h1>
            <p className="text-sm text-slate-600">Your progress is saved in this browser — close the tab and come back later.</p>
          </header>

          <nav aria-label="Progress" className="mb-6">
            <ol className="flex items-center gap-2">
              {STEPS.map((label, i) => {
                const status = i < s.step ? "done" : i === s.step ? "current" : "todo";
                return (
                  <li key={label} className="flex-1" aria-current={status === "current" ? "step" : undefined}>
                    <div className="flex items-center gap-2">
                      <span className={
                        "h-7 w-7 grid place-items-center rounded-full text-sm font-medium " +
                        (status === "done" ? "bg-emerald-600 text-white"
                        : status === "current" ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600")
                      }>
                        {status === "done" ? "✓" : i + 1}
                      </span>
                      <span className={"text-sm " + (status === "current" ? "font-medium" : "text-slate-600")}>{label}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>

          <form onSubmit={(e) => { e.preventDefault(); s.step < STEPS.length - 1 ? canAdvance && setStep(s.step + 1) : submit(); }} noValidate>
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              {s.step === 0 && (
                <>
                  <Field name="email" label="Email" type="email" autoComplete="email" refProp={firstFieldRef} />
                  <Field name="password" label="Password (min 8)" type="password" autoComplete="new-password" />
                  <Field name="name" label="Full name" autoComplete="name" />
                </>
              )}
              {s.step === 1 && (
                <>
                  <Field name="line1" label="Street address" autoComplete="address-line1" refProp={firstFieldRef} />
                  <Field name="suburb" label="Suburb" autoComplete="address-level2" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field name="postcode" label="Postcode" autoComplete="postal-code" />
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">State</label>
                      <select
                        id="state"
                        value={s.data.state}
                        onChange={(e) => setField("state", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((st) => <option key={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {s.step === 2 && (
                <dl className="grid grid-cols-1 gap-3 text-sm">
                  {Object.entries(s.data).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-100 pb-2 last:border-0">
                      <dt className="text-slate-500 capitalize">{k}</dt>
                      <dd className="font-medium">{k === "password" ? "••••••••" : v || "—"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="flex items-center justify-between mt-5">
              <button
                type="button"
                onClick={reset}
                className="text-sm text-slate-500 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded"
              >
                Reset
              </button>
              <div className="flex gap-2">
                {s.step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(s.step - 1)}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={s.step < STEPS.length - 1 && !canAdvance}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {s.step < STEPS.length - 1 ? "Next" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </main>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
```

**Follow-up:**
Three-step sign-up wizard — Account, Address, Review. Per-field validation runs on blur and again on Next-click. Step 2 (Address) uses an Australian postcode pattern (4 digits) and an Australian-states dropdown. State persists in `localStorage` so closing the tab is safe; "Reset" wipes it. Focus shifts to the first field on each step change. Submit shows an `alert()` only as a stand-in — replace it with a real `fetch` call to your endpoint.
