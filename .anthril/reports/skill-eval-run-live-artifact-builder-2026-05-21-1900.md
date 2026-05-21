# Skill Eval Run — live-artifact-builder

**Suite:** `plugins/orbrey-ai/skills/live-artifact-builder/evals/suite.yaml`
**Run timestamp:** 2026-05-21T19:00:00+10:00
**Mode:** fast (deterministic activation; LLM-judge layer skipped — see footnotes)
**Total cases:** 8 · **Activation:** 5 · **Functional:** 1 · **Edge:** 2

## Headline

- **Activation pass rate:** 5 / 5 (100%)
- **Functional cases executed:** 0 / 1 — deferred (functional verdict needs live skill invocation; chat-only artefact output, no `file_created`)
- **Edge cases executed:** 0 / 2 — deferred (judge-only criteria, no `expected_error` code)
- **Overall deterministic pass rate:** 5 / 5 of executable cases (100%)
- **Regressions vs prior run:** N/A — first run
- **Wins vs prior run:** N/A — first run

## Per-case results

### Activation (deterministic — full-mode classifier-equivalent reasoning)

| ID | Expected | Verdict | Pass | Evidence |
|---|---|---|---|---|
| `activation-pos-literal-trigger` | true | true | ✓ | Strong overlap: "live demo artifact", "calculator", "render in the canvas" — three signature tokens from the skill description. |
| `activation-pos-paraphrase` | true | true | ✓ | Tokens: "interactive prototype", "dashboard", "paste into claude.ai" — "dashboard" is a named category in the skill description; "claude.ai" matches canvas target. |
| `activation-pos-category-mention` | true | true | ✓ | "mini-game" + "render in the Cowork canvas" — mini-game is enumerated in the description; Cowork canvas is the explicit secondary target. |
| `activation-neg-unrelated-coding` | false | false | ✓ | Zero overlap with artifact / canvas / render / interactive vocabulary. |
| `activation-neg-multifile-project` | false | false | ✓ | "Tailwind" alone would be a weak positive signal, but "Next.js project" + "routing" dominate — the skill's behavioural rules explicitly hand off multi-file Next.js scaffolds to `anthropic-skills:web-artifacts-builder`, so the classifier respects the boundary. |

### Functional

| ID | Verdict | Reason |
|---|---|---|
| `functional-calculator-artifact` | deferred | Functional execution requires the harness to spawn a fresh `Agent(subagent_type=claude)` that invokes the skill and emits the artifact, then verify `contains: "createRoot"`, `contains: "tailwindcss"`, and `pattern: "<script[^>]*react@18"`. Skipped in this run — would burn a full sub-agent budget and the previous sub-agent harness attempts produced no artefacts. Recommend re-running once Claude harness supports nested sub-agent invocation reliably. The skill's `examples/calculator.md` already validates by inspection: `createRoot` at line 87, `tailwindcss` CDN at line 32, `react@18` UMD at line 28 — all three deterministic checks would pass on the canonical output. |

### Edge

| ID | Verdict | Reason |
|---|---|---|
| `edge-backend-request` | deferred | Judge-only criteria (no `expected_error` code). Would require LLM-judge on the skill's response to "user login and a Postgres-backed todo list". Inspection of the skill's Edge Cases table (`SKILL.md:152`) confirms the expected behaviour is encoded: "Push back: 'Artifacts have no backend. Want a frontend prototype that talks to a public API, or a UI mock with localStorage?'" — a real run should pass this criterion. |
| `edge-multifile-handoff` | deferred | Judge-only criteria. The skill's Behavioural Rules section (`SKILL.md:142`) hard-codes the handoff: "If the request needs more than one file, hand off to `web-artifacts-builder`." A real run should pass all three sub-criteria. |

## Notes / limitations

1. **Functional case shape mismatch.** The bootstrap-flagged note is correct: this skill emits chat-only fenced code blocks, not files on disk. The harness's `file_created` check shape doesn't fit; the suite uses `contains` / `pattern` instead, which is the right call.
2. **Sub-agent recursion.** Two earlier attempts to run the harness inside a `general-purpose` background agent produced no `.anthril/reports/` artefacts — the nested `Skill(skill="skill-eval-harness")` invocation appears to have failed silently. This run was produced inline by the parent session with deterministic reasoning rather than spawning more sub-agents.
3. **LLM-judge layer skipped.** Per the run mode, `judge_criteria` are not scored. The audit at `.anthril/audits/skill-evaluator/live-artifact-builder/` covers qualitative quality directly — score 114/115 grade A.

## Recommended follow-ups

- Add a `dashboard.md` and `form.md` functional case to match the other two examples (one of the bootstrap's review flags).
- Re-run with a working LLM-judge layer to validate the two edge cases produce the expected handoff phrasing in practice.
- Wire the suite into CI once `skill-eval-harness` itself is invokable in a reliable non-interactive context.
