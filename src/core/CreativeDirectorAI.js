// CREATIVE DIRECTOR AI - The artistic brain of the Chaos Engine
// This is not just code - it's a creative entity that understands aesthetics

class CreativeDirectorAI {
  constructor() {
    this.currentMood = 'exploratory';
    this.aestheticHistory = [];
    this.userEngagement = 0;
    this.sophisticationLevel = 0.7;
    
    // Aesthetic vocabulary
    this.aestheticModes = {
      // SOPHISTICATED MODES
      minimalElegance: {
        name: 'Minimal Elegance',
        background: 'clean',
        assetDensity: 0.1,
        animations: 'subtle',
        colors: 'monochrome',
        typography: 'helvetica',
        interaction: 'hover-states',
        surprise: 'sudden-glitch'
      },
      
      dataVisualization: {
        name: 'Data Visualization',
        background: 'grid-systems',
        assetDensity: 0.3,
        animations: 'flowing-data',
        colors: 'neon-accent',
        typography: 'mono',
        interaction: 'mouse-trails',
        surprise: 'data-corruption'
      },
      
      brutalismDigital: {
        name: 'Digital Brutalism',
        background: 'concrete-textures',
        assetDensity: 0.4,
        animations: 'harsh-cuts',
        colors: 'high-contrast',
        typography: 'impact',
        interaction: 'destructive',
        surprise: 'asset-invasion'
      },
      
      vaporwaveNostalgia: {
        name: 'Vaporwave Nostalgia',
        background: 'gradient-mesh',
        assetDensity: 0.5,
        animations: 'slow-float',
        colors: 'pastel-neon',
        typography: 'retro-future',
        interaction: 'dreamlike',
        surprise: 'time-glitch'
      },
      
      gameCinematic: {
        name: 'Game Cinematic',
        background: 'parallax-scenes',
        assetDensity: 0.6,
        animations: 'cinematic-pan',
        colors: 'atmospheric',
        typography: 'game-ui',
        interaction: 'controller-based',
        surprise: 'boss-appearance'
      },
      
      // CHAOS MODES
      assetTsunami: {
        name: 'Asset Tsunami',
        background: 'void',
        assetDensity: 1.0,
        animations: 'overwhelming',
        colors: 'rainbow-explosion',
        typography: 'broken',
        interaction: 'uncontrollable',
        surprise: 'total-meltdown'
      },
      
      glitchReality: {
        name: 'Glitch Reality',
        background: 'corrupted-video',
        assetDensity: 0.7,
        animations: 'datamosh',
        colors: 'rgb-shift',
        typography: 'zalgo',
        interaction: 'broken-physics',
        surprise: 'reality-tear'
      },
      
      // TRANSITIONAL MODES
      dreamSequence: {
        name: 'Dream Sequence',
        background: 'ethereal-fog',
        assetDensity: 0.3,
        animations: 'morphing',
        colors: 'soft-pastels',
        typography: 'floating',
        interaction: 'gentle-response',
        surprise: 'nightmare-flash'
      },
      
      museumGallery: {
        name: 'Museum Gallery',
        background: 'white-walls',
        assetDensity: 0.2,
        animations: 'exhibition',
        colors: 'gallery-lighting',
        typography: 'placard',
        interaction: 'audio-guide',
        surprise: 'artwork-alive'
      },
      
      codePoetry: {
        name: 'Code Poetry',
        background: 'terminal',
        assetDensity: 0.4,
        animations: 'typing',
        colors: 'syntax-highlight',
        typography: 'monospace',
        interaction: 'command-line',
        surprise: 'code-execute'
      }
    };
    
    // Transition strategies
    this.transitionTypes = [
      'smooth-fade',
      'glitch-transition',
      'pixel-dissolve',
      'reality-tear',
      'time-warp',
      'dimension-shift',
      'asset-invasion',
      'calm-to-storm',
      'freeze-frame',
      'reboot-sequence'
    ];
    
    // Interactive elements bank
    this.interactiveElements = [
      'gravity-wells',
      'magnetic-cursors',
      'asset-shooters',
      'remix-buttons',
      'time-scrubbers',
      'reality-sliders',
      'mood-selectors',
      'chaos-triggers',
      'easter-eggs',
      'hidden-portals'
    ];
  }
  
  // Main creative decision engine
  makeCreativeDecision(currentState) {
    const decision = {
      mode: this.selectAestheticMode(currentState),
      duration: this.calculateDuration(),
      transition: this.selectTransition(),
      interactive: this.shouldAddInteraction(),
      surprise: this.planSurprise(),
      assetMix: this.createAssetRecipe(),
      backgroundComplexity: this.determineBackgroundComplexity(),
      soundscape: this.suggestAudioMood()
    };
    
    this.aestheticHistory.push(decision);
    this.evolveCreativeState();
    
    return decision;
  }
  
  selectAestheticMode(currentState) {
    // Never repeat the same mode twice in a row
    const lastMode = this.aestheticHistory[this.aestheticHistory.length - 1]?.mode;
    let availableModes = Object.keys(this.aestheticModes).filter(m => m !== lastMode);
    
    // Weight selection based on sophistication needs
    if (this.sophisticationLevel < 0.5) {
      // Need more sophisticated modes
      availableModes = availableModes.filter(m => 
        ['minimalElegance', 'dataVisualization', 'museumGallery', 'codePoetry'].includes(m)
      );
    }
    
    // Consider user engagement
    if (this.userEngagement < 0.3) {
      // Need something attention-grabbing
      availableModes.push('assetTsunami', 'glitchReality');
    }
    
    // Time-based variety
    const timePattern = Date.now() % 10;
    if (timePattern < 3) {
      // Calm period
      return this.pickWeighted(availableModes, 'calm');
    } else if (timePattern < 7) {
      // Building period
      return this.pickWeighted(availableModes, 'medium');
    } else {
      // Chaos period
      return this.pickWeighted(availableModes, 'intense');
    }
  }
  
