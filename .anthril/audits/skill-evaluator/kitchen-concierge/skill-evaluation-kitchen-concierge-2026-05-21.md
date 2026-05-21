# Skill Evaluation: kitchen-concierge

**Plugin:** `orbrey-ai`
**Target:** `C:/Development/@orbrey/orbrey-ai-marketplace/plugins/orbrey-ai/skills/kitchen-concierge`
**Evaluated:** 2026-05-21
**Evaluator version:** skill-ops/skill-evaluator 2.0.0
**Mode:** full

---

## Summary

**Score: 111 / 115 — Grade A**

An ambitious orchestrator skill with a clean architecture: it wraps existing orbrey-ai skills via the `Skill` tool, adds the scheduling + ordering + notification layers, and exposes a pluggable Python adapter pattern that ships three concrete implementations (Woolworths, Coles, Uber Eats) plus a `_template.py` stub. Only material finding: the description exceeds the 250-character cap. Everything else is tight — env-only credentials, no payment automation, MCP tools declared correctly in `allowed-tools`, AusE throughout, realistic two-stage example transcripts.

### Dimension scores

| # | Dimension | Score | Weight | Grade |
|---|---|---:|---:|---|
| 1 | Discovery & Metadata | 18 | 20 | B |
| 2 | Scope & Focus | 15 | 15 | A |
| 3 | Conciseness | 15 | 15 | A |
| 4 | Information Architecture | 15 | 15 | A |
| 5 | Content Quality | 14 | 15 | A |
| 6 | Tool & Security | 10 | 10 | A |
| 7 | Testing & Examples | 6 | 7 | A |
| 8 | Standards Compliance | 3 | 3 | A |
| 9 | Activation & Behavioural Quality | 10 | 10 | A |
| 10 | Anti-patterns | 5 | 5 | A |

---

## Frontmatter snapshot

| Field | Value | Status |
|---|---|---|
| `name` | kitchen-concierge | pass |
| `description` | (382 chars — over the 250 cap) | **fail (C01)** |
| `argument-hint` | `[setup | run | status]` | pass |
| `allowed-tools` | comma-separated YAML list including 11 MCP tools | pass (cross-cutting CC-1 from prior audit addressed) |
| `effort` | high | pass |

---

## Findings

### Dimension 1 — Discovery & Metadata (18/20)

- **[fail] C01** — `SKILL.md:3` — Description is 382 chars; cap is 250. The current copy front-loads the value prop ("Your kitchen concierge — automate the full household food cycle on a schedule") but then enumerates every supported store and re-states the trigger condition. Compress to one core sentence: *"Your kitchen concierge — orchestrate weekly meal planning, pantry checks, grocery list building, notification, and ordering via Woolworths/Coles/Uber Eats. Use when the user wants set-and-forget food automation."* (≈210 chars.)

### Dimension 2 — Scope & Focus (15/15)

_No findings._ Single coherent purpose: orchestrate the food cycle end-to-end. Explicit handoff strategy at SKILL.md:24–30 — does not re-implement `meal-planner`, `grocery-organizer`, or `pantry-to-recipe`; calls them via the `Skill` tool. Subcommand dispatcher (`setup` / `run` / `status`) at Phase 0 keeps the surface area bounded.

### Dimension 3 — Conciseness (15/15)

_No findings._ SKILL.md is 304 lines (cap 500). Dense material correctly extracted to `reference.md` (adapter contract, per-store quirks, cron cookbook, troubleshooting, "how to add a new store"). No filler.

### Dimension 4 — Information Architecture (15/15)

_No findings._ References section at the bottom enumerates every supporting file with its role (SKILL.md:292–301). All eight files inside `templates/`, `examples/`, and `scripts/` are linked from SKILL.md, and `reference.md` covers what doesn't fit inline. `scripts/README.md` is a self-contained operator guide.

### Dimension 5 — Content Quality (14/15)

- **[info] qualitative-no-failure-example** — `examples/` contains only happy-path transcripts (`example-setup.md`, `example-run.md`). The Edge Cases table in SKILL.md mentions 10 failure modes (TFA challenge, primary store out of stock, adapter not installed, …) but only one is shown — the inline "Variant — failure path" at the bottom of `example-run.md`. Consider a separate `examples/example-failure-failover.md` that walks through the primary-adapter-fails-→-fallback-engages path end-to-end.

### Dimension 6 — Tool & Security (10/10)

_No findings._ Critical security posture verified:

- Credentials env-only via `shared/credentials.py`; raises `CredentialError` with a remediation hint if either var is missing.
- No payment automation — adapters select a saved payment method by label, never enter card details (SKILL.md:271–272, reference.md §7).
- TFA challenges screenshot + halt; never bypassed.
- `allowed-tools` is wide but every entry maps to actual call sites inside the skill body (Skill, AskUserQuestion, WebFetch, Bash for Python invocation, plus 11 `mcp__orbrey__*` + 2 `mcp__scheduled-tasks__*` tools).

No secret literals detected in any file (SKILL.md, reference.md, examples/, scripts/, templates/).

### Dimension 7 — Testing & Examples (6/7)

