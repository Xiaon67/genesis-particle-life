# ✦ GENESIS // Emergent Particle Life & Ecosystem Laboratory

An interactive, high-performance simulation of artificial life, emergent biologies, and self-organizing dynamical systems built with HTML5 Canvas, modern JavaScript, and the Web Audio API.

---

## 🌌 Overview

In **Genesis**, thousands of autonomous particles belonging to distinct "species" interact through a matrix of attraction and repulsion forces. Despite having no explicit instructions to create biological forms, their interactions spontaneously give rise to complex emergent behaviors:

- **Self-assembling cell membranes** with enclosed nuclei that undergo mitosis.
- **Predator-prey hunting loops** and evasive swarms.
- **Slithering multi-segmented filaments** ("centipedes").
- **Galactic spiral nebulae** with orbital dynamics.
- **Crystalline lattice formations** exhibiting elastic solid-state physics.

---

## ⚡ Quick Start

### 1. Launch with Node.js
```bash
node server.js
```
Then navigate to `http://localhost:3000` in your browser.

### 2. Direct Browser Open
Alternatively, simply double-click or open [index.html](file:///c:/Users/Khronos%20Aion/Documents/antigravity/fearless-goodall/index.html) directly in any modern web browser (Chrome, Edge, Firefox, Brave, Safari). Zero dependencies required.

---

## 🔬 Mathematical Formulation

### 1. The Interaction Force Curve
For two particles $i$ and $j$ separated by toroidal distance $r$:
- **Repulsion Zone** ($r < \beta \cdot r_{\text{max}}$):
  $$F(r) = \frac{r}{\beta \cdot r_{\text{max}}} - 1$$
  This acts as an electrostatic/steric Pauli exclusion zone, preventing particles from collapsing into infinitely dense singular points.
  
- **Species Attraction/Repulsion Zone** ($\beta \cdot r_{\text{max}} \le r < r_{\text{max}}$):
  $$u = \frac{r - \beta \cdot r_{\text{max}}}{(1 - \beta) \cdot r_{\text{max}}}$$
  $$F(r) = A_{i, j} \cdot (1 - |2u - 1|)$$
  where $A_{i, j} \in [-1.0, 1.0]$ is the interaction coefficient from the species force matrix.
  
- **Beyond Cutoff** ($r \ge r_{\text{max}}$):
  $$F(r) = 0$$

### 2. Spatial Partitioning Grid
To achieve smooth 60 FPS with $N = 2,000 - 4,000$ particles:
- Instead of naive $O(N^2)$ checks ($\approx 16,000,000$ calculations/frame), space is partitioned into a uniform 2D grid with cell size $c = r_{\text{max}}$.
- Each particle only calculates pairwise forces against particles located in its own cell and the 8 adjacent neighboring cells.
- This reduces complexity from $O(N^2)$ to $O(N)$, speeding up computation by over $40\times$.

### 3. Non-Euclidean Toroidal Topology
The simulation space is wrapped toroidally: particles moving off the right edge smoothly re-enter from the left, and particles moving off the bottom re-enter from the top, eliminating artificial wall-boundary artifacts.

---

## 🎮 Controls & Shortcuts

| Key / Action | Function |
| :--- | :--- |
| **Space** | Pause / Resume simulation |
| **R** | Respawn / Re-seed particles randomly |
| **M** | Generate a randomized force matrix |
| **H** | Toggle UI control drawer |
| **1 - 4** | Select Mouse Tool (Attract, Repel, Vortex, Spawn) |
| **Click & Drag (Canvas)** | Apply gravitational pull, repulsion wave, vortex swirl, or spawn particles |
| **Click & Drag (Matrix)** | Fine-tune force coefficient $A_{i, j}$ between species in real-time |
| **Audio Button** | Toggle ambient generative soundscapes modulated by system kinetic energy |
| **Capture Button** | Save a high-resolution PNG snapshot of the current canvas |

---

## 🎵 Generative Audio Engine

Genesis features an ambient sound synthesizer using the **Web Audio API**:
- Dual-oscillator sub-bass and fifth harmonic drone.
- Dynamic resonant lowpass filter frequency tied directly to system kinetic energy $\bar{E}_k = \frac{1}{N}\sum v_i^2$.
- Pentatonic chime bursts triggered by high-energy particle accelerations.

---

## 📁 Project Structure

```
fearless-goodall/
├── index.html        # Main HTML layout, canvas & glassmorphism UI
├── style.css         # Cyber-minimalist styling, neon accents & animations
├── simulation.js     # Spatial grid & particle physics computation engine
├── presets.js        # Hand-crafted emergent life presets & matrix generators
├── audio.js          # Web Audio ambient generative synthesizer
├── app.js            # UI controller, event handlers, and render loop
├── server.js         # Lightweight zero-dependency Node static server
└── README.md         # Documentation & mathematical reference
```
