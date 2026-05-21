# Notification Brief Template

The brief delivered to the designated household member at Phase 3.5. Sent either as an in-Claude markdown render or as a shared-list entry (split into multiple list items if length is the constraint).

---

```markdown
## Kitchen Concierge — {{DATE_DDMMYYYY}}

**Household:** {{HOUSEHOLD_NAME}}
**Period:** {{PERIOD_LABEL}} ({{START_DATE}} – {{END_DATE}})
**Designated reviewer:** {{MEMBER_NAME}}

---

### Meals planned

| Date | Meal | Recipe | Source | Cook time |
|---|---|---|---|---|
| {{DD/MM}} | {{Breakfast|Lunch|Dinner}} | {{recipe name}} | {{Library | Suggested new}} | {{min}} |
| … | … | … | … | … |

{{PLANNING_NOTES}}  <!-- e.g. "Tuesday is busy — 20-min stir-fry chosen." -->

---

### Pantry status

- {{N}} items expiring within 7 days — used in {{M}} of the new meals
- {{N}} items consumed since last run — logged via `pantry_consume`
- {{N}} items below low-stock threshold and added to the shopping list

---

### Shopping list ({{N_ITEMS}} items · est. ${{TOTAL_AUD}} AUD)

**Produce**
- {{item}} × {{qty}} {{unit}}

**Pantry / dry**
- …

**Chilled**
- …

**Frozen**
- …

---

### Suggested store

**Primary:** {{STORE_NAME}} ({{STORE_SUBURB}}) via {{click-and-collect|delivery}}
**Fallback:** {{STORE_NAME_2}} (used automatically if primary fails)
**Earliest available slot:** {{DD/MM HH:MM}} – {{HH:MM}}

---

### Awaiting your go-ahead

Reply with one of:

- **`go`** — order the cart as listed
- **`edit`** — let me adjust the list first
- **`skip`** — defer this run; I'll try again next cycle
- **`store: <name>`** — force a specific store

This brief is auto-generated. The full plan is in your meal-plan view; the full list is in the grocery view.
```

---

## Variant: shared-list entry (compact)

When delivered via `lists_add_item`, collapse to a single entry of the form:

```
[Kitchen Concierge {{DD/MM}}] {{N_ITEMS}} items · ${{TOTAL_AUD}} · {{STORE_NAME}} {{click-and-collect|delivery}} · reply "go"/"edit"/"skip"
```

Add a second list item with the meal plan summary if the channel supports it.

---

## Final outcome card (Phase 3.7 render)

After the order completes (or is cancelled / deferred), append this card to the conversation:

```markdown
### Run complete — {{ISO8601}}

- Outcome: **{{Placed | Deferred | Cancelled | Failed}}**
- Order reference: {{REF_NUMBER or "—"}}
- Total: ${{TOTAL_AUD}} AUD
- Pickup/delivery: {{DD/MM HH:MM}}
- Adapter: {{ADAPTER_NAME}}
- Log: `.kitchen-concierge/runs/{{ISO8601}}.md`

Next scheduled run: {{NEXT_FIRE_DATETIME}}
```
