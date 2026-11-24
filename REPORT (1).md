# AI-Driven Software Engineering — Practice #12
## Code-based vs Low-code: Smart Campus Room Availability Checker

| | |
|---|---|
| Student | **[Full name], [Student ID]** |
| Class time / day | **[e.g. Tuesday, 18:00]** |
| AI tool | Claude (Anthropic), model Claude Opus 5.5, used via claude.ai |
| Code-based demo | https://aushetaskhat.github.io/Software/ (after enabling GitHub Pages) |
| Repository | https://github.com/AushetAskhat/Software |
| Low-code platform | Microsoft Power Apps (Canvas app, developer/free plan): planned |
| Low-code demo | Not executed (no published app yet) |

> **Status of this submission.** The code-based solution is complete and tested (8/8). The low-code (Power Apps) solution is **designed but NOT yet executed**: formulas and build steps are in `POWERAPPS_GUIDE.md`; no low-code screenshots or test results exist yet, so those cells are marked *Not executed*. Effort times were not measured with a timer and are marked *Not measured*. No results were invented.

---

## Task 1. Frozen baseline
- Version: `v1.2.0` (see `package.json`).
- Room: fictional Room **B-204**.
- Fictional bookings (identical in both solutions):

| ID | Start | End | Title |
|---|---|---|---|
| BK-1 | 2027-03-15 09:00 | 10:30 | Algorithms seminar |
| BK-2 | 2027-03-15 12:00 | 13:00 | Robotics club |
| BK-3 | 2027-03-15 15:00 | 16:00 | Thesis defence |

- Baseline check: `npm test` → 9/9 passed (8 acceptance + 1 robustness). Screenshot: `screenshots/code-desktop-available.png`.
- Booking rules were **not** changed to favour either approach.

## Task 2. Common contract (shared requirement / acceptance-criteria sheet)
**User story.** *As a student, I want to check whether Room B-204 is free for a chosen future start time and duration, so that I can plan my study session without double-booking.*

| AC | Criterion |
|---|---|
| AC1 | Start time must be in the future. |
| AC2 | Duration must be greater than zero and at most 120 minutes. |
| AC3 | Overlapping bookings are unavailable (adjacent intervals are not overlaps). |
| AC4 | Blocked room is unavailable. |
| AC5 | Display a clear decision without changing existing bookings. |
| AC6 | Invalid input receives understandable feedback. |

**Inputs:** `startTime` (local date-time), `durationMinutes` (integer), `isBlocked` (boolean), `bookings` (fictional list above).
**Outputs:** `available` (boolean), `reasonCode` (`OK` · `OVERLAP` · `BLOCKED` · `PAST_TIME` · `INVALID_DURATION` · `INVALID_INPUT`), `message` (visible text).
**Rule order:** validation → blocked → overlap. Overlap rule: `newStart < b.end AND newEnd > b.start`.
**Test clock:** both solutions use a fixed "now" = 2027-03-14 18:00 for tests (code: `test-cases.js`; Power Apps: *Test mode* toggle).

## Task 3. Code-based solution
- `availability.js`: rule engine: `validate()` (AC1, AC2, AC6) and `checkAvailability()` (AC3–AC5). Pure functions, no DOM.
- `app.js`: UI layer only, renders with `textContent`.
- `index.html`: responsive layout (flex-wrap + media query ≤600 px).
- `tests/availability.test.js`: Node built-in test runner.
- Evidence: `screenshots/code-desktop-available.png`, `code-desktop-overlap.png`, `code-mobile.png`.

## Task 4. Low-code solution (Power Apps)
**INCOMPLETE: designed, not executed.** The full design (data collection, controls, Power Fx availability workflow, output, T8 check) is specified in `POWERAPPS_GUIDE.md`. The app has not been built and run in Power Apps yet, so there are no low-code screenshots or `.msapp` export in this submission.

**Requirements the platform could not implement directly / simplifications:**
- Date picker has no time component → time chosen with two dropdowns, minutes in 15-min steps (code version: 1-min steps).
- No automated tests → T1–T8 executed manually.
- Whole low-code run: **incomplete** (see status above).

## Task 5. Identical tests: expected vs observed

| ID | Input | Expected | Code-based: observed | Low-code: observed |
|---|---|---|---|---|
| T1 | 15.03.2027 10:45, 60 min | Available / OK | Available / OK ✅ | Not executed |
| T2 | 15.03.2027 12:30, 60 min | Unavailable / OVERLAP | Unavailable / OVERLAP ✅ | Not executed |
| T3 | 15.03.2027 10:45, 60 min, blocked | Unavailable / BLOCKED | Unavailable / BLOCKED ✅ | Not executed |
| T4 | duration 0 | Validation error | INVALID_DURATION ✅ | Not executed |
| T5 | duration 121 | Validation error | INVALID_DURATION ✅ | Not executed |
| T6 | 14.03.2027 09:00 (past) | Validation error | PAST_TIME ✅ | Not executed |
| T7 | 15.03.2027 13:00, 120 min (adjacent) | Available / OK | Available / OK ✅ | Not executed |
| T8 | bookings after T1–T7 | Unchanged | Unchanged (array frozen, JSON identical) ✅ | Not executed |
| **Total** | | | **8 / 8** | **0 / 8 executed** |

