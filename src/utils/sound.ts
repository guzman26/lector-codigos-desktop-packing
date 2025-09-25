// Simple audio utilities for feedback sounds

let errorAudio: HTMLAudioElement | null = null;

export function playErrorBeep(): void {
  try {
    if (!errorAudio) {
      errorAudio = new Audio('/error-126627.mp3');
      errorAudio.preload = 'auto';
    }
    errorAudio.currentTime = 0;
    errorAudio.volume = 1.0; // Max volume
    // Attempt to play; browsers may require prior user interaction
    void errorAudio.play();
  } catch {
    // no-op if playback fails
  }
}


