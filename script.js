/**
 * SHREYAS M — 3D CYBERNETIC PORTFOLIO
 * High-performance 3D background, multi-layer tilt physics, Web Audio synthesizer, and interactions.
 */

(function () {
  'use strict';

  // State
  const state = {
    audioEnabled: false,
    orbitActive: true,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };

  /* ==========================================================================
     Web Audio API Cybernetic Sound Synthesizer (Zero External Audio Files)
     ========================================================================== */
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(freq = 600, type = 'sine', duration = 0.08, vol = 0.05) {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  /* ==========================================================================
     Three.js 3D Neural Constellation & Particle Mesh
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  let threeScene, threeCamera, threeRenderer, neuralParticles, neuralLines;
  let particlePositions = [];
  const PARTICLE_COUNT = 110;
  const CONNECTION_DIST = 160;

  function initThreeBackground() {
    if (!canvas) return;

    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
      init2DCanvasFallback();
      return;
    }

    try {
      threeScene = new THREE.Scene();
      threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
      threeCamera.position.z = 700;

      threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      threeRenderer.setSize(window.innerWidth, window.innerHeight);
      threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Build Neural Nodes (Particles)
      const pGeometry = new THREE.BufferGeometry();
      const pPositions = new Float32Array(PARTICLE_COUNT * 3);
      const pVelocities = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * 1100;
        const y = (Math.random() - 0.5) * 850;
        const z = (Math.random() - 0.5) * 600;

        pPositions[i * 3] = x;
        pPositions[i * 3 + 1] = y;
        pPositions[i * 3 + 2] = z;

        pVelocities.push({
          x: (Math.random() - 0.5) * 0.55,
          y: (Math.random() - 0.5) * 0.55,
          z: (Math.random() - 0.5) * 0.35
        });
      }

      pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

      // Particle texture / style
      const pMaterial = new THREE.PointsMaterial({
        color: 0x00f2fe,
        size: 4,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      neuralParticles = new THREE.Points(pGeometry, pMaterial);
      threeScene.add(neuralParticles);

      // Line mesh for neural synaptic connections
      const maxLines = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
      const lPositions = new Float32Array(maxLines * 6);
      const lColors = new Float32Array(maxLines * 6);

      const lGeometry = new THREE.BufferGeometry();
      lGeometry.setAttribute('position', new THREE.BufferAttribute(lPositions, 3).setUsage(THREE.DynamicDrawUsage));
      lGeometry.setAttribute('color', new THREE.BufferAttribute(lColors, 3).setUsage(THREE.DynamicDrawUsage));

      const lMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.6
      });

      neuralLines = new THREE.LineSegments(lGeometry, lMaterial);
      threeScene.add(neuralLines);

      // Ambient 3D floating wireframe polyhedrons for AI cyber look
      const icoGeo = new THREE.IcosahedronGeometry(45, 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0x4facfe,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const icosahedron1 = new THREE.Mesh(icoGeo, icoMat);
      icosahedron1.position.set(-360, 180, -120);
      threeScene.add(icosahedron1);

      const torusGeo = new THREE.TorusGeometry(60, 15, 8, 24);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.position.set(400, -180, -150);
      threeScene.add(torusMesh);

      // Animation loop
      function animateThree() {
        requestAnimationFrame(animateThree);

        const posAttr = neuralParticles.geometry.attributes.position;
        const linePosAttr = neuralLines.geometry.attributes.position;
        const lineColAttr = neuralLines.geometry.attributes.color;

        let lineIdx = 0;

        // Move particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          let px = posAttr.getX(i) + pVelocities[i].x;
          let py = posAttr.getY(i) + pVelocities[i].y;
          let pz = posAttr.getZ(i) + pVelocities[i].z;

          // Boundary bounce
          if (px < -550 || px > 550) pVelocities[i].x *= -1;
          if (py < -425 || py > 425) pVelocities[i].y *= -1;
          if (pz < -300 || pz > 300) pVelocities[i].z *= -1;

          posAttr.setXYZ(i, px, py, pz);

          // Find nearby connections
          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const dx = px - posAttr.getX(j);
            const dy = py - posAttr.getY(j);
            const dz = pz - posAttr.getZ(j);
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < CONNECTION_DIST) {
              const alpha = 1.0 - dist / CONNECTION_DIST;

              linePosAttr.setXYZ(lineIdx, px, py, pz);
              linePosAttr.setXYZ(lineIdx + 1, posAttr.getX(j), posAttr.getY(j), posAttr.getZ(j));

              // Gradient from cyan to blue
              lineColAttr.setXYZ(lineIdx, 0.0, 0.95 * alpha, 1.0 * alpha);
              lineColAttr.setXYZ(lineIdx + 1, 0.3 * alpha, 0.67 * alpha, 1.0 * alpha);

              lineIdx += 2;
            }
          }
        }

        posAttr.needsUpdate = true;
        neuralLines.geometry.setDrawRange(0, lineIdx);
        linePosAttr.needsUpdate = true;
        lineColAttr.needsUpdate = true;

        // Floating geometric rotation
        icosahedron1.rotation.x += 0.005;
        icosahedron1.rotation.y += 0.008;
        torusMesh.rotation.x -= 0.006;
        torusMesh.rotation.y += 0.005;

        // Camera damping with mouse interaction
        if (state.orbitActive) {
          state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.04;
          state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.04;

          threeCamera.position.x = state.mouse.x * 240;
          threeCamera.position.y = -state.mouse.y * 180 + (window.scrollY * 0.15);
          threeCamera.lookAt(0, window.scrollY * 0.1, 0);
        } else {
          threeScene.rotation.y += 0.002;
        }

        threeRenderer.render(threeScene, threeCamera);
      }

      animateThree();

      // Window resize
      window.addEventListener('resize', () => {
        threeCamera.aspect = window.innerWidth / window.innerHeight;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (err) {
      console.warn('Three.js initialization notice, falling back to 2D canvas:', err);
      init2DCanvasFallback();
    }
  }

  // 2D Canvas Fallback in case WebGL is unavailable or offline
  function init2DCanvasFallback() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const nodes = [];

    for (let i = 0; i < 75; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1
      });
    }

    function render2D() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 120 * 0.8})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f2fe';
        ctx.fill();
      }

      requestAnimationFrame(render2D);
    }

    render2D();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  /* ==========================================================================
     High-Fidelity 3D Tilt Engine with Specular Glare
     ========================================================================== */
  function init3DTiltCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll('.tilt-3d-card');

    cards.forEach((card) => {
      const maxTilt = parseFloat(card.dataset.tiltMax) || 10;
      let isHovered = false;

      card.addEventListener('pointerenter', () => {
        isHovered = true;
        playCyberTone(880, 'sine', 0.04, 0.015);
      });

      card.addEventListener('pointermove', (e) => {
        if (!isHovered || window.innerWidth < 850) return;

        const rect = card.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const xPct = clientX / rect.width;
        const yPct = clientY / rect.height;

        const rotX = (0.5 - yPct) * maxTilt * 2;
        const rotY = (xPct - 0.5) * maxTilt * 2;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`;

        // Update card glare coordinates
        card.style.setProperty('--glare-x', `${(xPct * 100).toFixed(1)}%`);
        card.style.setProperty('--glare-y', `${(yPct * 100).toFixed(1)}%`);
      });

      card.addEventListener('pointerleave', () => {
        isHovered = false;
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     Custom 3D Glowing Cursor
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');

  function initCursor() {
    if (!cursorDot || !cursorGlow || window.innerWidth <= 850) return;

    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      // Update 3D canvas parallax target
      state.mouse.targetX = (mouseX / window.innerWidth) * 2 - 1;
      state.mouse.targetY = (mouseY / window.innerHeight) * 2 - 1;
    });

    // Smooth trailing interpolation for cursor glow
    function loopGlow() {
      glowX += (mouseX - glowX) * 0.16;
      glowY += (mouseY - glowY) * 0.16;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(loopGlow);
    }
    loopGlow();

    // Hover state expanding
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .copy-trigger, .tilt-3d-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     3D Role Rotator
     ========================================================================== */
  function initRoleRotator() {
    const items = document.querySelectorAll('.rotator-item');
    if (items.length <= 1) return;

    let index = 0;
    setInterval(() => {
      items[index].classList.remove('active');
      index = (index + 1) % items.length;
      items[index].classList.add('active');
    }, 2800);
  }

  /* ==========================================================================
     Project Categories Filtering
     ========================================================================== */
  function initProjectFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-3d-card');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        playCyberTone(700, 'triangle', 0.05, 0.03);

        cards.forEach((card) => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-filtered-out');
            card.style.display = 'flex';
          } else {
            card.classList.add('is-filtered-out');
            setTimeout(() => {
              if (card.classList.contains('is-filtered-out')) {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  /* ==========================================================================
     3D Project Architecture Inspector Modal
     ========================================================================== */
  const modalData = {
    guardrail: {
      tag: 'AI & CYBERSECURITY ARCHITECTURE',
      title: 'GuardRAIL — Autonomous Secret & Cloud Threat Scanner',
      desc: 'GuardRAIL safeguards developer repositories by analyzing source code, commit history, and CI/CD pipelines for accidental leakages of credentials, API tokens, cloud keys (AWS/GCP/Azure), and insecure environment variables.',
      sections: [
        {
          title: 'Detection Engine',
          content: 'Combines multi-pattern Regular Expression matching with Shannon Entropy scoring to differentiate random hash-like strings (actual secrets) from common English words, minimizing false positives.'
        },
        {
          title: 'Core Implementation Snapshot',
          code: `# Shannon Entropy & Regex Hybrid Scanner Sample\nimport math, re\n\ndef calculate_shannon_entropy(string_val):\n    prob = [float(string_val.count(c)) / len(string_val) for c in dict.fromkeys(list(string_val))]\n    return -sum([p * math.log(p) / math.log(2.0) for p in prob])\n\n# Flag high-entropy tokens exceeding vulnerability thresholds\nif calculate_shannon_entropy(token) > 4.5:\n    trigger_security_alert("High-entropy secret token identified!")`
        },
        {
          title: 'Impact & Capabilities',
          content: 'Designed as a lightweight pre-commit hook or standalone CLI scanner. Zero configuration setup with immediate local terminal reporting.'
        }
      ],
      repoUrl: 'https://github.com/mshreyas156-wq/GuardRAIL'
    },
    queuecast: {
      tag: 'SIMULATION & FLOW PREDICTION',
      title: 'QueueCast — Real-Time Flow & Service Modeling',
      desc: 'QueueCast is an interactive web-based simulation platform designed to model client arrival rates, queue wait times, and bottleneck congestion across multi-server topologies.',
      sections: [
        {
          title: 'Mathematical Modeling',
          content: 'Employs discrete-event queueing theory (M/M/1 and M/M/k models) to project service delays and visualize crowd distribution in real time.'
        },
        {
          title: 'Interactive Frontend Architecture',
          code: `// Real-Time Arrival & Service Tick Dispatcher\nfunction updateQueueSimulation(arrivalRate, serviceRate, servers) {\n  const utilization = arrivalRate / (servers * serviceRate);\n  const expectedWaitTime = utilization / (serviceRate * (1 - utilization));\n  renderFlowMetrics({ utilization, expectedWaitTime });\n}`
        },
        {
          title: 'Key Innovations',
          content: 'Smooth UI visualizer illustrating arrival waveforms and instant feedback on system strain.'
        }
      ],
      repoUrl: 'https://github.com/mshreyas156-wq/QueueCast'
    },
    webtech: {
      tag: 'FRONTEND ARCHITECTURE LAB',
      title: 'Web-Technologies — Modern Component & 3D Lab',
      desc: 'An expansive collection of experiments, micro-applications, and UI prototypes exploring modern HTML5 APIs, CSS 3D transforms, JavaScript ES6+ state management, and accessible responsive interfaces.',
      sections: [
        {
          title: 'Highlights',
          content: 'Features customizable dark/light cybernetic UI themes, CSS Grid responsive systems without media query bloating, and physics-based linear() easing animations.'
        },
        {
          title: 'Standards & Compliance',
          content: 'Strict adherence to semantic markup, WCAG accessibility color contrasts, and touch-optimized gestures.'
        }
      ],
      repoUrl: 'https://github.com/mshreyas156-wq/Web-technoloties'
    },
    shreyasm: {
      tag: 'CORE ALGORITHMIC SUITE',
      title: 'Shreyas-M — Foundational CS & Algorithmic Hub',
      desc: 'Personal engineering repository housing foundational computational algorithms, C memory management implementations, and Python automation routines developed throughout academic training.',
      sections: [
        {
          title: 'Covered Domains',
          content: 'Pointer arithmetic, dynamic memory allocation in C, linked lists, binary search trees, sorting comparisons, and modular Python utilities.'
        },
        {
          title: 'Algorithmic Problem Solving',
          content: 'Focused on reducing algorithmic time and space complexity with clean, readable, documented code.'
        }
      ],
      repoUrl: 'https://github.com/mshreyas156-wq/Shreyas-M'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openProjectModal(key) {
    const data = modalData[key];
    if (!data || !modalBody || !projectModal) return;

    playCyberTone(920, 'sine', 0.08, 0.04);

    let sectionsHtml = '';
    data.sections.forEach((sec) => {
      sectionsHtml += `<h4 class="modal-section-title">${sec.title}</h4>`;
      if (sec.content) sectionsHtml += `<p class="modal-desc">${sec.content}</p>`;
      if (sec.code) sectionsHtml += `<pre class="modal-code-preview"><code>${escapeHtml(sec.code)}</code></pre>`;
    });

    modalBody.innerHTML = `
      <div class="modal-header-tag">${data.tag}</div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="modal-desc">${data.desc}</p>
      ${sectionsHtml}
      <div class="modal-actions-row">
        <a href="${data.repoUrl}" target="_blank" rel="noreferrer" class="btn btn-primary btn-sm">
          <span>View on GitHub</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    `;

    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    playCyberTone(440, 'sine', 0.06, 0.02);
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function initModals() {
    document.querySelectorAll('.open-modal-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modalKey = btn.dataset.modal;
        openProjectModal(modalKey);
      });
    });

    modalCloseBtn?.addEventListener('click', closeProjectModal);

    projectModal?.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal?.classList.contains('is-active')) {
        closeProjectModal();
      }
    });
  }

  /* ==========================================================================
     Click to Copy with 3D Toast Notification
     ========================================================================== */
  const toast = document.getElementById('toastNotification');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-msg');
    if (msgEl) msgEl.textContent = msg;

    toast.classList.add('is-shown');
    playCyberTone(1020, 'sine', 0.1, 0.05);

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-shown');
    }, 2800);
  }

  function initCopyTriggers() {
    document.querySelectorAll('.copy-trigger').forEach((item) => {
      item.addEventListener('click', () => {
        const textToCopy = item.dataset.copy;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(() => {
          showToast('Copied to clipboard!');
        });
      });
    });
  }

  /* ==========================================================================
     Contact Form Handler
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();

      const name = form.elements['name'].value.trim();
      const email = form.elements['email'].value.trim();
      const subject = form.elements['subject'].value.trim() || 'Portfolio Inquiry';
      const message = form.elements['message'].value.trim();

      const fullSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
      const fullBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

      playCyberTone(1200, 'triangle', 0.12, 0.06);

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<strong>Draft ready!</strong> Opening your email client to send to <code>mshreyas156@gmail.com</code>.`;
        feedback.classList.remove('hidden');
      }

      // Launch mailto
      setTimeout(() => {
        window.location.href = `mailto:mshreyas156@gmail.com?subject=${fullSubject}&body=${fullBody}`;
      }, 400);
    });
  }

  /* ==========================================================================
     Top Controls (Sound Toggle & 3D Orbit Toggle)
     ========================================================================== */
  function initHeaderControls() {
    const soundBtn = document.getElementById('soundToggle');
    const soundOff = soundBtn?.querySelector('.sound-off');
    const soundOn = soundBtn?.querySelector('.sound-on');

    soundBtn?.addEventListener('click', () => {
      initAudio();
      state.audioEnabled = !state.audioEnabled;

      if (state.audioEnabled) {
        soundOff?.classList.add('hidden');
        soundOn?.classList.remove('hidden');
        soundBtn.classList.add('active');
        playCyberTone(800, 'sine', 0.1, 0.06);
        showToast('Audio SFX Enabled');
      } else {
        soundOn?.classList.add('hidden');
        soundOff?.classList.remove('hidden');
        soundBtn.classList.remove('active');
        showToast('Audio SFX Muted');
      }
    });

    const orbitBtn = document.getElementById('orbitToggle');
    orbitBtn?.addEventListener('click', () => {
      state.orbitActive = !state.orbitActive;
      playCyberTone(650, 'triangle', 0.08, 0.03);
      if (state.orbitActive) {
        orbitBtn.classList.remove('active');
        showToast('3D Mouse Interactive Mode');
      } else {
        orbitBtn.classList.add('active');
        showToast('3D Autonomous Orbit Mode');
      }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    menuToggle?.addEventListener('click', () => {
      const isOpen = nav?.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      playCyberTone(600, 'sine', 0.05, 0.03);
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        nav?.classList.remove('open');
        menuToggle?.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     Scroll Progress, Back-to-Top & Intersection Observers
     ========================================================================== */
  function initScrollTracking() {
    const progressBar = document.getElementById('scrollProgressBar');
    const toTopBtn = document.getElementById('toTopBtn');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Scroll progress
      if (progressBar && docHeight > 0) {
        const pct = (scrollY / docHeight) * 100;
        progressBar.style.width = `${pct}%`;
      }

      // Back to top button visibility
      if (toTopBtn) {
        if (scrollY > 350) {
          toTopBtn.classList.add('is-visible');
        } else {
          toTopBtn.classList.remove('is-visible');
        }
      }

      // Active nav highlight
      sections.forEach((sec) => {
        const top = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });

    toTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playCyberTone(900, 'sine', 0.08, 0.04);
    });

    // 3D Perspective Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-up, .reveal-fade, .skill-category-deck').forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================================
     Year Stamp & Intro Loader Dismissal
     ========================================================================== */
  function initApp() {
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    initThreeBackground();
    init3DTiltCards();
    initCursor();
    initRoleRotator();
    initProjectFilters();
    initModals();
    initCopyTriggers();
    initContactForm();
    initHeaderControls();
    initScrollTracking();

    // Dismiss intro loader
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.getElementById('introLoader');
        if (loader) loader.classList.add('is-done');
      }, 1000);
    });
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
