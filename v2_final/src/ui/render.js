const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const renderRoomOptions = (rooms, selectedId) =>
  rooms.map((r) => `<option value="${esc(r.id)}"${r.id === selectedId ? ' selected' : ''}>${esc(r.name)} (${esc(r.id)}, ${r.capacity} seats${r.blocked ? ', blocked' : ''})</option>`).join('');

// Single rendering path for every result state
export const renderResult = (result) => `<div class="result ${esc(result.status)}" role="status">${esc(result.message)}</div>`;
