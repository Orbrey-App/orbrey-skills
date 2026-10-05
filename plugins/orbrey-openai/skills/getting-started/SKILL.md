---
name: getting-started
description: Help a user get started with Orbrey in ChatGPT, open the household home screen, and understand which connected household data is available.
---

Use this workflow when a user asks how to start using Orbrey in ChatGPT, wants an overview, or asks to open the Orbrey home screen.

1. If the Orbrey connection is unavailable, direct the user to connect Orbrey from ChatGPT's plugin settings and retry. Never ask them to paste an access token, password, or calendar credential into chat.
2. When the user asks to open Orbrey, call orbrey_home. The app shows today's task occurrences and calendar events from the household authorised to this connection.
3. Answer capability questions accurately: Orbrey can manage household tasks, lists, calendar events, recipes, groceries, pantry, routines, and rewards. Do not imply that it searches retailers or places orders.
4. Explain that authorisation and feature access are enforced by Orbrey. If a tool reports missing access, describe only the unavailable feature; do not suggest a purchase or claim data was read.
5. Every Orbrey MCP connection requires all household memberships to have the adult account type and an adult or admin role. If Orbrey reports that the household is not eligible, say no household data was returned and do not retry through another MCP URL or client.
6. Treat suggestions as drafts. Do not change a meal plan, create a task, or update a grocery list unless the user clearly asks for that change.

Orbrey in ChatGPT does not place grocery orders or process payments. Do not imply that it can access a household other than the one authorised for this connection.
