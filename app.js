/**
 * Genesis - Main Application Controller
 * Handles UI bindings, matrix visualizer, lifecycle loop, and user gestures.
 */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('sim-canvas');
  const engine = new ParticleLifeEngine(canvas);
  const soundscape = new GenerativeSoundscape();

  let isPaused = false;
  let activePresetIndex = 0;

  // Resize Handling
  function updateDimensions() {
    engine.resize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', updateDimensions);
  updateDimensions();

  // Elements
  const statFps = document.getElementById('stat-fps');
  const statCount = document.getElementById('stat-count');
  const statEnergy = document.getElementById('stat-energy');
  const btnAudio = document.getElementById('btn-audio');
  const btnToggleUi = document.getElementById('btn-toggle-ui');
  const controlsPanel = document.getElementById('controls-panel');
  const presetsGrid = document.getElementById('presets-grid');
  const matrixContainer = document.getElementById('matrix-container');

  const btnPause = document.getElementById('btn-pause');
  const pauseText = document.getElementById('pause-text');
  const btnReset = document.getElementById('btn-reset');
  const btnCapture = document.getElementById('btn-capture');
  const btnRandomMatrix = document.getElementById('btn-random-matrix');
  const btnMutate = document.getElementById('btn-mutate');
  const btnSymmetrize = document.getElementById('btn-symmetrize');
  const btnInvertMatrix = document.getElementById('btn-invert-matrix');

  // Sliders
  const sliderParticles = document.getElementById('slider-particles');
  const valParticles = document.getElementById('val-particles');
  const sliderRadius = document.getElementById('slider-radius');
  const valRadius = document.getElementById('val-radius');
  const sliderForce = document.getElementById('slider-force');
  const valForce = document.getElementById('val-force');
  const sliderFriction = document.getElementById('slider-friction');
  const valFriction = document.getElementById('val-friction');
  const sliderTrails = document.getElementById('slider-trails');
  const valTrails = document.getElementById('val-trails');

  // Build Presets List
  PRESETS.forEach((preset, index) => {
    const chip = document.createElement('div');
    chip.className = `preset-chip ${index === 0 ? 'active' : ''}`;
    chip.innerHTML = `
      <span class="preset-name">${preset.name}</span>
      <span class="preset-desc">${preset.desc}</span>
    `;
    chip.addEventListener('click', () => {
      applyPreset(index);
    });
    presetsGrid.appendChild(chip);
  });

  function applyPreset(index) {
    activePresetIndex = index;
    const preset = PRESETS[index];

    // Deep copy matrix
    engine.matrix = preset.matrix.map(row => [...row]);
    engine.radius = preset.radius;
    engine.forceStrength = preset.force;
    engine.friction = preset.friction;

    // Update UI Sliders
    sliderRadius.value = preset.radius;
    valRadius.textContent = `${preset.radius}px`;
    sliderForce.value = preset.force;
    valForce.textContent = `${preset.force.toFixed(1)}x`;
    sliderFriction.value = preset.friction;
    valFriction.textContent = preset.friction.toFixed(2);

    // Refresh preset chips
    const chips = presetsGrid.querySelectorAll('.preset-chip');
    chips.forEach((c, idx) => {
      c.classList.toggle('active', idx === index);
    });

    renderMatrixUI();
  }

  // Build Force Matrix UI
  function renderMatrixUI() {
    matrixContainer.innerHTML = '';
    const numSpecies = SPECIES.length;

    // Top species header indicator
    const headerRow = document.createElement('div');
    headerRow.className = 'matrix-row';
    const corner = document.createElement('div');
    corner.className = 'matrix-header-cell';
    headerRow.appendChild(corner);

    for (let j = 0; j < numSpecies; j++) {
      const colHeader = document.createElement('div');
      colHeader.className = 'matrix-header-cell';
      colHeader.style.color = SPECIES[j].color;
      colHeader.textContent = SPECIES[j].name[0];
      colHeader.title = `Source Species: ${SPECIES[j].name}`;
      headerRow.appendChild(colHeader);
    }
    matrixContainer.appendChild(headerRow);

    // Matrix rows
    for (let i = 0; i < numSpecies; i++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'matrix-row';

      const rowHeader = document.createElement('div');
      rowHeader.className = 'matrix-header-cell';
      rowHeader.style.color = SPECIES[i].color;
      rowHeader.textContent = SPECIES[i].name[0];
      rowHeader.title = `Target Species: ${SPECIES[i].name}`;
      rowDiv.appendChild(rowHeader);

      for (let j = 0; j < numSpecies; j++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        const val = engine.matrix[i][j];

        formatCellAppearance(cell, val);

        // Drag or click to change value
        let isDragging = false;
        let startX = 0;
        let initialVal = val;

        const onPointerDown = (e) => {
          isDragging = true;
          startX = e.clientX;
          initialVal = engine.matrix[i][j];
          window.addEventListener('pointermove', onPointerMove);
          window.addEventListener('pointerup', onPointerUp);
          e.preventDefault();
        };

        const onPointerMove = (e) => {
          if (!isDragging) return;
          const delta = (e.clientX - startX) * 0.015;
          let newVal = Math.max(-1.0, Math.min(1.0, initialVal + delta));
          newVal = Math.round(newVal * 100) / 100;
          engine.matrix[i][j] = newVal;
          formatCellAppearance(cell, newVal);
        };

        const onPointerUp = () => {
          isDragging = false;
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        };

        // Click to toggle sign / nudge
        cell.addEventListener('click', (e) => {
          if (Math.abs(e.clientX - startX) < 3) {
            // Invert or cycle
            let current = engine.matrix[i][j];
            let nextVal = current <= 0 ? 0.6 : -0.6;
            engine.matrix[i][j] = nextVal;
            formatCellAppearance(cell, nextVal);
          }
        });

        cell.addEventListener('pointerdown', onPointerDown);
        rowDiv.appendChild(cell);
      }
      matrixContainer.appendChild(rowDiv);
    }
  }

  function formatCellAppearance(cell, val) {
    cell.textContent = (val > 0 ? '+' : '') + val.toFixed(1);
    if (val > 0.05) {
      const alpha = Math.min(0.85, 0.15 + val * 0.7);
      cell.style.background = `rgba(16, 185, 129, ${alpha})`;
      cell.style.color = '#ffffff';
    } else if (val < -0.05) {
      const alpha = Math.min(0.85, 0.15 + Math.abs(val) * 0.7);
      cell.style.background = `rgba(255, 51, 102, ${alpha})`;
      cell.style.color = '#ffffff';
    } else {
      cell.style.background = 'rgba(255, 255, 255, 0.05)';
      cell.style.color = 'var(--text-sub)';
    }
  }

  // Initial matrix setup
  applyPreset(0);

  // Mouse tool segmented control
  const toolButtons = document.querySelectorAll('#mouse-tools .segment-btn');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      engine.mouse.tool = btn.dataset.tool;
    });
  });

  // Slider events
  sliderParticles.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valParticles.textContent = val;
    engine.spawnParticles(val);
  });

  sliderRadius.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valRadius.textContent = `${val}px`;
    engine.radius = val;
    engine.initGrid();
  });

  sliderForce.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valForce.textContent = `${val.toFixed(1)}x`;
    engine.forceStrength = val;
  });

  sliderFriction.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valFriction.textContent = val.toFixed(2);
    engine.friction = val;
  });

  sliderTrails.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valTrails.textContent = val.toFixed(2);
    engine.trailPersistence = val;
  });

  // Randomize Matrix
  btnRandomMatrix.addEventListener('click', () => {
    engine.matrix = generateRandomMatrix(SPECIES.length);
    renderMatrixUI();
    // Deselect preset
    presetsGrid.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
  });

  // Mutate Matrix slightly
  btnMutate.addEventListener('click', () => {
    for (let i = 0; i < SPECIES.length; i++) {
      for (let j = 0; j < SPECIES.length; j++) {
        let delta = (Math.random() - 0.5) * 0.2;
        let val = Math.max(-1.0, Math.min(1.0, engine.matrix[i][j] + delta));
        engine.matrix[i][j] = Math.round(val * 100) / 100;
      }
    }
    renderMatrixUI();
  });

  // Symmetrize Matrix
  btnSymmetrize.addEventListener('click', () => {
    for (let i = 0; i < SPECIES.length; i++) {
      for (let j = i + 1; j < SPECIES.length; j++) {
        const avg = (engine.matrix[i][j] + engine.matrix[j][i]) * 0.5;
        const rounded = Math.round(avg * 100) / 100;
        engine.matrix[i][j] = rounded;
        engine.matrix[j][i] = rounded;
      }
    }
    renderMatrixUI();
  });

  // Invert Matrix
  btnInvertMatrix.addEventListener('click', () => {
    for (let i = 0; i < SPECIES.length; i++) {
      for (let j = 0; j < SPECIES.length; j++) {
        engine.matrix[i][j] = -engine.matrix[i][j];
      }
    }
    renderMatrixUI();
  });

  // Audio Toggle
  btnAudio.addEventListener('click', () => {
    const active = soundscape.toggle();
    btnAudio.classList.toggle('active', active);
    btnAudio.querySelector('.btn-text').textContent = active ? 'Audio On' : 'Audio Off';
  });

  // Toggle HUD Panel
  function toggleControls() {
    controlsPanel.classList.toggle('hidden');
    btnToggleUi.classList.toggle('active', !controlsPanel.classList.contains('hidden'));
  }
  btnToggleUi.addEventListener('click', toggleControls);

  // Pause / Resume
  function togglePause() {
    isPaused = !isPaused;
    pauseText.textContent = isPaused ? 'Resume' : 'Pause';
    btnPause.querySelector('.btn-icon').textContent = isPaused ? '▶' : '⏸';
  }
  btnPause.addEventListener('click', togglePause);

  // Reset / Respawn
  btnReset.addEventListener('click', () => {
    engine.spawnParticles();
  });

  // High-res Snapshot Capture
  btnCapture.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `genesis-simulation-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // Mouse & Touch Interaction
  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function handlePointerDown(e) {
    // Ignore clicks on UI elements
    if (e.target.closest('#top-bar') || e.target.closest('#controls-panel')) return;
    const pos = getCanvasPos(e);
    engine.mouse.down = true;
    engine.mouse.x = pos.x;
    engine.mouse.y = pos.y;

    if (engine.mouse.tool === 'spawn') {
      engine.addParticlesAt(pos.x, pos.y, 30);
    }
  }

  function handlePointerMove(e) {
    const pos = getCanvasPos(e);
    engine.mouse.x = pos.x;
    engine.mouse.y = pos.y;

    if (engine.mouse.down && engine.mouse.tool === 'spawn' && Math.random() < 0.4) {
      engine.addParticlesAt(pos.x, pos.y, 8);
    }
  }

  function handlePointerUp() {
    engine.mouse.down = false;
  }

  canvas.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);

  canvas.addEventListener('touchstart', (e) => {
    handlePointerDown(e);
  }, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });
  window.addEventListener('touchend', handlePointerUp);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePause();
    } else if (e.code === 'KeyR') {
      engine.spawnParticles();
    } else if (e.code === 'KeyM') {
      btnRandomMatrix.click();
    } else if (e.code === 'KeyH') {
      toggleControls();
    } else if (e.code === 'Digit1') {
      toolButtons[0].click();
    } else if (e.code === 'Digit2') {
      toolButtons[1].click();
    } else if (e.code === 'Digit3') {
      toolButtons[2].click();
    } else if (e.code === 'Digit4') {
      toolButtons[3].click();
    }
  });

  // Main Render & Simulation Loop
  function loop() {
    if (!isPaused) {
      engine.step(1.0);
      soundscape.update(engine.kineticEnergy);
    }

    engine.render();

    // Update Topbar Stats
    statFps.textContent = engine.actualFps;
    statCount.textContent = engine.particleCount;
    statEnergy.textContent = engine.kineticEnergy.toFixed(2);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
