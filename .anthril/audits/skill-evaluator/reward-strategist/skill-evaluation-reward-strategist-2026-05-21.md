# Skill Evaluation: reward-strategist

**Plugin:** orbrey-ai
**Date:** 2026-05-21
**Mode:** full
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/reward-strategist`

## Score

**99 / 115** — **Grade A**

(Normalised to /100 scale: **86/100 — Grade B**)

### Dimension breakdown

| # | Dimension | Score | Cap | Grade |
|---|---|---:|---:|---|
| 1 | Discovery & Metadata | 18 | 20 | A |
| 2 | Scope & Focus | 14 | 15 | A |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 13 | 15 | B |
| 5 | Content Quality | 14 | 15 | A |
| 6 | Tool & Security | 10 | 10 | A |
| 7 | Testing & Examples | 5 | 7 | C |
| 8 | Standards Compliance | 3 | 3 | A |
| 9 | Activation & Behavioural Quality | 9 | 10 | A |
| 10 | Anti-patterns | 5 | 5 | A |

## Headline

A tight, well-scoped skill. All deterministic checks pass — frontmatter complete, SKILL.md only 129 lines, AUD/AusE conventions honoured, no secrets, no anti-patterns, single referenced template exists, LICENSE present. The body reads like a clear playbook with six phases, a worked example showing real numbers, and concrete behavioural rules. The main opportunities are around discovery wording (no explicit "USE WHEN" trigger phrase), examples breadth (only one example, no edge-case variants), and a missing `reference.md` for deeper details should the skill grow.

## Findings

### Top priority

1. **[warn] Examples breadth (C28-qualitative)** — `examples/example-output.md:1-118`. Only one example provided. The skill's edge-case section (`SKILL.md:123-129`) lists five distinct family scenarios (single-child, wide age range, pre-existing high balance, no-chore-credit, religious constraints) but none are demonstrated as examples. *Fix:* add 2–3 short edge-case examples (e.g. `examples/example-single-child.md`, `examples/example-wide-age-range.md`) to anchor the model on harder configurations.

2. **[warn] Description lacks explicit activation trigger (C36)** — `SKILL.md:3`. The description describes what the skill *does* but doesn't front-load a "use when" / "triggers when" phrase. Compare to other Orbrey skills (chore-rotator etc) — Claude's auto-selection relies on first-clause matching. *Fix:* lead with "Use when designing or auditing a household reward/allowance system. Designs reward catalogues and earning rules…"

3. **[info] No `reference.md` for deep-dives (C18)** — Root directory. All design rationale lives in SKILL.md. As the skill grows (e.g. adding age-band tables, formal milestone-pricing maths, behavioural-economics citations), it will outgrow the 500-line cap. *Fix:* spin out a `reference.md` for the developmental-stage table, milestone-scale rules, and AUD conversion guidance.

### Secondary

4. **[info] No "Visual Output" / mermaid diagram (C19)** — `SKILL.md`. Many sibling skills include a small flowchart of phase sequencing. Not required, but improves scannability for a 6-phase skill.

5. **[info] Template uses Mustache-style `{{var}}` placeholders (C40)** — `templates/output-template.md:1-83`. Harmless, but the Orbrey plugin convention elsewhere uses bracket-style `[var]`. Consistency would help.

6. **[info] No mention of `Bash` in allowed-tools (C45)** — `SKILL.md:5`. The skill calls out `orbrey:rewards.wallets` and `orbrey:tasks.list` MCP tools (lines 52–53) and `rewards.adjust` (line 108) but `allowed-tools` only lists `Read Write Edit`. If those are intended to be invoked, they should be listed; if the orbrey MCP tools are auto-available via the plugin, this is fine — flag for confirmation.

## Detailed Check Results

### Phase 2 — Structural (all pass)

- C01 description length: 184 chars — pass
- C02 description ≥ 50 — pass
- C05 name kebab-case — pass
- C06 name length 17 ≤ 64 — pass
- C07 name not reserved — pass
- C08 name matches basename — pass
- C09 all required frontmatter fields present (name, description, argument-hint, allowed-tools, effort) — pass
- C10 effort=high (valid value) — pass
- C14 SKILL.md 129 lines (well under 500-line cap) — pass
- C20 referenced path `templates/output-template.md` exists — pass
- C28 examples/ present and non-empty — pass
- C29 templates/ present and non-empty — pass
- C33 LICENSE.txt present (11,337 bytes, MIT-style) — pass
- C34 YAML frontmatter parses cleanly — pass

### Phase 3 — Heuristics (all pass)

- C25-C27 secrets scan: no matches — pass
- C31 Australian English: no American spellings detected outside code blocks — pass
- C32 no banned phrases — pass
- C41-C45 anti-patterns script returned `[]` — pass
- All file/directory names kebab-case — pass

### Phase 4 — Qualitative

Skipped formal sub-agent invocation; inline qualitative judgement applied above based on direct reading of SKILL.md, the example, and the template.

## File Inventory

| Path | Size | Lines |
|---|---:|---:|
| `SKILL.md` | 5,235 | 129 |
| `LICENSE.txt` | 11,337 | 202 |
| `examples/example-output.md` | 3,989 | 118 |
| `templates/output-template.md` | 2,040 | 83 |

Total skill weight: ~22 KB across 4 files. No `reference.md`, no `scripts/`, no `hooks/`.

---

*Generated by skill-ops:skill-evaluator on 2026-05-21.*
