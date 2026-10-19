/**
 * Genesis - Master Application Controller
 * Coordinates the Multiphysics Engine, WebGL2 Hardware Renderer,
 * Biological Ecosystem Processor, and Spatial Soundscape.
 */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('sim-canvas');
  const renderer = new WebGLRenderer(canvas);
  const physics = new PhysicsEngine(window.innerWidth, window.innerHeight, 10000);
  const ecosystem = new EcosystemEngine(physics);
  const soundscape = new GenerativeSoundscape();

  let isPaused = false;
  let activePresetIndex = 0;

  // Camera pan state
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let cameraStartPanX = 0;
  let cameraStartPanY = 0;

  // Window Resize
  function updateDimensions() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    physics.resize(w, h);
    renderer.resize(w, h);
  }
  window.addEventListener('resize', updateDimensions);
  updateDimensions();

  // Telemetry DOM Elements
  const statFps = document.getElementById('stat-fps');
  const statCount = document.getElementById('stat-count');
  const statInteractions = document.getElementById('stat-interactions');
  const statTemp = document.getElementById('stat-temp');
  const statZoom = document.getElementById('stat-zoom');

  // Control Buttons
  const btnAudio = document.getElementById('btn-audio');
  const btnCameraReset = document.getElementById('btn-camera-reset');
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
  const sliderTemp = document.getElementById('slider-temp');
  const valTemp = document.getElementById('val-temp');
  const sliderRadius = document.getElementById('slider-radius');
  const valRadius = document.getElementById('val-radius');
  const sliderForce = document.getElementById('slider-force');
  const valForce = document.getElementById('val-force');
  const sliderFriction = document.getElementById('slider-friction');
  const valFriction = document.getElementById('val-friction');

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

    physics.matrix = preset.matrix.map(row => [...row]);
    physics.radius = preset.radius;
    physics.forceStrength = preset.force;
    physics.viscosity = preset.friction;
    physics.temperature = preset.temperature !== undefined ? preset.temperature : 0.18;

    physics.initGrid();

    // Sync Sliders
    sliderRadius.value = preset.radius;
    valRadius.textContent = `${preset.radius}px`;
    sliderForce.value = preset.force;
    valForce.textContent = `${preset.force.toFixed(1)}x`;
    sliderFriction.value = preset.friction;
    valFriction.textContent = preset.friction.toFixed(2);
    sliderTemp.value = physics.temperature;
    valTemp.textContent = physics.temperature.toFixed(2);
    statTemp.textContent = physics.temperature.toFixed(2);

    // Refresh preset chips
    const chips = presetsGrid.querySelectorAll('.preset-chip');
    chips.forEach((c, idx) => {
      c.classList.toggle('active', idx === index);
    });

    renderMatrixUI();
  }

  // Interactive Force Matrix Grid
  function renderMatrixUI() {
    matrixContainer.innerHTML = '';
    const numSpecies = SPECIES.length;

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
      colHeader.title = `${SPECIES[j].name} (${SPECIES[j].role})`;
      headerRow.appendChild(colHeader);
    }
    matrixContainer.appendChild(headerRow);

    for (let i = 0; i < numSpecies; i++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'matrix-row';

      const rowHeader = document.createElement('div');
      rowHeader.className = 'matrix-header-cell';
      rowHeader.style.color = SPECIES[i].color;
      rowHeader.textContent = SPECIES[i].name[0];
      rowHeader.title = `${SPECIES[i].name} (${SPECIES[i].role})`;
      rowDiv.appendChild(rowHeader);

      for (let j = 0; j < numSpecies; j++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        const val = physics.matrix[i][j];

        formatCellAppearance(cell, val);

        let isDragging = false;
        let startX = 0;
        let initialVal = val;

        const onPointerDown = (e) => {
          isDragging = true;
          startX = e.clientX;
          initialVal = physics.matrix[i][j];
          window.addEventListener('pointermove', onPointerMove);
          window.addEventListener('pointerup', onPointerUp);
          e.preventDefault();
        };

        const onPointerMove = (e) => {
          if (!isDragging) return;
          const delta = (e.clientX - startX) * 0.015;
          let newVal = Math.max(-1.0, Math.min(1.0, initialVal + delta));
          newVal = Math.round(newVal * 100) / 100;
          physics.matrix[i][j] = newVal;
          formatCellAppearance(cell, newVal);
        };

        const onPointerUp = () => {
          isDragging = false;
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        };

        cell.addEventListener('click', (e) => {
          if (Math.abs(e.clientX - startX) < 3) {
            let current = physics.matrix[i][j];
            let nextVal = current <= 0 ? 0.65 : -0.65;
            physics.matrix[i][j] = nextVal;
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

  applyPreset(0);

  // Mouse Tool Selection
  const toolButtons = document.querySelectorAll('#mouse-tools .segment-btn');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      physics.mouse.tool = btn.dataset.tool;
    });
  });

  // Slider Events
  sliderParticles.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valParticles.textContent = val;
    physics.spawnParticles(val);
  });

  sliderTemp.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valTemp.textContent = val.toFixed(2);
    statTemp.textContent = val.toFixed(2);
    physics.temperature = val;
  });

  sliderRadius.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valRadius.textContent = `${val}px`;
    physics.radius = val;
    physics.initGrid();
  });

  sliderForce.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valForce.textContent = `${val.toFixed(1)}x`;
    physics.forceStrength = val;
  });

  sliderFriction.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valFriction.textContent = val.toFixed(2);
    physics.viscosity = val;
  });

  // Matrix Manipulations
  btnRandomMatrix.addEventListener('click', () => {
    physics.matrix = generateRandomMatrix(SPECIES.length);
    renderMatrixUI();
    presetsGrid.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
  });

  btnMutate.addEventListener('click', () => {
    for (let i = 0; i < SPECIES.length; i++) {
      for (let j = 0; j < SPECIES.length; j++) {
        const delta = (Math.random() - 0.5) * 0.2;
        const val = Math.max(-1.0, Math.min(1.0, physics.matrix[i][j] + delta));
        physics.matrix[i][j] = Math.round(val * 100) / 100;
      }
    }
    renderMatrixUI();
  });

  btnSymmetrize.addEventListener('click', () => {
    for (let i = 0; i < SPECIES.length; i++) {
      for (let j = i + 1; j < SPECIES.length; j++) {
        const avg = (physics.matrix[i][j] + physics.matrix[j][i]) * 0.5;
        const rounded = Math.round(avg * 100) / 100;
        physics.matrix[i][j] = rounded;
        physics.matrix[j][i] = rounded;
      }
    }
    renderMatrixUI();
  });

  btnInvertMatrix.addEventListener('click', () => {
    for (let i = 0; i < SPECIES.length; i++) {
      for (let j = 0; j < SPECIES.length; j++) {
        physics.matrix[i][j] = -physics.matrix[i][j];
      }
    }
    renderMatrixUI();
  });

  // Camera Reset
  function resetCamera() {
    renderer.camera.targetZoom = 1.0;
    renderer.camera.targetX = 0;
    renderer.camera.targetY = 0;
  }
  btnCameraReset.addEventListener('click', resetCamera);

  // Audio Toggle
  btnAudio.addEventListener('click', () => {
    const active = soundscape.toggle();
    btnAudio.classList.toggle('active', active);
    btnAudio.querySelector('.btn-text').textContent = active ? 'Audio On' : 'Audio Off';
  });

  // Toggle HUD
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

  // Re-Seed
  btnReset.addEventListener('click', () => {
    physics.spawnParticles();
  });

  // Snapshot Capture
  btnCapture.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `genesis-simulation-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // Coordinate Conversion (Screen / Canvas -> World with Camera Zoom & Pan)
  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const cam = renderer.camera;
    return {
      x: (sx / cam.zoom + cam.x + physics.width) % physics.width,
      y: (sy / cam.zoom + cam.y + physics.height) % physics.height
    };
  }

  // Pointer & Panning Event Handlers
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('mousedown', (e) => {
    if (e.target.closest('#top-bar') || e.target.closest('#controls-panel')) return;

    // Right click or Middle click: Camera Pan
    if (e.button === 2 || e.button === 1) {
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      cameraStartPanX = renderer.camera.targetX;
      cameraStartPanY = renderer.camera.targetY;
      canvas.classList.add('panning');
      return;
    }

    // Left click: Physics Field Tool
    if (e.button === 0) {
      const world = screenToWorld(e.clientX, e.clientY);
      physics.mouse.down = true;
      physics.mouse.x = world.x;
      physics.mouse.y = world.y;

      if (physics.mouse.tool === 'spawn') {
        physics.addParticlesAt(world.x, world.y, 35);
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isPanning) {
      const dx = (e.clientX - panStartX) / renderer.camera.zoom;
      const dy = (e.clientY - panStartY) / renderer.camera.zoom;
      renderer.camera.targetX = cameraStartPanX - dx;
      renderer.camera.targetY = cameraStartPanY - dy;
      return;
    }

    const world = screenToWorld(e.clientX, e.clientY);
    physics.mouse.x = world.x;
    physics.mouse.y = world.y;

    if (physics.mouse.down && physics.mouse.tool === 'spawn' && Math.random() < 0.4) {
      physics.addParticlesAt(world.x, world.y, 8);
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (isPanning) {
      isPanning = false;
      canvas.classList.remove('panning');
    }
    if (e.button === 0) {
      physics.mouse.down = false;
    }
  });

  // Mouse Wheel Zoom
  window.addEventListener('wheel', (e) => {
    if (e.target.closest('#controls-panel')) return; // Allow scrolling inside drawer

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.max(0.3, Math.min(4.5, renderer.camera.targetZoom * zoomFactor));
    renderer.camera.targetZoom = newZoom;
    statZoom.textContent = `${newZoom.toFixed(1)}x`;
  }, { passive: true });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const world = screenToWorld(t.clientX, t.clientY);
      physics.mouse.down = true;
      physics.mouse.x = world.x;
      physics.mouse.y = world.y;
      if (physics.mouse.tool === 'spawn') {
        physics.addParticlesAt(world.x, world.y, 30);
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const world = screenToWorld(t.clientX, t.clientY);
      physics.mouse.x = world.x;
      physics.mouse.y = world.y;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    physics.mouse.down = false;
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePause();
    } else if (e.code === 'KeyR') {
      physics.spawnParticles();
    } else if (e.code === 'KeyM') {
      btnRandomMatrix.click();
    } else if (e.code === 'KeyH') {
      toggleControls();
    } else if (e.code === 'Digit0') {
      resetCamera();
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

  // Performance Telemetry Tracking
  let frameCount = 0;
  let lastTime = performance.now();
  let currentFps = 60;

  // Main Render & Physics Loop
  function loop(now) {
    frameCount++;
    if (now - lastTime >= 500) {
      currentFps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;

      // Update Telemetry Bar
      statFps.textContent = currentFps;
      statCount.textContent = physics.particleCount;
      statInteractions.textContent = physics.pairwiseInteractions.toLocaleString();
    }

    if (!isPaused) {
      physics.step(1.0);
      ecosystem.update(1.0);
      soundscape.update(physics.kineticEnergy);
    }

    renderer.render(physics);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
