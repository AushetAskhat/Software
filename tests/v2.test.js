// Final (v2): AC1-AC5 regression + F1-F5 + boundaries + integration/UI checks
import test from 'node:test';
import assert from 'node:assert/strict';
import { ROOMS } from '../v2_final/src/data/rooms.js';
import { checkAvailability, validateRange } from '../v2_final/src/domain/availability.js';
import { filterRooms } from '../v2_final/src/domain/filter.js';
import { computeView } from '../v2_final/src/app/controller.js';
import { renderResult, renderRoomOptions } from '../v2_final/src/ui/render.js';

const room = (id) => ROOMS.find((r) => r.id === id);
const ids = (rs) => rs.map((r) => r.id);

// ---- Regression AC1-AC5 ----
test('AC1 invalid time inputs are rejected', () => {
  for (const [s, e] of [['25:00', '26:00'], ['11:00', '10:00'], ['08:00', '08:30'], ['', '']])
    assert.equal(checkAvailability(room('R201'), s, e).status, 'invalid');
});
test('AC2 boundary: exactly 120 min allowed', () => assert.equal(validateRange('13:00', '15:00').ok, true));
test('AC2 boundary: 121 min rejected', () => assert.equal(validateRange('13:00', '15:01').ok, false));
test('AC3 blocked room is never available', () => assert.equal(checkAvailability(room('R202'), '10:00', '11:00').status, 'blocked'));
test('AC4 touching intervals are allowed (before and after)', () => {
  assert.equal(checkAvailability(room('R201'), '10:00', '12:00').status, 'available');
  assert.equal(checkAvailability(room('R201'), '13:00', '14:00').status, 'available');
});
test('AC4 overlapping intervals conflict (partial, contained, containing)', () => {
  assert.equal(checkAvailability(room('R201'), '11:59', '12:30').status, 'conflict');
  assert.equal(checkAvailability(room('R201'), '12:15', '12:45').status, 'conflict');
  assert.equal(checkAvailability(room('R201'), '11:30', '13:30').status, 'conflict');
});
test('AC5 data is deep-frozen and checks do not mutate it', () => {
  const before = JSON.stringify(ROOMS);
  checkAvailability(room('R101'), '10:00', '11:00');
  assert.equal(JSON.stringify(ROOMS), before);
  assert.throws(() => { room('R101').bookings.push({ start: '16:00', end: '17:00' }); }, TypeError);
});

// ---- New features F1-F5 ----
test('Catalog has >= 4 rooms with required fields', () => {
  assert.ok(ROOMS.length >= 4);
  for (const r of ROOMS) for (const k of ['id', 'name', 'capacity', 'equipment', 'blocked', 'bookings']) assert.ok(k in r);
});
test('F1 capacity: exact capacity matches, insufficient does not', () => {
  assert.deepEqual(ids(filterRooms(ROOMS, { attendees: 30 })), ['R101', 'R201']);
  assert.deepEqual(ids(filterRooms(ROOMS, { attendees: 31 })), ['R201']);
});
test('F2 equipment: room must contain ALL selected items', () => {
  assert.deepEqual(ids(filterRooms(ROOMS, { equipment: ['projector', 'video-conf'] })), ['R201', 'R203']);
  assert.deepEqual(ids(filterRooms(ROOMS, { equipment: ['projector', 'microphone', 'video-conf'] })), ['R201']);
});
test('F1+F2 combined filters', () => assert.deepEqual(ids(filterRooms(ROOMS, { attendees: 30, equipment: ['projector', 'video-conf'] })), ['R201']));
test('F3 blocked room reported as blocked via view', () => {
  const v = computeView({ attendees: 6, equipment: [], roomId: 'R202', start: '10:00', end: '11:00' }, ROOMS);
  assert.equal(v.selectedId, 'R202'); assert.equal(v.result.status, 'blocked');
});
test('F4 empty state when no rooms match (integration)', () => {
  const v = computeView({ attendees: 81, equipment: [], roomId: 'R101', start: '10:00', end: '11:00' }, ROOMS);
  assert.equal(v.rooms.length, 0); assert.equal(v.result.status, 'empty');
  assert.match(renderResult(v.result), /No rooms match/);
});
test('F5 switching room refreshes result and uses that room\'s own bookings', () => {
  const base = { attendees: null, equipment: [], start: '10:00', end: '11:00' };
  assert.equal(computeView({ ...base, roomId: 'R101' }, ROOMS).result.status, 'conflict');
  assert.equal(computeView({ ...base, roomId: 'R201' }, ROOMS).result.status, 'available');
});
test('F5 selected room hidden by filter falls back to first match', () => {
  const v = computeView({ attendees: 80, equipment: [], roomId: 'R101', start: '13:00', end: '14:00' }, ROOMS);
  assert.equal(v.selectedId, 'R201');
});

// ---- UI behaviour ----
test('UI render escapes HTML and sets status role', () => {
  const html = renderResult({ status: 'invalid', message: '<img onerror=x>' });
  assert.ok(!html.includes('<img')); assert.match(html, /role="status"/);
});
test('UI room options mark selected and blocked rooms', () => {
  const html = renderRoomOptions(ROOMS, 'R202');
  assert.match(html, /value="R202" selected/); assert.match(html, /blocked/);
});