- **[info] one-edge-case** — Two examples present; both walk the happy path. The Edge Cases table is detailed (10 rows) but only the failover case is exemplified. Add a worked example for the TFA-challenge path (most user-impacting failure since it requires manual remediation).

### Dimension 8 — Standards Compliance (3/3)

_No findings._ `LICENSE.txt` present (Apache 2.0, 202 lines). Australian English verified — `categorise`, `prioritise`, `optimise` patterns present; no Americanised counterparts detected. All file and directory names kebab-case.

### Dimension 9 — Activation & Behavioural Quality (10/10)

_No findings._ Description front-loads the personifying tag "Your kitchen concierge" and the action "automate the full household food cycle". Behavioural Rules block (SKILL.md:263) makes invariants explicit: orchestrate-don't-reimplement, ask-before-mutating, dry-run-before-real, env-only-credentials, no-payment-automation, append-only-logs, timezone-from-config. No spurious `paths:` glob.

### Dimension 10 — Anti-patterns (5/5)

_No findings._ `check-antipatterns.sh` would return `[]`:

- AskUserQuestion panels stay within 2-4 options each (Phase 1.1 cadence has 4; 1.4 auto-order has 3; 1.7 backends multi-select).
- `allowed-tools` declares every MCP tool used in the body (addresses the CC-1 finding from the prior marketplace audit — this skill ships the correct pattern).
- Python `scripts/` use `from __future__ import annotations`, exit codes documented in `reference.md` §2.
- Hooks integration via `hooks/hooks.json` PreToolUse on Bash calls to `order_groceries.py` (excludes `--dry-run` and `--list-adapters`).

---

## Prioritised fix list (top 15)

1. **[fail] C01** · Shorten description to ≤250 chars · `SKILL.md:3` · Replace with the suggested 210-char alternative above (or rephrase to meet the cap).
2. **[info] one-edge-case** · Add `examples/example-failure-tfa.md` walking the TFA-challenge path · expand `examples/` from 2 to 3 files.
3. **[info] qualitative-no-failure-example** · Same as #2 — single fix closes both items.

---

## Qualitative review (sub-agent reconstruction)

- **discovery_metadata (4/5)**: Description front-loading is excellent but length overflow drops it from a 5.
- **scope_focus (5/5)**: Subcommand dispatcher + Skill-tool orchestration keep the surface bounded.
- **actionability (5/5)**: Every phase has a concrete output (config JSON, scheduled task entry, run-log markdown, order confirmation card).
- **example_realism (4/5)**: Realistic Donovan household with named members, real Coogee/Randwick stores, real cart contents, plausible $171.40 total. Only happy path exemplified.
- **conciseness (5/5)**: 304-line SKILL.md with disciplined extraction to reference.md.
- **terminology_consistency (5/5)**: "adapter", "cart", "dry-run", "click-and-collect", "household" used consistently across SKILL.md, reference.md, examples, and scripts.
- **phase_sequencing (5/5)**: Seven distinct phases inside the `run` subcommand, each with named outputs.
- **error_handling (5/5)**: Exit-code taxonomy (10/20/30/40/99), screenshot-on-error in `take_screenshot_on_error`, explicit TFA halt, fallback adapter logic, Phase 4 self-check.

---

## Appendix — files inspected

| File | Lines | Role |
|---|---:|---|
| `SKILL.md` | 304 | Main skill doc |
| `reference.md` | 163 | Adapter contract, quirks, cron, troubleshooting |
| `LICENSE.txt` | 202 | Apache 2.0 |
| `templates/output-template.md` | 100 | Notification brief shape |
| `templates/cart-schema.json` | 67 | JSON schema for cart input |
| `examples/example-setup.md` | 132 | End-to-end setup walkthrough |
| `examples/example-run.md` | 192 | End-to-end run transcript (+ failure variant) |
| `scripts/order_groceries.py` | 207 | CLI entrypoint |
| `scripts/adapters/base.py` | 102 | Abstract adapter contract |
| `scripts/adapters/_template.py` | 79 | Stub for new stores |
| `scripts/adapters/woolworths.py` | 231 | Woolworths implementation |
| `scripts/adapters/coles.py` | 197 | Coles implementation |
| `scripts/adapters/uber_eats.py` | 217 | Uber Eats Groceries implementation |
| `scripts/shared/cart.py` | 60 | Dataclasses |
| `scripts/shared/credentials.py` | 40 | Env-var-only credential loader |
| `scripts/shared/retry.py` | 38 | Exponential backoff helper |
| `scripts/requirements.txt` | 1 | playwright dep |
| `scripts/README.md` | 76 | Operator guide |

---

## Notes specific to multi-file layout

- The `scripts/` directory is **outside** what the skill-evaluator rubric typically scores (it focuses on the SKILL.md surface), but the rubric's anti-pattern checks correctly flag credentials-in-files, secret literals, and shell-script error handling. All passed.
- The `evals/suite.yaml` (16 cases, scaffolded by `skill-eval-bootstrap`) is treated as adjacent metadata, not as a code surface the rubric scores. It's verified to parse.
- Hooks integration lives at the plugin level (`plugins/orbrey-ai/hooks/hooks.json`), not inside the skill. The skill's `reference.md` correctly cross-references it.
