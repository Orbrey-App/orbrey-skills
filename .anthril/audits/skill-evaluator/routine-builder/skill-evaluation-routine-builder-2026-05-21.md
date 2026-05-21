# Skill Evaluation — `routine-builder`

- **Plugin:** `orbrey-ai`
- **Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/routine-builder`
- **Date:** 2026-05-21
- **Mode:** full (qualitative sub-agent review included)
- **Total score:** **110 / 115** — Grade **A**

## Dimension Scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|:---:|
| 1 | Discovery & Metadata | 20 | 20 | A |
| 2 | Scope & Focus | 15 | 15 | A |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 10 | 15 | C |
| 5 | Content Quality | 15 | 15 | A |
| 6 | Tool & Security | 10 | 10 | A |
| 7 | Testing & Examples | 7 | 7 | A |
| 8 | Standards Compliance | 3 | 3 | A |
| 9 | Activation & Behavioural Quality | 10 | 10 | A |
| 10 | Anti-patterns | 5 | 5 | A |

Dimension 4 sits below cap only because the rubric's qualitative layer does not score Information Architecture — it is already at full deterministic marks (10/10).

## Summary

`routine-builder` is a tightly scoped, well-architected skill. Frontmatter is complete and valid; the description front-loads the action verb and artefact ("Build... routines as cascading recurring task occurrences with realistic time budgets..."). SKILL.md is 143 lines with six genuinely sequential phases that pass state forward (Define → Inventory → Math → Schedule → Create → Output). The example (`examples/example-output.md`) is fully populated with realistic domain content — named member "Eli, 8", real anchor "school bus at 08:15", concrete RRULEs. Terminology ("anchor", "window", "slack", "step", "occurrence") is consistent across SKILL.md, reference.md, and example. The MCP-fallback path in Phase 5 ("If `tasks.create` is not exposed by the orbrey-mcp, surface this gap and offer CSV / markdown") is exactly the kind of explicit failure-mode handling the rubric rewards.

No `fail` or `warn` findings were raised by the deterministic layer. The findings below are all `info` — quality-of-life polish, not defects.

## Findings

### Info — low-priority polish

1. **[info] Behavioural Rules duplicate Australian English guidance** (`SKILL.md:32` and `SKILL.md:133`). Aus-English direction appears twice. Either remove the line in the System Prompt or remove rule 6 in Behavioural Rules — pick one home.
2. **[info] `reference.md` step lists drift slightly from `SKILL.md` Phase 2 examples** (`SKILL.md:54-61` vs `reference.md:7-17`). SKILL.md morning lists eight steps; reference.md lists seven. Tighten so the in-body example points at reference instead of carrying its own list.
3. **[info] Output template lacks an explicit field for "what was negotiated away"** (`templates/output-template.md`). Phase 3 mandates surfacing overruns and the trade-off the user accepts, but the template only conditionally hints at it in line 16. Adding a `## Trade-offs Accepted` section would lock that behaviour in.
4. **[info] No explicit handling for "anchor moves seasonally"** (e.g. daylight savings, term-2 bus retiming). Example calls this out as an open item (`examples/example-output.md:63`) but Edge Cases section doesn't mention it.
5. **[info] `allowed-tools: Read Write Edit`** — skill never uses `Edit` operationally (only writes a new render via template). Consider trimming to `Read Write` to follow least-privilege.
6. **[info] Six phases are well-named but no visual workflow diagram** — a small mermaid `flowchart TD` would make the cascade obvious at-a-glance for the model and reduce reasoning load.

### Structural — all clear

- YAML valid; all required frontmatter fields present.
- SKILL.md 143 lines (well under 500-line cap).
- `examples/` populated. `templates/` populated. `LICENSE.txt` present.
- All referenced paths exist (`reference.md`, `templates/output-template.md`).
- All filenames kebab-case.

### Heuristic — all clear

- No American spellings detected (Aus-English check returned clean).
- No secret-like literals.
- No `set -e` / hook-schema / `AskUserQuestion` antipatterns (skill has no `scripts/` or `hooks/`).
- Description (178 chars) front-loads action + artefact.

## Qualitative Scores (0–5)

| Question | Dimension | Score | Note |
|---|---|:---:|---|
| Front-loading | discovery_metadata | 5 | "Build morning, school-prep, and bedtime routines..." — verb + artefact in first 100 chars. |
| Single-purpose | scope_focus | 4 | Bundles three routine types but shared mechanics make it coherent. |
| Actionability | scope_focus | 5 | Produces a timeline + task-occurrence proposals + render output. |
| Example realism | testing_examples | 5 | Real names, real times, real RRULEs. No placeholder rot. |
| Over-explanation | conciseness | 5 | No filler preamble; straight into phases. |
| Terminology consistency | content_quality | 5 | "anchor", "window", "slack", "step", "occurrence" used uniformly. |
| Phase sequencing | content_quality | 5 | Six phases cascade with state passed forward. |
| Error handling | content_quality | 4 | Five Edge Cases + per-phase fallbacks; missing data-quality edge cases. |

## Prioritised Fix List (top 3)

1. **[info] Trim `allowed-tools`** to `Read Write` (least-privilege; `Edit` is unused operationally). `SKILL.md:5`.
2. **[info] De-duplicate Australian English guidance** — remove either `SKILL.md:32` or `SKILL.md:133`.
3. **[info] Add a "Trade-offs Accepted" section to `templates/output-template.md`** so Phase 3's overrun-negotiation behaviour is captured in the artefact, not just performed in chat.

## Notes

- Self-evaluation banner: not applicable (`skill_name != "skill-evaluator"`).
- No `paths:` auto-activation field — invocation is explicit.
- No `hooks/`, `scripts/`, or `context: fork` — skill is pure prompt-and-templates.
