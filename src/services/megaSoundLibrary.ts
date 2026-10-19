/**
 * Mega Sound FX Library & Procedural Web Audio Synthesizer
 * 105+ distinct procedural sound effects across 6 categories:
 * - Engine & Exhaust (18)
 * - Police & Sirens (12)
 * - Casino & Jackpots (16)
 * - Factory & Plate Stamp (14)
 * - UI & Haptics (16)
 * - Vehicle & Mechanical (19)
 * - Procedural Music Radio Loops (10)
 */

export interface SoundMeta {
  id: string;
  name: string;
  category: 'engine' | 'police' | 'casino' | 'factory' | 'ui' | 'vehicle' | 'radio';
  icon: string;
  description: string;
  play: (pitch?: number) => void;
}

class MegaAudioEngine {
  private ctx: AudioContext | null = null;
  public masterVolume: number = 0.85;
  public enabled: boolean = true;
  private radioInterval: any = null;
  public isRadioPlaying: boolean = false;
  public currentRadioTrack: string = '';

  public getContext(): AudioContext {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx!;
  }

  // Noise generator helper
  private createNoiseBuffer(duration = 1.0): AudioBuffer {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Master Gain node helper
  private createMasterGain(): GainNode {
    const ctx = this.getContext();
    const gain = ctx.createGain();
    gain.gain.value = this.masterVolume;
    gain.connect(ctx.destination);
    return gain;
  }

  // ==========================================
  // CATEGORY 1: ENGINES & EXHAUST (18 sounds)
  // ==========================================

  // 1. Cold Start V8
  public coldStartV8(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();

    // Starter motor cranks 3 times
    for (let i = 0; i < 3; i++) {
      const crank = ctx.createOscillator();
      const crankGain = ctx.createGain();
      crank.type = 'sawtooth';
      crank.frequency.setValueAtTime((120 + i * 20) * pitch, t + i * 0.18);
      crank.frequency.linearRampToValueAtTime((80 + i * 20) * pitch, t + i * 0.18 + 0.12);
      crankGain.gain.setValueAtTime(0.25, t + i * 0.18);
      crankGain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.14);
      crank.connect(crankGain);
      crankGain.connect(master);
      crank.start(t + i * 0.18);
      crank.stop(t + i * 0.18 + 0.14);
    }

    // Engine Roar Catch
    const roar = ctx.createOscillator();
    const roarGain = ctx.createGain();
    roar.type = 'sawtooth';
    roar.frequency.setValueAtTime(65 * pitch, t + 0.6);
    roar.frequency.exponentialRampToValueAtTime(280 * pitch, t + 0.85);
    roar.frequency.exponentialRampToValueAtTime(75 * pitch, t + 1.4);
    roarGain.gain.setValueAtTime(0.001, t + 0.6);
    roarGain.gain.linearRampToValueAtTime(0.4, t + 0.85);
    roarGain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    roar.connect(roarGain);
    roarGain.connect(master);
    roar.start(t + 0.6);
    roar.stop(t + 1.6);
  }

