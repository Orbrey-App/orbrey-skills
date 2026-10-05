# Orbrey for ChatGPT

Orbrey connects ChatGPT to an authorised household. Every Orbrey MCP connection checks that each household membership has the adult account type and adult or admin role; child, guest, local-only, unknown, or unreadable classifications are blocked before household data can be read or changed. Orbrey can manage household tasks, lists, calendar events, recipes, groceries, pantry, and routines, and plan meals from saved recipes.

The ChatGPT sidebar entry opens an Orbrey home screen with today's tasks and calendar, household shortcuts, and a prompt box. Focused skills cover household and calendar planning, a read-only household digest, chore fairness and rotation, meal planning, grocery organisation, pantry recipes, recipe import from content provided in chat, recurring tasks, and routine building and coaching. Grocery tools manage the list only; they do not browse stores, place orders, or process payments.

This package uses the portable Agent Plugins layout: root `plugin.json`, root `mcp.json`, focused `skills/`, and listing icons in `assets/`. It shares the same hosted Orbrey MCP root endpoint and adult-only household policy used by other MCP clients, while keeping ChatGPT-specific listing, home UI, and skills in its own package. During authorisation, choose the household and scopes to connect; the MCP connection is bound to that household. Reconnect to switch.

The `assets/` folder contains separate light- and dark-mode listing and composer icons. This package does not include listing screenshots because those should be captured from a real ChatGPT runtime after the plugin is connected.
