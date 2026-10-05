# Orbrey Plugin Marketplace

The Claude Code plugin marketplace for [Orbrey](https://orbrey.com). It currently contains the `orbrey` plugin: 11 skills, 3 agents, and 7 commands backed by the hosted Orbrey MCP server.

## Install

```text
/plugin marketplace add Orbrey-App/orbrey-skills
/plugin install orbrey@orbrey-ai-marketplace
```

On first use, run `/mcp` and complete Claude Code's OAuth flow. Select the household and scopes to authorise. Each connection is bound to one household; re-authorise to switch. Claude Code and Claude.ai use separate connections.

## Try it

```text
/plan-week
/grocery-tidy
/chore-fairness
/family-digest
/next-up
```

## Plugin contents

| Component | Count | Examples |
|---|---:|---|
| Skills | 11 | Meal planning, groceries, chores, routines, calendar conflicts, pantry recipes |
| Agents | 3 | Household curator, meal-plan orchestrator, routine coach |
| Commands | 7 | Planning, grocery review, chores, household digest, recipe-import guidance, next-up, Kitchen Concierge |

The full Claude plugin and supported tool boundaries are documented in [`plugins/orbrey-claude/README.md`](plugins/orbrey-claude/README.md). The separate portable ChatGPT/Codex package is [`plugins/orbrey-openai/`](plugins/orbrey-openai/).

## Architecture

Both packages connect to `https://mcp.orbrey.com/`. The OpenAI package uses portable `plugin.json` and `mcp.json`, OpenAI listing metadata, and ChatGPT app UI. The Claude Code package uses its Claude marketplace manifest, commands, agents, hooks, and Claude-specific skills. The Claude-only Kitchen Concierge uses the user's Chrome session and requires a human decision at checkout; it is excluded from the OpenAI package.

The MCP authorisation selects one household. `household_id` does not switch to a second grant. Tool access and plan requirements are enforced by Orbrey. Some meal-planning and pantry tools may require Orbrey Plus.

## Safety

The destructive-action hook is advisory. The Kitchen Concierge checkout hook blocks checkout unless the cart passes local verification, then requires a separate host permission prompt. Grocery and list tools in ChatGPT only manage household records; they do not place orders or process payments.

## Repository layout

```text
plugins/
  orbrey-claude/   Claude marketplace package source
  orbrey-openai/   Portable OpenAI plugin package
scripts/
.claude-plugin/
```

## License

Marketplace files are MIT licensed. Per-skill licenses are included in each skill directory.
