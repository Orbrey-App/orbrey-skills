# Orbrey ChatGPT and Claude plugin review

**Reviewed:** 2026-10-05  
**State:** OpenAI package v0.1.1 and unified MCP changes are prepared locally. The Worker is deployed and live-read back with the root endpoint adult-gated for all clients, `/openai` removed, and the OpenAI challenge token live. The legacy `/openai` Platform draft remains URL-locked, while a separate root-URL draft (`asdk_app_6ac33eb9a4e48191baa644ab1d51668b`) now points to `https://mcp.orbrey.com/`, has verified domain status, and shows Authentication `Authorized`. The user completed its Connect flow. Its initial MCP tool scan has completed; the draft remains unpublished and unsubmitted. Production privacy-page deployment and scan follow-up remain outstanding.

## Decision

Maintain **one hosted Orbrey MCP service** and **separate client packages**:

- **OpenAI portable plugin:** root `plugin.json`, root `mcp.json`, fifteen OpenAI-facing skills, and light/dark listing icons. OpenAI-specific listing and UI details live under `extensions.com.openai`.
- **Claude Code plugin:** the existing Claude marketplace package remains under `plugins/orbrey-ai`, with its own Claude manifest, `.mcp.json`, commands, agents, hooks, and Claude-specific workflows.
- **Shared backend and one route:** both packages use `https://mcp.orbrey.com/` and the same Orbrey data/authentication. The universal root MCP endpoint applies the adult-only household gate to every client. The former `/openai` route returns 404.

