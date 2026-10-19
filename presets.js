/**
 * Genesis - Species Physical Definitions & Emergent Presets
 * 
 * Physical Properties:
 * - mass: determines inertia (F = ma) and momentum exchange during collisions
 * - coreRadius: hard steric Pauli-exclusion boundary
 * - renderSize: WebGL point sprite visual diameter
 */

const SPECIES = [
  {
    id: 0,
    name: 'Crimson',
    color: '#ff3366',
    glow: 'rgba(255, 51, 102, 0.7)',
    rgb: [255, 51, 102],
    mass: 1.5,
    coreRadius: 3.2,
    renderSize: 6.0,
    role: 'Apex Predator / Heavy Core'
  },
  {
    id: 1,
    name: 'Emerald',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.7)',
    rgb: [16, 185, 129],
    mass: 0.9,
    coreRadius: 2.5,
    renderSize: 5.0,
    role: 'Producer / Autotroph'
  },
  {
    id: 2,
    name: 'Cyan',
    color: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.7)',
    rgb: [0, 240, 255],
    mass: 1.0,
    coreRadius: 2.6,
    renderSize: 5.2,
    role: 'Motile Herbivore / Swarmer'
  },
  {
    id: 3,
    name: 'Amber',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.7)',
    rgb: [245, 158, 11],
    mass: 1.2,
    coreRadius: 2.8,
    renderSize: 5.4,
    role: 'Lipid / Membrane Structural'
  },
  {
    id: 4,
    name: 'Violet',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.7)',
    rgb: [168, 85, 247],
    mass: 0.8,
    coreRadius: 2.3,
    renderSize: 4.8,
    role: 'Vesicle / Elastic Linker'
  },
  {
    id: 5,
    name: 'Pearl',
    color: '#f8fafc',
    glow: 'rgba(248, 250, 252, 0.7)',
    rgb: [248, 250, 252],
    mass: 2.2,
    coreRadius: 3.6,
    renderSize: 6.8,
    role: 'Catalyst / Dense Nucleus'
  }
];

const PRESETS = [
  {
    name: 'Mitosis & Proto-Cells',
    desc: 'Self-assembling bilayer membranes with dense nuclei',
    radius: 92,
    force: 1.15,
    friction: 0.12,
    temperature: 0.12,
    matrix: [
      // Crimson, Emerald, Cyan,  Amber, Violet, Pearl
      [ 0.65,   -0.45,   0.25, -0.70,  0.15,  -0.25], // Crimson
      [-0.35,    0.80,  -0.55,  0.35, -0.25,   0.45], // Emerald
      [ 0.35,   -0.25,   0.85, -0.65,  0.45,  -0.15], // Cyan
      [-0.55,    0.45,  -0.35,  0.70, -0.45,   0.35], // Amber
      [ 0.25,   -0.55,   0.35, -0.25,  0.75,  -0.65], // Violet
      [-0.15,    0.35,  -0.45,  0.55, -0.35,   0.90]  // Pearl
    ]
  },
  {
    name: 'Trophic Web (Predator/Prey)',
    desc: 'Realistic metabolic hunting loops & evasive fluid dynamics',
    radius: 85,
    force: 1.35,
    friction: 0.10,
    temperature: 0.22,
    matrix: [
      // Crimson, Emerald, Cyan,  Amber, Violet, Pearl
      [ 0.15,    0.85,  -0.75,  0.00,  0.00,  -0.35],
      [-0.85,    0.15,   0.85, -0.55,  0.00,   0.00],
      [ 0.00,   -0.85,   0.15,  0.85, -0.45,   0.00],
      [ 0.00,    0.00,  -0.85,  0.15,  0.85,  -0.25],
      [-0.65,    0.00,   0.00, -0.85,  0.15,   0.85],
      [ 0.85,   -0.35,   0.00,  0.00, -0.85,   0.15]
    ]
  },
  {
    name: 'Serpents & Biopolymers',
    desc: 'Articulated undulating chains with spring cohesion',
    radius: 72,
    force: 1.25,
    friction: 0.15,
    temperature: 0.10,
    matrix: [
      [ 0.40,  0.60, -0.45, -0.25,  0.15, -0.35],
      [-0.55,  0.45,  0.65, -0.35, -0.15,  0.25],
      [ 0.25, -0.60,  0.50,  0.70, -0.25, -0.15],
      [-0.35,  0.15, -0.65,  0.55,  0.75, -0.45],
      [ 0.70, -0.35,  0.15, -0.60,  0.40,  0.65],
      [-0.25,  0.55, -0.35,  0.25, -0.70,  0.45]
    ]
  },
  {
    name: 'Cosmic Stellar Nursery',
    desc: 'Galactic spirals, gravitational accretion, and orbital resonance',
    radius: 115,
    force: 0.85,
    friction: 0.07,
    temperature: 0.28,
    matrix: [
      [ 0.55,  0.35,  0.25, -0.15,  0.45,  0.15],
      [ 0.35,  0.65, -0.25,  0.35,  0.15,  0.45],
      [ 0.25, -0.25,  0.75,  0.25, -0.35,  0.35],
      [-0.15,  0.35,  0.25,  0.55,  0.45, -0.25],
      [ 0.45,  0.15, -0.35,  0.45,  0.70,  0.25],
      [ 0.15,  0.45,  0.35, -0.25,  0.25,  0.60]
    ]
  },
  {
    name: 'Solid-State Crystal',
    desc: 'Hexagonal close-packed lattice with elastic vibrational modes',
    radius: 68,
    force: 1.10,
    friction: 0.22,
    temperature: 0.04, // Ultra-low temperature allows stable crystal formation
    matrix: [
      [ 0.85, -0.75,  0.25, -0.55,  0.35, -0.65],
      [-0.75,  0.85, -0.65,  0.35, -0.45,  0.55],
      [ 0.25, -0.65,  0.85, -0.75,  0.45, -0.35],
      [-0.55,  0.35, -0.75,  0.85, -0.65,  0.45],
      [ 0.35, -0.45,  0.45, -0.65,  0.85, -0.55],
      [-0.65,  0.55, -0.35,  0.45, -0.55,  0.85]
    ]
  },
  {
    name: 'Primordial Hydrothermal Vents',
    desc: 'Thermal energy boiling, high-entropy emergence, and catalysis',
    radius: 88,
    force: 1.05,
    friction: 0.12,
    temperature: 0.35,
    matrix: [
      [ 0.30, -0.40,  0.50, -0.20,  0.35, -0.55],
      [ 0.45,  0.25, -0.35,  0.55, -0.25,  0.15],
      [-0.50,  0.40,  0.20, -0.30,  0.65, -0.25],
      [ 0.15, -0.45,  0.35,  0.45, -0.55,  0.40],
      [-0.35,  0.30, -0.55,  0.40,  0.25,  0.45],
      [ 0.55, -0.25,  0.40, -0.35,  0.45,  0.20]
    ]
  }
];

function generateRandomMatrix(speciesCount = 6) {
  const matrix = [];
  for (let i = 0; i < speciesCount; i++) {
    const row = [];
    for (let j = 0; j < speciesCount; j++) {
      let val = (Math.random() * 2 - 1);
      val = Math.round(val * 100) / 100;
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
}
