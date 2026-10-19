/**
 * Genesis - High Performance Particle Life Engine
 * Features:
 * - Spatial grid partitioning O(N) neighbor query
 * - Smooth continuous force response curves
 * - Toroidal non-Euclidean boundary wrapping
 * - Typed arrays / optimized particle representation
 */

class ParticleLifeEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = canvas.width;
    this.height = canvas.height;

    // Simulation params
    this.particleCount = 2000;
    this.radius = 80;
    this.forceStrength = 1.0;
    this.friction = 0.15;
    this.trailPersistence = 0.25;
    this.beta = 0.3; // Repulsion inflection point ratio
    this.maxSpeed = 12.0;

    // Matrix (6x6)
    this.matrix = PRESETS[0].matrix;

    // Particles Data
    // Stored in flat arrays or object arrays for speed
    this.x = new Float32Array(4000);
    this.y = new Float32Array(4000);
    this.vx = new Float32Array(4000);
    this.vy = new Float32Array(4000);
    this.species = new Uint8Array(4000);

    // Spatial partitioning grid
    this.gridCellSize = this.radius;
    this.gridCols = 0;
    this.gridRows = 0;
    this.grid = []; // Array of arrays containing particle indices

    // Stats
    this.kineticEnergy = 0;
    this.actualFps = 60;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsUpdateTime = performance.now();

    // Mouse Interaction
    this.mouse = {
      x: 0,
      y: 0,
      down: false,
      tool: 'attract',
      radius: 200
    };

    this.initGrid();
    this.spawnParticles();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.initGrid();
  }

  initGrid() {
    this.gridCellSize = Math.max(this.radius, 40);
    this.gridCols = Math.ceil(this.width / this.gridCellSize);
    this.gridRows = Math.ceil(this.height / this.gridCellSize);
    const totalCells = this.gridCols * this.gridRows;
    
    this.grid = new Array(totalCells);
    for (let i = 0; i < totalCells; i++) {
      this.grid[i] = [];
    }
  }

  spawnParticles(count = this.particleCount) {
    this.particleCount = Math.min(count, 4000);
    const numSpecies = SPECIES.length;

    for (let i = 0; i < this.particleCount; i++) {
      this.x[i] = Math.random() * this.width;
      this.y[i] = Math.random() * this.height;
      this.vx[i] = (Math.random() - 0.5) * 2;
      this.vy[i] = (Math.random() - 0.5) * 2;
      this.species[i] = Math.floor(Math.random() * numSpecies);
    }
  }

  addParticlesAt(x, y, count = 20, speciesId = null) {
    if (this.particleCount + count > 4000) return;
    const startIndex = this.particleCount;
    this.particleCount += count;

    for (let i = startIndex; i < this.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30;
      this.x[i] = (x + Math.cos(angle) * dist + this.width) % this.width;
      this.y[i] = (y + Math.sin(angle) * dist + this.height) % this.height;
      this.vx[i] = Math.cos(angle) * (1 + Math.random() * 4);
      this.vy[i] = Math.sin(angle) * (1 + Math.random() * 4);
      this.species[i] = speciesId !== null ? speciesId : Math.floor(Math.random() * SPECIES.length);
    }
  }

  updateGrid() {
    const totalCells = this.gridCols * this.gridRows;
    for (let c = 0; c < totalCells; c++) {
      this.grid[c].length = 0;
    }

    const cs = this.gridCellSize;
    const cols = this.gridCols;
    const rows = this.gridRows;

    for (let i = 0; i < this.particleCount; i++) {
      let cx = Math.floor(this.x[i] / cs);
      let cy = Math.floor(this.y[i] / cs);
      if (cx < 0) cx = 0; else if (cx >= cols) cx = cols - 1;
      if (cy < 0) cy = 0; else if (cy >= rows) cy = rows - 1;
      
      const cellIdx = cy * cols + cx;
      this.grid[cellIdx].push(i);
    }
  }

  step(dt = 1.0) {
    this.updateGrid();

    const w = this.width;
    const h = this.height;
    const halfW = w * 0.5;
    const halfH = h * 0.5;
    const rMax = this.radius;
    const rMaxSq = rMax * rMax;
    const beta = this.beta;
    const betaR = beta * rMax;
    const forceScale = this.forceStrength * 0.45;
    const cs = this.gridCellSize;
    const cols = this.gridCols;
    const rows = this.gridRows;

    let totalKinetic = 0;

    // Apply forces for each particle
    for (let i = 0; i < this.particleCount; i++) {
      const px = this.x[i];
      const py = this.y[i];
      const sp1 = this.species[i];
      const rowMatrix = this.matrix[sp1];

      let fx = 0;
      let fy = 0;

      // Find cell coords
      const cx = Math.floor(px / cs);
      const cy = Math.floor(py / cs);

      // Inspect 3x3 neighboring cells with toroidal wrapping
      for (let ox = -1; ox <= 1; ox++) {
        let ncx = (cx + ox + cols) % cols;
        for (let oy = -1; oy <= 1; oy++) {
          let ncy = (cy + oy + rows) % rows;
          const cell = this.grid[ncy * cols + ncx];

          for (let k = 0; k < cell.length; k++) {
            const j = cell[k];
            if (i === j) continue;

            let dx = this.x[j] - px;
            let dy = this.y[j] - py;

            // Toroidal minimum distance
            if (dx > halfW) dx -= w;
            else if (dx < -halfW) dx += w;
            if (dy > halfH) dy -= h;
            else if (dy < -halfH) dy += h;

            const distSq = dx * dx + dy * dy;
            if (distSq > 0 && distSq < rMaxSq) {
              const r = Math.sqrt(distSq);
              let forceMag = 0;

              if (r < betaR) {
                // Short-range repulsive buffer (prevents collapse)
                forceMag = (r / betaR) - 1.0;
              } else {
                // Interaction zone mediated by matrix coefficient
                const sp2 = this.species[j];
                const attraction = rowMatrix[sp2];
                // Smooth triangular peak centered at (1 + beta) * 0.5 * rMax
                const mid = (1.0 + beta) * 0.5 * rMax;
                const halfWidth = (1.0 - beta) * 0.5 * rMax;
                forceMag = attraction * (1.0 - Math.abs(r - mid) / halfWidth);
              }

              const scaled = (forceMag * forceScale) / r;
              fx += dx * scaled;
              fy += dy * scaled;
            }
          }
        }
      }

      // Mouse interactive force
      if (this.mouse.down) {
        let mdx = this.mouse.x - px;
        let mdy = this.mouse.y - py;
        if (mdx > halfW) mdx -= w; else if (mdx < -halfW) mdx += w;
        if (mdy > halfH) mdy -= h; else if (mdy < -halfH) mdy += h;

        const mDistSq = mdx * mdx + mdy * mdy;
        const mRadiusSq = this.mouse.radius * this.mouse.radius;

        if (mDistSq < mRadiusSq && mDistSq > 1) {
          const mDist = Math.sqrt(mDistSq);
          const mFactor = (1.0 - mDist / this.mouse.radius) * 2.5;

          if (this.mouse.tool === 'attract') {
            fx += (mdx / mDist) * mFactor;
            fy += (mdy / mDist) * mFactor;
          } else if (this.mouse.tool === 'repel') {
            fx -= (mdx / mDist) * mFactor * 2.0;
            fy -= (mdy / mDist) * mFactor * 2.0;
          } else if (this.mouse.tool === 'vortex') {
            // Tangential rotational force
            fx += (-mdy / mDist) * mFactor * 2.0;
            fy += (mdx / mDist) * mFactor * 2.0;
          }
        }
      }

      // Update velocity with friction
      let nvx = (this.vx[i] + fx * dt) * (1.0 - this.friction);
      let nvy = (this.vy[i] + fy * dt) * (1.0 - this.friction);

      // Clamp speed
      const speed = Math.sqrt(nvx * nvx + nvy * nvy);
      if (speed > this.maxSpeed) {
        const factor = this.maxSpeed / speed;
        nvx *= factor;
        nvy *= factor;
      }

      this.vx[i] = nvx;
      this.vy[i] = nvy;

      totalKinetic += speed * speed;

      // Update position with toroidal wrap
      let nx = px + nvx * dt;
      let ny = py + nvy * dt;

      if (nx < 0) nx += w; else if (nx >= w) nx -= w;
      if (ny < 0) ny += h; else if (ny >= h) ny -= h;

      this.x[i] = nx;
      this.y[i] = ny;
    }

    this.kineticEnergy = totalKinetic / this.particleCount;

    // Track FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.fpsUpdateTime > 500) {
      this.actualFps = Math.round((this.frameCount * 1000) / (now - this.fpsUpdateTime));
      this.frameCount = 0;
      this.fpsUpdateTime = now;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Semi-transparent fade to generate luminous phosphor trails
    const fadeAlpha = 1.0 - this.trailPersistence;
    ctx.fillStyle = `rgba(7, 9, 14, ${fadeAlpha})`;
    ctx.fillRect(0, 0, w, h);

    // Additive blending for organic bioluminescence
    ctx.globalCompositeOperation = 'lighter';

    const numSpecies = SPECIES.length;
    // Batch render by species to minimize context state changes
    for (let s = 0; s < numSpecies; s++) {
      const sp = SPECIES[s];
      ctx.fillStyle = sp.color;
      ctx.beginPath();

      for (let i = 0; i < this.particleCount; i++) {
        if (this.species[i] === s) {
          const px = this.x[i];
          const py = this.y[i];
          ctx.moveTo(px + 2, py);
          ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }

    // Render mouse reticle when active
    if (this.mouse.down) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = this.mouse.tool === 'repel' ? 'rgba(255, 51, 102, 0.4)' : 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.globalCompositeOperation = 'source-over';
  }
}
