// Fictional data only. Deep-frozen => immutable booking data (AC5).
const b = (start, end) => ({ start, end });
const deepFreeze = (o) => { Object.values(o).forEach((v) => typeof v === 'object' && v !== null && deepFreeze(v)); return Object.freeze(o); };

export const ROOMS = deepFreeze([
  { id: 'R101', name: 'Alpha Lab',      capacity: 30, equipment: ['projector', 'whiteboard', 'pc'],                  blocked: false, bookings: [b('10:00', '11:00'), b('13:00', '14:30')] },
  { id: 'R102', name: 'Beta Studio',    capacity: 12, equipment: ['whiteboard', 'video-conf'],                       blocked: false, bookings: [b('09:30', '10:30'), b('15:00', '16:00')] },
  { id: 'R201', name: 'Gamma Hall',     capacity: 80, equipment: ['projector', 'microphone', 'video-conf'],          blocked: false, bookings: [b('12:00', '13:00')] },
  { id: 'R202', name: 'Delta Meeting',  capacity: 6,  equipment: ['whiteboard'],                                     blocked: true,  bookings: [] },
  { id: 'R203', name: 'Epsilon Seminar',capacity: 20, equipment: ['projector', 'whiteboard', 'video-conf'],          blocked: false, bookings: [b('11:00', '12:00')] }
]);
