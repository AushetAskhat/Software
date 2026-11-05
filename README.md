# Smart Campus Room Availability Checker (Assignment #04)

Requirements: Node.js >= 20 (tested on v22), Python 3 (only to serve the UI). No npm dependencies.

| Action | Command |
|---|---|
| Run all tests (22 = 5 v1 + 17 v2) | `npm test` |
| Baseline v1 tests only | `npm run test:v1` |
| Final v2 tests only | `npm run test:v2` |
| Run UI | `npm start`, open http://localhost:8080/v2_final/ (v1: /v1_initial/) |

Layout: `v1_initial/` (before, monolith) · `v2_final/` (after, modules) · `tests/` · `docs/` (report, AI evidence, test log).
Fixed current time: 09:00. All data is fictional. Demo scenarios: see docs/REPORT.md §4.

## Git
- Tag `v1-initial` = original (before) version; tag `v2-final` = final (after) version.
- Compare: `git diff v1-initial v2-final --stat` · History: `git log --oneline --decorate`
- Publish: create an empty repo on GitHub, then
  `git remote add origin <URL>` → `git push -u origin main --tags`
