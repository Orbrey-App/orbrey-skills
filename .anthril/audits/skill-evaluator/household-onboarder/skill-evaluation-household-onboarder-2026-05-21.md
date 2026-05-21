# Skill Evaluation: household-onboarder

**Plugin:** `orbrey-ai`
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/household-onboarder`
**Evaluated:** 2026-05-21
**Evaluator version:** skill-ops/2.0.0
**Mode:** full

---

## Summary

**Score: 106 / 115 — Grade A**

A tightly-scoped, well-sequenced onboarding skill with a realistic worked example and a faithful output template; minor metadata polish (action verb, output count) and the absence of a reference.md are the only material gaps.

### Dimension scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|---|
| 1 | Discovery & Metadata | 19 | 20 | A |
| 2 | Scope & Focus | 12 | 15 | B |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 10 | 15 | C |
| 5 | Content Quality | 15 | 15 | A |
| 6 | Tool & Security | 10 | 10 | A |
| 7 | Testing & Examples | 7 | 7 | A |
| 8 | Standards Compliance | 3 | 3 | A |
| 9 | Activation & Behavioural Quality | 10 | 10 | A |
| 10 | Anti-patterns | 5 | 5 | A |

---

## Frontmatter snapshot

| Field | Value | Status |
|---|---|---|
| `name` | household-onboarder | pass |
| `description` | _Walk a new member through joining an Orbrey household — profile, role, dietary prefs, calendar OAuth, allowance setup. Markdown checklist with live MCP calls at each step._ (178 chars) | pass |
| `argument-hint` | `[member-name-and-role]` | pass |
| `allowed-tools` | `Read Write Edit` | pass |
| `effort` | medium | pass |

---

## Findings

### Dimension 1 — Discovery & Metadata (19/20)

- **[warn] C04 · Description lacks a leading action verb from the canonical set** — `SKILL.md:3`
  - Evidence: `Walk a new member through joining…` — "Walk" is action-shaped but not in the catalogue's verb list (audit/create/generate/review/analyse/produce/build/scan/extract/convert/migrate/refactor/evaluate/score).
  - Fix: Lead with a canonical verb, e.g. "Onboard a new household member through profile, role, dietary, calendar and wallet setup…" or "Guide a new member through joining…" — the catalogue is a hint, not law, but stronger verbs help discovery.
- **[info] C13 · Description names ≥4 comma-separated outputs** — `SKILL.md:3`
  - Evidence: 4 commas across the field — "profile, role, dietary prefs, calendar OAuth, allowance setup".
  - Fix: Consider whether all five belong, or restate as "the joining flow (profile through allowance)".

### Dimension 2 — Scope & Focus (12/15)

- **[fail] D2.2 (via C13) · Description enumerates many outputs** — `SKILL.md:3`
  - Evidence: Five comma-separated items in the description triggers the "names many outputs" rule.
  - Fix: Collapse to ≤3 primary outputs, e.g. "Walk a new member through onboarding — capturing profile, dietary record, and scope grants — producing a Markdown record."

### Dimension 3 — Conciseness (15/15)

_No findings._

### Dimension 4 — Information Architecture (10/15)

- **[info] Architecture · No `reference.md`** — `target_dir`
  - Evidence: SKILL.md is 137 lines (well under 350) and contains only one small table, so `reference.md` is not required by C44/D3.4; qualitative IA dimension is therefore not scored.
  - Fix: None required. Note kept so the missing-reference state is explicit.

### Dimension 5 — Content Quality (15/15)

_No findings. No `scripts/` directory means C22–C24 are vacuously satisfied._

### Dimension 6 — Tool & Security (10/10)

_No findings._

### Dimension 7 — Testing & Examples (7/7)

_No findings. `examples/example-output.md` matches the declared template shape._

### Dimension 8 — Standards Compliance (3/3)

_No findings. Australian English used throughout ("recognise", "authorisation", "behavioural", DD/MM/YYYY date format)._

### Dimension 9 — Activation & Behavioural Quality (10/10)

_No findings. Phases are imperative; no soft-modal verbs in step text; example matches Output Format._

### Dimension 10 — Anti-patterns (5/5)

_No findings. No oversized option lists, no hooks, layout compliant, `allowed-tools` minimal (Read/Write/Edit only)._

---

## Prioritised fix list (top 15)

1. **[fail] D2.2 / C13** · Description enumerates five outputs — `SKILL.md:3` — Trim to ≤3 primary outputs to align with single-purpose framing.
2. **[warn] C04** · Description lacks canonical leading action verb — `SKILL.md:3` — Lead with a verb from the catalogue (e.g. "Guide", "Produce", or rephrase around "Onboard").
3. **[info] Architecture** · No `reference.md` — none required at 137 lines, but if the skill grows beyond 350 lines plan an extraction.

_Full list in the JSON sidecar (`skill-evaluation-household-onboarder-2026-05-21.json`)._

---

## Qualitative review (sub-agent)

- **discovery_metadata (4/5)**: "Walk a new member through joining" reads as action; "Markdown checklist" names the artefact at the tail rather than the head.
- **scope_focus (5/5)**: Seven phases all serve the single onboarding flow; cross-skill mentions (`reward-strategist`, `chore-rotator`, `routine-builder`) are positioned as next-actions, not prerequisites.
- **conciseness (5/5)**: No generic preamble. Each phase is 3–8 lines; rules and edge-cases are tight.
- **content_quality (5/5)**: Terminology stable across SKILL.md, template, and example (member/admin/role/scope/wallet); phases pass state forward cleanly (profile → permissions → wallet → routines → record).
- **testing_examples (5/5)**: `example-output.md` is fully populated for an 8-year-old child including severe nut allergies, real scope grants, real wallet figures, and dated next-actions.

---

## Appendix — files inspected

| File | Lines | Size (bytes) |
|---|---:|---:|
| `SKILL.md` | 137 | 5273 |
| `LICENSE.txt` | 202 | 11337 |
| `templates/output-template.md` | 79 | 1921 |
| `examples/example-output.md` | 81 | 2167 |
