# ✦ GENESIS // Emergent Particle Life & Multiphysics Engine

An interactive, high-performance simulation of artificial life, emergent biologies, and self-organizing dynamical systems built with **WebGL2 hardware acceleration**, **zero-allocation spatial partitioning**, **contact mechanics**, and the **Web Audio API**.

---

## 🌌 Overview

[**🔗 Live Web Demo (GitHub Pages)**](https://xiaon67.github.io/genesis-particle-life/)

In **Genesis**, thousands of autonomous particles across 6 species interact through continuous potential gradients and steric contact mechanics. Without explicit instructions to form biological structures, their interactions spontaneously give rise to complex emergent behaviors:

- **Self-assembling bilayer cell membranes** with enclosed nuclei that undergo mitosis.
- **Predator-prey hunting chains** with metabolic energy transfer.
- **Undulating segmented organisms** ("centipedes") and biopolymers.
- **Stellar nurseries & galactic spirals** with orbital resonance.
- **Solid-state crystalline lattices** exhibiting elastic phonon modes.

---

## ⚡ Quick Start

### 1. Launch with Node.js
```bash
node server.js
```
Then navigate to `http://localhost:3000` in your browser.

### 2. Direct Browser Open
Double-click or open [index.html](file:///c:/Users/Khronos%20Aion/Documents/antigravity/fearless-goodall/index.html) directly in any modern browser (Chrome, Edge, Firefox, Brave, Safari). Zero dependencies required.

---

## 🔬 Multiphysics Architecture

### 1. WebGL2 Hardware Acceleration
- **GPU Point Sprites**: Renders 2,500–6,000+ particles with smooth anti-aliased radial discs and organic volumetric falloff via custom GLSL vertex and fragment shaders.
- **Dynamic VBO Streaming**: Streams particle state arrays in a single interleaved buffer subdata call (`gl.bufferSubData`), minimizing CPU-to-GPU overhead.
- **Additive Bioluminescence**: Leverages GPU alpha-blending (`gl.SRC_ALPHA, gl.ONE`) to recreate natural bioluminescent glow.

### 2. Zero-Allocation Spatial Hash Grid
- Standard JavaScript particle simulations allocate and resize arrays every frame, causing garbage collection (GC) micro-stutters.
- Genesis uses a **flat linked-list spatial hash grid** (`Int32Array` head/next pointers) that allocates **0 bytes** of heap memory per frame.
- Reduces pairwise checks from naive $O(N^2)$ ($\approx 36,000,000$ operations) to $O(N)$ ($\approx 150,000$ operations), unlocking butter-smooth 60–120 FPS.

### 3. Contact Mechanics & Momentum Conservation
- When particles penetrate their hard steric cores ($r < r_1 + r_2$), realistic elastic collision impulses are resolved using Newton's Third Law and conservation of linear momentum:
  $$J = -\frac{(1 + e)(v_{\text{rel}} \cdot n)}{\frac{1}{m_1} + \frac{1}{m_2}}$$
  where $e$ is the coefficient of restitution and $m_i$ is species mass.

### 4. Langevin Thermodynamic Thermostat
- Realistic microscopic thermal fluctuations (Brownian motion) are modeled via a Langevin thermostat:
  $$F_{\text{thermal}} = \sqrt{2 \gamma k_B T} \cdot \mathcal{N}(0, 1)$$
- Adjust the **Thermal Agitation (Temperature)** slider in the control panel to transition from frozen crystalline arrays ($T \to 0$) to active living fluid dynamics ($T \approx 0.18$) or boiling high-entropy states ($T > 0.5$).

### 5. Biological Activities & Ecosystem Engine
- **Trophic Energy Transfer**: Producers photosynthesize ambient energy while motile predators expend energy through locomotion.
- **Mitosis**: Dense colonies that maintain high metabolic energy levels can undergo spontaneous cellular division.

---

## 🎮 Controls & Shortcuts

| Key / Gesture | Function |
| :--- | :--- |
| **Scroll Wheel** | Smooth zoom in / out ($0.3\times$ to $4.5\times$) |
| **Right-Click Drag** | Pan camera across the infinite toroidal universe |
| **Space** | Pause / Resume simulation |
| **R** | Re-seed / Respawn particles |
| **M** | Generate a randomized force matrix |
| **H** | Toggle UI control HUD |
| **0** | Reset camera zoom and position to origin |
| **1 - 4** | Select Field Tool (Attract, Repel, Vortex, Spawn) |
| **Left-Click Drag (Canvas)** | Emit gravitational well, shockwave, or vortex swirl |
| **Click / Drag (Matrix)** | Fine-tune pairwise potential coefficient $A_{i, j}$ in real-time |
| **Audio Button** | Toggle ambient generative soundscapes modulated by kinetic energy |
| **Capture Button** | Download a high-resolution PNG snapshot |

---

## 📁 Repository Structure

```
fearless-goodall/
├── index.html          # Main HTML structure & telemetry HUD
├── style.css           # Glassmorphism cyber-minimalist styling
├── app.js              # Application coordinator & camera controller
├── presets.js          # Physical presets & species mass/radius specs
├── audio.js            # Web Audio spatial synthesizer
├── server.js           # Zero-dependency local Node server
├── engine/
│   ├── physics.js      # Zero-allocation spatial grid & contact mechanics
│   ├── renderer.js     # WebGL2 point sprite GPU rendering engine
│   └── ecosystem.js    # Biological metabolism, mitosis & trophic flows
└── README.md           # Comprehensive documentation & physics formulation
```