  calculateDuration() {
    // Vary duration unpredictably
    const patterns = [
      3000,   // Quick flash
      8000,   // Short scene
      15000,  // Medium experience
      30000,  // Long meditation
      45000,  // Extended journey
      2000,   // Blink
      12000,  // Standard
      60000   // Epic
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  selectTransition() {
    // Smart transition selection based on mode change
    const dramatic = Math.random() > 0.7;
    
    if (dramatic) {
      return this.transitionTypes.filter(t => 
        t.includes('tear') || t.includes('glitch') || t.includes('invasion')
      )[Math.floor(Math.random() * 3)];
    }
    
    return this.transitionTypes[Math.floor(Math.random() * this.transitionTypes.length)];
  }
  
  shouldAddInteraction() {
    // Interactive elements should be surprising, not constant
    const interactionChance = Math.random();
    
    if (interactionChance > 0.8) {
      return {
        type: this.interactiveElements[Math.floor(Math.random() * this.interactiveElements.length)],
        intensity: Math.random(),
        duration: Math.random() > 0.5 ? 'persistent' : 'temporary'
      };
    }
    
    return null;
  }
  
  planSurprise() {
    if (Math.random() > 0.9) {
      return {
        type: 'major',
        timing: Math.random() * 0.8 + 0.1, // Between 10% and 90% through
        element: this.generateSurpriseElement()
      };
    }
    
    return null;
  }
  
  createAssetRecipe() {
    // Sophisticated asset mixing
    const recipes = [
      { images: 1.0, audio: 0.0, video: 0.0, text: 0.0 }, // Pure images
      { images: 0.3, audio: 0.3, video: 0.3, text: 0.1 }, // Multimedia mix
      { images: 0.0, audio: 0.0, video: 1.0, text: 0.0 }, // Video focus
      { images: 0.2, audio: 0.1, video: 0.0, text: 0.7 }, // Text heavy
      { images: 0.5, audio: 0.2, video: 0.2, text: 0.1 }, // Balanced
      { images: 0.8, audio: 0.1, video: 0.0, text: 0.1 }, // Image dominant
      { images: 0.1, audio: 0.7, video: 0.1, text: 0.1 }, // Audio visualization
      { images: 0.4, audio: 0.0, video: 0.4, text: 0.2 }, // No audio mix
    ];
    
    return recipes[Math.floor(Math.random() * recipes.length)];
  }
  
  determineBackgroundComplexity() {
    // Background should complement, not compete
    const complexityLevels = [
      { type: 'void', complexity: 0.0 },
      { type: 'subtle-gradient', complexity: 0.1 },
      { type: 'geometric-pattern', complexity: 0.3 },
      { type: 'living-texture', complexity: 0.5 },
      { type: 'parallax-layers', complexity: 0.7 },
      { type: 'reactive-mesh', complexity: 0.8 },
      { type: 'full-environment', complexity: 1.0 }
    ];
    
    // Inverse relationship with asset density often works well
    const currentMode = this.aestheticModes[this.currentMood];
    const targetComplexity = currentMode ? (1 - currentMode.assetDensity) : 0.5;
    
    return complexityLevels.reduce((prev, curr) => 
      Math.abs(curr.complexity - targetComplexity) < Math.abs(prev.complexity - targetComplexity) ? curr : prev
    );
  }
  
  suggestAudioMood() {
    const audioMoods = [
      'silence',
      'ambient-wash',
      'glitch-percussion',
      'cinematic-score',
      'retro-game',
      'berlin-techno',
      'nature-sounds',
      'data-sonification',
      'voice-fragments',
      'chaos-symphony'
    ];
    
    return audioMoods[Math.floor(Math.random() * audioMoods.length)];
  }
  
  generateSurpriseElement() {
    const surprises = [
      'full-screen-takeover',
      'gravity-reversal',
      'time-freeze',
      'asset-multiplication',
      'reality-glitch',
      'interactive-prompt',
      'fake-crash',
      'dimension-portal',
      'memory-flashback',
      'consciousness-shift'
    ];
    
    return surprises[Math.floor(Math.random() * surprises.length)];
  }
  
  pickWeighted(modes, intensity) {
    // Intelligent mode selection based on intensity needs
    const weights = {
      calm: ['minimalElegance', 'museumGallery', 'dreamSequence'],
      medium: ['dataVisualization', 'brutalismDigital', 'codePoetry', 'vaporwaveNostalgia'],
      intense: ['assetTsunami', 'glitchReality', 'gameCinematic']
    };
    
    const preferred = weights[intensity];
    const available = modes.filter(m => preferred.includes(m));
    
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    
    return modes[Math.floor(Math.random() * modes.length)];
  }
  
  evolveCreativeState() {
    // AI learns and evolves its taste
    this.sophisticationLevel += (Math.random() - 0.5) * 0.1;
    this.sophisticationLevel = Math.max(0, Math.min(1, this.sophisticationLevel));
    
    // Simulate user engagement
    this.userEngagement = Math.random();
    
    // Mood evolution
    if (Math.random() > 0.8) {
      const moods = Object.keys(this.aestheticModes);
      this.currentMood = moods[Math.floor(Math.random() * moods.length)];
    }
  }
  
  getCreativeReport() {
    return {
      currentMood: this.currentMood,
      sophisticationLevel: this.sophisticationLevel,
      recentHistory: this.aestheticHistory.slice(-5),
      recommendation: this.makeCreativeDecision({})
    };
  }
}

export default CreativeDirectorAI;