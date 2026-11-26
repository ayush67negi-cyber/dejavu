// Dates are shown in German with Indian venues, so the locale is de-DE and the
// wall-clock time stays Asia/Kolkata (the restaurants are in India).
const LOCALE = 'de-DE';
const TIME_ZONE = 'Asia/Kolkata';

export function formatDate(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(d);
}

/** Long form for editorial surfaces: "Sonntag, 14. Juni 2026". */
export function formatDateLong(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(d);
}

export function formatTime(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  // 24-hour clock: standard in Germany.
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(d);
}

export function formatDateTime(value: string | Date) {
  return `${formatDate(value)} · ${formatTime(value)}`;
}

export function relativeDay(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  const days = Math.round((d.getTime() - Date.now()) / 86_400_000);
  if (days === 0) return 'Heute';
  if (days === 1) return 'Morgen';
  if (days > 1) return `In ${days} Tagen`;
  if (days === -1) return 'Gestern';
  return `Vor ${Math.abs(days)} Tagen`;
}

export function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

/** Rupee amounts with German thousands separators: 1.999 ₹ */
export function formatPrice(amount: number) {
  return `${new Intl.NumberFormat(LOCALE).format(amount)} ₹`;
}
