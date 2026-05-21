# Example — End-to-end setup transcript

A walkthrough of `/orbrey-ai:kitchen-concierge setup` for the Donovan household in Coogee, NSW.

---

**User:** `/orbrey-ai:kitchen-concierge setup`

**Assistant:** Configuring the kitchen concierge for your household. Six quick questions.

### 1. Cadence

How often should the concierge run?

- [x] **Weekly** (Sunday 18:00) — recommended
- [ ] Fortnightly
- [ ] Monthly
- [ ] Custom cron string

**User:** Weekly

### 2. Local grocery store

What's your postcode and suburb?

**User:** 2034 Coogee NSW

**Assistant:** *(WebFetch × 3 in parallel against Woolworths/Coles/Aldi store finders)*

Nearest stores by chain:

**Woolworths**
- [x] Woolworths Coogee (1.2 km, 32 Arden St)
- [ ] Woolworths Maroubra Junction (2.8 km)
- [ ] Woolworths Eastgate Bondi (3.4 km)

**Coles**
- [ ] Coles Randwick (2.1 km, Royal Randwick Shopping Centre)
- [ ] Coles Pacific Square Maroubra (3.0 km)

**Aldi**
- [ ] Aldi Maroubra (2.9 km)

Pick a **primary**: *Woolworths Coogee*
Pick a **fallback**: *Coles Randwick*

### 3. Auto-save recipes

If I research a meal idea online and you cook it, should I save it to your household library?

- [x] **Yes** — persist via `recipes_create` so I'll suggest it again
- [ ] No — mention it in the brief, don't persist

**User:** Yes

### 4. Auto-order policy

- [ ] Always auto-order (still confirm cart before checkout)
- [x] **Build cart but pause for explicit go-ahead** — recommended
- [ ] Never auto-order (produce list + notify only)

**User:** Build cart but pause

### 5. Designated notification target

*(households_list returned: Anna Donovan, Mark Donovan, Eli Donovan (13), Sophie Donovan (10))*

Who reviews the brief each cycle?

- [x] **Anna Donovan** (parent)
- [ ] Mark Donovan
- [ ] Eli Donovan
- [ ] Sophie Donovan

Delivery channel:

- [x] **In-Claude prompt** (default)
- [x] **Also add to shared list** "Kitchen Concierge notifications"

### 6. Ordering backends + priority

Multi-select, in priority order:

1. [x] **Woolworths** (click-and-collect)
2. [x] **Coles** (click-and-collect fallback)
3. [ ] Uber Eats Groceries

Default delivery mode: **Click-and-collect** (cheapest, you collect Sunday morning)

---

**Assistant:**

Writing config to `plugins/orbrey-ai/.kitchen-concierge.config.json`…

Registering scheduled task…

```
mcp__scheduled-tasks__create_scheduled_task
  cronExpression: 0 18 * * 0
  prompt: /orbrey-ai:kitchen-concierge run
  description: Kitchen concierge — Donovan household
  notifyOnCompletion: true
```

Confirming with `mcp__scheduled-tasks__list_scheduled_tasks`…

### Setup complete

| Field | Value |
|---|---|
| Cadence | Weekly, Sunday 18:00 (next: 24/05/2026 18:00 AEST) |
| Primary store | Woolworths Coogee — click-and-collect |
| Fallback store | Coles Randwick |
| Auto-save recipes | Yes |
| Auto-order policy | Build + pause for go-ahead |
| Notification target | Anna Donovan (in-Claude + shared list) |
| Adapters available | woolworths ✓ · coles ✓ · uber_eats ✓ |

**Before the first scheduled run**, set credentials in your shell:

```
$env:ORBREY_WOOLWORTHS_USER = "anna@donovan.example"
$env:ORBREY_WOOLWORTHS_PASS = "<your password>"
$env:ORBREY_COLES_USER = "anna@donovan.example"
$env:ORBREY_COLES_PASS = "<your password>"
```

Save a payment method on each grocer's account beforehand — the adapter selects "saved payment", never enters card details.

To trigger an immediate run: `/orbrey-ai:kitchen-concierge run`
To see status: `/orbrey-ai:kitchen-concierge status`
