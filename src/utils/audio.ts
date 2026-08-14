/**
 * Web Audio API Synthesizer for Douluo Dalu RPG
 * Pure synthetic sound effects with no external asset requirements.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

let awakeningBgmNodes: {
  masterGain: GainNode;
  oscillators: (OscillatorNode | AudioNode)[];
  timerId: number | null;
  pulseTimerId: number | null;
} | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export const SoundEngine = {
  // Soul ring summoning hum
  playSoulRingAura(color: string = 'yellow') {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      let baseFreq = 220;
      if (color === 'purple') baseFreq = 330;
      if (color === 'black') baseFreq = 440;
      if (color === 'red') baseFreq = 587;
      if (color === 'gold') baseFreq = 880;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Audio safety fallback
    }
  },

  // Attack / Slash sound
  playSlash() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // White noise burst with lowpass filter
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {}
  },

  // Heavy Impact / Hammer smash
  playSmash() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  },

  // Thunder / Lightning strike
  playThunder() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  },

  // Level Up / Breakthrough Fanfare
  playBreakthrough() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C E G C E G
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {}
  },

  // Victory Fanfare
  playVictory() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.15 },
        { f: 523.25, d: 0.15 },
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.3 },
        { f: 587.33, d: 0.2 },
        { f: 783.99, d: 0.6 },
      ];

      let elapsed = 0;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + elapsed;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + note.d);
        elapsed += note.d * 0.85;
      });
    } catch {}
  },

  // Level Up Jingle
  playLevelUp() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {}
  },

  // Combat Start Clang
  playCombatStart() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.15);
      osc2.frequency.setValueAtTime(240, now);
      osc2.frequency.exponentialRampToValueAtTime(640, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch {}
  },

  // Defeat Somber Tone
  playDefeat() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [330, 311.13, 293.66, 261.63];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.18;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {}
  },

  // Button click tick
  playClick() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  },

  // Ethereal Singing Bowl / Meditation Chime
  playMeditationChime() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [432, 864, 1296];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.6);
      });
    } catch {}
  },

  // Meridian breakthrough surge sound
  playMeridianBreakthrough() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  },

  // Waterfall splash / hammer impact sound
  playWaterfallSmash() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Low rumble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  },

  // Purple Demon Eye mystic gaze shimmer
  playZijiGaze() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  },

  // Soul guidance rifle gunshot
  playGunshot() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  },

  // Soul guidance heavy cannon explosion
  playCannonExplosion() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {}
  },

  // Switch hero squad sound
  playHeroSwitch() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  },

  // Gold coins jingling sound
  playCoins() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const coinFreqs = [1200, 1500, 1800];
      coinFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.08);
        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.15);
      });
    } catch {}
  },

  // Soul Bone Enhance success sound
  playEnhanceSuccess() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {}
  },

  // Flight jetpack thruster whoosh
  playThrusterJet() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  },

  // Divine Metal Forge sound
  playForge() {
    this.playSmash();
    setTimeout(() => this.playEnhanceSuccess(), 120);
  },

  // Battle start
  playBattle() {
    this.playCombatStart();
  },

  // Skill casting
  playSkill() {
    this.playSoulRingAura('gold');
  },

  // Space Laser Cannon Fire
  playLaserCannon() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.35);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  },

  // Warp Jump sound
  playWarpJump() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.7);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch {}
  },

  // Void Shield Deflect / Energy Pulse
  playShieldPulse() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(280, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  },

  // Alien Invasion Alert Klaxon
  playInvasionAlert() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [0, 0.25, 0.5].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + offset;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, start);
        osc.frequency.linearRampToValueAtTime(440, start + 0.2);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {}
  },

  // Item pickup / resource acquired sound
  playItemPickup() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [659.25, 880, 1174.66]; // E5, A5, D6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.05;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch {}
  },

  // Planetary Trade Transaction Jingle
  playTradeSuccess() {
    this.playCoins();
    setTimeout(() => this.playItemPickup(), 100);
  },

  // Divine God Skill Release Voice & Synthesized Harmonic Declaration
  playDivineDeclaration(godPosition?: string | null, skillName?: string) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (ctx) {
      try {
        const now = ctx.currentTime;

        // 1. Divine booming low bass drop oscillator
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(60, now);
        osc1.frequency.exponentialRampToValueAtTime(180, now + 0.3);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 1.2);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 1.2);

        // 2. Majestic ascending divine chord tones
        const freqs = godPosition === '海神' ? [261.63, 329.63, 392.0, 523.25, 659.25]
          : godPosition === '修罗神' ? [220.0, 277.18, 329.63, 440.0, 554.37]
          : godPosition === '天使神' ? [293.66, 369.99, 440.0, 587.33, 739.99]
          : godPosition === '罗刹神' ? [196.0, 246.94, 293.66, 392.0, 493.88]
          : godPosition === '情绪之神' ? [329.63, 392.0, 493.88, 659.25, 783.99]
          : godPosition === '至高龙神' ? [220.0, 277.18, 329.63, 440.0, 554.37, 659.25, 880.0]
          : [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];

        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.01, start);
          gain.gain.linearRampToValueAtTime(0.18, start + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 1.5);
        });
      } catch {
        // Audio fallback
      }
    }

    // 3. Web Speech API SpeechSynthesis for Voice Declaration
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Clear queued speech
        const linesMap: Record<string, string[]> = {
          '海神': [
            '海神降临，听吾号令，无定风波！',
            '瀚海汪洋，黄金十三式，法裁万物！',
            '三叉戟重逾千钧，海神威慑全场！'
          ],
          '修罗神': [
            '修罗裁决，杀戮领域，血剑斩灭！',
            '审判天诛，修罗血魔斩！',
            '执掌神界杀罚，万物尽皆斩尽！'
          ],
          '天使神': [
            '天使圣光，大日金阳，净化世间邪祟！',
            '太阳真火，六翼翱翔，神光普照！',
            '圣剑凌霄，天使降世！'
          ],
          '罗刹神': [
            '罗刹幽冥，深渊绝灭，幽魂断骨！',
            '九幽魔躯，噬魂绝煞，罗刹斩仙！',
            '邪煞盖世，深渊降临！'
          ],
          '情绪之神': [
            '命运天眼，情绪神光，浩冬定乾坤！',
            '灵眸永恒，七彩神光降世！'
          ],
          '至高龙神': [
            '以龙神之名，九彩神芒，万龙俯首！',
            '龙枪破空，万龙朝圣，至高龙神降临！',
            '融汇金银九彩本源，毁灭与创生尽在掌中！'
          ],
          '海神 & 修罗双神': [
            '双神一体，至高裁决，瀚海修罗共尊！',
            '神王临世，双神共鸣，万界臣服！'
          ]
        };

        const pool = linesMap[godPosition || ''] || [
          skillName ? `神力觉醒，释放【${skillName}】！` : '神力觉醒，神威法裁！'
        ];
        const text = pool[Math.floor(Math.random() * pool.length)];

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech API restriction fallback
      }
    }
  },

  // Martial Soul Awakening Ritual BGM - Sacred Hall Ambient Synth
  startAwakeningBgm() {
    if (!soundEnabled) return;
    this.stopAwakeningBgm(); // clear existing if any
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);

      const oscillators: OscillatorNode[] = [];

      // Warm Sacred Ambient Pads (C2, G2, C3, E3, G3, B3)
      const chordFreqs = [65.41, 98.00, 130.81, 164.81, 196.00, 246.94];
      chordFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);

        gain.gain.setValueAtTime(0.04 - idx * 0.005, ctx.currentTime);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
        oscillators.push(osc, lfo);
      });

      // Periodic sacred hall chime / harp arpeggiator
      const pentatonic = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99];
      let step = 0;
      const timerId = window.setInterval(() => {
        if (!soundEnabled || !awakeningBgmNodes) return;
        const curCtx = getAudioContext();
        if (!curCtx) return;
        const now = curCtx.currentTime;
        const noteFreq = pentatonic[step % pentatonic.length];
        step++;

        const osc = curCtx.createOscillator();
        const gain = curCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.8);
      }, 700);

      awakeningBgmNodes = {
        masterGain,
        oscillators,
        timerId,
        pulseTimerId: null
      };
    } catch {
      // Audio safety
    }
  },

  // Intensify Awakening BGM during ceremony (mystical pulse & energy buildup)
  setAwakeningCeremonyMusicIntense() {
    if (!awakeningBgmNodes) {
      this.startAwakeningBgm();
    }
    if (!soundEnabled || !awakeningBgmNodes) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      awakeningBgmNodes.masterGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.0);

      if (!awakeningBgmNodes.pulseTimerId) {
        awakeningBgmNodes.pulseTimerId = window.setInterval(() => {
          if (!soundEnabled || !awakeningBgmNodes) return;
          const curCtx = getAudioContext();
          if (!curCtx) return;
          const now = curCtx.currentTime;

          // Heartbeat drum thud
          const osc = curCtx.createOscillator();
          const gain = curCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(90, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(curCtx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        }, 600);
      }
    } catch {}
  },

  // Stop Awakening BGM
  stopAwakeningBgm() {
    if (awakeningBgmNodes) {
      try {
        if (awakeningBgmNodes.timerId) clearInterval(awakeningBgmNodes.timerId);
        if (awakeningBgmNodes.pulseTimerId) clearInterval(awakeningBgmNodes.pulseTimerId);

        const ctx = getAudioContext();
        if (ctx) {
          awakeningBgmNodes.masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
          setTimeout(() => {
            awakeningBgmNodes?.oscillators.forEach(o => {
              try { (o as OscillatorNode).stop(); } catch {}
            });
            awakeningBgmNodes = null;
          }, 600);
        } else {
          awakeningBgmNodes = null;
        }
      } catch {
        awakeningBgmNodes = null;
      }
    }
  },

  // Awakening Fanfare Jingle upon successful awakening
  playAwakeningFanfare() {
    this.stopAwakeningBgm();
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Grand Triumphant Chord Progression: C -> G -> Am -> F -> C
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C
        [293.66, 392.00, 493.88, 587.33], // G
        [329.63, 440.00, 523.25, 659.25], // Am
        [349.23, 440.00, 523.25, 698.46], // F
        [523.25, 659.25, 783.99, 1046.50]  // High C burst
      ];

      chords.forEach((chord, cIdx) => {
        const time = now + cIdx * 0.28;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = cIdx === 4 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.01, time);
          gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, time + (cIdx === 4 ? 2.5 : 0.4));

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + (cIdx === 4 ? 2.5 : 0.4));
        });
      });
    } catch {}

    // Speech synthesis announcement
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const text = '天地灵力灌注完毕！天生异象，绝世双生武魂，先天满魂力觉醒！';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  }
};
