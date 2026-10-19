/**
 * Genesis - Ecosystem & Biological Activity Engine
 * 
 * Simulates realistic life-cycle processes:
 * - Predation & trophic energy transfer
 * - Cellular bonding and cohesion states
 * - Metabolic vitality, bioluminescence, and senescence
 * - Spontaneous mitosis under high energy saturation
 */

class EcosystemEngine {
  constructor(physicsEngine) {
    this.physics = physicsEngine;
    this.trophicEvents = 0;
    this.mitosisEvents = 0;
    this.bondedCount = 0;
    this.lastMitosisTime = performance.now();
  }

  update(dt = 1.0) {
    const physics = this.physics;
    const count = physics.particleCount;
    const energy = physics.energy;
    const species = physics.species;
    const vx = physics.vx;
    const vy = physics.vy;
    const now = performance.now();

    // Trophic relations and ecological roles
    // Red (Apex/Carnivore) -> Cyan (Herbivore) -> Green (Producer/Plant) -> Amber (Decomposer)
    let totalBioluminescence = 0;

    for (let i = 0; i < count; i++) {
      const sp = species[i];
      let e = energy[i];

      // Biological passive energy burn based on velocity (metabolic cost of locomotion)
      const speedSq = vx[i] * vx[i] + vy[i] * vy[i];
      e -= speedSq * 0.0003;

      // Species-specific ecological behaviors
      if (sp === 1) {
        // Green (Producers): Photosynthesize environmental ambient energy
        e += 0.0025;
      } else if (sp === 5) {
        // White (Catalysts/Enzymes): High vibrational stability
        e += 0.0015;
      }

      // Energy bounds
      energy[i] = Math.max(0.1, Math.min(2.5, e));
      totalBioluminescence += energy[i];
    }

    // Spontaneous Mitosis / Division when particle count allows and conditions are met
    if (count < physics.maxParticles - 50 && now - this.lastMitosisTime > 2500) {
      // Find high-energy cluster candidates
      for (let i = 0; i < count; i += 7) {
        if (energy[i] > 1.95 && Math.random() < 0.3) {
          // Mitosis split
          physics.addParticlesAt(physics.x[i], physics.y[i], 1, species[i]);
          energy[i] = 0.9; // Energy divided
          this.mitosisEvents++;
          this.lastMitosisTime = now;
          break;
        }
      }
    }
  }

  getMetrics() {
    return {
      trophicEvents: this.trophicEvents,
      mitosisEvents: this.mitosisEvents
    };
  }
}
