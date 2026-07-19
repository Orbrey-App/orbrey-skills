# Example — `setup`

> **Illustrative, not a captured transcript.** Names, stores and figures are
> invented to show the shape of the flow. Nothing here is a record of a real
> run. (The 0.2.0 version of this file presented invented output as if it were
> tested; that is why every example in 0.3.0 carries this banner.)

---

**User:** `/orbrey-ai:kitchen-concierge setup`

**Claude:**

> Setting up your kitchen concierge. Six quick questions, then I'll register the
> schedule.
>
> First — what's your postcode and suburb? I'll find the nearest stores.

**User:** 2026, Bondi

**Claude:** *(navigates the store finders in Chrome, then asks)*

**S2** — "Which store should be your primary?" · `Store`
→ `Woolworths Bondi` · `Coles Bondi Junction` · `Woolworths Waverley` · `Aldi Bondi Junction`

**User:** Woolworths Bondi

**S3** — "And your fallback, if Woolworths is short?" · `Fallback`
→ `Coles Bondi Junction` · `Woolworths Waverley` · `Aldi Bondi Junction` · `No fallback`

**User:** Coles Bondi Junction

**S4** — three questions in one panel:

| Question | Header | Answer |
|---|---|---|
| How often should the run fire? | `Cadence` | Weekly |
| Auto-save new recipes to your library? | `Recipes` | Ask each time |
| Who gets the shopping brief? | `Notify` | Sam |

**S5** — "What's the maximum total for a single order?" · `Max spend`
→ `$100` · `$150` · `$250` · `$400`

**User:** $250

**S6** — "If an item is unavailable, what should happen?" · `Subs`
→ `Substitute similar` · `Ask me first` · `Skip the item` · `Cancel the run`

**User:** Ask me first

---

**Claude:**

> Config written to `${CLAUDE_PLUGIN_DATA}/config.json`.
>
> Scheduled task registered:
>
> | | |
> |---|---|
> | Cron | `0 18 * * 0` (Sundays 18:00, Australia/Sydney) |
> | Prompt | `/orbrey-ai:kitchen-concierge run` |
> | Notify on completion | yes |
>
> **One thing before this can order anything.**
>
> I checked for `household-dietary-profiles.json` and there isn't one. Ordering
> will refuse to run until every member has a dietary profile — that's a hard
> stop, not a warning, because a scheduled run has nobody to ask about allergies
> and I'd otherwise be buying food blind.
>
> Run `/orbrey-ai:household-onboarder` for each member. It takes a couple of
> minutes each and only needs doing once.
>
> Two other things worth knowing:
>
> - **Ordering needs Chrome.** Start Claude Code with `claude --chrome` when you
>   want to place an order. I drive your own logged-in browser — I never handle
>   your password or a verification code.
> - **Payment stays with Woolworths.** Make sure your card is saved on your
>   account. I never see it. If you want a hard financial ceiling on top of the
>   $250 limit, a Revolut or Wise virtual card with a monthly cap works well as
>   the card on file.
>
> Check anytime with `/orbrey-ai:kitchen-concierge status`.
