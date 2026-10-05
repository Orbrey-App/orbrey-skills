---
name: household-onboarder
description: Guide a user through checking an existing Orbrey household connection and preparing onboarding steps in the Orbrey app.
argument-hint: [member-name-and-role]
allowed-tools: Read mcp__orbrey__members_list mcp__orbrey__calendar_list mcp__orbrey__rewards_wallets mcp__orbrey__tasks_list
effort: medium
---

# Household Onboarder

Guide a household manager through onboarding a person in the Orbrey app, then help verify information that is visible to this MCP connection. This MCP does not create members, send invitations, change permissions, connect external calendars, or set up allowance rules.

## Workflow

1. Explain that the active MCP connection is already authorised for one household. Do not ask for a household ID or claim that this plugin can choose another household.
2. If the user asks what is currently connected, use members_list to read the roster and recorded food preferences, foods to avoid, and allergies that the tool returns.
3. If the person is not in the returned roster, guide the household manager to add or invite them in the Orbrey app. Do not create a local profile or pretend that a note updates the Orbrey account.
4. Permissions, invitations, roles, and external calendar connections must be completed by the user in the Orbrey app. Do not request passwords, tokens, or personal calendar credentials in chat.
5. After the user says setup is complete, use only the requested read tools to verify the returned state: members_list for roster/profile fields, calendar_list for events visible to this connection, rewards_wallets for current balances, or tasks_list for assigned occurrences.
6. Explain that members_list does not include age, allergy severity tiers, or ingredient aliases. Do not describe missing fields as clear or safe.
7. Report what was observed and what remains for the user to finish in the app. Do not save a local report unless the user requests one and a file destination is provided.

## Privacy and control

Read only information the user requested. Do not expose household details unnecessarily, do not change membership or authorization, and do not treat access to the MCP as permission to alter another person's profile.