Code-based results are from a real run: `node --test tests/*.test.js` → `# pass 9  # fail 0`, plus the in-page "Run tests" button (8/8).

## Task 6. Engineering effort

| Phase | Code-based (min) | Low-code (min) |
|---|---|---|
| Setup | Not measured | Not executed |
| Implementation | Not measured | Not executed |
| Debugging | Not measured | Not executed |
| Testing | Not measured | Not executed |
| **Total** | Not measured | Not executed |
| Unresolved defects | 0 | Unknown (not executed) |

| | Code-based | Low-code |
|---|---|---|
| Review | Pull request / diff in Git, line by line | Visual review in editor; formulas reviewed manually; no textual diff by default |
| Export | Plain files (HTML/JS), run anywhere | `.msapp` / solution package, runs only in Power Platform |
| Version control | Git (full history, branches) | Power Apps version history (restore only); `.msapp` committed as binary |

**Measured vs impressions.** Measured: test counts, minutes, defect count. Impressions (not measured): the date/time logic is the hardest part for low-code: Power Apps has no combined date-time picker, so a workaround is needed. Code made the rules and automated tests straightforward.

## Task 7. Security review (Lecture #12)

| Check | Code-based | Low-code |
|---|---|---|
| Injection / XSS (output) | Output via `textContent` only; no `innerHTML`; CSP meta tag `script-src 'self'` | Label control renders plain text; HTML text control not used |
| Input validation | Number field rejects text in browser; engine re-validates (non-integer, negative, empty, `<script>` string → `INVALID_DURATION` in unit test) | `IfError(Value(...))`, integer and range checks in formula |
| SQL injection | No database, no queries → not applicable | No connector/database used (local collection) → not applicable |
| Authentication / permissions | No login by design (scenario requirement); static page, read-only data | Planned: share only with specific users, not the whole organisation (not executed) |
| Secrets | No API keys, tokens or passwords in repo or screenshots | Design uses no connectors → no credentials (not executed) |
| Sensitive data | Fictional data only | Fictional data only |
| Dependencies (SCA) | Zero runtime dependencies; dev uses only Node built-ins → nothing to patch | Platform & runtime patched by Microsoft (shared responsibility); student responsible for sharing settings & connectors |
| Runtime checks (DAST, manual, own app only) | Tried empty input, 0, -5, 121, 30.5, past date → all rejected with clear messages; number field refuses `<script>` text in browser | Not executed |
| Third-party scanning | None performed (not authorised) | None performed |

## Comparison matrix

| Criterion | Code-based | Low-code |
|---|---|---|
| Functional tests | **8 / 8** (automated) | Not executed (0 / 8) |
| Build and repair time | Not measured (AI-assisted, one iteration, 1 defect fixed in test script) | Not measured |
| Customization | Full control of UI and logic; any time granularity, custom layout, CSP | Limited to platform controls; time needs workaround; formulas sufficient for this rule set |
| Security controls | Developer-controlled (textContent, CSP, validation); developer also owns all fixes | Platform-managed hosting & auth; developer controls sharing, connectors, formulas |
| Versioning / portability | Git, text diffs, runs on any static host | Binary `.msapp`; vendor lock-in to Power Platform |
| Ongoing cost | Free static hosting (GitHub Pages) | Free developer plan for learning; production use requires paid Power Apps licences |

## Recommendation
For this feature, the **code-based** solution is recommended as the primary implementation: it passed 8/8 automated, repeatable tests, is fully version-controlled and portable, and has no licence cost. The low-code version is suitable for a quick internal prototype or a non-developer team inside an existing Microsoft 365 environment, but it needs manual testing, uses a binary export that is hard to review, and ties the app to one vendor. This recommendation is provisional: the low-code side was not executed, so it is based on the design analysis, not on measured low-code results.

## AI-use reflection
- **Tool:** Claude Opus 5.5 (claude.ai). Used for: drafting the rule engine, tests, UI, Power Fx formulas and report structure.
- **Verification:** every AI-generated result was checked by running it: unit tests were executed (9/9 pass), the page was opened on desktop and at 375 px width, and the security claims were checked against the code (no `innerHTML`, no secrets). Low-code formulas have **not** been verified by a run yet.
- **Limits:** AI cannot run the Power Apps editor; the low-code app was therefore not built in this submission. Following the course prompt, no test results were invented.
- **Lesson:** AI produces working code quickly, but its output has to be backed by evidence (test runs, screenshots); anything not actually run must be labelled as such.
