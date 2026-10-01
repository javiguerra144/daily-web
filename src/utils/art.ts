import type { Member } from '@/types';
import { hash, seededRandom } from './random';

const cache = new Map<string, string>();

export function initialsOf(name: string): string {
  return (
    name
      .replace(/\(.*?\)/g, '')
      .trim()
      .split(/\s+/)
      .map(w => w[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}

/** Procedurally draws a landscape with the member's initials; returns a PNG data URL. */
export function generateArt(name: string, role: string): string {
  const key = `${name}|${role}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 500;
  const x = canvas.getContext('2d');
  if (!x) return '';
  const r = seededRandom(hash(key));

  const h1 = Math.floor(r() * 360);
  const h2 = (h1 + 40 + r() * 80) % 360;
  const sky = x.createLinearGradient(0, 0, 0, 500);
  sky.addColorStop(0, `hsl(${h1} 70% 72%)`);
  sky.addColorStop(1, `hsl(${h2} 60% 45%)`);
  x.fillStyle = sky;
  x.fillRect(0, 0, 400, 500);

  x.fillStyle = `hsla(${(h1 + 180) % 360} 90% 85% / .9)`;
  x.beginPath();
  x.arc(80 + r() * 240, 90 + r() * 70, 36 + r() * 30, 0, 7);
  x.fill();

  for (let layer = 0; layer < 3; layer++) {
    x.fillStyle = `hsl(${(h2 + layer * 18) % 360} ${50 - layer * 8}% ${38 - layer * 9}%)`;
    x.beginPath();
    x.moveTo(0, 500);
    const base = 330 + layer * 55;
    for (let px = 0; px <= 400; px += 20) {
      x.lineTo(px, base - Math.sin(px / 60 + r() * 3 + layer) * 24 - r() * 16);
    }
    x.lineTo(400, 500);
    x.closePath();
    x.fill();
  }

  for (let i = 0; i < 18; i++) {
    x.fillStyle = `hsla(0 0% 100% / ${0.3 + r() * 0.5})`;
    x.beginPath();
    x.arc(r() * 400, r() * 300, 1 + r() * 2.5, 0, 7);
    x.fill();
  }

  const initials = initialsOf(name);
  x.font = 'bold 120px Bungee, Impact, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillStyle = '#00000040';
  x.fillText(initials, 206, 256);
  x.fillStyle = '#fff';
  x.fillText(initials, 200, 250);

  const url = canvas.toDataURL('image/png');
  cache.set(key, url);
  return url;
}

/** Picture for a member: the uploaded one, or the generated art. */
export function imageFor(member: Pick<Member, 'img' | 'name' | 'role'>): string {
  return member.img || generateArt(member.name, member.role);
}