OpenAI's current Agent Plugins format is portable and public plugins publish once to the shared ChatGPT/Codex directory. Claude Code plugins are installed from a Claude Code marketplace repository and can package skills, agents, hooks, and MCP servers. The Claude Code plugin marketplace is distinct from Claude's consumer connector directory; Claude.ai users connect to the hosted MCP server through custom connectors. Reuse the MCP server, but keep client packaging and UI metadata separate. [OpenAI package guide](https://developers.openai.com/plugins/build/plugins) · [Claude Code plugins](https://code.claude.com/docs/en/plugins) · [Claude Code marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces) · [Claude remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

## Review findings and changes implemented

### MCP UI and ChatGPT home

- Added a read-only `orbrey_home` tool that returns the authorised household's today snapshot and household name. It requires only task-read and calendar-read scopes.
- Registered the tool as a ChatGPT global sidebar app entrypoint and marked it app-only. The full-screen home view shows today's tasks and calendar events, connection and empty/error states, a prompt box, suggested prompts, and cards for tasks, calendar, meals, groceries, pantry, and rewards.
- Added navigation for app paths `/`, `/today`, `/tasks`, `/calendar`, `/meals`, `/groceries`, `/pantry`, and `/rewards`. The home prompt sends the user's request into the current ChatGPT conversation; it does not replace ChatGPT's own sidebar or composer.
- The home shows the household selected during OAuth. Because the MCP connection is intentionally bound to one household, switching households means reconnecting and selecting another one; the app does not present a misleading in-widget selector.
- Replaced the provider-specific `/openai` route with a single root MCP endpoint and root protected-resource metadata. Every client now passes the same adult-classification gate before tool work; every membership row must have `account_type=adult` and role `adult` or `admin`. Child account types, legacy `kid` roles, guest/local classifications, unknown values, and lookup failures are denied before household records are read or changed. This is a server-side profile-classification check, not independent age verification or free-text scanning. Live adult/child/unknown/error cases remain unexercised.
- Applied the MCP Apps bridge and host styles for theme and display behavior. UI resources now advertise the dedicated `https://mcp.orbrey.com` UI origin, empty CSP domain allowlists, an accessible description, and an explicit OpenAI display mode: fullscreen-only for the global home and inline-only for conversational result cards.
- Corrected destructive annotations and server-side confirmation gates for overwriting or removing task status, task definitions, shared-list details and lines, recipes, reward definitions and balances, grocery items/lists, calendar events, pantry items, meal-plan slots/meals, and removable profile preferences. Updated widget task and meal-slot actions to pass confirmation after the user's explicit click. Added an annotation audit view to the generated tool inventory. The public MCP README counts remain 63 tools, 11 UI resources, and 19 scopes.

This implements the high-value sidebar extension and a useful dashboard that follows ChatGPT's app surface. Conversation panels, persistent plugin settings, file editors/viewers, and custom form flows are deferred: the current household workflows do not need them to deliver the first release, and each should be added only for a validated use case. Validate the UI in the real ChatGPT runtime before public review. [ChatGPT UI](https://developers.openai.com/plugins/build/chatgpt-ui) · [Extensions](https://developers.openai.com/plugins/build/extensions) · [UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines) · [UI reference](https://developers.openai.com/plugins/reference)

### OpenAI package and metadata

Created `plugins/orbrey-openai/` using the portable package layout. It contains fifteen focused skills: getting started, weekly household planning, a read-only household digest, next-up, chore fairness and rotation, meal planning, grocery organising, calendar conflicts, pantry-based recipes, recipe import from provided content, recurring tasks, routine building and coaching, and rewards. These port the reusable Claude commands and agent procedures while leaving Claude-only browser checkout, local-file behavior, and the Claude canvas artifact builder out. Each skill declares its OpenAI MCP dependency in `agents/openai.yaml`.

The listing uses publisher **Orbrey**, the six selected countries (**AU, US, GB, NZ, CA, IE**), three default prompts, a short description within the 30-character limit, and a longer description covering the universal adult-only household gate and grocery-list-only behavior. Pricing, subscription, upgrade, free-trial, discount, and promotion claims have been removed. Four icon slots refer to the Orbrey mark in 512×512 light and dark PNG variants. The metadata includes five positive and three negative review-case drafts, including adult-only denial. Commerce is `false`; the ChatGPT package contains no browser ordering skill and no purchase capability. `mcp.json` now points to `https://mcp.orbrey.com/`.

The requested public privacy URL, `https://orbrey.com/privacy-policy`, remains in the listing as instructed. The live privacy and terms URLs still serve brief placeholder copy. Locally, those same routes now render the longer Privacy and Terms components; the privacy component explains the ChatGPT tool-request/result flow, the adult profile-classification gate, and that it does not inspect free-text for child references. The legal copy still needs fact-checking and publisher review before deployment; it contains unresolved data-region and legal-entity details. This is a launch blocker, not a reason to silently substitute another URL. [Metadata guide](https://developers.openai.com/plugins/guides/optimize-metadata) · [Submission reference](https://developers.openai.com/plugins/deploy/submission)

### Claude Code package and MCP alignment

- Updated the Claude MCP URL to the working hosted root `https://mcp.orbrey.com/`; the old `/mcp` path returned 404 during the live endpoint review.
- Updated package descriptions and corrected stale assumptions in meal planning, grocery organising, chore rotation, routines, recurring tasks, rewards, household onboarding, and Kitchen Concierge.
- Updated the Orbrey AI publisher page and Claude Code help article source to distinguish the separate ChatGPT package, correct the Claude plugin count to 12 skills, and use the current MCP root URL. These website changes are local only; the public pages still need a normal site deployment.
- Replaced calendar-conflict guidance that assumed drive-time, attendee, provider, and calendar-sync fields with a read-only overlap review based only on returned events.
- Replaced the weekly household planner's unsupported list lookup with the real meal-plan, tasks, and calendar tools.
- Corrected reward examples and instructions to use Orbrey gems, not cash allowances, and to avoid duplicate wallet credits when a task reward is applied on completion.
- Clarified that an MCP authorisation selects one household; there is no household discovery or default-household tool.
- Kept Kitchen Concierge Claude-only. Its dietary profile is local to Claude Code, it verifies the local profile against a fresh `members_list` roster before checkout, rejects stale or mismatched roster snapshots, and reports its brief in the current session. Its retailer checkout remains human-gated and is excluded from the ChatGPT package.
- Synchronized the Claude marketplace entry with plugin version 0.3.1 and its current component counts.

## OpenAI extension recommendation

Use the **global sidebar app entrypoint** as the ChatGPT home surface. The implemented version follows the supplied Higgsfield/Figma-style pattern at a smaller household-focused scale: a prompt area, guided prompts, a today summary, and shortcut cards. ChatGPT retains its own shell and conversation composer.

The current deep-link handler can focus supported home sections. After observing real usage, consider one focused form for reviewing a meal plan or a consequential edit; keep MCP confirmation on all protected writes. Add conversation panels or settings only if users need cross-conversation workspace state. Do not add commerce, retail browsing, or checkout to ChatGPT, consistent with the user's instruction.

## Public review and launch blockers

### OAuth and domain checks

Pre-deployment checks on 2026-10-05 confirmed the provider-identity mismatch: `/.well-known/oauth-authorization-server` reported `https://mcp.orbrey.com`, while `/.well-known/openid-configuration` exposed Supabase's issuer and authorize/token endpoints. The user confirmed that `sfvakyudufremliasnld` is Orbrey's only, production database despite the provider's “Orbrey Test” label. The developer identity is now verified and a Platform draft exists.

The Worker OAuth metadata now derives its upstream Auth URL from the same `SUPABASE_URL` as the data API, stops proxying Supabase's OIDC discovery document, omits OIDC identity fields/scopes from the Orbrey RFC 8414 metadata, and filters Supabase's upstream ID token from the OAuth token response. It preserves `/.well-known/jwks.json` for internal JWT verification. Dynamic Client Registration now accepts OpenAI's stable ChatGPT callback as well as the existing clients' callbacks.

The Worker was deployed to the existing production Worker on 2026-10-05 (version `d89fc023-f731-471e-a9af-5655148c231b`). Live readback confirms: `/` returns 401 with a `WWW-Authenticate` challenge pointing to `/.well-known/oauth-protected-resource`; the root PRM returns 200 and names `https://mcp.orbrey.com/`; `/openai` and `/.well-known/oauth-protected-resource/openai` return 404; RFC 8414 metadata returns 200 with issuer `https://mcp.orbrey.com`; `/.well-known/openid-configuration` returns 404; and the challenge URL returns the exact token supplied by the user. OpenAI Platform reports the root draft's domain verified and Authentication `Authorized`. The original `/openai` draft still rejects changing its associated MCP URL, but the root endpoint is now connected through a separate draft (`asdk_app_6ac33eb9a4e48191baa644ab1d51668b`); no migration is needed for that draft. The user reports completing its Connect flow. The consent page and exact authorization redirect were not independently observed, so record the Platform authorization state without claiming a verified browser handoff.

1. Keep `sfvakyudufremliasnld` as the sole production Supabase project. No restore or switch to the separately listed project is required.
2. Read back or configure the Supabase OAuth Server settings: Site URL `https://app.orbrey.com`, authorization path `/oauth/consent`, dynamic registration enabled, and the exact callback URI shown in OpenAI Platform allowed. Supabase documents that Site URL + Authorization Path control where it sends the user with `authorization_id`; the runtime setting has not been verified. The Worker allowlist includes `https://chatgpt.com/connector_platform_oauth_redirect`; the project-level redirect allowlist also needs confirmation against the Platform's displayed URI.
3. Keep the root-URL Platform draft as the submission target. The prior `/openai` app remains URL-locked; the separate root draft is connected and uses the unified endpoint. Leave the legacy draft unsubmitted.
4. The root draft is domain-verified, authorized, and has an initial tool scan. Fix true annotation mismatches, then use Rescan to refresh its captured tool definitions. OpenAI's scanner flags `openWorldHint: false` because its heuristic sees a separately operated service; the official guideline says `false` is correct for a bounded private account or workspace even when externally hosted. Retain `false` for Orbrey's OAuth-bound household workspace and explain that scope in the submission materials. The `grocery_set_purchased` merge and `meal_plan_add_meals` replacement modes were missing `destructiveHint: true`; those are being corrected with server confirmation gates. The draft remains unsubmitted.
5. Use a dedicated sample household to verify the adult-only boundary, household selection, refresh/revocation, tool scopes, and hosted UI. Complete the reviewer materials and submit for review only after the server and policy checks pass.

OpenAI's auth guide says its OAuth metadata issuer must exactly match the protected-resource metadata's authorization server, and that OIDC scopes in metadata make ChatGPT request those identity scopes by default. The deployed metadata therefore uses the standard OAuth contract and does not claim Orbrey-issued OIDC tokens when Supabase signs the upstream token. [OpenAI authentication](https://developers.openai.com/plugins/build/auth) · [Supabase OAuth Server setup](https://supabase.com/docs/guides/auth/oauth-server/getting-started)

### Privacy, terms, demo, and reviewer access

- The package keeps the current privacy and terms URLs per the user's choice. Live page checks on 2026-10-05 returned HTTP 200, but the live privacy and terms content was only brief placeholder copy. The source now routes those URLs to longer policy components; the local build rendered both routes, but this change has not been deployed. The privacy component includes the universal adult-only MCP boundary. Fact-check the policy and terms before deployment, including the Singapore-versus-Australia Supabase region conflict, Orbrey's legal entity and governing law, the actual OpenAI data flow, retention, deletion, sharing, liability, and user rights.
- OpenAI App Developer Terms restrict sending personal information of children under 13 or the applicable age of digital consent. The deployed root route fails closed unless every member row is classified as an adult account with an adult/admin role; this also catches legacy `kid` roles, and denies guest/local/unknown states or lookup errors. This is a profile-classification boundary, not independent age verification or a scanner for child information written into free-text event/task records. The adult-only design does not prove that no child personal information can appear in an adult household's content; resolve that product/legal boundary before public review. Adult/child/legacy-kid/guest/unknown/database-error cases have not yet been exercised live. [OpenAI Developer App Terms](https://openai.com/policies/developer-apps-terms/)
- Reconcile the product's stated data-hosting regions across live privacy/help content and confirmed production configuration.
- Prepare a dedicated sample household and secure reviewer access. Do not put reviewer credentials in the ZIP; enter them through the portal's protected review-details form.
- Record and host a real walkthrough using the connected ChatGPT runtime. Do not use a fabricated preview or placeholder recording URL.
- The root Platform draft (`asdk_app_6ac33eb9a4e48191baa644ab1d51668b`) is domain-verified and Authentication is `Authorized`; its initial scan completed. It remains unpublished and unsubmitted. The legacy `/openai` draft is still separate and URL-locked. The live privacy page remains brief placeholder content; the longer local policy has not been deployed or legally reviewed.

OpenAI requires exactly five positive and three negative cases for initial MCP review and a reviewer-accessible demo recording; the current cases are drafts and have not been run. [App review requirements](https://developers.openai.com/plugins/deploy/app-review) · [Submission](https://developers.openai.com/plugins/deploy/submission) · [Claude plugin submission guide](https://developers.openai.com/plugins/guides/submit-claude-plugin)

### Walkthrough to record after the real ChatGPT connection is available

Use a dedicated sample household and record the packaged build in ChatGPT. Show the Orbrey global entrypoint opening the full-screen home, the authorized household name, today's returned tasks and events, the prompt and suggested actions, then open one shortcut card. Demonstrate a read-only task or calendar question and an ordinary grocery-list addition in the sample household. End with “Order the groceries on my list”; show Orbrey explain that list management does not place orders and confirm no purchase tool is called. Keep the recording short enough to read the returned data, hide all credentials, and link the actual reviewer-accessible video as `review.demo_recording_url` only after playback and access have been checked.

## Verification

| Check | Result |
|---|---|
| Portable `plugin.json` JSON, listing field limits, six countries, commerce declaration, test-case counts, and asset paths | Passed locally |
| Portable package folder and manifest name; skill folder/frontmatter IDs; 15 MCP skill dependency YAML files | Passed locally after aligning identifiers |
| Official Agent Plugins 1.0 plugin and MCP JSON schemas | Both passed against the packaged ZIP manifests |
| Final ZIP inventory | v0.1.1 has 37 entries, one `orbrey-openai/` root, 15 skills, 15 MCP dependency manifests, 5 positive and 3 negative cases; no `.app.json` or `apps` declaration |
| Listing website, support, privacy, and terms URLs | All returned HTTP 200; policy and terms content are too brief for public review |
| Light/dark PNG assets | Both present, square, 512×512 |
| Fifteen skill folders and fifteen `agents/openai.yaml` files | Present; YAML parsed and required interface/dependency fields checked |
| Claude plugin manifest | `claude plugin validate plugins/orbrey-ai` passed |
| Claude marketplace manifest | Passed after aligning its entry with plugin version 0.3.1 |
| MCP worker TypeScript check and lint | Passed after the OAuth callback and metadata changes |
| MCP widget TypeScript check | Passed |
| Widget build and generated embedded UI | Passed; all 11 UI resources built and embedded |
| Worker deployment and live OAuth metadata readback | Deployed as Worker version `d89fc023-f731-471e-a9af-5655148c231b`; root auth challenge, root PRM, and issuer metadata identify Orbrey; `/openai` and its PRM are 404; Supabase OIDC discovery is not exposed |
| Publisher page/help copy typecheck and lint | Passed locally; site changes not deployed |
| Website production build and static route check | Passed; generated help, privacy, and terms pages contain the updated copy; production still serves placeholders |
| Universal adult-only MCP gate and legacy `kid` role gate | Deployed at `/`; code checks before tool work for every client; adult/child/guest/unknown/database-error cases not exercised live |
| OpenAI DCR callback allowlist | Deployed with OpenAI's stable callback and connector callback-ID shape; exact Platform URI and Supabase project redirect allowlist remain to confirm |
| Orbrey OAuth metadata, internal JWKS proxy, and challenge route | Deployed; root PRM and issuer metadata verified; exact challenge token matches; Platform reports domain verified |
| OpenAI root draft and tool scan | Root draft `asdk_app_6ac33eb9a4e48191baa644ab1d51668b` points to `https://mcp.orbrey.com/`, reports domain verified and Authentication `Authorized`; initial scan completed. The tool list reports `Not live` because the plugin has not been published. Scan flags `openWorldHint: false` on household tools (official docs define this as correct for a bounded private workspace) and found missing destructive annotations on grocery duplicate merging and meal replacement; those annotation fixes are in progress. |
| Kitchen Concierge script syntax | `node --check` passed |
| Unit/integration tests | Not run |
| Live ChatGPT/Codex UI and review cases | Not run; the root draft is authorized but unpublished, and no reviewer household is configured |
| Orbrey consent handoff | User reports completing Connect; Platform shows Authentication `Authorized`. The exact consent page and browser redirect were not independently observed; Supabase Site URL and Authorization Path remain unverified |
| Domain verification, reviewer account, scan, and demo | Domain verified and initial scan completed; reviewer access and demo remain outstanding |

The production dependency audit remains unverified. `npm audit --omit=dev` reported `ENOLOCK`/missing virtual lock data, and the attempted `pnpm audit --prod --filter ...` invocation was rejected with an unknown `recursive` option. Neither command produced audit results; no dependency remediation was attempted. Run the repository-supported audit command against its lockfile before release.

## Package output

The updated local archive is [`../dist/orbrey-ai-openai-v0.1.1.zip`](../dist/orbrey-ai-openai-v0.1.1.zip), 42,834 bytes, SHA-256 `61F8E7490A4B19EDC709FBF6334B7C6C4D688FC085EF484707D92E9E98F739E1`. It contains 37 entries under the single `orbrey-openai/` plugin root, including 15 skills and their 15 MCP dependency manifests. Both manifests parse as JSON, the package MCP URL is `https://mcp.orbrey.com/`, and no pricing/subscription/promotion language or `/openai` route appears in the packaged text. The root Platform draft is connected but remains unsubmitted. Do not submit it for public review until the rescan is current, the live policy is complete and reviewed, and the remaining reviewer, privacy, UI, and safety gates above are complete.

## Official references reviewed

- OpenAI [plugin architecture](https://developers.openai.com/plugins/concepts/plugins), [portable package layout](https://developers.openai.com/plugins/build/plugins), and [skills](https://developers.openai.com/plugins/build/skills)
- OpenAI [ChatGPT UI](https://developers.openai.com/plugins/build/chatgpt-ui), [extensions](https://developers.openai.com/plugins/build/extensions), [UI guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines), and [reference](https://developers.openai.com/plugins/reference)
- OpenAI [metadata optimisation](https://developers.openai.com/plugins/guides/optimize-metadata), [Claude-to-OpenAI submission guide](https://developers.openai.com/plugins/guides/submit-claude-plugin), and [MCP review/submission](https://developers.openai.com/plugins/deploy/app-review)
- Anthropic [Claude Code plugin overview](https://code.claude.com/docs/en/plugins), [plugin manifest reference](https://code.claude.com/docs/en/plugins-reference), and [marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces)
- Anthropic [remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) and [MCP overview](https://docs.anthropic.com/en/docs/mcp)
