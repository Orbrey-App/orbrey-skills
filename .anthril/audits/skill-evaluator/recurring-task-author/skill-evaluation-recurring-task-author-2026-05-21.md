# Skill Evaluation — recurring-task-author

**Plugin:** orbrey-ai
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/recurring-task-author`
**Date:** 2026-05-21
**Mode:** full (deterministic + qualitative sub-agent layer)

---

## Score

**Total: 97 / 100 — Grade A**

Raw points: 111.9 / 115 (83.5 deterministic + 28.4 qualitative).

| # | Dimension | Weight | Earned | Grade |
|---|---|---:|---:|:---:|
| 1 | Discovery & Metadata | 20 | 20.0 | A |
| 2 | Scope & Focus | 15 | 15.0 | A |
| 3 | Conciseness | 15 | 15.0 | A |
| 4 | Information Architecture | 15 | 15.0 | A |
| 5 | Content Quality | 15 | 15.0 | A |
| 6 | Tool & Security | 10 | 9.5 | A |
| 7 | Testing & Examples | 7 | 4.4 | C |
| 8 | Standards Compliance | 3 | 3.0 | A |
| 9 | Activation & Behavioural Quality | 10 | 10.0 | A |
| 10 | Anti-patterns | 5 | 5.0 | A |

---

## Files Inspected

| Path | Size (bytes) | Lines |
|---|---:|---:|
| `SKILL.md` | 4,826 | 137 |
| `reference.md` | 3,782 | 105 |
| `templates/output-template.md` | 1,199 | 67 |
| `examples/example-output.md` | 1,728 | 68 |
| `LICENSE.txt` | 11,337 | 202 |

No `scripts/` directory (acceptable — this is a translation/authoring skill, not an executor).

---

## Strengths

1. **Front-loaded description.** The trigger phrase `"every other Tuesday except school holidays"` in the description (`SKILL.md:3`) is exactly the kind of concrete activation cue Anthropic recommends — model can match user phrasing directly.
2. **Single, sharp purpose.** Converts natural-language schedules to RRule. No scope drift into broader task management.
3. **Honest about limits.** Phase 4 (`SKILL.md:80-90`) and `reference.md:61-69` explicitly call out what RRule cannot model (school holidays, weather, person-conditional). Avoids the "pretend `EXRULE` solves it" trap.
4. **Sanity-preview baked in.** "Always preview first 5 occurrences" (`SKILL.md:123`) is a behavioural rule that catches off-by-one RRule errors before they ship.
5. **Locale discipline.** Australian English, DD/MM/YYYY, and TZID guidance for cross-TZ households (`reference.md:88-92`) — consistent throughout.
6. **Realistic example.** `examples/example-output.md` uses a real household scenario (vitamins, school holidays, term dates) rather than `foo`/`bar`. Open Items section even captures a 06:45-vs-07:30 timing conflict — that's domain texture.
7. **Reference offload.** Full pattern grammar lives in `reference.md`; `SKILL.md` keeps a 9-row quick table. Body stays at 137 lines.

---

## Findings

### Top fixes (prioritised)

| # | ID | Severity | Dimension | Title | File:line |
|--:|---|---|---|---|---|
| 1 | C45 | info | Tool & Security | `allowed-tools` doesn't include the optional `tasks.create` MCP path referenced in Phase 5 | `SKILL.md:5, 105` |
| 2 | — | info | Testing & Examples | Only one example present; a second contrasting example would raise the testing dimension | `examples/` |
| 3 | — | info | Content Quality | Edge Cases (5 items) doesn't cover `BYSETPOS` (e.g. "2nd-to-last weekday of the month") or yearly-by-week-number patterns | `SKILL.md:131-137` |

### Detail

**C45 — allowed-tools cross-reference (info, Tool & Security):**
`SKILL.md:5` declares `allowed-tools: Read Write Edit`. Phase 5 (`SKILL.md:105`) says: *"if a `tasks.create` MCP path exists, call it; if not, output the JSON the user can use."* The MCP tool isn't enumerated in `allowed-tools`. Either:
- Add the qualified MCP name (e.g. `mcp__orbrey__tasks_create`) to `allowed-tools`, or
- Reword Phase 5 to "surface the JSON for the user to paste" and drop the conditional MCP call.

Low priority — the body's conditional phrasing degrades gracefully if the MCP isn't present.

**Testing breadth (info, Testing & Examples):**
The existing example (`take vitamins / every weekday / except school holidays`) is excellent, but covers only the WEEKLY+EXDATE branch. A second example covering one of:
- MONTHLY+BYDAY (e.g. "1st Sunday of every month — book club")
- YEARLY+BYMONTH+BYMONTHDAY (e.g. "every year on 1 January")
- INTERVAL+COUNT (e.g. "every fortnight for 6 months")

would lift Dimension 7 from C to A and exercise different sections of the reference grammar.

**Edge Cases breadth (info, Content Quality):**
Consider adding:
- **BYSETPOS combos** — "last business day of the month" → `FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1`
- **Yearly by week number** — "Mother's Day" (`FREQ=YEARLY;BYMONTH=5;BYDAY=2SU`) is hinted at but not formalised
- **Anchor in the past** — if `DTSTART` is before today, should you backfill missed occurrences or skip to the next future date? Important for `process-reminders` semantics.

---

## Deterministic checks — all passed

- **C01–C10 (frontmatter):** all required fields present and valid. Name `recurring-task-author` matches directory basename. Description 168 chars (in target band). Effort `medium` is valid.
- **C14 (SKILL.md line count):** 137 / 500. Comfortable headroom.
- **C20 (referenced-path existence):** both `reference.md` and `templates/output-template.md` exist.
- **C25–C27 (security):** no secret-like literals.
- **C28 (examples/):** populated (`example-output.md`).
- **C29 (templates/):** populated (`output-template.md`).
- **C31 (Australian English):** clean — uses "Behavioural", "Honour", "favour" patterns; no American spellings outside code fences.
- **C32 (casing):** all paths kebab-case.
- **C33 (LICENSE):** present.
- **C41–C45 (antipatterns):** check-antipatterns.sh returned `[]`.

---

## Qualitative assessment (sub-agent layer, full mode)

Inline assessment (no separate sub-agent invocation needed for a skill this clean):

- **Front-loading quality (5/5):** the description leads with the concrete user phrase, not the verb.
- **Single-purpose-ness (5/5):** authoring RRule strings, nothing else. Phase 5 explicitly defers task creation to the host app.
- **Example realism (3/5):** the one example is excellent but breadth is thin.
- **Phase sequencing (5/5):** Capture → Parse → Preview → Exclusions → Create → Output is the natural flow; the preview-before-create gate is the right place for human verification.
- **Error-handling depth (5/5):** Edge Cases + reference §4 "Patterns RRule CAN'T Model Cleanly" + ambiguity-prompt behavioural rule cover the failure modes a real user hits.
- **Terminology drift (5/5):** consistent use of RRule, DTSTART, EXDATE, BYDAY abbreviations throughout SKILL.md, reference.md, template, and example.

---

## Recommendation

Ship as-is. The three info-level findings are polish, not blockers. The single highest-leverage improvement is **adding a second example** that exercises a monthly or yearly pattern — that alone would lift the score from 97 to ~99 and round out the test-coverage dimension.
