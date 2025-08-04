import chaosAssets from './ChaosAssetLibrary.json';

class ChaosSynthesizer {
  constructor() {
    this.assets = chaosAssets;
    this.activeEffects = new Map();
    this.memoryEchoes = [];
    this.mutationHistory = [];
    this.chaosLevel = 0;
  }

  // Main synthesis function - combines random methods dynamically
  synthesize(container, phase, intensity) {
    // Increase chaos level over time
    this.chaosLevel = Math.min(this.chaosLevel + 0.001, 1);
    
    // Select random synthesis methods based on intensity
    const methodCount = Math.floor(1 + (intensity * 4));
    const methods = this.getRandomMethods(methodCount);
    
    // Apply each method with random parameters
    methods.forEach(method => {
      try {
        method.call(this, container, {
          phase,
          intensity,
          chaos: this.chaosLevel,
          memory: this.memoryEchoes
        });
      } catch (error) {
        console.log('Chaos overflow:', error.message);
        // Errors are part of the aesthetic
      }
    });
    
    // Random chance of meta-mutation
    if (Math.random() < intensity * 0.1) {
      this.metaMutate(container);
    }
  }

  getRandomMethods(count) {
    const allMethods = [
      this.dataToVisual,
      this.audioToMotion,
      this.codeToPoetry,
      this.imageToParticles,
      this.textToShapes,
      this.colorToSound,
      this.assetCannibalism,
      this.dimensionalRift,
      this.memoryLeak,
      this.realityBreak,
      this.ghostAssets,
      this.crossoverVirus,
      this.semanticCollision,
      this.frequencyFusion
    ];
    
    // Shuffle and select
    const shuffled = allMethods.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Convert JSON data into visual patterns
  dataToVisual(container, params) {
    const dataAssets = this.assets.data || [];
    if (dataAssets.length === 0) return;
    
    const randomData = dataAssets[Math.floor(Math.random() * dataAssets.length)];
    
    const visualization = document.createElement('div');
    visualization.className = 'data-visualization';
    visualization.style.cssText = `
      position: absolute;
      left: ${Math.random() * 80}%;
      top: ${Math.random() * 80}%;
      width: ${100 + Math.random() * 200}px;
      height: ${100 + Math.random() * 200}px;
      background: linear-gradient(${Math.random() * 360}deg, 
        ${this.getRandomColor()}, 
        ${this.getRandomColor()});
      transform: rotate(${Math.random() * 360}deg);
      opacity: ${0.3 + params.intensity * 0.5};
      mix-blend-mode: ${['screen', 'multiply', 'overlay'][Math.floor(Math.random() * 3)]};
      animation: dataFlow ${2 + Math.random() * 5}s infinite;
    `;
    
    // Add data structure visualization
    if (randomData.keys) {
      randomData.keys.forEach((key, i) => {
        const node = document.createElement('div');
        node.textContent = key;
        node.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          color: white;
          font-family: monospace;
          font-size: ${8 + Math.random() * 8}px;
          transform: rotate(${Math.random() * 180 - 90}deg);
        `;
        visualization.appendChild(node);
      });
    }
    
    container.appendChild(visualization);
    this.trackEffect(visualization, 10000);
  }

  // Transform audio frequencies into motion
  audioToMotion(container, params) {
    const audioAssets = this.assets.audio || [];
    if (audioAssets.length === 0) return;
    
    const randomAudio = audioAssets[Math.floor(Math.random() * audioAssets.length)];
    
    // Create motion element
    const motionElement = document.createElement('div');
    motionElement.className = 'audio-motion';
    motionElement.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;
    
    // Generate frequency bars
    const barCount = 10 + Math.floor(params.intensity * 20);
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: ${(i / barCount) * 100}%;
        width: ${100 / barCount}%;
        height: ${Math.random() * 100}%;
        background: ${this.getRandomColor()};
        transform-origin: bottom;
        animation: audioWave ${0.5 + Math.random() * 2}s ease-in-out infinite;
        animation-delay: ${i * 0.05}s;
        opacity: ${0.3 + params.intensity * 0.4};
      `;
      motionElement.appendChild(bar);
    }
    
    container.appendChild(motionElement);
    this.trackEffect(motionElement, 15000);
    
    // Try to play audio with chaos parameters
    if (params.intensity > 0.5) {
      this.playChaoticAudio(randomAudio.public);
    }
  }

  // Extract code comments and display as poetry
  codeToPoetry(container, params) {
    const codeSnippets = this.assets.snippets || [];
    if (codeSnippets.length === 0) return;
    
    const commentSnippets = codeSnippets.filter(s => s.type === 'comment');
    if (commentSnippets.length === 0) return;
    
    const randomSnippet = commentSnippets[Math.floor(Math.random() * commentSnippets.length)];
    
    const poetry = document.createElement('div');
    poetry.className = 'code-poetry';
    poetry.style.cssText = `
      position: absolute;
      left: ${Math.random() * 60 + 20}%;
      top: ${Math.random() * 60 + 20}%;
      color: ${this.getRandomColor()};
      font-family: monospace;
      font-size: ${12 + Math.random() * 12}px;
      text-shadow: 0 0 ${params.intensity * 20}px currentColor;
      transform: perspective(300px) rotateY(${Math.random() * 60 - 30}deg);
      opacity: ${0.5 + params.intensity * 0.5};
      max-width: 300px;
      line-height: 1.8;
      white-space: pre-wrap;
    `;
    
    // Clean and format code as poetry
    const poeticText = randomSnippet.code
      .replace(/\/\*+|\*+\//g, '')
      .replace(/\* /g, '')
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    poetry.textContent = poeticText;
    
    container.appendChild(poetry);
    this.trackEffect(poetry, 20000);
  }

  // Convert images into particle systems
  imageToParticles(container, params) {
    const imageAssets = this.assets.images || [];
    if (imageAssets.length === 0) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-system';
    particleContainer.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;
    
    // Create particles from random images
    const particleCount = Math.floor(10 + params.intensity * 50);
    for (let i = 0; i < particleCount; i++) {
      const randomImage = imageAssets[Math.floor(Math.random() * imageAssets.length)];
      const particle = document.createElement('img');
      
      particle.src = randomImage.public;
      particle.style.cssText = `
        position: absolute;
        width: ${10 + Math.random() * 50}px;
        height: auto;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${0.3 + Math.random() * 0.7};
        filter: blur(${Math.random() * 2}px) hue-rotate(${Math.random() * 360}deg);
        animation: particleFloat ${5 + Math.random() * 10}s infinite;
        animation-delay: ${Math.random() * 5}s;
        mix-blend-mode: ${['normal', 'screen', 'multiply'][Math.floor(Math.random() * 3)]};
      `;
      
      particleContainer.appendChild(particle);
    }
    
    container.appendChild(particleContainer);
    this.trackEffect(particleContainer, 30000);
  }

  // Transform text into geometric shapes
  textToShapes(container, params) {
    const textAssets = this.assets.text || [];
    if (textAssets.length === 0) return;
    
    const randomText = textAssets[Math.floor(Math.random() * textAssets.length)];
    const words = (randomText.preview || 'CHAOS').split(' ');
    
    words.forEach((word, i) => {
      const shape = document.createElement('div');
      const shapeType = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)];
      
      shape.className = `text-shape shape-${shapeType}`;
      shape.textContent = word;
      shape.style.cssText = `
        position: absolute;
        left: ${Math.random() * 80 + 10}%;
        top: ${Math.random() * 80 + 10}%;
        width: ${50 + Math.random() * 100}px;
        height: ${50 + Math.random() * 100}px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${this.getRandomColor()};
        color: ${Math.random() > 0.5 ? 'white' : 'black'};
        font-family: ${['monospace', 'serif', 'sans-serif'][Math.floor(Math.random() * 3)]};
        font-size: ${8 + Math.random() * 16}px;
        transform: rotate(${Math.random() * 360}deg);
        opacity: ${0.3 + params.intensity * 0.5};
        clip-path: ${this.getShapeClipPath(shapeType)};
        animation: shapeWarp ${2 + Math.random() * 5}s infinite;
      `;
      
      container.appendChild(shape);
      this.trackEffect(shape, 15000);
    });
  }

  // Convert colors to sound frequencies
  colorToSound(container, params) {
    const colors = Array.from(this.assets.colors || []);
    if (colors.length === 0) return;
    
    // Create visual sound wave
    const soundWave = document.createElement('div');
    soundWave.className = 'color-sound-wave';
    soundWave.style.cssText = `
      position: absolute;
      width: 100%;
      height: 200px;
      top: ${Math.random() * 60 + 20}%;
      left: 0;
      overflow: hidden;
    `;
    
    // Generate wave from colors
    colors.slice(0, 20).forEach((color, i) => {
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: absolute;
        width: 100%;
        height: 2px;
        background: ${color};
        top: ${50 + Math.sin(i * 0.5) * 40}%;
        transform: translateX(${-100 + i * 10}%);
        animation: soundFlow ${3 + Math.random() * 2}s linear infinite;
        box-shadow: 0 0 20px ${color};
      `;
      soundWave.appendChild(wave);
    });
    
    container.appendChild(soundWave);
    this.trackEffect(soundWave, 10000);
  }

  // Assets consume each other
  assetCannibalism(container, params) {
    const allAssets = [...(this.assets.images || []), ...(this.assets.text || [])];
    if (allAssets.length < 2) return;
    
    const predator = allAssets[Math.floor(Math.random() * allAssets.length)];
    const prey = allAssets[Math.floor(Math.random() * allAssets.length)];
    
    const cannibalContainer = document.createElement('div');
    cannibalContainer.className = 'asset-cannibal';
    cannibalContainer.style.cssText = `
      position: absolute;
      left: ${Math.random() * 60 + 20}%;
      top: ${Math.random() * 60 + 20}%;
      width: 200px;
      height: 200px;
      overflow: hidden;
      transform: rotate(${Math.random() * 360}deg);
    `;
    
    // Create morphing effect
    if (predator.type === 'images' && prey.type === 'images') {
      const img1 = document.createElement('img');
      const img2 = document.createElement('img');
      
      img1.src = predator.public;
      img2.src = prey.public;
      
      [img1, img2].forEach((img, i) => {
        img.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: ${i === 0 ? 1 : 0};
          animation: cannibalMorph ${3 + Math.random() * 2}s infinite ${i === 0 ? '0s' : '1.5s'};
          filter: contrast(${1 + params.intensity}) saturate(${1 + params.intensity});
        `;
      });
      
      cannibalContainer.appendChild(img1);
      cannibalContainer.appendChild(img2);
    }
    
    container.appendChild(cannibalContainer);
    this.trackEffect(cannibalContainer, 12000);
  }

  // 2D/3D dimensional rifts
  dimensionalRift(container, params) {
    const rift = document.createElement('div');
    rift.className = 'dimensional-rift';
    rift.style.cssText = `
      position: absolute;
      left: ${Math.random() * 80}%;
      top: ${Math.random() * 80}%;
      width: ${100 + Math.random() * 200}px;
      height: ${100 + Math.random() * 200}px;
      transform-style: preserve-3d;
      transform: perspective(500px) rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg);
      animation: riftRotate ${5 + Math.random() * 5}s linear infinite;
    `;
    
    // Create rift layers
    for (let i = 0; i < 5; i++) {
      const layer = document.createElement('div');
      layer.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid ${this.getRandomColor()};
        transform: translateZ(${i * 20}px) scale(${1 - i * 0.1});
        opacity: ${0.8 - i * 0.15};
        animation: riftPulse ${1 + Math.random() * 2}s ease-in-out infinite;
        animation-delay: ${i * 0.1}s;
      `;
      rift.appendChild(layer);
    }
    
    container.appendChild(rift);
    this.trackEffect(rift, 15000);
  }

  // Intentional memory leaks that accumulate
  memoryLeak(container, params) {
    // Store echoes of previous mutations
    const echo = {
      timestamp: Date.now(),
      phase: params.phase,
      intensity: params.intensity,
      snapshot: container.innerHTML.substring(0, 100)
    };
    
    this.memoryEchoes.push(echo);
    
    // Display memory fragments
    if (this.memoryEchoes.length > 5) {
      const oldEcho = this.memoryEchoes[Math.floor(Math.random() * this.memoryEchoes.length)];
      
      const fragment = document.createElement('div');
      fragment.className = 'memory-fragment';
      fragment.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        color: rgba(255, 255, 255, ${0.2 + params.intensity * 0.3});
        font-family: monospace;
        font-size: 10px;
        transform: scale(${0.5 + Math.random() * 0.5});
        pointer-events: none;
        animation: memoryFade ${5 + Math.random() * 5}s ease-out forwards;
      `;
      fragment.textContent = `MEMORY_${oldEcho.timestamp}_PHASE_${oldEcho.phase}`;
      
      container.appendChild(fragment);
      this.trackEffect(fragment, 10000);
    }
    
    // Limit memory to prevent actual crashes
    if (this.memoryEchoes.length > 100) {
      this.memoryEchoes.splice(0, 50);
    }
  }

  // DOM manipulation chaos
  realityBreak(container, params) {
    if (params.intensity < 0.7) return;
    
    // Randomly modify existing elements
    const elements = container.querySelectorAll('*');
    const targetCount = Math.min(elements.length, Math.floor(params.intensity * 10));
    
    for (let i = 0; i < targetCount; i++) {
      const element = elements[Math.floor(Math.random() * elements.length)];
      if (!element || element.classList.contains('reality-broken')) continue;
      
      element.classList.add('reality-broken');
      
      // Apply random reality-breaking effects
      const effects = [
        () => element.style.transform += ` skew(${Math.random() * 30 - 15}deg)`,
        () => element.style.filter += ` invert(${Math.random()})`,
        () => element.style.animation = `realityGlitch ${Math.random() * 2}s infinite`,
        () => element.style.mixBlendMode = 'difference',
        () => element.style.writingMode = 'vertical-rl',
        () => element.style.transform += ` matrix(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()}, 0, 0)`
      ];
      
      const effect = effects[Math.floor(Math.random() * effects.length)];
      effect();
    }
  }

  // Show deleted/hidden assets
  ghostAssets(container, params) {
    // Simulate finding "deleted" assets
    const ghostTypes = ['DELETED_', 'HIDDEN_', 'LOST_', 'CORRUPTED_'];
    const ghostPrefix = ghostTypes[Math.floor(Math.random() * ghostTypes.length)];
    
    const ghost = document.createElement('div');
    ghost.className = 'ghost-asset';
    ghost.style.cssText = `
      position: absolute;
      left: ${Math.random() * 80 + 10}%;
      top: ${Math.random() * 80 + 10}%;
      color: rgba(255, 255, 255, ${0.1 + params.intensity * 0.3});
      font-family: monospace;
      font-size: ${10 + Math.random() * 10}px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      animation: ghostFlicker ${2 + Math.random() * 3}s infinite;
      pointer-events: none;
    `;
    
    ghost.textContent = `${ghostPrefix}${Math.random().toString(36).substring(2, 10)}.${['png', 'mp3', 'txt', 'glb'][Math.floor(Math.random() * 4)]}`;
    
    container.appendChild(ghost);
    this.trackEffect(ghost, 8000);
  }

  // Mutations that spread between elements
  crossoverVirus(container, params) {
    const virus = {
      strain: Math.random().toString(36).substring(2, 8),
      effect: ['rotate', 'scale', 'color', 'glitch'][Math.floor(Math.random() * 4)],
      intensity: params.intensity
    };
    
    // Patient zero
    const elements = container.querySelectorAll('*:not(.virus-infected)');
    if (elements.length === 0) return;
    
    const patientZero = elements[Math.floor(Math.random() * elements.length)];
    this.infectElement(patientZero, virus);
    
    // Spread mechanism
    let spreadCount = 0;
    const spread = setInterval(() => {
      const infected = container.querySelectorAll('.virus-infected');
      const healthy = container.querySelectorAll('*:not(.virus-infected)');
      
      if (healthy.length === 0 || spreadCount > 10) {
        clearInterval(spread);
        return;
      }
      
      // Each infected element can infect nearby elements
      infected.forEach(infectedEl => {
        const target = healthy[Math.floor(Math.random() * healthy.length)];
        if (target && Math.random() < virus.intensity) {
          this.infectElement(target, virus);
          spreadCount++;
        }
      });
    }, 500);
  }

  infectElement(element, virus) {
    element.classList.add('virus-infected');
    element.dataset.virusStrain = virus.strain;
    
    switch (virus.effect) {
      case 'rotate':
        element.style.transform += ` rotate(${Math.random() * 360}deg)`;
        break;
      case 'scale':
        element.style.transform += ` scale(${0.5 + Math.random() * 2})`;
        break;
      case 'color':
        element.style.filter += ` hue-rotate(${Math.random() * 360}deg)`;
        break;
      case 'glitch':
        element.style.animation = `virusGlitch ${0.1 + Math.random() * 0.5}s infinite`;
        break;
    }
  }

  // AI interprets and remixes content
  semanticCollision(container, params) {
    const textAssets = this.assets.text || [];
    const codeAssets = this.assets.snippets || [];
    
    if (textAssets.length === 0 || codeAssets.length === 0) return;
    
    const text = textAssets[Math.floor(Math.random() * textAssets.length)];
    const code = codeAssets[Math.floor(Math.random() * codeAssets.length)];
    
    const collision = document.createElement('div');
    collision.className = 'semantic-collision';
    collision.style.cssText = `
      position: absolute;
      left: ${Math.random() * 60 + 20}%;
      top: ${Math.random() * 60 + 20}%;
      padding: 20px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid ${this.getRandomColor()};
      color: white;
      font-family: monospace;
      font-size: 12px;
      max-width: 300px;
      transform: perspective(300px) rotateX(${Math.random() * 20 - 10}deg);
      animation: semanticPulse ${3 + Math.random() * 2}s infinite;
    `;
    
    // Mix text and code semantically
    const mixedContent = `
      ${text.name || 'UNKNOWN'}.${code.type}() {
        // ${text.preview ? text.preview.substring(0, 50) : 'void'}
        return ${code.source || 'chaos'};
      }
    `;
    
    collision.textContent = mixedContent;
    container.appendChild(collision);
    this.trackEffect(collision, 12000);
  }

  // Audio frequencies control visual parameters
  frequencyFusion(container, params) {
    const audioAssets = this.assets.audio || [];
    if (audioAssets.length === 0) return;
    
    const fusion = document.createElement('div');
    fusion.className = 'frequency-fusion';
    fusion.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      mix-blend-mode: screen;
    `;
    
    // Create frequency-responsive elements
    for (let i = 0; i < 8; i++) {
      const band = document.createElement('div');
      band.style.cssText = `
        position: absolute;
        left: ${(i / 8) * 100}%;
        top: 0;
        width: ${100 / 8}%;
        height: 100%;
        background: linear-gradient(to top, 
          transparent, 
          ${this.getRandomColor()} ${20 + Math.random() * 60}%, 
          transparent);
        opacity: ${0.1 + params.intensity * 0.3};
        transform: scaleY(${Math.random()});
        animation: frequencyResponse ${0.5 + Math.random() * 1}s ease-in-out infinite;
        animation-delay: ${i * 0.05}s;
      `;
      fusion.appendChild(band);
    }
    
    container.appendChild(fusion);
    this.trackEffect(fusion, 10000);
  }

  // Meta mutation - the engine mutates itself
  metaMutate(container) {
    console.log('🧬 META MUTATION TRIGGERED');
    
    // Randomly modify synthesis parameters
    this.chaosLevel = Math.min(1, this.chaosLevel * (1 + Math.random() * 0.5));
    
    // Inject random CSS that affects everything
    const metaStyle = document.createElement('style');
    metaStyle.textContent = `
      .mutation-container * {
        animation-duration: ${Math.random() * 5}s !important;
        animation-direction: ${Math.random() > 0.5 ? 'reverse' : 'normal'} !important;
      }
      
      @keyframes metaChaos {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 180}deg); }
        100% { transform: scale(1) rotate(360deg); }
      }
    `;
    
    document.head.appendChild(metaStyle);
    setTimeout(() => metaStyle.remove(), 10000);
  }

  // Helper functions
  getRandomColor() {
    const colors = Array.from(this.assets.colors || []);
    if (colors.length > 0) {
      return colors[Math.floor(Math.random() * colors.length)];
    }
    return `hsl(${Math.random() * 360}, 70%, 50%)`;
  }

  getShapeClipPath(type) {
    switch (type) {
      case 'circle':
        return 'circle(50%)';
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      default:
        return 'none';
    }
  }

  playChaoticAudio(src) {
    try {
      const audio = new Audio(src);
      audio.volume = 0.1 + Math.random() * 0.2;
      audio.playbackRate = 0.5 + Math.random() * 2;
      audio.play().catch(() => {});
      
      setTimeout(() => {
        audio.pause();
      }, 3000 + Math.random() * 5000);
    } catch (e) {
      // Audio chaos continues
    }
  }

  trackEffect(element, duration) {
    // Clean up effects after duration
    setTimeout(() => {
      element.style.transition = 'opacity 1s';
      element.style.opacity = '0';
      setTimeout(() => element.remove(), 1000);
    }, duration);
  }

  // Add global animation styles
  static injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dataFlow {
        0% { transform: translateX(-100%) rotate(0deg); }
        100% { transform: translateX(100%) rotate(360deg); }
      }
      
      @keyframes audioWave {
        0%, 100% { transform: scaleY(0.5); }
        50% { transform: scaleY(1.5); }
      }
      
      @keyframes particleFloat {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
        100% { transform: translateY(0) rotate(360deg); }
      }
      
      @keyframes shapeWarp {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(90deg) scale(1.1); }
        50% { transform: rotate(180deg) scale(0.9); }
        75% { transform: rotate(270deg) scale(1.05); }
      }
      
      @keyframes soundFlow {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      
      @keyframes cannibalMorph {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0; transform: scale(1.5); }
      }
      
      @keyframes riftRotate {
        0% { transform: perspective(500px) rotateX(0deg) rotateY(0deg); }
        100% { transform: perspective(500px) rotateX(360deg) rotateY(360deg); }
      }
      
      @keyframes riftPulse {
        0%, 100% { opacity: 0.8; transform: translateZ(var(--z)) scale(1); }
        50% { opacity: 1; transform: translateZ(var(--z)) scale(1.1); }
      }
      
      @keyframes memoryFade {
        0% { opacity: 0; transform: scale(0.5); }
        10% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8) translateY(-50px); }
      }
      
      @keyframes realityGlitch {
        0%, 100% { transform: skew(0deg); filter: none; }
        10% { transform: skew(5deg); filter: invert(1); }
        20% { transform: skew(-5deg); filter: hue-rotate(90deg); }
        30% { transform: skew(0deg); filter: contrast(5); }
      }
      
      @keyframes ghostFlicker {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.5; }
        51% { opacity: 0; }
        52% { opacity: 0.4; }
      }
      
      @keyframes virusGlitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        60% { transform: translate(-1px, 1px); }
        80% { transform: translate(1px, -1px); }
      }
      
      @keyframes semanticPulse {
        0%, 100% { opacity: 0.8; transform: perspective(300px) rotateX(0deg); }
        50% { opacity: 1; transform: perspective(300px) rotateX(5deg); }
      }
      
      @keyframes frequencyResponse {
        0%, 100% { transform: scaleY(0.2); }
        50% { transform: scaleY(1); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Inject styles on load
ChaosSynthesizer.injectStyles();

export default ChaosSynthesizer;