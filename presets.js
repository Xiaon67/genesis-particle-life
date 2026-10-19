/**
 * Genesis Presets & Species Definitions
 * 
 * Matrix values range from -1.0 (strong repulsion) to +1.0 (strong attraction).
 * Matrix[i][j] specifies the force exerted on species i by species j.
 */

const SPECIES = [
  { id: 0, name: 'Red', color: '#ff3366', glow: 'rgba(255, 51, 102, 0.7)', rgb: [255, 51, 102] },
  { id: 1, name: 'Green', color: '#10b981', glow: 'rgba(16, 185, 129, 0.7)', rgb: [16, 185, 129] },
  { id: 2, name: 'Cyan', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.7)', rgb: [0, 240, 255] },
  { id: 3, name: 'Amber', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)', rgb: [245, 158, 11] },
  { id: 4, name: 'Violet', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.7)', rgb: [168, 85, 247] },
  { id: 5, name: 'White', color: '#f8fafc', glow: 'rgba(248, 250, 252, 0.7)', rgb: [248, 250, 252] }
];

const PRESETS = [
  {
    name: 'Mitosis & Cells',
    desc: 'Self-assembling membranes & biological nuclei',
    radius: 90,
    force: 1.1,
    friction: 0.16,
    matrix: [
      // Red,   Green,  Cyan,   Amber,  Violet, White
      [ 0.60, -0.40,  0.20, -0.70,  0.10, -0.20], // Red
      [-0.30,  0.75, -0.50,  0.30, -0.20,  0.40], // Green
      [ 0.30, -0.20,  0.80, -0.60,  0.40, -0.10], // Cyan
      [-0.50,  0.40, -0.30,  0.65, -0.40,  0.30], // Amber
      [ 0.20, -0.50,  0.30, -0.20,  0.70, -0.60], // Violet
      [-0.10,  0.30, -0.40,  0.50, -0.30,  0.85]  // White
    ]
  },
  {
    name: 'Predator & Prey',
    desc: 'Asymmetric hunting loops & evasive swarms',
    radius: 80,
    force: 1.3,
    friction: 0.14,
    matrix: [
      // Red,   Green,  Cyan,   Amber,  Violet, White
      [ 0.10,  0.80, -0.70,  0.00,  0.00, -0.30], // Red chases Green
      [-0.80,  0.10,  0.80, -0.50,  0.00,  0.00], // Green chases Cyan, flees Red
      [ 0.00, -0.80,  0.10,  0.80, -0.40,  0.00], // Cyan chases Amber, flees Green
      [ 0.00,  0.00, -0.80,  0.10,  0.80, -0.20], // Amber chases Violet, flees Cyan
      [-0.60,  0.00,  0.00, -0.80,  0.10,  0.80], // Violet chases White, flees Amber
      [ 0.80, -0.30,  0.00,  0.00, -0.80,  0.10]  // White chases Red, flees Violet
    ]
  },
  {
    name: 'Serpents & Trains',
    desc: 'Segmented crawling organisms and filaments',
    radius: 70,
    force: 1.2,
    friction: 0.18,
    matrix: [
      // Red,   Green,  Cyan,   Amber,  Violet, White
      [ 0.35,  0.55, -0.40, -0.20,  0.10, -0.30],
      [-0.50,  0.40,  0.60, -0.30, -0.10,  0.20],
      [ 0.20, -0.55,  0.45,  0.65, -0.20, -0.10],
      [-0.30,  0.10, -0.60,  0.50,  0.70, -0.40],
      [ 0.65, -0.30,  0.10, -0.55,  0.35,  0.60],
      [-0.20,  0.50, -0.30,  0.20, -0.65,  0.40]
    ]
  },
  {
    name: 'Cosmic Nebulae',
    desc: 'Swirling galactic clusters and gravitational balance',
    radius: 110,
    force: 0.8,
    friction: 0.10,
    matrix: [
      // Red,   Green,  Cyan,   Amber,  Violet, White
      [ 0.50,  0.30,  0.20, -0.10,  0.40,  0.10],
      [ 0.30,  0.60, -0.20,  0.30,  0.10,  0.40],
      [ 0.20, -0.20,  0.70,  0.20, -0.30,  0.30],
      [-0.10,  0.30,  0.20,  0.50,  0.40, -0.20],
      [ 0.40,  0.10, -0.30,  0.40,  0.65,  0.20],
      [ 0.10,  0.40,  0.30, -0.20,  0.20,  0.55]
    ]
  },
  {
    name: 'Crystalline Lattice',
    desc: 'Stable geometric arrays with spring-like resilience',
    radius: 65,
    force: 1.0,
    friction: 0.25,
    matrix: [
      // Red,   Green,  Cyan,   Amber,  Violet, White
      [ 0.80, -0.70,  0.20, -0.50,  0.30, -0.60],
      [-0.70,  0.80, -0.60,  0.30, -0.40,  0.50],
      [ 0.20, -0.60,  0.80, -0.70,  0.40, -0.30],
      [-0.50,  0.30, -0.70,  0.80, -0.60,  0.40],
      [ 0.30, -0.40,  0.40, -0.60,  0.80, -0.50],
      [-0.60,  0.50, -0.30,  0.40, -0.50,  0.80]
    ]
  },
  {
    name: 'Primordial Soup',
    desc: 'Complex chaotic ecology with high diversity',
    radius: 85,
    force: 1.0,
    friction: 0.15,
    matrix: [
      // Red,   Green,  Cyan,   Amber,  Violet, White
      [ 0.25, -0.35,  0.45, -0.15,  0.30, -0.50],
      [ 0.40,  0.20, -0.30,  0.50, -0.20,  0.10],
      [-0.45,  0.35,  0.15, -0.25,  0.60, -0.20],
      [ 0.10, -0.40,  0.30,  0.40, -0.50,  0.35],
      [-0.30,  0.25, -0.50,  0.35,  0.20,  0.40],
      [ 0.50, -0.20,  0.35, -0.30,  0.40,  0.15]
    ]
  }
];

function generateRandomMatrix(speciesCount = 6) {
  const matrix = [];
  for (let i = 0; i < speciesCount; i++) {
    const row = [];
    for (let j = 0; j < speciesCount; j++) {
      // Bias slightly towards non-zero for active dynamics
      let val = (Math.random() * 2 - 1);
      // Round to 2 decimal places
      val = Math.round(val * 100) / 100;
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
}
