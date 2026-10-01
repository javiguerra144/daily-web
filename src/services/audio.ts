type AudioContextCtor = typeof AudioContext;

let context: AudioContext | undefined;

function getContext(): AudioContext {
  const Ctor: AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: AudioContextCtor }).webkitAudioContext;
  context ??= new Ctor();
  return context;
}

/** Plays a short triangle-wave tone. Silently does nothing if audio is unavailable. */
export function beep(frequency: number, duration: number): void {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore: autoplay policy or no Web Audio support
  }
}

/** Rising three-note arpeggio played when a card is revealed. */
export function sparkle(): void {
  [880, 1175, 1568].forEach((frequency, i) => setTimeout(() => beep(frequency, 0.14), i * 70));
}

export function requestWakeLock(): void {
  try {
    void navigator.wakeLock?.request('screen').catch(() => undefined);
  } catch {
    // ignore: unsupported
  }
}
