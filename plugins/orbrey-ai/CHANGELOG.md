# Changelog — orbrey plugin

All notable changes to the `orbrey` plugin are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] — 2026-07-19

Rebuild of `kitchen-concierge` following a full skill audit that scored the 0.2.0
version **31/100 — no-go**. The skill's documented safety layer had never been
implemented, on the one skill in the plugin that spends real money.

> ### ⚠️ This release ships a skill that spends real money
>
> `kitchen-concierge` builds and places grocery orders at Woolworths and Coles,
> charging the card saved on your retailer account. It drives your own Chrome
> session; it never sees your password or your card. Every order passes a
> code-enforced spend ceiling and reaches a real permission prompt before it is
> placed, and scheduled runs never buy — they plan and defer. Read the
> "Grocery ordering" section of the README, including the terms-of-service and
> account-suspension note, before enabling a schedule.

### Fixed — safety-critical

- **`--dry-run` was not a dry run.** It ran the identical add-to-cart loop and
  only skipped `checkout()`. Retailer carts persist server-side and no adapter
  cleared them, so the mandated dry-run-then-real sequence added every item
  **twice**. The example transcript concealed this with a fabricated
  "Cart restored" line. The whole mechanism is gone; verification is now a
  read-only assertion pass over the cart the browser already holds.
- **The checkout hook was a no-op.** It shelled out to `jq`, which is absent on
  Windows, and exited 0 unconditionally by design — while `SKILL.md` told the
  model a confirmation hook would fire. All three hooks are now Node, and
  `gate-order` genuinely blocks: it denies checkout until the cart is verified,
  and returns `ask` (never `allow`) so the spend always reaches a real prompt.
- **No allergy data existed anywhere in the plugin.** `household-onboarder`
  collected severity-flagged allergies into a markdown file nothing read;
  `/plan-week` claimed to read "each member's profile" and no such tool existed;
  `meal-plan-orchestrator` implemented an allergen hard-fail with no source for
  the flag. Added a schema-backed dietary profile with four severity tiers, and
  made a current profile a **fail-closed precondition** for ordering.
- **Five declared MCP tools did not exist** (`pantry_list`, `meal_plan_week`,
  `meal_plan_sync_to_grocery`, `meal_plan_set_slot`, `pantry_consume`). Pantry
  state now comes from `lists_list`, matching what `grocery-organizer` already did.
- **No spend cap of any kind.** `max_price_aud` was parsed and never read;
  `substitution: "deny"` was never honoured; there was no cart-total ceiling.
  All three are now asserted in `verify_cart.mjs` before checkout is reachable.
- **A wrong-product bug.** The add-to-cart selector bound its `data-product-id`
  filter to only one alternative of a comma-separated selector list, so `.first`
  could resolve to an arbitrary tile — buying the wrong item and reporting success.
- **Scheduled runs blocked on `AskUserQuestion`**, which has nobody to answer it
  and is denied outright in some permission modes. Runs now split at the notify
  boundary and defer via a new `approve` subcommand.

### Changed

- **Browser architecture: Claude in Chrome only.** Removed ~1,236 lines of
  Playwright adapters and all stored-credential handling. The retailer returns
  403 to non-browser clients, its terms prohibit automated access, and the old
  Uber Eats adapter shipped deliberate bot-detection evasion on an account
  holding the user's card. The skill now drives the user's own authenticated
  Chrome, never logs in, and never handles a one-time code.
- **No credentials anywhere.** `ORBREY_<STORE>_USER` / `_PASS` are gone.
- Hooks ported from bash to Node — no `jq`, no `sh -c`, works on Windows.
- All mutable state moved to `${CLAUDE_PLUGIN_DATA}`; script invocations are
  anchored to `${CLAUDE_PLUGIN_ROOT}`. The previous config path referenced a
  `settings.json` deleted back in 0.2.0, and bare relative script paths could
  never resolve.
- `meal-planner`, `grocery-organizer` and `household-onboarder` were declaring
  `allowed-tools: Read Write Edit` with **no MCP grants** while their bodies
  mandated MCP calls. Grants added.
