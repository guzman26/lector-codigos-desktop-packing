// Audio feedback utilities with optional amplification using Web Audio API

let htmlAudioElement: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let decodedErrorBuffer: AudioBuffer | null = null;
let defaultErrorBeepGain = 3.0; // >1.0 amplifies; beware of clipping

async function ensureAudioContext(): Promise<AudioContext> {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch {
      // ignore; will resume on next user gesture
    }
  }
  return audioContext;
}

async function ensureDecodedErrorBuffer(): Promise<AudioBuffer | null> {
  if (decodedErrorBuffer) return decodedErrorBuffer;
  try {
    const ctx = await ensureAudioContext();
    const resp = await fetch('/error-126627.mp3', { cache: 'force-cache' });
    const arr = await resp.arrayBuffer();
    decodedErrorBuffer = await ctx.decodeAudioData(arr);
    return decodedErrorBuffer;
  } catch {
    return null;
  }
}

/**
 * Adjust the default amplification factor for the error beep.
 * Values > 1.0 amplify; typical range 1.0 - 5.0.
 */
export function setErrorBeepGain(gain: number): void {
  if (Number.isFinite(gain)) {
    defaultErrorBeepGain = Math.max(0.1, Math.min(6.0, gain));
  }
}

export async function playErrorBeep(): Promise<void> {
  // Try Web Audio pipeline first to allow amplification above 1.0
  try {
    const buffer = await ensureDecodedErrorBuffer();
    const ctx = audioContext;
    if (buffer && ctx) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      gainNode.gain.value = defaultErrorBeepGain; // amplify

      // Optional: light compression to reduce clipping artifacts
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -10;
      compressor.knee.value = 24;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.1;

      source.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(ctx.destination);

      source.start(0);
      return;
    }
  } catch {
    // fall through to HTMLAudioElement fallback
  }

  // Fallback: HTMLAudioElement at max element volume (cannot exceed 1.0)
  try {
    if (!htmlAudioElement) {
      htmlAudioElement = new Audio('/error-126627.mp3');
      htmlAudioElement.preload = 'auto';
    }
    htmlAudioElement.currentTime = 0;
    htmlAudioElement.volume = 1.0;
    void htmlAudioElement.play();
  } catch {
    // no-op if playback fails
  }
}


