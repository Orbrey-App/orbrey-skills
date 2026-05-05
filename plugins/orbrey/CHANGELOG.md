# Changelog — orbrey plugin

All notable changes to the `orbrey` plugin are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