  // 2. Idle Rumble 2JZ
  public idle2JZ(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 6; i++) {
      const pulse = ctx.createOscillator();
      const pGain = ctx.createGain();
      pulse.type = 'triangle';
      pulse.frequency.setValueAtTime((48 + (i % 2) * 6) * pitch, t + i * 0.1);
      pGain.gain.setValueAtTime(0.3, t + i * 0.1);
      pGain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.08);
      pulse.connect(pGain);
      pGain.connect(master);
      pulse.start(t + i * 0.1);
      pulse.stop(t + i * 0.1 + 0.08);
    }
  }

  // 3. Redline Rev 9000 RPM (GT3 / V10)
  public redlineV10(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220 * pitch, t);
    osc.frequency.linearRampToValueAtTime(780 * pitch, t + 0.4);
    // Rev limiter stutter
    for (let s = 0; s < 6; s++) {
      osc.frequency.setValueAtTime(780 * pitch, t + 0.4 + s * 0.06);
      osc.frequency.setValueAtTime(710 * pitch, t + 0.4 + s * 0.06 + 0.03);
    }
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.85);
  }

  // 4. Exhaust Popcorn / Pops & Bangs
  public exhaustPops(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.08, 0.15, 0.28, 0.35].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((240 + Math.random() * 80) * pitch, t + offset);
      osc.frequency.exponentialRampToValueAtTime(30, t + offset + 0.06);
      gain.gain.setValueAtTime(0.4, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.06);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.06);
    });
  }

  // 5. 2-Step Launch Control
  public launchControl(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420 * pitch, t + i * 0.07);
      osc.frequency.setValueAtTime(110 * pitch, t + i * 0.07 + 0.03);
      gain.gain.setValueAtTime(0.35, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.07 + 0.05);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.05);
    }
  }

  // 6. Turbo Spool Garrett Whistle
  public turboSpool(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(3200 * pitch, t + 0.6);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.7);
  }

  // 7. Blow-Off Valve Stututu (HKS Flutter)
  public blowOffStututu(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.06, 0.12, 0.18, 0.24, 0.3].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime((2400 - idx * 260) * pitch, t + delay);
      osc.frequency.exponentialRampToValueAtTime(600, t + delay + 0.05);
      gain.gain.setValueAtTime(0.25 - idx * 0.035, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.05);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + delay);
      osc.stop(t + delay + 0.05);
    });
  }

  // 8. Supercharger Whine (Hellcat / Whipple)
  public superchargerWhine(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 * pitch, t);
    osc.frequency.linearRampToValueAtTime(4200 * pitch, t + 0.7);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  // 9. Straight Cut Dog-Box Gears Whine
  public straightCutGears(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950 * pitch, t);
    osc.frequency.linearRampToValueAtTime(2600 * pitch, t + 0.5);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  // 10. Anti-Lag Rally Gunshot
  public antiLagGunshot(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  // 11. Diesel Truck Turbo Clatter
  public dieselClatter(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 7; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime((110 + (i % 3) * 20) * pitch, t + i * 0.08);
      gain.gain.setValueAtTime(0.18, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.04);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.04);
    }
  }

  // 12. Electric Hypercar Warp Whine
  public evHypercarWarp(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(4500 * pitch, t + 0.7);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  // 13. Rotary 13B Brap Brap Idle
  public rotaryBrap(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(85 * pitch, t + i * 0.09);
      gain.gain.setValueAtTime(0.3, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.09 + 0.05);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.05);
    }
  }

  // 14. VAZ-2101 Carburetor Sputter
  public vazCarbSputter(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 * pitch, t);
    osc.frequency.linearRampToValueAtTime(90 * pitch, t + 0.3);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  // 15. AMG M177 Biturbo Low Rumble
  public amgV8Bass(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(180 * pitch, t + 0.3);
    osc.frequency.exponentialRampToValueAtTime(45 * pitch, t + 0.7);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.75);
  }

  // 16. Bugatti Quad-Turbo W16 Hypersonic
  public bugattiW16(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [80, 160, 320, 640].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * pitch, t);
      osc.frequency.linearRampToValueAtTime((freq * 2.8) * pitch, t + 0.5);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  // 17. Downshift Rev Match (Heel & Toe)
  public downshiftBlip(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160 * pitch, t);
    osc.frequency.linearRampToValueAtTime(480 * pitch, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(220 * pitch, t + 0.28);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.32);
  }

  // 18. Engine Stalled / Cutout
  public engineStall(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(15, t + 0.35);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.38);
  }

  // ==========================================
  // CATEGORY 2: POLICE & SIRENS (12 sounds)
  // ==========================================

  // 19. FSO Kryakalka Quack (Кря-Кря Спецсвязь)
  public kryakalka(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.14].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(460 * pitch, t + offset);
      osc.frequency.linearRampToValueAtTime(210 * pitch, t + offset + 0.09);
      gain.gain.setValueAtTime(0.4, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.11);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.11);
    });
  }

  // 20. Federal Siren Wail
  public federalSiren(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500 * pitch, t);
    osc.frequency.linearRampToValueAtTime(1100 * pitch, t + 0.35);
    osc.frequency.linearRampToValueAtTime(500 * pitch, t + 0.7);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.75);
  }

  // 21. High-Speed Police Yelp
  public policeYelp(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650 * pitch, t + i * 0.12);
      osc.frequency.linearRampToValueAtTime(1250 * pitch, t + i * 0.12 + 0.1);
      gain.gain.setValueAtTime(0.25, t + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.11);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.11);
    }
  }

  // 22. Euro Hi-Lo Siren
  public hiLoSiren(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700 * pitch, t);
    osc.frequency.setValueAtTime(500 * pitch, t + 0.25);
    osc.frequency.setValueAtTime(700 * pitch, t + 0.5);
    osc.frequency.setValueAtTime(500 * pitch, t + 0.75);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 1.0);
  }

  // 23. Radar Detector Beep (Стрелка / Камера)
  public radarBeep(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.09, 0.18].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2600 * pitch, t + offset);
      gain.gain.setValueAtTime(0.3, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.05);
    });
  }

  // 24. Police Megaphone Bullhorn Click
  public megaphoneClick(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 25. Police Dispatch Radio Chatter Squelch
  public radioSquelch(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800 * pitch, t);
    osc.frequency.linearRampToValueAtTime(900 * pitch, t + 0.08);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // 26. Inspector Whistle (Свисток гаишника)
  public inspectorWhistle(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800 * pitch, t);
    osc.frequency.setValueAtTime(3200 * pitch, t + 0.08);
    osc.frequency.setValueAtTime(2900 * pitch, t + 0.16);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // 27. Tactical Intercept Alert
  public tacticalAlert(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880 * pitch, t);
    osc.frequency.setValueAtTime(440 * pitch, t + 0.12);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // 28. Fine Issued Cash Register Penalty
  public finePenalty(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350 * pitch, t);
    osc.frequency.linearRampToValueAtTime(180 * pitch, t + 0.25);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // 29. Police Strobe Flash Sync Tick
  public strobeTick(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600 * pitch, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // 30. FSB Priority Green Light Clearance Tone
  public fsbClearance(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.06);
      gain.gain.setValueAtTime(0.2, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.25);
    });
  }

  // ==========================================
  // CATEGORY 3: CASINO & JACKPOTS (16 sounds)
  // ==========================================

  // 31. Grand Jackpot Brass Trumpets
  public jackpotBrass(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.07);
      gain.gain.setValueAtTime(0.25, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.45);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.45);
    });
  }

  // 32. 100 Gold Coins Cascade in Tray
  public coinCascade(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 18; i++) {
      const delay = i * 0.035 + Math.random() * 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime((1400 + Math.random() * 900) * pitch, t + delay);
      gain.gain.setValueAtTime(0.18, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + delay);
      osc.stop(t + delay + 0.08);
    }
  }

  // 33. Crystal Ping
  public crystalPing(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [2400, 3600, 4800].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // 34. Slot Machine Reel Tick
  public reelTick(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 * pitch, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  // 35. Wheel of Fortune Clacker
  public wheelClacker(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(750 * pitch, t);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // 36. Suspense Heartbeat
  public heartbeatThud(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.14].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65 * pitch, t + offset);
      osc.frequency.exponentialRampToValueAtTime(25, t + offset + 0.1);
      gain.gain.setValueAtTime(0.4, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.12);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.12);
    });
  }

  // 37. Drumroll Crescendo
  public drumroll(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 20; i++) {
      const delay = i * 0.035;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((160 + i * 8) * pitch, t + delay);
      gain.gain.setValueAtTime((0.08 + i * 0.015), t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.03);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + delay);
      osc.stop(t + delay + 0.03);
    }
  }

  // 38. Major Winning Chord
  public majorWinChord(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [440, 554.37, 659.25, 880].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // 39. Fireworks Cracker Pop
  public fireworkPop(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);
    gain.gain.setValueAtTime(0.38, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.24);
  }

  // 40. Legendary Shimmer Glow
  public legendaryShimmer(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [1046, 1318, 1567, 2093, 2637].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.08);
      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.5);
    });
  }

  // 41. Sad Trombone / Fail Buzzer
  public failBuzzer(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const notes = [293.66, 277.18, 261.63, 246.94];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.16);
      gain.gain.setValueAtTime(0.25, t + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.16 + 0.18);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.16);
      osc.stop(t + idx * 0.16 + 0.18);
    });
  }

  // 42. Multiplier Booster x2 / x5
  public multiplierBooster(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(1760 * pitch, t + 0.22);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  // 43. Cash Register Cha-Ching
  public cashRegister(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    // Lever clank
    const clank = ctx.createOscillator();
    const cGain = ctx.createGain();
    clank.type = 'square';
    clank.frequency.setValueAtTime(600 * pitch, t);
    clank.frequency.exponentialRampToValueAtTime(120, t + 0.08);
    cGain.gain.setValueAtTime(0.3, t);
    cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    clank.connect(cGain);
    cGain.connect(master);
    clank.start(t);
    clank.stop(t + 0.1);

    // Bell chime
    const bell = ctx.createOscillator();
    const bGain = ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1800 * pitch, t + 0.08);
    bGain.gain.setValueAtTime(0.35, t + 0.08);
    bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    bell.connect(bGain);
    bGain.connect(master);
    bell.start(t + 0.08);
    bell.stop(t + 0.6);
  }

  // 44. Bill Counting Rustle
  public billCounting(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 8; i++) {
      const delay = i * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((800 + Math.random() * 400) * pitch, t + delay);
      gain.gain.setValueAtTime(0.12, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.03);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + delay);
      osc.stop(t + delay + 0.03);
    }
  }

  // 45. Vault Safe Unlocking Click
  public safeUnlocking(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.09, 0.18, 0.32].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((idx === 3 ? 340 : 850) * pitch, t + offset);
      gain.gain.setValueAtTime(0.3, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.08);
    });
  }

  // 46. Level Up Ascending Chime
  public levelUpChime(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const chord = [392.0, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.05);
      gain.gain.setValueAtTime(0.22, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.35);
    });
  }

  // ==========================================
  // CATEGORY 4: GOST PLATE FACTORY (14 sounds)
  // ==========================================

  // 47. 50-Ton Hydraulic Press Metal Stamp
  public hydraulicStamp(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();

    // Heavy bass impact
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(140 * pitch, t);
    sub.frequency.exponentialRampToValueAtTime(20, t + 0.28);
    subGain.gain.setValueAtTime(0.5, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    sub.connect(subGain);
    subGain.connect(master);
    sub.start(t);
    sub.stop(t + 0.3);

    // Metal clink ring
    const ring = ctx.createOscillator();
    const rGain = ctx.createGain();
    ring.type = 'triangle';
    ring.frequency.setValueAtTime(1100 * pitch, t);
    ring.frequency.exponentialRampToValueAtTime(320, t + 0.2);
    rGain.gain.setValueAtTime(0.3, t);
    rGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    ring.connect(rGain);
    rGain.connect(master);
    ring.start(t);
    ring.stop(t + 0.25);
  }

  // 48. Aluminum Sheet Guillotine Cutter
  public sheetGuillotine(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(950 * pitch, t);
    osc.frequency.linearRampToValueAtTime(280 * pitch, t + 0.12);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // 49. Laser Engraving Hiss
  public laserEngraving(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(3200 * pitch, t);
    osc.frequency.linearRampToValueAtTime(1400 * pitch, t + 0.3);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // 50. Torque Wrench Ratchet Click
  public torqueRatchet(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1450 * pitch, t + i * 0.04);
      gain.gain.setValueAtTime(0.25, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.025);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.025);
    }
  }

  // 51. Metal Plate Drop on Workbench
  public plateDropClatter(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.05, 0.09, 0.14].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((800 - idx * 110) * pitch, t + offset);
      gain.gain.setValueAtTime(0.3 - idx * 0.06, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.08);
    });
  }

  // 52. Thermal Foil Stamp Peel
  public foilPeel(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200 * pitch, t);
    osc.frequency.linearRampToValueAtTime(2600 * pitch, t + 0.2);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // 53. Inspection Scanner Beep OK
  public inspectionBeep(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1864 * pitch, t);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // 54. Counterfeit Rejection Klaxon
  public counterfeitReject(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150 * pitch, t);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // 55. License Frame Snap Lock
  public frameSnap(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.05);
    gain.gain.setValueAtTime(0.38, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // 56. Carbon Fiber Buffing Polish
  public buffingPolish(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 * pitch, t);
    osc.frequency.linearRampToValueAtTime(800 * pitch, t + 0.15);
    osc.frequency.linearRampToValueAtTime(600 * pitch, t + 0.3);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // 57. Arc Welding Spark Buzz
  public arcWelding(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime((180 + Math.random() * 200) * pitch, t + i * 0.05);
      gain.gain.setValueAtTime(0.2, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.05 + 0.035);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.035);
    }
  }

  // 58. Embossing Stamp Heat Relief
  public heatRelief(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.4);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // 59. Magnetic Frame Clasp
  public magnetClasp(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.07);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 60. Final Quality Control Approval Stamp
  public qcApproval(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [523.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.08);
      gain.gain.setValueAtTime(0.25, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.2);
    });
  }

  // ==========================================
  // CATEGORY 5: UI & HAPTICS (16 sounds)
  // ==========================================

  // 61. Soft Pop
  public softPop(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // 62. Glassy Tap
  public glassTap(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400 * pitch, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // 63. Futuristic Woosh Swipe
  public futureWoosh(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 * pitch, t);
    osc.frequency.linearRampToValueAtTime(1100 * pitch, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.18);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 64. Modal Spring Open Pop
  public modalPop(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(880 * pitch, t + 0.1);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // 65. Toggle Switch Clack
  public toggleClack(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 * pitch, t);
    osc.frequency.setValueAtTime(600 * pitch, t + 0.02);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 66. Credit Card Terminal Beep
  public cardBeep(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1750 * pitch, t);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 67. Error Deny Buzz
  public errorBuzz(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130 * pitch, t);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  // 68. Tab Selection Click
  public tabClick(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 * pitch, t);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  // 69. Trophy Achievement Fanfare
  public trophyFanfare(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.07);
      gain.gain.setValueAtTime(0.24, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.4);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.4);
    });
  }

  // 70. Energy Charge Spark
  public energyCharge(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(2200 * pitch, t + 0.3);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // 71. Trash Shredder Sell
  public trashShredder(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260 * pitch, t);
    osc.frequency.linearRampToValueAtTime(90 * pitch, t + 0.2);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // 72. Neon Underglow Hum
  public neonHum(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * pitch, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // 73. Rebirth Crown Ascend
  public rebirthAscend(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const notes = [440, 554, 659, 880, 1108, 1318, 1760];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitch, t + idx * 0.06);
      gain.gain.setValueAtTime(0.22, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.5);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.5);
    });
  }

  // 74. Subtle Hover Pip
  public hoverPip(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1900 * pitch, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  // 75. Notification Bell Ping
  public notifyPing(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1318.51 * pitch, t);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  // 76. Cyber Glitch Scan
  public cyberGlitch(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime((3000 - Math.random() * 2000) * pitch, t + i * 0.03);
      gain.gain.setValueAtTime(0.18, t + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.025);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.025);
    }
  }

  // ==========================================
  // CATEGORY 6: VEHICLE & MECHANICAL (19 sounds)
  // ==========================================

  // 77. Mercedes-AMG Gelik Door Slam (Iconic Gunshot Latch)
  public gelikDoorSlam(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    // Heavy latch clack
    const clack = ctx.createOscillator();
    const cGain = ctx.createGain();
    clack.type = 'triangle';
    clack.frequency.setValueAtTime(850 * pitch, t);
    clack.frequency.exponentialRampToValueAtTime(140, t + 0.05);
    cGain.gain.setValueAtTime(0.4, t);
    cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    clack.connect(cGain);
    cGain.connect(master);
    clack.start(t);
    clack.stop(t + 0.06);

    // Deep vault door thud
    const thud = ctx.createOscillator();
    const tGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(95 * pitch, t + 0.04);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.2);
    tGain.gain.setValueAtTime(0.5, t + 0.04);
    tGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    thud.connect(tGain);
    tGain.connect(master);
    thud.start(t + 0.04);
    thud.stop(t + 0.22);
  }

  // 78. VAZ-2106 Classic Door Slam (Soviet Sheet Metal Clank)
  public vazDoorSlam(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(420 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.14);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  // 79. Remote Alarm Keyfob Beep-Beep
  public keyfobLock(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200 * pitch, t + offset);
      gain.gain.setValueAtTime(0.25, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.06);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + offset);
      osc.stop(t + offset + 0.06);
    });
  }

  // 80. Tire Drift Screech
  public tireScreech(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950 * pitch, t);
    osc.frequency.linearRampToValueAtTime(1400 * pitch, t + 0.2);
    osc.frequency.linearRampToValueAtTime(850 * pitch, t + 0.4);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // 81. Air Suspension Dump (Пневма Сброс Pshhh)
  public airSuspensionDump(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2800 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.5);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  // 82. Handbrake Ratchet 8-Clicks
  public handbrakeRatchet(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 7; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((1200 + i * 40) * pitch, t + i * 0.04);
      gain.gain.setValueAtTime(0.25, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.025);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.025);
    }
  }

  // 83. Turn Signal Relay Click-Clack
  public turnSignalRelay(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400 * pitch, t);
    g1.gain.setValueAtTime(0.2, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc1.connect(g1);
    g1.connect(master);
    osc1.start(t);
    osc1.stop(t + 0.03);

    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(950 * pitch, t + 0.25);
    g2.gain.setValueAtTime(0.18, t + 0.25);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc2.connect(g2);
    g2.connect(master);
    osc2.start(t + 0.25);
    osc2.stop(t + 0.28);
  }

  // 84. Classic Low Volga Horn
  public volgaHorn(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [329.63, 392.0].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // 85. Train / Locomotive Air Horn Blast
  public trainAirHorn(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    [220, 277.18, 329.63].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  // 86. Windshield Wiper Squeak
  public wiperSqueak(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600 * pitch, t);
    osc.frequency.linearRampToValueAtTime(2400 * pitch, t + 0.15);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 87. ABS Brake Pedal Pulsing
  public absPulse(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140 * pitch, t + i * 0.05);
      gain.gain.setValueAtTime(0.25, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.03);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.03);
    }
  }

  // 88. Heavy Hood Slam
  public hoodSlam(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);
    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 89. Gas Tank Cap Click
  public gasCapClick(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950 * pitch, t + i * 0.04);
      gain.gain.setValueAtTime(0.2, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.02);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.02);
    }
  }

  // 90. Fuel Gurgling Fill
  public fuelGurgle(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime((350 + Math.random() * 200) * pitch, t + i * 0.06);
      gain.gain.setValueAtTime(0.18, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.04);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.04);
    }
  }

  // 91. Slammed Scrape on Speedbump (БПАН Скребёт)
  public bpanScrape(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450 * pitch, t);
    osc.frequency.linearRampToValueAtTime(180 * pitch, t + 0.25);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  // 92. Rumble Strip Vibration on Highway
  public rumbleStrip(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80 * pitch, t + i * 0.04);
      gain.gain.setValueAtTime(0.3, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.025);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.025);
    }
  }

  // 93. Reverse Backup Warning Beeper
  public reverseBackupBeep(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000 * pitch, t);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 94. Gravel Kickup under Wheel Well
  public gravelKickup(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    for (let i = 0; i < 7; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime((1600 + Math.random() * 800) * pitch, t + i * 0.03);
      gain.gain.setValueAtTime(0.18, t + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.02);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.02);
    }
  }

  // 95. Thunder Rumble
  public thunderRumble(pitch = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const master = this.createMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.8);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.85);
  }

  // ==========================================
  // CATEGORY 7: PROCEDURAL RADIO STATIONS (10)
  // ==========================================

  public stopRadio() {
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
    this.isRadioPlaying = false;
    this.currentRadioTrack = '';
  }

  public playRadioTrack(trackId: string) {
    this.stopRadio();
    this.isRadioPlaying = true;
    this.currentRadioTrack = trackId;

    const ctx = this.getContext();

    // Procedural Synth Loop player
    let step = 0;
    const trackTempos: Record<string, number> = {
      phonk: 160,
      eurobeat: 140,
      lofi: 320,
      cyberpunk: 180,
      retrowave: 220,
      rap: 200,
      shanson: 260,
      syndicate: 170,
      nightdrive: 240,
      ambient: 350,
    };

    const intervalMs = trackTempos[trackId] || 200;

    this.radioInterval = setInterval(() => {
      if (!this.enabled || !this.isRadioPlaying) return;
      step++;
      const t = ctx.currentTime;
      const master = this.createMasterGain();

      // Track 1: Phonk 808 Cowbell & Bass
      if (trackId === 'phonk') {
        // Cowbell on steps
        const cowbellFreqs = [587.33, 587.33, 783.99, 659.25, 587.33, 880, 783.99, 659.25];
        const freq = cowbellFreqs[step % cowbellFreqs.length];
        const cb = ctx.createOscillator();
        const cbG = ctx.createGain();
        cb.type = 'square';
        cb.frequency.setValueAtTime(freq, t);
        cbG.gain.setValueAtTime(0.12, t);
        cbG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        cb.connect(cbG);
        cbG.connect(master);
        cb.start(t);
        cb.stop(t + 0.08);

        // 808 Bass Kick
        if (step % 2 === 0) {
          const bass = ctx.createOscillator();
          const bG = ctx.createGain();
          bass.type = 'triangle';
          bass.frequency.setValueAtTime(95, t);
          bass.frequency.exponentialRampToValueAtTime(32, t + 0.16);
          bG.gain.setValueAtTime(0.28, t);
          bG.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          bass.connect(bG);
          bG.connect(master);
          bass.start(t);
          bass.stop(t + 0.18);
        }
      }

      // Track 2: Eurobeat Drift Synth
      else if (trackId === 'eurobeat') {
        const leadNotes = [440, 523.25, 659.25, 523.25, 659.25, 783.99, 659.25, 440];
        const freq = leadNotes[step % leadNotes.length];
        const lead = ctx.createOscillator();
        const lG = ctx.createGain();
        lead.type = 'sawtooth';
        lead.frequency.setValueAtTime(freq, t);
        lG.gain.setValueAtTime(0.14, t);
        lG.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        lead.connect(lG);
        lG.connect(master);
        lead.start(t);
        lead.stop(t + 0.1);
      }

      // Track 3: Lo-Fi Garage Chill
      else if (trackId === 'lofi') {
        const chord = [261.63, 329.63, 392.0];
        const freq = chord[step % chord.length];
        const rhodes = ctx.createOscillator();
        const rG = ctx.createGain();
        rhodes.type = 'sine';
        rhodes.frequency.setValueAtTime(freq, t);
        rG.gain.setValueAtTime(0.15, t);
        rG.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        rhodes.connect(rG);
        rG.connect(master);
        rhodes.start(t);
        rhodes.stop(t + 0.28);
      }

      // Default synth pulse for other tracks
      else {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime((220 + (step % 5) * 60), t);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.12);
      }
    }, intervalMs);
  }
}

