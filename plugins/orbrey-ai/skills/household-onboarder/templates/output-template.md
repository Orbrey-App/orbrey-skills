# Onboarded — {{Member Name}}

**Household:** {{name}}
**Date:** {{DD/MM/YYYY}}
**Onboarded by:** {{admin name}}

---

## Profile

- **Display name:** {{name}}
- **Role:** {{admin | parent | partner | child | flatmate | carer | guest}}
- **Age:** {{n}} (if child)
- **Email:** {{email}}
- **Phone:** {{phone or "—"}}
- **Time-bound invite ends:** {{DD/MM/YYYY or "no expiry"}}

---

## Dietary Record

- **Allergies:**
  - {{ingredient}} — {{[SEVERE] | moderate | preference}}
- **Dietary pattern:** {{none | vegetarian | vegan | pescatarian | halal | kosher | other}}
- **Cultural patterns:** {{e.g. Friday is fish night}}
- **Strong dislikes:** {{list}}

---

## Scope Grants

| Scope | Granted? | Notes |
|---|---|---|
| tasks:read | yes / no | |
| tasks:write | yes / no | |
| lists:read | yes / no | |
| lists:write | yes / no | |
| calendar:read | yes / no | |
| calendar:write | yes / no | |
| recipes:read | yes / no | |
| recipes:write | yes / no | |
| grocery:read | yes / no | |
| grocery:write | yes / no | |
| rewards:read | yes / no | |
| rewards:write | yes / no | |

Confirmed by: {{admin name}} on {{DD/MM/YYYY}}.

---

## Calendar Connection

- **Provider connected:** {{Google | iCloud | Outlook | none}}
- **First sync result:** {{N events imported | not yet synced | skipped}}
- **Action needed:** {{e.g. "Member to grant Google access via app"}}

---

## Reward Wallet

- **Wallet created:** yes / n/a
- **Starting balance:** ${{n}}
- **Weekly allowance:** ${{n}}
- **Allowance source:** {{base | hybrid with chores | n/a}}

---

## Next Actions

- [ ] Run `/orbrey-ai:chore-rotator` to slot {{member}} into the rotation
- [ ] Run `/orbrey-ai:routine-builder` for {{member}}'s morning routine
- [ ] Run `/orbrey-ai:reward-strategist` if this is the household's first child
- [ ] (For adults) Trigger `calendar.sync_import` once OAuth is granted

---

## Open Items

- [ ] {{Anything pending}}
