// 👻 MEMORY GHOST CONFIGURATION
// Central configuration for the Memory Ghost Engine
// Adjust these values to change how memories persist and blend

const MemoryConfig = {
  // Core Settings
  enabled: true,                    // Master switch for ghost system
  bufferSize: 7,                   // Number of ghosts to keep (5-10 recommended)
  captureInterval: 3000,           // Milliseconds between automatic captures
  
  // Visual Settings
  baseOpacity: 0.1,                // Starting opacity for new ghosts (0.05-0.2)
  maxOpacity: 0.3,                 // Maximum ghost opacity
  fadeRate: 0.95,                  // How quickly ghosts fade (0.9-0.99)
  blendMode: 'screen',             // Blend mode: screen, overlay, multiply, difference
  
  // Effects
  driftEnabled: true,              // Enable visual drift over time
  driftSpeed: 0.001,              // Speed of drift animation
  spectralEffects: true,          // Rainbow/chromatic effects
  noiseOverlay: true,             // Grain texture overlay
  feedbackLoop: false,            // Recursive feedback (intense!)
  
  // Performance
  scaleFactor: 0.5,               // Scale down captures for performance (0.3-1.0)
  renderFPS: 20,                  // Ghost render framerate
  
  // Behavior by Phase
  phaseSettings: {
    calm: {
      captureRate: 5000,
      opacity: 0.05,
      effects: 'minimal'
    },
    build: {
      captureRate: 3000,
      opacity: 0.1,
      effects: 'moderate'
    },
    chaos: {
      captureRate: 1000,
      opacity: 0.2,
      effects: 'maximum'
    },
    fade: {
      captureRate: 4000,
      opacity: 0.15,
      effects: 'dreamy'
    }
  },
  
  // Emotional Presets
  emotionalFilters: {
    peaceful: {
      hue: 200,
      saturation: 0.5,
      brightness: 0.9
    },
    anticipation: {
      hue: 60,
      saturation: 0.7,
      brightness: 1.1
    },
    frantic: {
      hue: 0,
      saturation: 1.2,
      brightness: 1.2
    },
    melancholic: {
      hue: 240,
      saturation: 0.3,
      brightness: 0.8
    }
  },
  
  // Debug
  debug: {
    showStats: false,            // Show ghost statistics
    logCaptures: true,          // Log ghost captures to console
    visualizeBuffer: false      // Show ghost buffer visualization
  }
};

// Dynamic configuration loader
export const loadConfig = () => {
  // Check for localStorage overrides
  try {
    const savedConfig = localStorage.getItem('memoryGhostConfig');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return { ...MemoryConfig, ...parsed };
    }
  } catch (e) {
    console.log('Using default ghost config');
  }
  
  return MemoryConfig;
};

// Save configuration
export const saveConfig = (newConfig) => {
  try {
    localStorage.setItem('memoryGhostConfig', JSON.stringify(newConfig));
    console.log('👻 Ghost configuration saved');
  } catch (e) {
    console.error('Failed to save ghost config:', e);
  }
};

// Get phase-specific settings
export const getPhaseConfig = (phase) => {
  return MemoryConfig.phaseSettings[phase] || MemoryConfig.phaseSettings.calm;
};

// Get emotional filter
export const getEmotionalFilter = (emotion) => {
  return MemoryConfig.emotionalFilters[emotion] || MemoryConfig.emotionalFilters.peaceful;
};

export default MemoryConfig;