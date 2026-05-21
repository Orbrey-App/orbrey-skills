# Skill Evaluation — meal-planner

**Plugin:** orbrey-ai
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/meal-planner`
**Date:** 2026-05-21
**Mode:** full
**Score:** 94/100 (raw 108.6/115)
**Grade:** A

---

## Dimension Scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|:---:|
| 1 | Discovery & Metadata | 19.0 | 20 | A |
| 2 | Scope & Focus | 15.0 | 15 | A |
| 3 | Conciseness | 14.4 | 15 | A |
| 4 | Information Architecture | 14.0 | 15 | A |
| 5 | Content Quality | 15.0 | 15 | A |
| 6 | Tool & Security | 7.0 | 10 | C |
| 7 | Testing & Examples | 6.2 | 7 | A |
| 8 | Standards Compliance | 3.0 | 3 | A |
| 9 | Activation & Behavioural Quality | 10.0 | 10 | A |
| 10 | Anti-patterns | 5.0 | 5 | A |
| — | **Total** | **108.6** | **115** | **A** |

Pipe: `Disc 19 | Scope 15 | Concise 14.4 | IA 14 | Content 15 | Tool/Sec 7 | Test 6.2 | Std 3 | Act 10 | AP 5`

---

## Headline Findings

This is a tight, opinionated, production-grade skill. It avoids fabrication, respects household reality (calendar busy-nights, pantry stock, dietary contracts), and hands off cleanly to sibling skills. The single material defect is an undeclared MCP tool surface in `allowed-tools`.

---

## Prioritised Fixes

### 1. [fail] C45 — `allowed-tools` does not declare the MCP tools the skill invokes

**File:** `SKILL.md:5`
**Evidence:**
- Frontmatter: `allowed-tools: Read Write Edit` (line 5)
- Body invokes:
  - `orbrey:recipes.list` (line 58)
  - `orbrey:calendar.list` (line 59)
  - `orbrey:grocery.list` (line 60)
  - `orbrey:lists.list` (line 64)
  - `orbrey:lists.create` (line 118)

**Fix:** Update frontmatter to enumerate the MCP tools (or use a glob if the harness supports it):

```yaml
allowed-tools: Read, Write, Edit, mcp__orbrey__recipes_list, mcp__orbrey__calendar_list, mcp__orbrey__grocery_list, mcp__orbrey__lists_list, mcp__orbrey__lists_create
```

Without this, the harness may prompt for permission on every MCP call, or refuse the call outright — defeating the "one pass, then iterate" behavioural rule (line 142).

---

### 2. [info] Testing — single example covers only the happy path

**File:** `examples/example-output.md` (only example present)

The example is rich and realistic (Donovan household, 7-day window, Vegetarian Tuesdays, no-nuts allergy, takeaway Friday, batch-cook Saturday). But the skill explicitly supports 7/14/28-day windows and has six edge cases in `SKILL.md:147-154`. None are illustrated.

**Fix:** Add at least one of:
- `examples/example-28-day.md` — to show how non-repeat-within-5-days plays out at scale
- `examples/example-thin-library.md` — to show the "push back, suggest seeding" edge case from `SKILL.md:152`
- `examples/example-all-vegetarian.md` — to show the meat-heavy library edge case from `SKILL.md:152`

---

### 3. [info] Activation — no `paths` glob; relies entirely on description match

**File:** `SKILL.md:1-7`

The frontmatter has no `paths:` field. This is fine for a command-style skill invoked deliberately, but auto-activation when a user opens (say) `meal-plan-*.md` would be a low-cost win.

**Fix (optional):**
```yaml
paths:
  - "**/meal-plan-*.md"
  - "**/meal-plans/**"
```

Skip if you want the skill to remain purely user-initiated.

---

## All Findings

| ID | Severity | Dimension | File:Line | Title |
|---|---|---|---|---|
| C45 | fail | Tool & Security | SKILL.md:5 | `allowed-tools` omits MCP tools (`orbrey:recipes.list`, `orbrey:calendar.list`, `orbrey:grocery.list`, `orbrey:lists.list`, `orbrey:lists.create`) used in body |
| C28-variant | info | Testing & Examples | examples/ | Only one example file; edge-case scenarios (28-day, thin library, all-vegetarian) not illustrated |
| C36-paths | info | Activation | SKILL.md:1-7 | No `paths:` auto-activation glob declared |

---

## Strengths (no fix required)

- **Description front-loads the trigger and the scope** — "Build a 7/14/28-day meal plan from the household recipe library…" satisfies C36 cleanly.
- **Scope is single-purpose and explicitly hands off adjacent work** — `grocery-organizer`, `family-week-planner`, `recipe-from-url` are referenced as siblings, not absorbed.
- **Australian English throughout** — "favourites", "honour", "behaviour", DD/MM/YYYY, grams/ml/°C. `check-aus-english.sh` clean.
- **Behavioural rules are opinionated and grounded** — "Never invent recipes the household hasn't logged" (line 137); "Never auto-mutate the grocery list without explicit user confirmation" (line 138); "Mark thin evidence" (line 141).
- **The slot-map classification (Express/Standard/Leisure/Skipped)** is a genuine planning primitive, not boilerplate. The example uses it correctly.
- **Template and example are aligned** — `templates/output-template.md` declares the output shape; `examples/example-output.md` is a populated instance of it. The body references the template at line 116.
- **No secrets, no anti-patterns, no oversized files** — 154-line SKILL.md is well under the 500-line cap; `check-antipatterns.sh` returns `[]`.

---

## Methodology

- **Phase 1** — Resolved target via `resolve-target.sh`; enumerated four files (SKILL.md, LICENSE.txt, examples/example-output.md, templates/output-template.md).
- **Phase 2** — Structural checks: all required frontmatter fields present and valid; name kebab-case and matches directory; description 232 chars (within 50–250 range); `templates/` and `examples/` populated; LICENSE present.
- **Phase 3** — Heuristic catalogue (C01–C45). Grep + line-count scans clean except C45.
- **Phase 4** — Qualitative review per the eight-dimension rubric. Scored inline given the skill is small and the evaluator had full file context.
- **Phase 5** — Deterministic + qualitative composition per the rubric in `skill-evaluator/SKILL.md`.

---

*Generated by skill-ops:skill-evaluator on 2026-05-21.*
