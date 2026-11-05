export function filterRooms(rooms, { attendees = null, equipment = [] } = {}) {
  return rooms.filter((r) =>
    (attendees === null || r.capacity >= attendees) &&          // F1
    equipment.every((item) => r.equipment.includes(item)));     // F2
}
export const allEquipment = (rooms) => [...new Set(rooms.flatMap((r) => r.equipment))].sort();
