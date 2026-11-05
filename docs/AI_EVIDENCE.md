# AI evidence appendix
| Field | Entry |
|---|---|
| Tool / model | Claude (Anthropic), claude.ai |
| Date | <fill> |
| Prompt summary | Assignment #04 PDF + request for step-by-step plan and ready files |
| Output used | v1 reconstruction, v2 modules, 27 tests, README, report draft |
| Problems found | v1 tests failed (package "type":"module" made app.js ESM → fixed with v1_initial/package.json); `node --test tests/` unsupported → glob in npm script |
| Changes made by me | <fill: renamed rooms, edited messages, etc.> |
| Verification | `npm test` (27/27), manual UI run, diff review |
