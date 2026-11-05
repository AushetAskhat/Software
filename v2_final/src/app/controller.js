import { filterRooms } from '../domain/filter.js';
import { checkAvailability } from '../domain/availability.js';

// Pure state -> view-model. Testable without a DOM (F4, F5).
export function computeView(state, rooms, now) {
  const matches = filterRooms(rooms, { attendees: state.attendees ?? null, equipment: state.equipment ?? [] });
  if (matches.length === 0) return { rooms: [], selectedId: null, result: { status: 'empty', message: 'No rooms match your requirements. Lower the attendee count or remove equipment.' } };
  const selected = matches.find((r) => r.id === state.roomId) ?? matches[0];
  return { rooms: matches, selectedId: selected.id, result: checkAvailability(selected, state.start, state.end, now) };
}
