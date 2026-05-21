# Skill Evaluation: live-artifact-builder

**Plugin:** `orbrey-ai`
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/live-artifact-builder`
**Evaluated:** 2026-05-21
**Evaluator version:** skill-ops/skill-evaluator 2.0.0
**Mode:** full

---

## Summary

**Score: 114 / 115 — Grade A**

A tightly-scoped, well-documented skill that produces a concrete single-file artefact, with realistic worked examples and clean separation between SKILL.md, reference lookup, templates, and examples; only minor qualitative trim possible around per-phase error notes.

### Dimension scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|---|
| 1 | Discovery & Metadata | 20 | 20 | A |
| 2 | Scope & Focus | 15 | 15 | A |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 15 | 15 | A |
| 5 | Content Quality | 14 | 15 | A |
| 6 | Tool & Security | 10 | 10 | A |
| 7 | Testing & Examples | 7 | 7 | A |
| 8 | Standards Compliance | 3 | 3 | A |
| 9 | Activation & Behavioural Quality | 10 | 10 | A |
| 10 | Anti-patterns | 5 | 5 | A |

---

## Frontmatter snapshot

| Field | Value | Status |
|---|---|---|
| `name` | live-artifact-builder | pass |
| `description` | _Generate single-file live HTML or React artifacts for claude.ai or Claude Cowork canvas. Use when the user wants a working interactive demo, calculator, dashboard, mini-game, form, data visualisation, or tool prototype, and asks for an "artifact", "live demo", or wants to "render" something in the canvas._ (359 chars) | pass |
| `argument-hint` | `[artifact concept]` | pass |
| `allowed-tools` | Read, Write, Edit, Glob, Grep, AskUserQuestion | pass |
| `effort` | medium | pass |

---

## Findings

### Dimension 1 — Discovery & Metadata (20/20)

_No findings._ All required frontmatter fields present, description front-loads action verb and artefact, name kebab-case and matches directory.

### Dimension 2 — Scope & Focus (15/15)

_No findings._ Single coherent purpose (single-file live artifact). Explicit handoff to `anthropic-skills:web-artifacts-builder` for multi-file work prevents scope creep (SKILL.md:35, 142).

### Dimension 3 — Conciseness (15/15)

_No findings._ SKILL.md is 172 lines (cap 500). No filler or generic preamble; every section earns its place.

### Dimension 4 — Information Architecture (15/15)

_No findings._ `reference.md` linked from SKILL.md:168 and from inline pointers (SKILL.md:80–82). Three example files, all referenced. Output template referenced and shaped to match three stack choices.

### Dimension 5 — Content Quality (14/15)

- **[info] qualitative-error-handling** — `SKILL.md:152` — Edge Cases table is strong but per-phase error notes are implicit ("If any check fails, fix and re-render" on line 99). Consider adding a 1-line "If X, do Y" note inside Phases 2–3.

### Dimension 6 — Tool & Security (10/10)

_No findings._ `allowed-tools` is narrow and appropriate (Read, Write, Edit, Glob, Grep, AskUserQuestion). No secret literals detected anywhere in the skill.

### Dimension 7 — Testing & Examples (7/7)

_No findings._ Three realistic worked examples (calculator, dashboard, form) — each starts with a concept brief + architecture sketch, then a full working HTML block. No lorem/TBD/placeholder content.

### Dimension 8 — Standards Compliance (3/3)

_No findings._ `LICENSE.txt` present (202 lines). Australian English check passes (`visualisation`, `colour`, `behavioural` used consistently). All file/directory names kebab-case.

### Dimension 9 — Activation & Behavioural Quality (10/10)

_No findings._ Description begins with the action ("Generate single-file live HTML or React artifacts"). Behavioural Rules block (SKILL.md:140) makes invariants explicit. No spurious `paths:` glob and no hooks.

### Dimension 10 — Anti-patterns (5/5)

_No findings._ `check-antipatterns.sh` returned `[]`. AskUserQuestion panels stay within 2-5 options (Phase 1 has 5 dimensions × ≤6 each; Phase 5 lists 5 options).

---

## Prioritised fix list (top 15)

1. **[info] qualitative-error-handling** · Per-phase error notes are implicit — `SKILL.md:99,152` — Add a 1-line "If X, do Y" failure note inside Phases 2 and 3, alongside the existing Edge Cases table.

_Only one minor info-level item; full list in JSON sidecar._

---

## Qualitative review (sub-agent)

- **discovery_metadata (5/5)**: Description leads with verb "Generate" and names the artefact "single-file live HTML or React artifacts" within the first 100 chars.
- **scope_focus (5/5)**: Single primary output (one fenced code block). Explicit handoff to `web-artifacts-builder` for multi-file work (SKILL.md:35).
- **actionability (5/5)**: Concrete deliverable — one paste-ready HTML artifact, validated against a Phase 4 self-review checklist.
- **example_realism (5/5)**: Three full working artefacts with concept briefs and architecture sketches (calculator 146 lines, dashboard 184 lines, form 239 lines).
- **conciseness (5/5)**: No over-explanation; the tone is operator-pitched, not tutorial-pitched.
- **terminology_consistency (5/5)**: "artifact", "canvas", "single-file", "CDN" used consistently across SKILL.md, reference.md, and examples.
- **phase_sequencing (5/5)**: Five distinct phases (Concept → Sketch → Scaffold → Self-Review → Iterate), with clear state hand-off and a cap on iteration loops.
- **error_handling (4/5)**: Solid Edge Cases table; per-phase failure paths could be slightly more explicit (e.g. Phase 3 "if CDN URL 404s").

---

## Appendix — files inspected

| File | Lines | Size (bytes) |
|---|---:|---:|
| `SKILL.md` | 172 | 8206 |
| `reference.md` | 137 | 7290 |
| `LICENSE.txt` | 202 | 11337 |
| `templates/output-template.md` | 139 | 4283 |
| `examples/calculator.md` | 146 | 6458 |
| `examples/dashboard.md` | 184 | 8772 |
| `examples/form.md` | 239 | 10950 |
