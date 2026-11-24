/* Layer 3: UI display only. Uses textContent everywhere (no innerHTML) to prevent XSS. */
(function () {
  "use strict";
  const A = window.Availability;
  const $ = (id) => document.getElementById(id);

  function el(tag, text, cls) {
    const e = document.createElement(tag);
    if (text !== undefined) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }

  function renderBookings() {
    const list = $("bookings");
    list.replaceChildren();
    A.BOOKINGS.forEach((b) => {
      list.appendChild(el("li", `${b.id} · ${b.start.replace("T", " ")} – ${b.end.slice(11)} · ${b.title}`));
    });
  }

  function renderResult(r) {
    const box = $("result");
    box.className = "result " + (r.available ? "ok" : r.isValidationError ? "warn" : "bad");
    box.replaceChildren(
      el("strong", r.available ? "Available" : r.isValidationError ? "Check your input" : "Unavailable"),
      el("p", r.message),
      el("code", `available=${r.available} · reasonCode=${r.reasonCode}`)
    );
  }

  function onCheck(e) {
    e.preventDefault();
    const input = {
      startTime: $("start").value,
      durationMinutes: $("duration").value,
      isBlocked: $("blocked").checked,
    };
    renderResult(A.checkAvailability(input, A.BOOKINGS, new Date()));
  }

  function runTests() {
    const { NOW, CASES } = window.TestCases;
    const now = new Date(NOW);
    const before = JSON.stringify(A.BOOKINGS);
    const body = $("tests-body");
    body.replaceChildren();
    let passed = 0;

    CASES.forEach((c) => {
      let observed, pass;
      if (c.special === "unchanged") {
        const after = JSON.stringify(A.BOOKINGS);
        pass = after === before && Object.isFrozen(A.BOOKINGS);
        observed = pass ? "3 bookings, identical" : "CHANGED";
        c._expectText = "Bookings unchanged";
      } else {
        const r = A.checkAvailability(c.input, A.BOOKINGS, now);
        pass = r.available === c.expect.available && r.reasonCode === c.expect.reasonCode;
        observed = `${r.available ? "Available" : "Unavailable"} / ${r.reasonCode}`;
        c._expectText = `${c.expect.available ? "Available" : "Unavailable"} / ${c.expect.reasonCode}`;
      }
      if (pass) passed++;
      const tr = el("tr");
      const inputText = c.input ? `${c.input.startTime.replace("T", " ")}, ${c.input.durationMinutes} min${c.input.isBlocked ? ", blocked" : ""}` : "after T1–T7";
      [c.id, c.name, inputText, c._expectText, observed].forEach((t) => tr.appendChild(el("td", t)));
      tr.appendChild(el("td", pass ? "PASS" : "FAIL", pass ? "pass" : "fail"));
      body.appendChild(tr);
    });
    $("tests-summary").textContent = `${passed} / ${CASES.length} passed (fixed "now" = ${NOW.replace("T", " ")})`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderBookings();
    $("form").addEventListener("submit", onCheck);
    $("run-tests").addEventListener("click", runTests);
    $("max").textContent = A.MAX_DURATION_MIN;
  });
})();
