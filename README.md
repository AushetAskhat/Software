# Smart Campus — Room Availability Checker (Practice #12)

Code-based vs low-code comparison. Full report: **[REPORT.md](REPORT.md)** · Low-code build steps: [POWERAPPS_GUIDE.md](POWERAPPS_GUIDE.md)

## Run
- Open `index.html` in a browser (no build, no dependencies), or use the live demo: https://aushetaskhat.github.io/Software/
- Tests: `npm test` (Node 18+). Or press **Run tests** on the page.

## Structure
```
availability.js         rule engine: validate() + checkAvailability()  (no UI)
app.js                  UI layer (textContent only)
index.html              responsive page
test-cases.js           shared inputs T1–T8 (same as low-code)
tests/                  Node unit tests
screenshots/            evidence
lowcode/                Power Apps export (.msapp)
```
All data is fictional. No login, payment or database.
