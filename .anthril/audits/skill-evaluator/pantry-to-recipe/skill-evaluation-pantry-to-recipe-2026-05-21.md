# Skill Evaluation: pantry-to-recipe

**Plugin:** orbrey-ai
**Target:** `plugins/orbrey-ai/skills/pantry-to-recipe/`
**Date:** 2026-05-21
**Mode:** full
**Score:** 109.6 / 115 (95.3 / 100)
**Grade:** A

---

## Dimension Scores

| Dimension | Score | Weight | Grade |
|---|---:|---:|:---:|
| Discovery & Metadata | 20.0 | 20 | A |
| Scope & Focus | 15.0 | 15 | A |
| Conciseness | 14.4 | 15 | A |
| Information Architecture | 14.0 | 15 | A |
| Content Quality | 15.0 | 15 | A |
| Tool & Security | 7.0 | 10 | C |
| Testing & Examples | 6.2 | 7 | A |
| Standards Compliance | 3.0 | 3 | A |
| Activation & Behavioural Quality | 10.0 | 10 | A |
| Anti-patterns | 5.0 | 5 | A |
| **Total** | **109.6** | **115** | **A** |

---

## Top Prioritised Fixes

### 1. [fail] C45 — `allowed-tools` does not match body tool usage

**File:** `SKILL.md:5`, with body references at `SKILL.md:47-48`
**Evidence:** Frontmatter declares `allowed-tools: Read Write Edit`. Phase 2 invokes MCP tools `orbrey:recipes.list` and `orbrey:lists.list`. Neither tool is declared.
**Fix:** Extend `allowed-tools` to include the MCP tools the skill actually calls, e.g.

```yaml
allowed-tools: Read, Write, Edit, mcp__orbrey__recipes_list, mcp__orbrey__lists_list
```

Use the YAML list (comma-separated) form for clarity. Cross-check against any other MCP calls referenced in Phases 3-6 (the substitution and shop steps look like they may also need `mcp__orbrey__grocery_add_item` if the shopping list is ever written back, though the current SKILL.md only renders to a template).

### 2. [info] `allowed-tools` syntax is space-separated rather than comma-separated

**File:** `SKILL.md:5`
**Evidence:** `allowed-tools: Read Write Edit`. Most Claude Code skills in the Anthril/Orbrey corpus use comma-separated or YAML list form.
**Fix:** Normalise to `allowed-tools: Read, Write, Edit` (or the YAML list form). Combine with Fix 1.

### 3. [info] No `examples/edge-cases.md` — edge cases live only in SKILL.md

**File:** `examples/` directory contains only `example-output.md`
**Evidence:** SKILL.md §Edge Cases (lines 122-128) enumerates five edge cases but `examples/` has no companion file showing how the skill renders output when, e.g., the top match is < 70% or the recipe library is too thin.
**Fix:** Add `examples/edge-case-low-match.md` (or similar) showing the "Stop. Tell the user the pantry really doesn't support a low-shop meal tonight" output. Small additional volume, large gain in handler confidence.

---

## Full Finding List

| ID | Sev | Dim | File:Line | Title |
|---|:---:|---|---|---|
| C45 | fail | Tool & Security | SKILL.md:5 | `allowed-tools` omits MCP tools invoked in body |
| — | info | Standards | SKILL.md:5 | `allowed-tools` space-separated vs. comma-separated convention |
| — | info | Testing & Examples | examples/ | No edge-case example file |

---

## What This Skill Does Well

- **Tight scope.** A single, well-defined workflow ("what can we cook without shopping?") with a humble framing.
- **Concrete formulas.** `match_score = owned/required × 100`, explicit ranking by (match_score desc, gap_count asc, prep_time asc).
- **Realistic example.** `examples/example-output.md` names a household member, surplus quantities, even a kid's plate preference. Reads like a real session, not a mock.
- **Strong description front-loading.** "Suggest recipes the household can cook with what's already in the pantry — minimising new grocery purchases." Action verb first, payoff second.
- **Aus English honoured throughout.** Coriander not cilantro; metric; °C; DD/MM/YYYY.
- **Sensible edge-case enumeration.** Five edge cases covering empty pantry, thin library, low match ceiling, vague ingredients, and ingredient aliasing.
- **Behavioural rules are operational, not generic.** "Don't claim 100% match without evidence" is specific to this workflow's failure mode.

---

## Notes

- No `scripts/` directory — appropriate for this skill's scope; nothing to script.
- No `reference.md` — appropriate at 128 SKILL.md lines.
- No hooks — appropriate; this is an on-demand assistant, not an auto-activator.
- `context: fork` / auto-activation `paths:` not used — sensible defaults.
- Template (`templates/output-template.md`) is well-aligned with the example output.
