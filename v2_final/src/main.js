import { ROOMS } from './data/rooms.js';
import { allEquipment } from './domain/filter.js';
import { computeView } from './app/controller.js';
import { renderRoomOptions, renderResult } from './ui/render.js';

const $ = (id) => document.getElementById(id);
$('equipment').innerHTML = allEquipment(ROOMS).map((e) => `<label><input type="checkbox" value="${e}"> ${e}</label>`).join('');

function update() {
  const n = parseInt($('attendees').value, 10);
  const state = {
    attendees: Number.isNaN(n) ? null : n,
    equipment: [...document.querySelectorAll('#equipment input:checked')].map((i) => i.value),
    roomId: $('room').value, start: $('start').value, end: $('end').value
  };
  const view = computeView(state, ROOMS);
  $('room').innerHTML = renderRoomOptions(view.rooms, view.selectedId);
  $('room').disabled = view.rooms.length === 0;
  $('result').innerHTML = renderResult(view.result);
}
document.querySelector('form').addEventListener('input', update);
document.querySelector('form').addEventListener('submit', (e) => e.preventDefault());
update();
