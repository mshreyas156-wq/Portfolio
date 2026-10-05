# Shreyas M — 3D Cybernetic AI/ML Portfolio

🌐 **Live Production URL:** [https://shreyas-portfolio-topaz-chi.vercel.app](https://shreyas-portfolio-topaz-chi.vercel.app)

A next-generation, high-performance portfolio engineered for **Shreyas M** (B.Tech in Artificial Intelligence & Machine Learning, S-VYASA Deemed to be University, Bangalore). Built with rich interactive 3D WebGL scenes, multi-layer 3D tilt physics, dynamic lighting, and futuristic cybernetic aesthetics.


---

## 🚀 Key 3D & Interactive Features

1. **Interactive 3D WebGL Neural Mesh Background (`Three.js`)**:
   - 3D Synaptic constellation of interconnected AI nodes dynamically calculated in real-time.
   - Responds to mouse coordinates and scroll inertia, giving authentic 3D spatial depth.
   - Includes autonomous 3D orbit mode toggle (`🪐` in the header).
   - High-performance graceful 2D canvas fallback for offline / low-end devices.

2. **3D Hologram Hero Stage & Gyroscopic Rings**:
   - Multi-axis rotating 3D gyroscope rings orbiting the portrait in real 3D perspective.
   - Multi-layer floating badges (`B.Tech AIML`, `Core Tech Stack`, `Bangalore, IN`) floating at varying Z-depths (`translateZ(45px)`, `translateZ(60px)`).
   - Real-time mouse tilt with specular point-light reflection and corner cyber accents.

3. **Multi-Layer 3D Tilt Cards (`Vanilla 3D Physics Engine`)**:
   - Cards have `transform-style: preserve-3d` and individual Z-axis layer elevations.
   - Dynamic cursor-following light glare on hover.
   - Applied to Project cards, Skill decks, About cards, and Timeline entries.

4. **Interactive 3D Project Architecture Inspector**:
   - Interactive category filtering: **All**, **AI & Security**, **Web Systems**, **Core & Code**.
   - "Architecture" button on each project launches a 3D perspective inspection modal detailing:
     - **GuardRAIL**: Pre-commit secret scanning engine, Shannon Entropy calculations, regex threat modeling.
     - **QueueCast**: Real-time discrete-event queue modeling, arrival waveforms, and wait-time algorithms.
     - **Web-Technologies**: Modern frontend component laboratory, CSS Grid 3D transforms.
     - **Shreyas-M Algorithmic Suite**: C memory management, data structures, and Python automation.

5. **Interactive Skill Meters & Badges Cloud**:
   - Dynamic fill animation upon scrolling into view.
   - Categorized by Programming Languages, Web & Modern Tech, and AI/ML & Problem Solving.
   - 3D floating badge cloud with magnetic hover effects.

6. **Click-to-Copy with 3D Floating Toast**:
   - Click either the email (`mshreyas156@gmail.com`) or phone (`+91 9148917193`) to copy directly to the clipboard.
   - Instant 3D spring-animated toast confirmation.

7. **Synthesized Cyber Sound FX (`Web Audio API`)**:
   - Futuristic synthesizer blips on button clicks and hover states.
   - Zero external audio files required.
   - Toggle audio on/off via the sound button (`🔇`/`🔊`) in the top navigation bar.

8. **Direct Resume Integration**:
   - Dedicated "Resume" button in the top bar and profile section directly downloading `assets/Shreyas_M_Resume.pdf`.

---

## 📂 Project Structure

```
portfolio/
├── assets/
│   ├── portrait-reference-hero.jpg    # Hero 3D portrait
│   ├── portrait-reference-about.jpg   # About section profile photo
│   └── Shreyas_M_Resume.pdf           # Official PDF Resume
├── index.html                         # Semantic HTML5 with 3D canvas & layout
├── styles.css                         # CSS with 3D transforms, glassmorphism & physics easing
├── script.js                          # Three.js 3D engine, tilt mechanics, sound & UI logic
└── README.md                          # Documentation
```

---

## 💻 How to Run

### Method 1: VS Code Live Server (Recommended)
1. Open this folder `c:\Users\Shreyas M\OneDrive\Desktop\portfolio` in VS Code.
2. Right-click `index.html` → **Open with Live Server**.

### Method 2: Direct Browser Launch
- Double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Brave, Safari).

### Method 3: Node / Python Local Server
```bash
# Using Node
npx serve .

# Or using Python
python -m http.server 3000
```
Then navigate to `http://localhost:3000`.
