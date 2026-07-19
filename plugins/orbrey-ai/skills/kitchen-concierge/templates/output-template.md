# Notification Brief Template

The brief delivered to the designated household member at Phase 3.5 — either rendered in-session or written as a shared-list entry.

---

```markdown
## Kitchen Concierge — {{DATE_DDMMYYYY}}

**Household:** {{HOUSEHOLD_NAME}}
**Period:** {{PERIOD_LABEL}} ({{START_DATE}} – {{END_DATE}})
**Reviewer:** {{MEMBER_NAME}}

---

### Dietary contract in force

Restate this at the top of every brief. If a plan was constrained, the person
approving it needs to see what it was constrained by.

| Member | Restriction | Tier |
|---|---|---|
| {{NAME}} | {{ingredient}} | **{{life_threatening}}** |
| {{NAME}} | {{ingredient}} | {{medical_avoid}} |

Profile last confirmed {{DD/MM/YYYY}} · {{N}}/{{N}} members covered

---

### Meals planned

| Date | Meal | Recipe | Source | Cook time |
|---|---|---|---|---|
| {{DD/MM}} | {{Dinner}} | {{recipe name}} | {{Library｜Suggested new}} | {{min}} |

{{PLANNING_NOTES}}  <!-- e.g. "Tuesday is busy — 20-min stir-fry chosen." -->

---

### Pantry status

- {{N}} items expiring within 7 days — used in {{M}} of the new meals
- {{N}} items below low stock and added to the shopping list
- Pantry list last updated {{DD/MM/YYYY}}{{" — STALE, consider a refresh" if >30 days}}

---

### Shopping list ({{N_ITEMS}} items · est. ${{TOTAL_AUD}} AUD)

**Produce**
- {{item}} × {{qty}} {{unit}}

**Pantry / dry** · **Chilled** · **Frozen**
- …

> Estimated total. The figure that gets checked against your ${{MAX_TOTAL}} ceiling
> is the retailer's own review-page total, read at order time.

---

### Store

**Primary:** {{STORE_NAME}} ({{STORE_SUBURB}}) via {{click-and-collect｜delivery}}
**Fallback:** {{STORE_NAME_2}} — offered as an explicit choice if the primary is
short more than 20% of the cart, never switched to silently
**Earliest slot:** {{DD/MM HH:MM}} – {{HH:MM}}

---

### Next step

{{#if interactive}}
I'll ask you to confirm before anything is ordered.
{{else}}
This run was scheduled, so it stops here. Nothing has been ordered and nothing
has been charged. Run `/orbrey-ai:kitchen-concierge approve` when you're next at
the keyboard and I'll build the cart and check out with you.
{{/if}}
```

> **Reply options must match the AskUserQuestion panel exactly.** The tool takes
> 2–4 fixed options and has no free-text field, so do not offer a
> `store: <name>` style reply the tool cannot capture. Phase 3.6's R2 panel is
> the canonical wording: `Order now` · `Edit the list` · `Try Coles instead` ·
> `Skip this run`.

---

## Variant: shared-list entry (compact)

Delivered via `lists_add_item`:

```
[Kitchen Concierge {{DD/MM}}] {{N_ITEMS}} items · est. ${{TOTAL_AUD}} · {{STORE_NAME}} {{mode}} · run `approve` to order
```

Add a second item with the meal-plan summary if the channel allows.

---

## Final outcome card (Phase 3.7)

```markdown
### Run complete — {{ISO8601}}

- Outcome: **{{Placed｜Deferred｜Cancelled｜Failed}}**
- Dietary profile: {{N}}/{{N}} members resolved
- Cart verified: {{Yes — hash {{HASH}}, total ${{TOTAL}}｜No — exit {{CODE}}: {{REASON}}}}
- Order reference: {{REF_NUMBER｜"—"}}
- Total: ${{TOTAL_AUD}} AUD (ceiling ${{MAX_TOTAL_AUD}})
- Pickup/delivery: {{DD/MM HH:MM}}
- Log: `${CLAUDE_PLUGIN_DATA}/runs/{{ISO8601}}.md`

Next scheduled run: {{NEXT_FIRE_DATETIME}}
```
