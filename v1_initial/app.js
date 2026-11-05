// V1: single-room prototype (monolithic, before refactoring). Fixed "now" = 09:00.
const NOW = 9 * 60;
const ROOM = Object.freeze({
  id: 'R101', name: 'Alpha Lab', blocked: false,
  bookings: Object.freeze([{ start: '10:00', end: '11:00' }, { start: '13:00', end: '14:30' }])
});
function toMin(s) { const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; }

function checkAvailability(start, end, room = ROOM) {
  const s = toMin(start), e = toMin(end);
  if (s === null || e === null || e <= s || s < NOW) return { status: 'invalid', message: 'Enter a valid time range starting at or after 09:00.' };
  if (e - s > 120) return { status: 'invalid', message: 'Maximum booking length is 120 minutes.' };
  if (room.blocked) return { status: 'blocked', message: 'Room is blocked.' };
  for (const b of room.bookings) {
    if (s < toMin(b.end) && toMin(b.start) < e) return { status: 'conflict', message: 'Conflicts with booking ' + b.start + '-' + b.end + '.' };
  }
  return { status: 'available', message: 'Room is available.' };
}

// DUPLICATION #1: same validation rules copied for live hint
function previewHint(start, end) {
  const s = toMin(start), e = toMin(end);
  if (s === null || e === null || e <= s || s < NOW) return 'Enter a valid time range starting at or after 09:00.';
  if (e - s > 120) return 'Maximum booking length is 120 minutes.';
  return '';
}

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  // DUPLICATION #2: result HTML built in two places
  $('check').addEventListener('click', () => {
    const r = checkAvailability($('start').value, $('end').value);
    $('result').innerHTML = '<div class="' + r.status + '" role="status">' + r.message + '</div>';
  });
  ['start', 'end'].forEach((id) => $(id).addEventListener('input', () => {
    const h = previewHint($('start').value, $('end').value);
    $('result').innerHTML = h ? '<div class="invalid" role="status">' + h + '</div>' : '';
  }));
}
if (typeof module !== 'undefined') module.exports = { checkAvailability, previewHint, toMin, ROOM };
