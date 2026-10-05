# Calendar Conflict Report — The Donovan Household

**Window:** 11/05/2026 – 24/05/2026
**Members in scope:** Sam, Jordan, Aria, Maya, Eli
**Providers synced:** Google (Sam, Jordan), iCloud (Aria), Orbrey-native (Maya, Eli)
**Events scanned:** 47
**Conflicts found:** 2 critical · 1 medium · 1 low

---

## Critical Conflicts

### 1. Maya double-booked Tuesday afternoon
**Type:** Double-booked attendee
**Day:** Tuesday 12/05/2026
**Severity:** Critical

**Evidence:**
- Event A: "Netball training" 16:30–18:00 @ Jacaranda Park (Orbrey-native)
- Event B: "Violin lesson" 17:00–17:30 @ home (Orbrey-native)
- Maya cannot be in two places.

**Proposed fix:**
- Move violin to **Wednesday 13/05 17:00**, OR
- Skip violin this week (last term Maya skipped twice already — verify with teacher), OR
- Cancel netball training (less likely — coach attendance tracked).

---

### 2. Drive-time conflict — Sam Friday school run
**Type:** Drive-time
**Day:** Friday 15/05/2026
**Severity:** Critical

**Evidence:**
- Event A: "Sam — work meeting" 14:30–15:30 @ Surry Hills office (Google)
- Event B: "Eli school pickup" 15:30 @ Banksia Primary (5 km, peak ~25 min) (Orbrey-native)
- Gap available: 0 min · drive time estimate: 25 min · **shortfall 25 min**

**Proposed fix:**
- Reassign pickup to **Jordan** (working from home that day per Google calendar), OR
- Sam moves work meeting to 13:30, OR
- Aftercare booking until 16:30 — Sam picks up at 16:00.

---

## Medium Conflicts

### 3. Aria back-to-back without gap
**Type:** Hard overlap (1 minute touch)
**Day:** Saturday 16/05/2026
**Severity:** Medium

**Evidence:**
- Event A: "Drama rehearsal" 09:00–11:00 @ school (iCloud)
- Event B: "Birthday party — Olivia" 11:00–13:00 @ Centennial Park (iCloud)
- Drive estimate: 12 min — Aria will arrive 12 min late to party.

**Proposed fix:**
- Tell Olivia's family Aria will be 12 min late (low-impact), OR
- Aria leaves drama 10:50 (mid-rehearsal — talk to drama teacher).

---

## Low Conflicts

### 4. Sunday all-day "Mother's Day" overlaps with Sam's "Cricket match"
**Type:** All-day vs timed
**Day:** Sunday 17/05/2026
**Severity:** Low

**Evidence:**
- Event A: All-day "Mother's Day" (Orbrey-native, household)
- Event B: "Sam — cricket match" 13:00–17:00 @ Centennial (Google)
- Not a hard conflict — the household-wide Mother's Day flag doesn't preclude an afternoon match.

**Proposed fix:**
- Confirm with Jordan that cricket is acceptable (stakeholder = the celebrated party).

---

## Open Items (Need More Data)

- [ ] "Maya — playdate?" Friday 15/05 17:00 — no location set; can't estimate drive time.
- [ ] "Eli swim training" Thursday 14/05 — recurring slot has changed three times this term; confirm 17:00 is correct for term 2.

---

## Coverage Gaps

- Maya does not have an external calendar provider connected. Her events are Orbrey-native only — anything booked on a school portal is invisible.
- Google last synced 36 hours ago. Re-run with `calendar.sync_import` before treating this report as fresh.

---

## Next Actions

- Decide on the violin/netball move for Maya (Critical 1)
- Confirm Friday pickup reassignment with Jordan (Critical 2)
- Re-run after `calendar.sync_import` if you make any edits
- Run `/orbrey-ai:family-week-planner` once conflicts are resolved
