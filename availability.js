/*
 * Smart Campus Room Availability Checker — rule engine (no UI code here).
 * Layers: 1) validate()  2) checkAvailability()  — UI lives in app.js.
 * All data is fictional. Works in the browser (window.Availability) and in Node (require).
 */
(function (root) {
  "use strict";

  const MAX_DURATION_MIN = 120;

  // Fictional bookings for one fictional room (Room B-204). Frozen: checks must never modify them (AC5 / T8).
  const BOOKINGS = Object.freeze([
    Object.freeze({ id: "BK-1", title: "Algorithms seminar", start: "2027-03-15T09:00", end: "2027-03-15T10:30" }),
    Object.freeze({ id: "BK-2", title: "Robotics club",      start: "2027-03-15T12:00", end: "2027-03-15T13:00" }),
    Object.freeze({ id: "BK-3", title: "Thesis defence",     start: "2027-03-15T15:00", end: "2027-03-15T16:00" }),
  ]);

  const REASONS = Object.freeze({
    OK: "OK",
    OVERLAP: "OVERLAP",
    BLOCKED: "BLOCKED",
    PAST_TIME: "PAST_TIME",
    INVALID_DURATION: "INVALID_DURATION",
    INVALID_INPUT: "INVALID_INPUT",
  });

  function parseLocal(value) {
    if (typeof value !== "string" || value.trim() === "") return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  function fmt(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  /** Layer 1: input validation (AC1, AC2, AC6). */
  function validate(input, now) {
    const start = parseLocal(input && input.startTime);
    if (!start) {
      return { ok: false, reasonCode: REASONS.INVALID_INPUT, message: "Please enter a valid start date and time." };
    }
    const raw = input.durationMinutes;
    const duration = typeof raw === "number" ? raw : Number(String(raw).trim());
    if (raw === "" || raw === null || raw === undefined || !Number.isFinite(duration) || !Number.isInteger(duration)) {
      return { ok: false, reasonCode: REASONS.INVALID_DURATION, message: "Duration must be a whole number of minutes." };
    }
    if (start.getTime() <= now.getTime()) {
      return { ok: false, reasonCode: REASONS.PAST_TIME, message: "Start time must be in the future." };
    }
    if (duration <= 0 || duration > MAX_DURATION_MIN) {
      return { ok: false, reasonCode: REASONS.INVALID_DURATION,
               message: `Duration must be greater than 0 and at most ${MAX_DURATION_MIN} minutes.` };
    }
    return { ok: true, start, end: new Date(start.getTime() + duration * 60000), duration };
  }

  /** Layer 2: availability decision (AC3, AC4, AC5). Pure function: never mutates bookings. */
  function checkAvailability(input, bookings, now) {
    const v = validate(input, now);
    if (!v.ok) return { available: false, reasonCode: v.reasonCode, message: v.message, isValidationError: true };

    if (input.isBlocked === true) {
      return { available: false, reasonCode: REASONS.BLOCKED, message: "Unavailable: the room is blocked by administration." };
    }

    const conflict = bookings.find((b) => {
      const bs = parseLocal(b.start), be = parseLocal(b.end);
      return v.start < be && v.end > bs; // touching edges (adjacent) do NOT overlap
    });
    if (conflict) {
      return {
        available: false, reasonCode: REASONS.OVERLAP, conflictId: conflict.id,
        message: `Unavailable: overlaps with "${conflict.title}" (${fmt(parseLocal(conflict.start))}–${fmt(parseLocal(conflict.end)).slice(11)}).`,
      };
    }
    return {
      available: true, reasonCode: REASONS.OK,
      message: `Available: room is free ${fmt(v.start)}–${fmt(v.end).slice(11)} (${v.duration} min).`,
    };
  }

  const api = { MAX_DURATION_MIN, BOOKINGS, REASONS, validate, checkAvailability };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Availability = api;
})(typeof window !== "undefined" ? window : globalThis);
