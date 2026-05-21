# Skill Evaluation: family-week-planner

**Plugin:** orbrey-ai
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/family-week-planner`
**Date:** 2026-05-21
**Mode:** full
**Evaluator:** skill-ops:skill-evaluator (rubric 45-check catalogue)

---

## Headline

| Metric | Value |
|---|---|
| **Score** | **99/100** (114.2/115 raw) |
| **Grade** | **A** |
| **Findings** | 0 fail · 0 warn · 1 info |

This skill is a near-exemplar of a focused, prompt-orchestration MCP skill. It does one thing — combine four MCP data sources into a printable weekly fridge schedule — and does it with discipline.

---

## Dimension Scores

| # | Dimension | Score | Grade |
|---|---|---:|:---:|
| 1 | Discovery & Metadata | 20.0 / 20 | A |
| 2 | Scope & Focus | 15.0 / 15 | A |
| 3 | Conciseness | 15.0 / 15 | A |
| 4 | Information Architecture | 15.0 / 15 | A |
| 5 | Content Quality | 15.0 / 15 | A |
| 6 | Tool & Security | 10.0 / 10 | A |
| 7 | Testing & Examples | 6.2 / 7 | A |
| 8 | Standards Compliance | 3.0 / 3 | A |
| 9 | Activation & Behavioural Quality | 10.0 / 10 | A |
| 10 | Anti-patterns | 5.0 / 5 | A |
| | **Total** | **114.2 / 115** | **A** |

---

## Structural Checks (Phase 2)

All deterministic frontmatter and shape checks pass.

| Check | Result | Evidence |
|---|---|---|
| C01 Description length ≤ 200 | PASS | 168 chars (SKILL.md:3) |
| C02 Description length ≥ 50 | PASS | 168 chars |
| C05 Name kebab-case | PASS | `family-week-planner` |
| C06 Name length ≤ 64 | PASS | 19 chars |
| C07 Name not reserved | PASS | — |
| C08 Name matches basename | PASS | — |
| C09 Required fields present | PASS | name, description, argument-hint, allowed-tools, effort |
| C10 Effort valid | PASS | `medium` |
| C14 SKILL.md ≤ 500 lines | PASS | 112 lines |
| C20 Referenced files exist | PASS | `templates/output-template.md` resolves |
| C28 examples/ populated | PASS | 1 realistic example (99 lines) |
| C29 templates/ populated | PASS | 1 template (77 lines) |
| C33 LICENSE.txt present | PASS | 202 lines |
| C34 YAML valid | PASS | parse-frontmatter.sh OK |

---

## Quality Heuristics (Phase 3)

| Check | Result | Notes |
|---|---|---|
| C27 Secret literals | PASS | No matches |
| C30 Placeholder leakage in examples | PASS | One "TBD" in SKILL.md:108 is legitimate edge-case copy describing rendered output, not a placeholder gap |
| C31 Australian English | PASS | No American spellings outside code |
| C36 Description front-loading | PASS | "Combined fridge-ready weekly view" leads with the artefact |
| C37 Forward-reference anti-pattern | PASS | No "run X first", no wiki-style `[[ ]]` links |
| C39 Phase verbs imperative | PASS | "Define", "Pull", "Filter", "Render" — no soft modals |
| C40 Example aligned to Output Format | PASS | Example mirrors template structure |
| C41–C45 Anti-patterns | PASS | check-antipatterns.sh emitted `[]` |
| C45 allowed-tools matches usage | PASS | `Read Write Edit` covers template read + artefact write |

---

## Qualitative Review (Phase 4)

| Dimension | Score (0–5) | Rationale |
|---|---:|---|
| Discovery | 5 | Description is concrete, names the artefact ("fridge-ready"), lists data sources (meals, chores, appointments, school events, reminders). |
| Scope | 5 | Single, sharp purpose. Cross-references `calendar-conflict-finder` for adjacent concerns instead of absorbing them. |
| Conciseness | 5 | 112 lines, zero padding. Every line earns its place. |
| Information Architecture | 5 | Phase 1–5 + Behavioural Rules + Edge Cases. Standard pattern, well-executed. |
| Content Quality | 5 | Opinionated and concrete: A4 portrait, DD/MM/YYYY, the privacy rule excluding adult work events, the "Tuesday has 8 items" overload warning. |
| Testing | 4 | Example is realistic (named household, real conflict, source notes, open items). Lone gap: only one example — a second showing a quieter week or the "no meal plan" path would harden the contract. |

---

## Findings

### Info (1)

**F-001 · Single example — consider adding a second**
- File: `examples/`
- Severity: info
- Evidence: Only `example-output.md` (99 lines) is present.
- Fix: Add a second example covering an edge case — e.g. a week with no meal plan (shows the TBD fallback path from SKILL.md:108), or a low-activity week (shows what "free evenings" look like rendered). This would lift Dimension 7 to full marks.

### Failures

None.

### Warnings

None.

---

## Prioritised Fix List

1. **[info] F-001** — Add a second example (`examples/example-output-quiet-week.md` or `examples/example-output-no-meal-plan.md`) to exercise the edge-case branches already declared in SKILL.md.

---

## What This Skill Does Right (for reference by sibling skills)

- **Description front-loading** — leads with the deliverable ("Combined fridge-ready weekly view"), not the implementation.
- **Opinionated filtering rule** — explicit Fridge vs Full distinction with concrete include/exclude lists (SKILL.md:62–75). Tells the model what *not* to include, which is usually missing.
- **Behavioural Rules block** — five sharp rules including a privacy rule (no adult work events) and a freshness rule (mention meal plan source).
- **Edge Cases block** — five realistic cases with explicit handling, including a cross-reference to a sibling skill (`/orbrey-ai:calendar-conflict-finder`) rather than absorbing that concern.
- **Realistic example** — named household, real conflict in the data, source notes, and open items. Not a synthetic happy-path demo.

---

## Files Audited

```
SKILL.md                           112 lines  3820 B
LICENSE.txt                        202 lines 11337 B
templates/output-template.md        77 lines  1103 B
examples/example-output.md          99 lines  3090 B
```

No `scripts/` directory — appropriate for a pure prompt-orchestration skill over MCP tools.
