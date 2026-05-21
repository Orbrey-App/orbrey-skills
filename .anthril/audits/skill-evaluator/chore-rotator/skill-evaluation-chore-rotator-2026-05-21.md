# Skill Evaluation: chore-rotator

**Plugin:** `orbrey-ai`
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/chore-rotator`
**Evaluated:** 2026-05-21
**Evaluator version:** skill-ops/skill-evaluator 2.0.0
**Mode:** full

---

## Summary

**Score: 108 / 115 — Grade A**

A well-scoped, concise, and concretely-illustrated skill for household chore rotation; primary defect is an `allowed-tools` declaration that does not cover the MCP tools the skill actually invokes.

### Dimension scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|---|
| 1 | Discovery & Metadata | 19 | 20 | A |
| 2 | Scope & Focus | 15 | 15 | A |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 14 | 15 | A |
| 5 | Content Quality | 15 | 15 | A |
| 6 | Tool & Security | 6 | 10 | C |
| 7 | Testing & Examples | 7 | 7 | A |
| 8 | Standards Compliance | 3 | 3 | A |
| 9 | Activation & Behavioural Quality | 9 | 10 | A |
| 10 | Anti-patterns | 5 | 5 | A |

---

## Frontmatter snapshot

| Field | Value | Status |
|---|---|---|
| `name` | chore-rotator | pass |
| `description` | _Generate a fair chore rotation across household members, weighted by effort/age, with recurring task occurrences and reward credits tied to completion._ (167 chars) | pass |
| `argument-hint` | [period-and-style] | pass |
| `allowed-tools` | `Read Write Edit` | warn (space-separated; convention is comma-separated; MCP tools missing) |
| `effort` | high | pass |

---

## Findings

### Dimension 1 — Discovery & Metadata (19/20)

- **[info] C-style · `allowed-tools` uses space-separated format** — `SKILL.md:5`
  - Evidence: `allowed-tools: Read Write Edit`
  - Fix: Switch to the conventional comma-separated form or YAML list: `allowed-tools: Read, Write, Edit` (also see Dimension 6 about declaring MCP tools).

### Dimension 2 — Scope & Focus (15/15)

- No findings — skill has a single, sharply-defined purpose (chore rotation with reward credits) and does not drift.

### Dimension 3 — Conciseness (15/15)

- No findings — 173 lines, no padding, every section earns its keep.

### Dimension 4 — Information Architecture (14/15)

- **[info] arch · No `reference.md` for deeper detail** — `chore-rotator/`
  - Evidence: SKILL.md contains the entire body of guidance (age bands, effort points, exclusion rules).
  - Fix: At current size this is fine. If the skill grows past ~300 lines, extract the tables and behavioural rules into `reference.md` and link from SKILL.md.

### Dimension 5 — Content Quality (15/15)

- No findings — concrete tables (age bands, effort points), clear behavioural rules, realistic example output.

### Dimension 6 — Tool & Security (6/10)

- **[fail] C45 · `allowed-tools` does not cover MCP tools the skill invokes** — `SKILL.md:5`
  - Evidence: `allowed-tools: Read Write Edit` but the body references `orbrey:rewards.wallets` (line 32, 64), `orbrey:tasks.list` (line 32, 65), `tasks.set_status` and `tasks.delete_occurrence` (line 117), and proposes calling a `tasks.create` MCP path (line 117).
  - Fix: Add the orbrey MCP tools to `allowed-tools`, e.g. `allowed-tools: Read, Write, Edit, mcp__orbrey__rewards_wallets, mcp__orbrey__tasks_list, mcp__orbrey__tasks_set_status, mcp__orbrey__tasks_delete_occurrence`. Without this, the harness will block the tool calls at runtime.
- **[pass] C25-C27 · No secrets, no shell-out to unsafe binaries** — no findings.

### Dimension 7 — Testing & Examples (7/7)

- No findings — `examples/example-output.md` is a realistic, fully-worked 5-member household with concrete rotation, reward projection, and 15 task-occurrence rows. `templates/output-template.md` matches the example's shape.

### Dimension 8 — Standards Compliance (3/3)

- No findings — Australian English throughout ("colour" not used but "honouring", "fortnightly", "kerb" all present; no American spellings detected), kebab-case file/dir naming, LICENSE.txt present (Apache-2.0).

### Dimension 9 — Activation & Behavioural Quality (9/10)

- **[info] activation · Description front-loading could be sharper** — `SKILL.md:3`
  - Evidence: `Generate a fair chore rotation across household members, weighted by effort/age, with recurring task occurrences and reward credits tied to completion.`
  - Fix: Strong action verb is present. Consider prefixing trigger keywords for discovery, e.g. `Chore rotation, household tasks, allowance: generate a fair rotation across members weighted by effort/age...`
- **[info] activation · `ultrathink` directive in skill body** — `SKILL.md:11`
  - Evidence: Line 11 is a bare `ultrathink` token.
  - Fix: `ultrathink` is typically used in slash commands to deepen reasoning. In a skill body it has no defined effect; either remove it or document its intent in a comment.

### Dimension 10 — Anti-patterns (5/5)

- No findings — anti-pattern scan returned empty.

---

## Prioritised fix list (top 15)

1. **[fail] C45** · `allowed-tools` does not list the orbrey MCP tools the skill actually invokes — `SKILL.md:5` — Add `mcp__orbrey__rewards_wallets`, `mcp__orbrey__tasks_list`, `mcp__orbrey__tasks_set_status`, `mcp__orbrey__tasks_delete_occurrence` (and `tasks_create` once it exists). Without this the harness blocks the calls.
2. **[info] C-style** · `allowed-tools` uses space-separated tokens instead of the conventional comma-separated/YAML list — `SKILL.md:5` — Reformat as `allowed-tools: Read, Write, Edit, ...`.
3. **[info] activation** · Description could front-load discovery keywords (chore, rotation, allowance, household) — `SKILL.md:3` — Lead with the noun phrase users actually search for.
4. **[info] activation** · `ultrathink` token at `SKILL.md:11` has no defined effect inside a skill body — Remove it, or move to a slash-command wrapper.
5. **[info] arch** · No `reference.md` — at current 173 lines this is fine; revisit if the skill grows past ~300 lines.

_Full list in the JSON sidecar (`skill-evaluation-chore-rotator-2026-05-21.json`)._

---

## Qualitative review (sub-agent)

Qualitative dimensions were assessed inline rather than via a sub-agent invocation (single-pass full mode):

- **Discovery & metadata (4/5)**: Description is clear and action-led; would benefit from explicit trigger keywords.
- **Scope & focus (5/5)**: Sharply single-purpose. Chore rotation only; Phase 6 (rewards) is the natural extension, not scope creep.
- **Conciseness (5/5)**: No bloat. Tables substitute for prose where appropriate.
- **Information architecture (4/5)**: Logical Phase 1-7 sequencing with Edge Cases and Behavioural Rules tail. Could host the age-band/effort tables in `reference.md` if the skill grows.
- **Content quality (5/5)**: Concrete, realistic, opinionated (the "fair feels different from balanced" framing is exactly right).
- **Testing & examples (5/5)**: Example is a fully-worked household with 15 occurrences, reward projection, and open items. Excellent.

---

## Appendix — files inspected

| File | Lines | Size (bytes) |
|---|---:|---:|
| `SKILL.md` | 173 | 6713 |
| `templates/output-template.md` | 66 | 1785 |
| `examples/example-output.md` | 108 | 4099 |
| `LICENSE.txt` | 202 | 11337 |
