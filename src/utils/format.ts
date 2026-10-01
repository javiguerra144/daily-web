/** Formats seconds as `m:ss`; overtime (negative) is prefixed with `+`. */
export function formatTime(seconds: number): string {
  const negative = seconds < 0;
  const abs = Math.abs(Math.round(seconds));
  const mm = Math.floor(abs / 60);
  const ss = String(abs % 60).padStart(2, '0');
  return `${negative ? '+' : ''}${mm}:${ss}`;
}

export function formatToday(date = new Date()): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