- Removed the inert bare `ultrathink` line from six skills — it is a user-prompt
  keyword and has no effect in an injected skill body. `effort:` does this job.
- Fixed a fortnightly cron (`0 18 */14 * 0`) that fired ~7×/month, because cron
  ORs day-of-month against day-of-week.

### Removed

- Uber Eats Groceries support (dropped with the Playwright layer).
- Four documented protections that were never implemented: payment-method
  selection by label, a CI credential-scanning lint rule, and a `.gitignore`
  that did not exist anywhere in the repo. A repo `.gitignore` now does exist.

### Known limitations

- Dietary profiles are a **local JSON file**, so a scheduled run on a device that
  never saw onboarding will fail closed rather than order. Tracked upstream as
  `members.list` / `members.set_dietary_profile` on the worker.
- Ordering requires `claude --chrome` and a direct Anthropic plan. Not available
  on WSL, Bedrock, Vertex or Foundry — the skill halts with instructions.
- The end-to-end Chrome ordering path has not yet been exercised against a live
  retailer account. The gates around it are tested; the flow through them is not.

## [0.2.0] — 2026-05-05

### Fixed

- **`.mcp.json` schema** — wrapped the server entry under the required `mcpServers` top-level key. Previously the file was silently ignored, so the bundled MCP server never registered and the plugin re-prompted every session.
- **`userConfig` location** — moved from the (incorrect) top-level `settings.json` into `.claude-plugin/plugin.json` per the Claude Code plugin spec. `${user_config.*}` substitutions could not previously resolve because the keys were declared in the wrong file.
- **`marketplace.json` source path** — corrected `./plugins/orbrey-ai` → `./plugins/Orbrey` to match the on-disk directory casing (failed silently on case-sensitive filesystems).

### Changed

- **Authentication is now OAuth-based** — the plugin no longer asks the user to paste a bearer token. It declares the `orbrey` MCP at `https://mcp.orbrey.com/mcp` (HTTP transport) with no auth headers; Claude Code performs a standard OAuth 2.0 flow via the worker's Protected Resource Metadata on first use. Run `/mcp` to authenticate.
- **`userConfig` reduced to one optional field** (`default_household_id`). The MCP URL is now hard-coded; the bearer-token prompt is gone.
- **README rewritten** with the new install + `/mcp` flow, a note about Claude.ai vs Claude Code separate token stores, and the up-to-date tool catalogue (21 tools, including the new discovery + create-side tools shipped in the worker on 2026-05-05).

## [0.1.0] — 2026-05-05

### Added

- Initial plugin scaffold targeting the orbrey-mcp Cloudflare Worker.
- 10 household-domain skills:
  - `meal-planner` — generate weekly/fortnightly meal plans grounded in calendar busy-nights and pantry stock; auto-syncs to grocery list.
  - `grocery-organizer` — dedupe, categorise, and aisle-order the grocery list; folds duplicates via `grocery.merge`.
  - `chore-rotator` — generate fair chore rotations weighted by effort/age and tied to the rewards wallet.
  - `routine-builder` — build morning, school-prep, and bedtime routines as recurring task occurrences.
  - `calendar-conflict-finder` — flag overlaps, drive-time conflicts, and double-booked attendees across providers.
  - `family-week-planner` — combined fridge-ready weekly view: meals, chores, appointments, school, reminders.
  - `reward-strategist` — design reward catalogues, balance allowance vs chore credits, and project wallet trajectories.
  - `pantry-to-recipe` — recipe suggestions that minimise new grocery purchases.
  - `household-onboarder` — interactive checklist for onboarding new household members.
  - `recurring-task-author` — translate natural-language schedules into RRule patterns.
- 3 agents: `household-curator`, `meal-plan-orchestrator`, `routine-coach`.
- 6 slash commands: `/plan-week`, `/grocery-tidy`, `/chore-fairness`, `/family-digest`, `/recipe-from-url`, `/next-up`.
- 2 hooks: `confirm-destructive` (PreToolUse on `*delete*` and `grocery.merge`), `suggest-meal-slot` (PostToolUse on `recipes.create`).
