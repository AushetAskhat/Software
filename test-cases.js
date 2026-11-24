/*
 * Shared test inputs T1–T8 (same inputs are used for the low-code version).
 * "now" is fixed so results are reproducible: 2027-03-14 18:00.
 */
(function (root) {
  "use strict";
  const NOW = "2027-03-14T18:00";

  const CASES = [
    { id: "T1", name: "Valid free interval",          input: { startTime: "2027-03-15T10:45", durationMinutes: 60,  isBlocked: false }, expect: { available: true,  reasonCode: "OK" } },
    { id: "T2", name: "Overlap with existing booking", input: { startTime: "2027-03-15T12:30", durationMinutes: 60,  isBlocked: false }, expect: { available: false, reasonCode: "OVERLAP" } },
    { id: "T3", name: "Blocked room",                  input: { startTime: "2027-03-15T10:45", durationMinutes: 60,  isBlocked: true  }, expect: { available: false, reasonCode: "BLOCKED" } },
    { id: "T4", name: "Duration = 0",                  input: { startTime: "2027-03-15T10:45", durationMinutes: 0,   isBlocked: false }, expect: { available: false, reasonCode: "INVALID_DURATION" } },
    { id: "T5", name: "Duration = 121",                input: { startTime: "2027-03-15T10:45", durationMinutes: 121, isBlocked: false }, expect: { available: false, reasonCode: "INVALID_DURATION" } },
    { id: "T6", name: "Past start time",               input: { startTime: "2027-03-14T09:00", durationMinutes: 60,  isBlocked: false }, expect: { available: false, reasonCode: "PAST_TIME" } },
    { id: "T7", name: "Adjacent interval (13:00–15:00)", input: { startTime: "2027-03-15T13:00", durationMinutes: 120, isBlocked: false }, expect: { available: true,  reasonCode: "OK" } },
    { id: "T8", name: "Booking data unchanged after T1–T7", special: "unchanged" },
  ];

  const api = { NOW, CASES };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TestCases = api;
})(typeof window !== "undefined" ? window : globalThis);
