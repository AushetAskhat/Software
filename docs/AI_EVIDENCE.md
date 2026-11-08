# AI evidence appendix

## 1. AI-use record

| Field | Entry |
|---|---|
| AI assistant | Claude (Anthropic), model Claude Sonnet 5.5, claude.ai chat |
| Date | 08 November 2026 |
| Prompt summary | Uploaded the Assignment #04 PDF and asked for a step-by-step plan with ready files; later asked for Git history, a screenshot plan and a reflection draft |
| Output used | v1 reconstruction (`v1_initial/`), v2 modules (`v2_final/src/`), 22 tests (5 v1 + 17 v2), README, report draft, Git commit structure |
| Problems found | See section 3 |
| Changes made by me | <list your own changes: renamed rooms, edited messages, rewrote reflection, added screenshots> |
| Verification sources | `npm test` (22/22), manual UI run in a browser, `git diff` review, hand count of duplicated logic, assignment PDF requirements |

## 2. Selected prompts and outputs

| # | Prompt (summary) | Output | Decision |
|---|---|---|---|
| 1 | Assignment PDF + "what needs to be done, step-by-step plan with ready files" | Project with v1 baseline, v2 modules, tests, README, report | Used; reviewed all files |
| 2 | "Git is mandatory" | Repository with 10 commits, tags `v1-initial` and `v2-final` | Used; replaced the placeholder author with my own |
| 3 | "Give me a step-by-step plan and where to put screenshots" | Screenshot list 01–09 and where each goes in REPORT.md | Used |
| 4 | "Write 200–300 words in English" | Draft AI reflection (about 255 words) | Edited to match what I actually did |
| 5 | "Write the AI evidence too" | This appendix | Edited and completed |

## 3. Problems found in AI output

1. **v1 baseline tests failed.** Root `package.json` has `"type": "module"`, which made `v1_initial/app.js` an ES module, so its CommonJS exports did not work. Fix: added `v1_initial/package.json` with `"type": "commonjs"`.
2. **Test command failed.** `node --test tests/` is not accepted by Node 22. Fix: npm script uses the glob `tests/*.test.*`.
3. **Git failed with "dubious ownership".** Fixed with `git config --global --add safe.directory`.
4. **Incorrect test count.** The AI first reported 22 tests for v2 (27 in total). Running `npm run test:v2` showed 17 (22 in total). Corrected in README, REPORT and test log, committed as a separate fix.
5. **Rejected or modified suggestion:** <describe one, for example: "I kept plain HTML/JS with ES modules and no framework, because the assignment forbids extra infrastructure and asks for a minimal prototype">.

## 4. Human review and verification

- Ran `npm test` myself: 22 tests, 22 pass, 0 fail (log in `docs/test-results.txt`).
- Opened the UI with `npm start` and checked: successful filter, empty state, room switching, blocked room, 120 vs 121 minutes, mobile layout. Screenshots in `docs/screenshots/`.
- Read the diff of every commit with `git show`.
- Counted duplicated logic by hand: 2 locations in v1 (validation in `checkAvailability`/`previewHint`, result rendering in two handlers), 0 in v2.
- Confirmed AC1–AC5 still pass on both versions, and that F1–F5 pass on v2.

## 5. Declaration

The AI generated the first draft of the code, tests and documents. I reviewed, ran and edited the result, and I take responsibility for the submitted work.