export const MegaAudio = new MegaAudioEngine();

// ==========================================
// CATALOG OF ALL 105+ SOUND EFFECTS
// ==========================================
export const ALL_SOUND_EFFECTS: SoundMeta[] = [
  // Engines (1-18)
  { id: 'cold_start_v8', name: 'Холодный пуск V8', category: 'engine', icon: '🔑', description: 'Заводка 8-цилиндрового мотора со стартером', play: (p) => MegaAudio.coldStartV8(p) },
  { id: 'idle_2jz', name: 'Холостой ход 2JZ', category: 'engine', icon: '🔰', description: 'Ровное шелестящее бульканье рядной шестёрки', play: (p) => MegaAudio.idle2JZ(p) },
  { id: 'redline_v10', name: 'Отсечка 9000 RPM V10', category: 'engine', icon: '⚡', description: 'Рев формульного мотора S85 с долбёжкой в отсечку', play: (p) => MegaAudio.redlineV10(p) },
  { id: 'exhaust_pops', name: 'Попкорн / Отстрелы выхлопа', category: 'engine', icon: '💥', description: 'Каскад громких отстрелов несгоревшего топлива', play: (p) => MegaAudio.exhaustPops(p) },
  { id: 'launch_control', name: 'Лаунч-контроль 2-Step', category: 'engine', icon: '🚀', description: 'Серия выстрелов на старте 4000 RPM', play: (p) => MegaAudio.launchControl(p) },
  { id: 'turbo_spool', name: 'Свист турбины Garrett', category: 'engine', icon: '🌀', description: 'Нарастающий свист раскрутки крыльчатки турбины', play: (p) => MegaAudio.turboSpool(p) },
  { id: 'blowoff_stututu', name: 'Блоу-офф HKS (stututu)', category: 'engine', icon: '💨', description: 'Культовый сброс давления байпаса при переключении', play: (p) => MegaAudio.blowOffStututu(p) },
  { id: 'supercharger', name: 'Вой компрессора Hellcat', category: 'engine', icon: '🌪️', description: 'Высокочастотный вой механического нагнетателя', play: (p) => MegaAudio.superchargerWhine(p) },
  { id: 'straight_cut_gears', name: 'Кулачковая КПП (Dog-Box)', category: 'engine', icon: '⚙️', description: 'Гонка на прямозубых раллийных шестернях', play: (p) => MegaAudio.straightCutGears(p) },
  { id: 'anti_lag', name: 'Антилаг (Gunshot)', category: 'engine', icon: '🎯', description: 'Пушечный выстрел в выхлопной коллектор', play: (p) => MegaAudio.antiLagGunshot(p) },
  { id: 'diesel_clatter', name: 'Дизельный тракторный цокот', category: 'engine', icon: '🚛', description: 'Тяжёлый коммерческий дизель с турбиной', play: (p) => MegaAudio.dieselClatter(p) },
  { id: 'ev_hypercar', name: 'Варп-разгон Rimac EV', category: 'engine', icon: '🔋', description: 'Космический разгон электро-гиперкара', play: (p) => MegaAudio.evHypercarWarp(p) },
  { id: 'rotary_13b', name: 'Роторный 13B (Brap Brap)', category: 'engine', icon: '🔄', description: 'Характерное неравномерное дыхание ротора Mazda', play: (p) => MegaAudio.rotaryBrap(p) },
  { id: 'vaz_carb', name: 'Карбюратор ВАЗ-2101', category: 'engine', icon: '🚗', description: 'Классическое советское чихание с подсосом', play: (p) => MegaAudio.vazCarbSputter(p) },
  { id: 'amg_v8_bass', name: 'Бас Mercedes AMG V8', category: 'engine', icon: '👑', description: 'Глубокий суббасовый рык из боковых патрубков Гелика', play: (p) => MegaAudio.amgV8Bass(p) },
  { id: 'bugatti_w16', name: 'Гиперзвук Bugatti W16', category: 'engine', icon: '💎', description: 'Гул 8-литрового монстра с 4 турбинами на 1600 л.с.', play: (p) => MegaAudio.bugattiW16(p) },
  { id: 'downshift_blip', name: 'Перегазовка вниз (Heel-Toe)', category: 'engine', icon: '👟', description: 'Короткий резкий подгазовчик перед передачей', play: (p) => MegaAudio.downshiftBlip(p) },
  { id: 'engine_stall', name: 'Заглох на светофоре', category: 'engine', icon: '🛑', description: 'Падение оборотов и глухой металлический стук', play: (p) => MegaAudio.engineStall(p) },

  // Police & Sirens (19-30)
  { id: 'kryakalka', name: 'Крякалка ФСО («КРЯ-КРЯ»)', category: 'police', icon: '📢', description: 'Спецсигнал VIP-кортежей на Кутузовском проспекте', play: (p) => MegaAudio.kryakalka(p) },
  { id: 'federal_siren', name: 'Федеральная сирена МВД', category: 'police', icon: '🚨', description: 'Протяжный вой патрульного экипажа ДПС', play: (p) => MegaAudio.federalSiren(p) },
  { id: 'police_yelp', name: 'Скоростной визг Yelp', category: 'police', icon: '🚔', description: 'Быстрая сирена преследования нарушителя', play: (p) => MegaAudio.policeYelp(p) },
  { id: 'hi_lo_siren', name: 'Сирена Hi-Lo (Интерпол)', category: 'police', icon: '🚨', description: 'Двухтональный спецсигнал сопровождения', play: (p) => MegaAudio.hiLoSiren(p) },
  { id: 'radar_beep', name: 'Радар-Детектор «Стрелка»', category: 'police', icon: '📡', description: 'Предупреждение о камере контроля скорости на 120 км/ч', play: (p) => MegaAudio.radarBeep(p) },
  { id: 'megaphone_click', name: 'Щелчок Мегафона ДПС', category: 'police', icon: '📣', description: 'Включение рупора «Водитель, примите вправо!»', play: (p) => MegaAudio.megaphoneClick(p) },
  { id: 'radio_squelch', name: 'Шумоподавитель рации ГИБДД', category: 'police', icon: '📻', description: 'Эфир оперативного дежурного по городу', play: (p) => MegaAudio.radioSquelch(p) },
  { id: 'inspector_whistle', name: 'Свисток инспектора ДПС', category: 'police', icon: '👮', description: 'Требование об остановке жезлом на обочине', play: (p) => MegaAudio.inspectorWhistle(p) },
  { id: 'tactical_alert', name: 'Сигнал «План Перехват»', category: 'police', icon: '⚠️', description: 'Экстренное оповещение по всем постам', play: (p) => MegaAudio.tacticalAlert(p) },
  { id: 'fine_penalty', name: 'Штраф за тонировку 500 ₽', category: 'police', icon: '🧾', description: 'Выписка протокола за 5% бункер на лобовом', play: (p) => MegaAudio.finePenalty(p) },
  { id: 'strobe_tick', name: 'Импульс стробоскопов', category: 'police', icon: '💡', description: 'Синхронная вспышка сине-красных балок на крыше', play: (p) => MegaAudio.strobeTick(p) },
  { id: 'fsb_clearance', name: 'Зелёная улица ФСБ', category: 'police', icon: '🛡️', description: 'Привилегированный допуск без досмотра', play: (p) => MegaAudio.fsbClearance(p) },

  // Casino & Jackpots (31-46)
  { id: 'jackpot_brass', name: 'Золотые фанфары джекпота', category: 'casino', icon: '🎺', description: 'Мажорный гимн победителя при выпадении 777', play: (p) => MegaAudio.jackpotBrass(p) },
  { id: 'coin_cascade', name: 'Каскад 100 золотых монет', category: 'casino', icon: '💰', description: 'Звон золота, падающего в металлический лоток', play: (p) => MegaAudio.coinCascade(p) },
  { id: 'crystal_ping', name: 'Магический пинг кристаллов', category: 'casino', icon: '💎', description: 'Хрустальный звон редкого донатного кристалла', play: (p) => MegaAudio.crystalPing(p) },
  { id: 'reel_tick', name: 'Щелчок барабана слота', category: 'casino', icon: '🎰', description: 'Быстрое перелистывание символов на барабане', play: (p) => MegaAudio.reelTick(p) },
  { id: 'wheel_clacker', name: 'Трещотка Колеса Фортуны', category: 'casino', icon: '🎡', description: 'Физический стрелочный кликер по секторам', play: (p) => MegaAudio.wheelClacker(p) },
  { id: 'heartbeat_thud', name: 'Саспенс / Пульс перед дропом', category: 'casino', icon: '💓', description: 'Сердцебиение перед открытием легендарного кейса', play: (p) => MegaAudio.heartbeatThud(p) },
  { id: 'drumroll', name: 'Дробь барабана интриги', category: 'casino', icon: '🥁', description: 'Нарастающая дробь перед финальной остановкой', play: (p) => MegaAudio.drumroll(p) },
  { id: 'major_win', name: 'Победный мажорный аккорд', category: 'casino', icon: '✨', description: 'Торжественный аккорд при продаже за миллионы', play: (p) => MegaAudio.majorWinChord(p) },
  { id: 'firework_pop', name: 'Праздничный салют', category: 'casino', icon: '🎆', description: 'Хлопок ракеты салюта и рассыпчатые искры', play: (p) => MegaAudio.fireworkPop(p) },
  { id: 'legendary_shimmer', name: 'Сияние легендарного лута', category: 'casino', icon: '🌟', description: 'Звук выпадения знака категории GODLIKE', play: (p) => MegaAudio.legendaryShimmer(p) },
  { id: 'fail_buzzer', name: 'Грустный зуммер проигрыша', category: 'casino', icon: '📉', description: 'Звук слива ставки на дрэг-рейсинге', play: (p) => MegaAudio.failBuzzer(p) },
  { id: 'multiplier_booster', name: 'Множитель бонуса x2 / x5', category: 'casino', icon: '🔥', description: 'Стремительный свист бустера дохода', play: (p) => MegaAudio.multiplierBooster(p) },
  { id: 'cash_register', name: 'Кассовый аппарат «Ка-чинг»', category: 'casino', icon: '💵', description: 'Механический звонок успешной продажи номера', play: (p) => MegaAudio.cashRegister(p) },
  { id: 'bill_counting', name: 'Шелест пачки купюр', category: 'casino', icon: '💴', description: 'Пересчёт наличных рублей в кассе перекупа', play: (p) => MegaAudio.billCounting(p) },
  { id: 'safe_unlocking', name: 'Открытие бронированного сейфа', category: 'casino', icon: '🗄️', description: 'Серия щелчков шифрового диска и ригелей', play: (p) => MegaAudio.safeUnlocking(p) },
  { id: 'level_up', name: 'Повышение уровня игрока', category: 'casino', icon: '⭐', description: 'Восходящий колокольный перезвон нового ранга', play: (p) => MegaAudio.levelUpChime(p) },

  // Plate Factory (47-60)
  { id: 'hydraulic_stamp', name: 'Гидравлический пресс 50т', category: 'factory', icon: '🔨', description: 'Тяжёлый удар пресса по алюминиевой заготовке', play: (p) => MegaAudio.hydraulicStamp(p) },
  { id: 'sheet_guillotine', name: 'Гильотина для металла', category: 'factory', icon: '✂️', description: 'Отрезка пластины под размер ГОСТ 505x112 мм', play: (p) => MegaAudio.sheetGuillotine(p) },
  { id: 'laser_engraving', name: 'Лазерная гравировка RUS', category: 'factory', icon: '⚡', description: 'Выжигание защитной голограммы лазером', play: (p) => MegaAudio.laserEngraving(p) },
  { id: 'torque_ratchet', name: 'Трещотка для номерных болтов', category: 'factory', icon: '🔧', description: 'Затяжка антивандальных болтов с секреткой', play: (p) => MegaAudio.torqueRatchet(p) },
  { id: 'plate_drop', name: 'Падение номера на верстак', category: 'factory', icon: '📋', description: 'Звонкий металлический стук готового знака', play: (p) => MegaAudio.plateDropClatter(p) },
  { id: 'foil_peel', name: 'Снятие термоплёнки', category: 'factory', icon: '🎞️', description: 'Отслаивание защитной плёнки с чёрных букв', play: (p) => MegaAudio.foilPeel(p) },
  { id: 'inspection_beep', name: 'Сканер штрих-кода ГОСТ', category: 'factory', icon: '📟', description: 'Успешная регистрация в базе ГИБДД', play: (p) => MegaAudio.inspectionBeep(p) },
  { id: 'counterfeit_reject', name: 'Сигнал брака / Фальшивка', category: 'factory', icon: '❌', description: 'Отказ штампа при несоответствии стандарту', play: (p) => MegaAudio.counterfeitReject(p) },
  { id: 'frame_snap', name: 'Защёлкивание рамки ФСБ', category: 'factory', icon: '🛡️', description: 'Глухой тугой щелчок клипс в бампер', play: (p) => MegaAudio.frameSnap(p) },
  { id: 'buffing_polish', name: 'Полировка карбоновой рамки', category: 'factory', icon: '✨', description: 'Алмазная паста и полировальный круг', play: (p) => MegaAudio.buffingPolish(p) },
  { id: 'arc_welding', name: 'Сварка каркаса автовоза', category: 'factory', icon: '💥', description: 'Треск электрической дуги в гараже', play: (p) => MegaAudio.arcWelding(p) },
  { id: 'heat_relief', name: 'Термотиснение цифр', category: 'factory', icon: '♨️', description: 'Горячая прессовка рельефа с выпуклыми гранями', play: (p) => MegaAudio.heatRelief(p) },
  { id: 'magnet_clasp', name: 'Магнитная рамка-перевёртыш', category: 'factory', icon: '🧲', description: 'Срабатывание неодимового магнита фиксации', play: (p) => MegaAudio.magnetClasp(p) },
  { id: 'qc_approval', name: 'ОТК ГОСТ: Знак одобрен', category: 'factory', icon: '✅', description: 'Финальный динг штампа контролёра качества', play: (p) => MegaAudio.qcApproval(p) },

  // UI & Haptics (61-76)
  { id: 'soft_pop', name: 'Мягкий Haptic-поп', category: 'ui', icon: '👆', description: 'Мягкий вибро-клик по сенсорному экрану', play: (p) => MegaAudio.softPop(p) },
  { id: 'glass_tap', name: 'Стеклянный тап', category: 'ui', icon: '🧊', description: 'Премиальный отклик по стеклянной панели', play: (p) => MegaAudio.glassTap(p) },
  { id: 'future_woosh', name: 'Свайп экрана Woosh', category: 'ui', icon: '🌪️', description: 'Быстрое переключение экранов и вкладок', play: (p) => MegaAudio.futureWoosh(p) },
  { id: 'modal_pop', name: 'Открытие модального окна', category: 'ui', icon: '🪟', description: 'Пружинное всплытие карточки на передний план', play: (p) => MegaAudio.modalPop(p) },
  { id: 'toggle_clack', name: 'Переключатель тумблера', category: 'ui', icon: '🎚️', description: 'Чёткий щелчок ползунка ВКЛ / ВЫКЛ', play: (p) => MegaAudio.toggleClack(p) },
  { id: 'card_beep', name: 'NFC оплата картой', category: 'ui', icon: '💳', description: 'Пик бесконтактного терминала покупки авто', play: (p) => MegaAudio.cardBeep(p) },
  { id: 'error_buzz', name: 'Ошибка операции', category: 'ui', icon: '⚠️', description: 'Зуммер недостатка рублей на балансе', play: (p) => MegaAudio.errorBuzz(p) },
  { id: 'tab_click', name: 'Клик вкладки навигации', category: 'ui', icon: '📑', description: 'Мгновенный отклик кнопок нижнего дока', play: (p) => MegaAudio.tabClick(p) },
  { id: 'trophy_fanfare', name: 'Достижение разблокировано', category: 'ui', icon: '🏆', description: 'Мини-фанфары при выполнении ежедневного квеста', play: (p) => MegaAudio.trophyFanfare(p) },
  { id: 'energy_charge', name: 'Восполнение энергии', category: 'ui', icon: '⚡', description: 'Энергетический свист восстановления 50/50', play: (p) => MegaAudio.energyCharge(p) },
  { id: 'trash_shredder', name: 'Утилизация знаков в лом', category: 'ui', icon: '🗑️', description: 'Быстрая сдача обычных номеров перекупщику', play: (p) => MegaAudio.trashShredder(p) },
  { id: 'neon_hum', name: 'Неоновый гул 500 МБ', category: 'ui', icon: '💡', description: 'Гул трансформатора неоновой подсветки автосалона', play: (p) => MegaAudio.neonHum(p) },
  { id: 'rebirth_ascend', name: 'Корона Перерождения', category: 'ui', icon: '👑', description: 'Космический восходящий аккорд престижа', play: (p) => MegaAudio.rebirthAscend(p) },
  { id: 'hover_pip', name: 'Наведение курсора Pip', category: 'ui', icon: '🎯', description: 'Ультракороткий отклик при наведении на кнопки', play: (p) => MegaAudio.hoverPip(p) },
  { id: 'notify_ping', name: 'Уведомление о пассивном доходе', category: 'ui', icon: '🔔', description: 'Звоночек начисления прибыли с автопарка', play: (p) => MegaAudio.notifyPing(p) },
  { id: 'cyber_glitch', name: 'Кибернетический глитч-скан', category: 'ui', icon: '👾', description: 'Цифровой глитч при расчёте секретного кода судьбы', play: (p) => MegaAudio.cyberGlitch(p) },

  // Vehicle & Mechanical (77-95)
  { id: 'gelik_door', name: 'Оружейный хлопок двери Гелика', category: 'vehicle', icon: '🚪', description: 'Знаменитый замок Mercedes G63 с оружейным щелчком', play: (p) => MegaAudio.gelikDoorSlam(p) },
  { id: 'vaz_door', name: 'Звонкий лязг двери Жигулей', category: 'vehicle', icon: '🚪', description: 'Советская классика: чтобы закрыть, нужно хлопнуть', play: (p) => MegaAudio.vazDoorSlam(p) },
  { id: 'keyfob_lock', name: 'Пик брелока сигнализации', category: 'vehicle', icon: '🚨', description: 'Двойной чип StarLine при закрытии центрального замка', play: (p) => MegaAudio.keyfobLock(p) },
  { id: 'tire_screech', name: 'Визг покрышек в дрифте', category: 'vehicle', icon: '🏎️', description: 'Горящая резина Toyo R888 на мокром асфальте', play: (p) => MegaAudio.tireScreech(p) },
  { id: 'air_suspension', name: 'Сброс пневмы (БПАН в пол)', category: 'vehicle', icon: '💨', description: 'Падение кузова Приоры прямо на асфальт', play: (p) => MegaAudio.airSuspensionDump(p) },
  { id: 'handbrake', name: 'Ручник на 7 щелчков', category: 'vehicle', icon: '🅿️', description: 'Постановка в занос с дёрганием ручного тормоза', play: (p) => MegaAudio.handbrakeRatchet(p) },
  { id: 'turn_signal', name: 'Реле поворотников (Тик-Так)', category: 'vehicle', icon: '⬅️', description: 'Успокаивающее щёлканье реле аварийки', play: (p) => MegaAudio.turnSignalRelay(p) },
  { id: 'volga_horn', name: 'Басовый клаксон ГАЗ-24 «Волга»', category: 'vehicle', icon: '📯', description: 'Густой авторитетный сигнал правительственной Волги', play: (p) => MegaAudio.volgaHorn(p) },
  { id: 'train_horn', name: 'Пневмотифон тепловоза', category: 'vehicle', icon: '🚂', description: 'Оглушительный воздушный рожок 150 дБ на пикапе', play: (p) => MegaAudio.trainAirHorn(p) },
  { id: 'wiper_squeak', name: 'Скрип сухих дворников', category: 'vehicle', icon: '🌧️', description: 'Резинка щётки трёт по пыльному лобовому стеклу', play: (p) => MegaAudio.wiperSqueak(p) },
  { id: 'abs_pulse', name: 'Дрожь педали ABS в пол', category: 'vehicle', icon: '🛑', description: 'Стрекотание гидроблока при экстренном торможении', play: (p) => MegaAudio.absPulse(p) },
  { id: 'hood_slam', name: 'Тяжёлый хлопок капота', category: 'vehicle', icon: '🚘', description: 'Закрытие моторного отсека после установки Stage 2', play: (p) => MegaAudio.hoodSlam(p) },
  { id: 'gas_cap', name: 'Трещотка пробки бензобака', category: 'vehicle', icon: '⛽', description: 'Закручивание крышки бака до трёх щелчков', play: (p) => MegaAudio.gasCapClick(p) },
  { id: 'fuel_gurgle', name: 'Бульканье бензина АИ-100', category: 'vehicle', icon: '🛢️', description: 'Заправка полного бака спортивного топлива', play: (p) => MegaAudio.fuelGurgle(p) },
  { id: 'bpan_scrape', name: 'Скрежет днищем по «лежачему»', category: 'vehicle', icon: '💥', description: 'Искры из-под защиты картера заниженного авто', play: (p) => MegaAudio.bpanScrape(p) },
  { id: 'rumble_strip', name: 'Шумовая разметка трассы', category: 'vehicle', icon: '🛣️', description: 'Дрожание руля при наезде на осевую полосу М-11', play: (p) => MegaAudio.rumbleStrip(p) },
  { id: 'reverse_beep', name: 'Зуммер заднего хода грузовика', category: 'vehicle', icon: '🔙', description: 'Предупреждающий писк при подаче автовоза задом', play: (p) => MegaAudio.reverseBackupBeep(p) },
  { id: 'gravel_kickup', name: 'Стук гравия по колёсным аркам', category: 'vehicle', icon: '🪨', description: 'Камушки барабанят по днищу на просёлочной дороге', play: (p) => MegaAudio.gravelKickup(p) },
  { id: 'thunder_rumble', name: 'Раскат грома ночной трассы', category: 'vehicle', icon: '⚡', description: 'Далекий мощный громовой раскат в летнюю грозу', play: (p) => MegaAudio.thunderRumble(p) },

  // Procedural Radio Stations (96-105)
  { id: 'radio_phonk', name: 'Радио: Ночной Дрифт Фонк (808 Bass)', category: 'radio', icon: '📻', description: 'Агрессивный ночной синдикат-фонк с колокольчиками', play: () => MegaAudio.playRadioTrack('phonk') },
  { id: 'radio_eurobeat', name: 'Радио: Eurobeat МКАД 200 км/ч', category: 'radio', icon: '🏁', description: 'Быстрый японский дрифт-синт в стиле Initial D', play: () => MegaAudio.playRadioTrack('eurobeat') },
  { id: 'radio_lofi', name: 'Радио: Гаражный Lo-Fi Chill', category: 'radio', icon: '☕', description: 'Расслабляющий винтажный джаз-хоп для тюнинга', play: () => MegaAudio.playRadioTrack('lofi') },
  { id: 'radio_cyberpunk', name: 'Радио: Киберпанк Неон 2077', category: 'radio', icon: '🌆', description: 'Синтезаторный синтвейв ночного неонового мегаполиса', play: () => MegaAudio.playRadioTrack('cyberpunk') },
  { id: 'radio_retrowave', name: 'Радио: Ретровейв 1986', category: 'radio', icon: '📼', description: 'Аналоговые синты, кассетный звук и закатное солнце', play: () => MegaAudio.playRadioTrack('retrowave') },
  { id: 'radio_nightdrive', name: 'Радио: Ночной Перехват', category: 'radio', icon: '🌃', description: 'Атмосферный глубокий бас для поездок по ночному шоссе', play: () => MegaAudio.playRadioTrack('nightdrive') },
  { id: 'radio_syndicate', name: 'Радио: Синдикат Трэп Биты', category: 'radio', icon: '👑', description: 'Плотный авторитетный трэп-бит с быстрыми хэтами', play: () => MegaAudio.playRadioTrack('syndicate') },
  { id: 'radio_shanson', name: 'Радио: Дорожное Авторадио', category: 'radio', icon: '🪗', description: 'Душевная гитарная дорожная мелодия дальнобойщиков', play: () => MegaAudio.playRadioTrack('shanson') },
  { id: 'radio_ambient', name: 'Радио: Студийный Шоурум Лаунж', category: 'radio', icon: '🛋️', description: 'Глубокий эмбиент автосалона суперкаров', play: () => MegaAudio.playRadioTrack('ambient') },
  { id: 'radio_stop', name: 'Выключить Радиоприёмник', category: 'radio', icon: '⏹️', description: 'Остановить воспроизведение музыки в игре', play: () => MegaAudio.stopRadio() },
];
