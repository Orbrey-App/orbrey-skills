# Skill Evaluation: calendar-conflict-finder

**Plugin:** `orbrey-ai`
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/calendar-conflict-finder`
**Evaluated:** 2026-05-21
**Evaluator version:** skill-ops/2.0.0
**Mode:** full

---

## Summary

**Score: 115 / 115 — Grade A**

A model-citizen skill: tight frontmatter, single-purpose scope, eight cleanly sequenced phases, a richly populated domain-realistic example, an explicit edge-case section, and full Australian-English compliance. Nothing to fix.

### Dimension scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|---|
| 1 | Discovery & Metadata | 20 | 20 | A |
| 2 | Scope & Focus | 15 | 15 | A |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 15 | 15 | A |
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
| `name` | calendar-conflict-finder | pass (kebab-case, matches dir, 24 chars) |
| `description` | _Pull events across all members and providers, then flag overlaps, drive-time gaps, double-booked attendees, and orphan events. Suggests rescheduling moves with rationale._ (199 chars) | pass (in 50–250 range) |
| `argument-hint` | `[date-range]` | pass |
| `allowed-tools` | `Read Write Edit` | pass |
| `effort` | `high` | pass (valid enum) |

---

## Findings

### Dimension 1 — Discovery & Metadata (20/20)

_No findings._

### Dimension 2 — Scope & Focus (15/15)

_No findings._

### Dimension 3 — Conciseness (15/15)

_No findings. SKILL.md is 141 lines — well under the 450/500 thresholds._

### Dimension 4 — Information Architecture (15/15)

_No findings. `reference.md` and `templates/output-template.md` are both linked from SKILL.md (lines 73–74, 116) and both exist on disk._

### Dimension 5 — Content Quality (15/15)

_No findings. Phases 1–8 pass state forward; explicit Edge Cases section covers 5 failure paths._

### Dimension 6 — Tool & Security (10/10)

_No findings. No secret-like literals in any file. `allowed-tools` (Read Write Edit) is minimal and matches the skill's stated behaviour (no auto-execute)._

### Dimension 7 — Testing & Examples (7/7)

_No findings. `examples/example-output.md` is densely domain-realistic (Donovan household, AU dates, real suburbs, named members, real conflict scenarios). Zero placeholder content._

### Dimension 8 — Standards Compliance (3/3)

_No findings. Australian English throughout (kilometres, prioritised, honour, behavioural). LICENSE.txt present. All filenames kebab-case._

### Dimension 9 — Activation & Behavioural Quality (10/10)

_No findings. Description front-loads action verbs ("Pull… flag… Suggests"). No soft-modal verbs in Steps. No `[[orphan]]` cross-refs. Example output shape conforms to declared template._

### Dimension 10 — Anti-patterns (5/5)

_No findings. `check-antipatterns.sh` returned an empty array._

---

## Prioritised fix list (top 15)

_None — the skill passed every deterministic and qualitative check._

Optional polish (not findings, just observations a maintainer might consider):

1. Edge Cases is technically a 5th-tier list (1–5) but Phase 1 mentions a 6th member-filter behaviour at line 44 — could be cross-referenced for symmetry. Cosmetic only.
2. The skill references `google-places-autocomplete` Edge Function (line 73) and `orbrey:calendar.*` MCP tools (lines 52–53) but `allowed-tools` is `Read Write Edit` only. If MCP tools are intended to be callable, `allowed-tools` may need expanding to include the relevant `mcp__*` patterns; if they are conceptual/external integrations called by the user separately, current state is fine. Worth a maintainer confirm.

---

## Qualitative review (sub-agent)

- **discovery_metadata (5/5)**: Description first 100 chars name the action and artefacts cleanly.
- **scope_focus (5/5)**: Single-purpose (conflict detection); concrete deliverable (the report).
- **conciseness (5/5)**: 141 lines, no preamble bloat, no over-explanation of base concepts.
- **information_architecture (n/a)**: deterministic layer covers this.
- **content_quality (5/5)**: Consistent terminology (hard overlap / drive-time / double-booked / orphan); phases sequence cleanly; explicit Edge Cases plus per-phase guidance.
- **tool_security (n/a)**: deterministic layer covers this.
- **testing_examples (5/5)**: Donovan household example is fully domain-realistic.
- **standards_compliance (n/a)**: deterministic layer covers this.

---

## Appendix — files inspected

| File | Lines | Size (bytes) |
|---|---:|---:|
| `SKILL.md` | 141 | 5452 |
| `reference.md` | 68 | 2045 |
| `templates/output-template.md` | 61 | 1581 |
| `examples/example-output.md` | 101 | 3338 |
| `LICENSE.txt` | 202 | 11337 |
