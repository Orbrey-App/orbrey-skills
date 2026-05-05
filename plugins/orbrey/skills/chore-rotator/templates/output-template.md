# Chore Rotation — {{Household Name}}

**Period:** {{weekly | fortnightly | four-weekly}}
**Start date:** {{DD/MM/YYYY}}
**Members in rotation:** {{N}}
**Reward rates:** Light ${{x}} · Medium ${{y}} · Heavy ${{z}}

---

## Assignments

### {{Member 1}} ({{age}}) — {{effort points used}}/{{budget}} pts · projected ${{weekly earn}}/wk

- [ ] **{{Chore}}** ({{tier}}, {{points}}pts, ${{$}}) — {{day}} {{HH:mm}}
- [ ] **{{Chore}}** ({{tier}}, {{points}}pts, ${{$}}) — {{day}} {{HH:mm}}

### {{Member 2}} ({{age}}) — {{effort}}/{{budget}} pts · ${{$}}/wk

- [ ] **{{Chore}}** ({{tier}}, {{points}}pts, ${{$}}) — {{day}}

<!-- Repeat per member -->

---

## Reward Projection

| Member | Light | Medium | Heavy | Effort pts | Weekly $ |
|---|---:|---:|---:|---:|---:|
| {{Name}} | {{n}} | {{n}} | {{n}} | {{n}} | ${{n}} |

---

## Proposed Task Occurrences

The following will be created on confirmation:

| Title | Assigned | Recurrence | First due | Reward |
|---|---|---|---|---|
| {{title}} | {{member}} | {{RRULE}} | {{DD/MM/YYYY}} | ${{n}} |

Confirm to proceed. Decline to keep this as advisory only.

---

## Open Items

- [ ] {{Chore}} — nobody under capability cap; needs adult absorption or scope cut
- [ ] {{Member}} flagged exclusion: {{chore}} ({{reason}})
- [ ] {{Suggestion to recalibrate rates}}

---

## Next Period Preview

The rotation will swap so:

- {{Member}} who did **{{chore}}** this period takes **{{different chore}}** next.
- Rebalance is automatic once `tasks.list` history shows the completed entries.

---

## Next Actions

- Run `/orbrey:routine-builder` to slot daily routine tasks alongside chores
- Run `/orbrey:reward-strategist` to design a redemption catalogue
- Open the Orbrey app to confirm the chore occurrences appeared
