# Calendar Conflict Finder — Reference

Reference data for drive-time estimates and conflict scoring.

---

## 1. Drive-Time Estimates (Australian Metro)

Rough peak vs off-peak for inner-suburb pairs (km · min).

| Distance | Off-peak | Peak (07:30–09:00, 15:00–18:30) |
|---|---:|---:|
| ≤ 2 km | 5 | 8 |
| 2–5 km | 10 | 18 |
| 5–10 km | 15 | 30 |
| 10–20 km | 22 | 45 |
| 20–35 km | 30 | 60+ |

These are estimates. Surface them as approximate. Use `google-places-autocomplete` if the user wants real-time geocoding.

---

## 2. Severity Scoring

| Factor | Critical | Medium | Low |
|---|---|---|---|
| Hard overlap | School/work day | Weekend | All-day vs timed |
| Drive-time | Shortfall ≥ 15 min | Shortfall 5–14 min | Shortfall 1–4 min (manageable) |
| Double-booked attendee | School-day commitment | Weekend optional | All-day vs minor event |
| Missing attendee | Child's medical/school event | Child's social event | Adult-only event |

---

## 3. Standard Conflict Patterns

**School run dependencies:**
- Drop-off needs an adult attendee.
- Pickup needs an adult attendee.
- After-care booking moves the pickup time forward.

**Sport / activity dependencies:**
- Game / match needs at least one parent attendee unless the kid is ≥14 and self-managing.
- Training has lower attendance threshold.

**Medical dependencies:**
- Appointment for a child needs an adult attendee. Zero exceptions.
- Telehealth flag may relax the location requirement but not the attendee.

---

## 4. Reschedule Move Templates

When proposing a move:

```
Move "{{event title}}" from {{day HH:mm}} to {{day HH:mm}}.
Why: {{conflict reason}}.
Effect: {{what other slots are now free / blocked}}.
Stakeholders to notify: {{names}}.
```

---

## 5. Out-of-Scope (don't flag these)

- Birthday calendar all-day reminders — these are notifications, not conflicts.
- "Out of office" / vacation flags on adults — these are context, not events to deconflict.
- Public holidays — these inform context but do not themselves conflict.
