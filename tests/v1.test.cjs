// Baseline: regression checks AC1-AC5 against the ORIGINAL (v1) implementation
const test = require('node:test'); const assert = require('node:assert/strict');
const { checkAvailability, ROOM } = require('../v1_initial/app.js');

test('V1 AC1 invalid time format / end before start / before now', () => {
  for (const [s, e] of [['25:00', '26:00'], ['11:00', '10:00'], ['08:00', '08:30'], ['', '']])
    assert.equal(checkAvailability(s, e).status, 'invalid');
});
test('V1 AC2 120 ok, 121 rejected', () => {
  assert.equal(checkAvailability('11:00', '13:00').status, 'available');
  assert.equal(checkAvailability('11:00', '13:01').status, 'invalid');
});
test('V1 AC3 blocked room', () => {
  assert.equal(checkAvailability('11:00', '12:00', { ...ROOM, blocked: true }).status, 'blocked');
});
test('V1 AC4 touching ok, overlapping conflict', () => {
  assert.equal(checkAvailability('11:00', '12:00').status, 'available');
  assert.equal(checkAvailability('09:00', '10:00').status, 'available');
  assert.equal(checkAvailability('10:59', '11:30').status, 'conflict');
});
test('V1 AC5 booking data not mutated', () => {
  const before = JSON.stringify(ROOM); checkAvailability('10:00', '11:00'); assert.equal(JSON.stringify(ROOM), before);
});
