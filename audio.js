/**
 * Genesis - Generative Soundscape Engine
 * Uses Web Audio API to transform kinetic energy and collective velocities
 * into an evolving ambient musical environment.
 */

class GenerativeSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.filter = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.scale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63]; // C Minor Pentatonic
    this.lastPingTime = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm Lowpass Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Drone 1 - Root Sine
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

    // Drone 2 - Detuned Sub/Fifth Triangle
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(98.00, this.ctx.currentTime); // G2

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.droneOsc1.connect(droneGain);
    this.droneOsc2.connect(droneGain);
    droneGain.connect(this.filter);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.22, this.ctx.currentTime, 0.4);
    } else {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.3);
    }

    return this.isPlaying;
  }

  update(kineticEnergy) {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    // Map kinetic energy (roughly 0 to 25) to filter cutoff (200Hz to 1600Hz)
    const targetFreq = Math.min(200 + kineticEnergy * 50, 1800);
    this.filter.frequency.setTargetAtTime(targetFreq, now, 0.2);

    // Drone frequency subtle pitch modulation
    const detune = Math.sin(now * 0.5) * 6;
    this.droneOsc1.detune.setTargetAtTime(detune, now, 0.1);

    // Trigger sporadic harmonic chime when energy spikes
    if (kineticEnergy > 4.5 && now - this.lastPingTime > 0.45 && Math.random() < 0.15) {
      this.triggerHarmonicChime(kineticEnergy);
      this.lastPingTime = now;
    }
  }

  triggerHarmonicChime(energy) {
    if (!this.ctx || !this.isPlaying) return;

    const noteIdx = Math.floor(Math.random() * this.scale.length);
    const freq = this.scale[noteIdx] * (Math.random() > 0.6 ? 2 : 1);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.3);
  }
}
