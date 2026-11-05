import { parseTime } from './time.js';
export const MAX_DURATION = 120;
export const NOW_MINUTES = 9 * 60; // fixed current time 09:00
export const overlaps = (a, b) => a.start < b.end && b.start < a.end; // touching is allowed

// Single source of validation rules (AC1, AC2)
export function validateRange(start, end, now = NOW_MINUTES) {
  const s = parseTime(start), e = parseTime(end);
  if (s === null || e === null || e <= s || s < now) return { ok: false, message: 'Enter a valid time range starting at or after 09:00.' };
  if (e - s > MAX_DURATION) return { ok: false, message: 'Maximum booking length is 120 minutes.' };
  return { ok: true, range: { start: s, end: e } };
}

// Pure: never mutates room (AC5). Uses ONLY the given room's bookings.
export function checkAvailability(room, start, end, now = NOW_MINUTES) {
  const v = validateRange(start, end, now);
  if (!v.ok) return { status: 'invalid', message: v.message };
  if (room.blocked) return { status: 'blocked', message: room.name + ' is blocked and cannot be booked.' };
  const hit = room.bookings.find((x) => overlaps(v.range, { start: parseTime(x.start), end: parseTime(x.end) }));
  if (hit) return { status: 'conflict', message: room.name + ' conflicts with booking ' + hit.start + '-' + hit.end + '.' };
  return { status: 'available', message: room.name + ' is available.' };
}
