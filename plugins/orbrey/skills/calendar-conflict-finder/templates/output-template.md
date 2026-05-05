# Calendar Conflict Report — {{Household Name}}

**Window:** {{DD/MM/YYYY}} – {{DD/MM/YYYY}}
**Members in scope:** {{list}}
**Providers synced:** {{Google · iCloud · Outlook · Orbrey-native}}
**Events scanned:** {{N}}
**Conflicts found:** {{N critical · M medium · K low}}

---

## Critical Conflicts

### {{N}}. {{Conflict title}}
**Type:** Hard overlap | Drive-time | Double-booked attendee | Missing pair
**Day:** {{Day DD/MM/YYYY}}
**Severity:** Critical

**Evidence:**
- Event A: "{{title}}" {{HH:mm}}–{{HH:mm}} @ {{location}} ({{provider}})
- Event B: "{{title}}" {{HH:mm}}–{{HH:mm}} @ {{location}} ({{provider}})
- Gap available: {{n}} min · drive time estimate: {{m}} min

**Proposed fix:**
- Move Event B to {{day}} {{HH:mm}}, OR
- Reassign attendee from {{member}} to {{other member}}, OR
- Cancel Event B

---

## Medium Conflicts

{{Same shape as Critical}}

---

## Low Conflicts

{{Same shape as Critical}}

---

## Open Items (Need More Data)

- [ ] {{Event}} — no location set; can't estimate drive time
- [ ] {{Event}} — no attendees; can't detect double-bookings
- [ ] {{Member}} — no calendar provider connected; running blind on their events

---

## Coverage Gaps

- {{Member}} has not connected an external calendar. Add via `/orbrey:household-onboarder`.
- {{Provider}} last synced > 24 hours ago. Re-run with calendar sync first.

---

## Next Actions

- Confirm proposed fixes with affected members
- Run `calendar.sync_export` after edits to push back to providers
- Run `/orbrey:family-week-planner` once conflicts are resolved
