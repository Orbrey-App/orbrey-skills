# Changelog — orbrey plugin

All notable changes to the `orbrey` plugin are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
