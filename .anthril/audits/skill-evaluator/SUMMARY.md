# Skill Evaluator — orbrey-ai marketplace audit

**Date:** 2026-05-21
**Mode:** full (qualitative sub-agent review enabled on every run)
**Skills audited:** 10 / 10
**Per-skill artefacts:** `.anthril/audits/skill-evaluator/<skill>/skill-evaluation-<skill>-2026-05-21.{md,json}`

---

## Score table

| # | Skill | Score | Grade | Failures | Warnings | Top issue |
|---|---|---:|:---:|---:|---:|---|
| 1 | calendar-conflict-finder | 115/115 | A | 0 | 0 | None — model citizen |
| 2 | routine-builder | 110/115 | A | 0 | 0 | `allowed-tools` includes unused `Edit` |
| 3 | pantry-to-recipe | 109.6/115 | A | 1 | 0 | C45 — `allowed-tools` omits MCP tools the body invokes |
| 4 | chore-rotator | 108/115 | A | 1 | 0 | C45 — `allowed-tools` omits MCP tools (`rewards.wallets`, `tasks.*`) |
| 5 | meal-planner | 108.6/115 | A | 1 | 0 | C45 — `allowed-tools` omits MCP tools (`recipes.list`, `calendar.list`, …) |
| 6 | household-onboarder | 106/115 | A | 1 | 1 | C13 — description enumerates 5 outputs (collapse to ≤3); C04 weak leading verb |
| 7 | recurring-task-author | 97/100 | A | 0 | 0 | C45 — conditional `tasks.create` not in `allowed-tools` (info) |
| 8 | family-week-planner | 99/100 | A | 0 | 0 | None — near-exemplar |
| 9 | grocery-organizer | 98/100 | A | 0 | 0 | None — three info-level polish items |
| 10 | reward-strategist | 99/115 | A | 0 | 2 | C28-qual single example; C36 description lacks "use when" trigger |

(Score format mixed because some runs reported the 100-scale grade rather than the raw 115-scale.)

**Aggregate:** 10/10 skills land at Grade A. No `fail` exceeding the C45 frontmatter-MCP-mismatch pattern. Zero secrets flagged. Zero structural violations.

---

## Cross-cutting findings (act on these once across the plugin)

### CC-1 — `allowed-tools` is missing the MCP tools each skill actually calls **[fix everywhere]**

Six of the ten skills declare `allowed-tools: Read Write Edit` only, but their bodies invoke orbrey MCP tools (`recipes.list`, `calendar.list`, `tasks.set_status`, `rewards.wallets`, etc). The harness blocks an undeclared tool at runtime, so the skills only work because clients currently approve at the workflow level rather than the tool level.

**Affected:** chore-rotator, meal-planner, pantry-to-recipe, recurring-task-author, household-onboarder, reward-strategist
**Action:** add `mcp__orbrey__<tool>` entries to each skill's `allowed-tools` (comma-separated YAML list, not space-separated).

### CC-2 — `allowed-tools` formatting drift

All ten skills use the space-separated form (`Read Write Edit`). The skill-evaluator rubric prefers comma-separated.
**Action:** convert to comma-separated YAML across the plugin in the same pass as CC-1.

### CC-3 — Single-example skills (no edge-case coverage)

Most skills ship one happy-path example. The evaluator flags this as a Testing-dimension drop.
**Affected:** chore-rotator, family-week-planner, meal-planner, pantry-to-recipe, recurring-task-author, reward-strategist
**Action:** add a second `examples/<edge-case>.md` per skill (e.g. thin-library meal plan, single-child chore rotation, 28-day plan, MONTHLY recurrence).

### CC-4 — Missing `reference.md` where the SKILL.md is near the 500-line cap

Six skills lack `reference.md`. Most are short enough that this is fine; reward-strategist was flagged specifically for content density that would benefit from extraction.
**Action:** spin out a `reference.md` for reward-strategist (developmental-stage tables, milestone maths). Leave the others alone unless they grow.

### CC-5 — Stray `ultrathink` token in skill bodies

chore-rotator (line 11) carries a bare `ultrathink` token that has no defined effect in a skill body — it's a slash-command opt-in, not a skill directive.
**Action:** delete from chore-rotator (and audit the others for the same anti-pattern).

### CC-6 — Description front-loading

reward-strategist and household-onboarder lost discovery points because the description either lacks an explicit "use when" trigger phrase or enumerates too many outputs.
**Action:** rewrite the first 100 chars of each affected description to: action verb + primary outcome + one trigger phrase.

---

## Prioritised punch-list (do these in order)

1. **CC-1 + CC-2 in a single commit per skill** — declare the MCP tools each skill calls, convert to YAML list format. Estimated 6 skills × 2 min = 12 min.
2. **CC-5** — delete stray `ultrathink` from chore-rotator. 30 sec.
3. **CC-6** — rewrite descriptions for reward-strategist and household-onboarder. 10 min.
4. **CC-3** — add edge-case examples to the six skills missing them. ~30 min/skill = 3 hr.
5. **CC-4** — spin out `reference.md` for reward-strategist. 30 min.

Total effort to lift every skill to ≥ 95/100 grade A: roughly half a day.

---

## Patterns worth keeping

- **AusE throughout** — passes the spell-check across all 10 skills.
- **LICENSE.txt present in every skill** — already at Apache 2.0.
- **Realistic worked examples** — every skill ships a domain-grounded example (real-looking household names, real meals/tasks). No lorem ipsum.
- **Single-purpose scope** — none of the skills overreach; each does one thing.
- **MCP-first orientation** — the bodies read live MCP data before opining, which is the right pattern for a household-management plugin.

---

## Notes

- No secrets detected across any skill (C27 hard-fail did not fire).
- No skill exceeds the 500-line SKILL.md cap.
- No anti-pattern findings (C41–C45 mostly clean; C45 is the recurring miss).
- The two newly-authored skills (`live-artifact-builder`, `kitchen-concierge`) should be audited on the same bar before they ship.
