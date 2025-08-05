// 👻 MEMORY GHOST ENGINE
// The engine's consciousness - it remembers, dreams, and accumulates visual ghosts
// Each mutation leaves behind traces that haunt future iterations

class MemoryGhostEngine {
  constructor(config = {}) {
    // Ghost configuration
    this.config = {
      bufferSize: config.bufferSize || 7,           // Number of ghosts to keep
      captureInterval: config.captureInterval || 3000, // Ms between captures
      baseOpacity: config.baseOpacity || 0.1,       // Base ghost opacity
      fadeRate: config.fadeRate || 0.95,            // How quickly ghosts fade
      maxOpacity: config.maxOpacity || 0.3,         // Maximum ghost opacity
      blendMode: config.blendMode || 'screen',      // Ghost blend mode
      driftEnabled: config.driftEnabled || true,     // Enable visual drift
      driftSpeed: config.driftSpeed || 0.001,       // Drift animation speed
      ...config
    };

    // Ghost storage
    this.ghosts = [];
    this.ghostCanvas = null;
    this.ghostContext = null;
    this.isInitialized = false;
    
    // Metadata tracking
    this.captureCount = 0;
    this.lastCaptureTime = 0;
    this.currentMutation = null;
    this.currentPhase = null;
    
    // Performance
    this.renderingGhosts = false;
    this.captureScheduled = false;
    
    console.log('👻 Memory Ghost Engine initialized');
  }

  // Initialize the ghost rendering canvas
  initialize(width, height) {
    if (this.isInitialized) return;
    
    // Create offscreen canvas for ghost compositing
    this.ghostCanvas = document.createElement('canvas');
    this.ghostCanvas.width = width;
    this.ghostCanvas.height = height;
    this.ghostContext = this.ghostCanvas.getContext('2d', {
      alpha: true,
      willReadFrequently: true
    });
    
    this.isInitialized = true;
    console.log(`👻 Ghost canvas initialized: ${width}x${height}`);
  }

  // Capture current canvas state as a ghost
  captureGhost(sourceCanvas, metadata = {}) {
    if (!this.isInitialized || !sourceCanvas) return;
    
    const now = Date.now();
    
    // Throttle captures
    if (now - this.lastCaptureTime < this.config.captureInterval) {
      return;
    }
    
    // Create ghost data
    const ghost = {
      id: `ghost-${this.captureCount++}`,
      timestamp: now,
      imageData: this.captureCanvasData(sourceCanvas),
      metadata: {
        mutation: metadata.mutation || this.currentMutation,
        phase: metadata.phase || this.currentPhase,
        intensity: metadata.intensity || 0.5,
        entropy: metadata.entropy || Math.random(),
        emotionalTone: metadata.emotionalTone || 'neutral',
        ...metadata
      },
      opacity: this.config.baseOpacity,
      age: 0,
      drift: {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1
      }
    };
    
    // Add to buffer (circular)
    this.ghosts.push(ghost);
    if (this.ghosts.length > this.config.bufferSize) {
      const removed = this.ghosts.shift();
      console.log(`👻 Ghost expired: ${removed.id}`);
    }
    
    this.lastCaptureTime = now;
    console.log(`👻 Captured ghost: ${ghost.id} from ${ghost.metadata.mutation}`);
    
    return ghost;
  }

  // Capture canvas as image data
  captureCanvasData(canvas) {
    try {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      // Scale down for performance (50% size)
      const scale = 0.5;
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      
      tempCtx.drawImage(
        canvas, 
        0, 0, canvas.width, canvas.height,
        0, 0, tempCanvas.width, tempCanvas.height
      );
      
      return tempCanvas;
    } catch (error) {
      console.error('👻 Failed to capture canvas:', error);
      return null;
    }
  }

  // Update ghost properties (aging, drift, fade)
  updateGhosts(deltaTime = 16) {
    this.ghosts.forEach(ghost => {
      // Age the ghost
      ghost.age += deltaTime;
      
      // Fade based on age
      ghost.opacity = Math.max(
        0,
        this.config.baseOpacity * Math.pow(this.config.fadeRate, ghost.age / 1000)
      );
      
      // Apply drift if enabled
      if (this.config.driftEnabled) {
        const driftAmount = this.config.driftSpeed * deltaTime;
        ghost.drift.x += Math.sin(ghost.age * 0.0001) * driftAmount;
        ghost.drift.y += Math.cos(ghost.age * 0.00015) * driftAmount;
        ghost.drift.rotation += driftAmount * 0.1;
        ghost.drift.scale = 1 + Math.sin(ghost.age * 0.0002) * 0.02;
      }
    });
    
    // Remove completely faded ghosts
    this.ghosts = this.ghosts.filter(g => g.opacity > 0.01);
  }

  // Render all ghosts to a canvas
  renderGhosts(targetContext, width, height) {
    if (!this.isInitialized || this.renderingGhosts) return;
    if (this.ghosts.length === 0) return;
    
    this.renderingGhosts = true;
    
    // Clear ghost canvas
    this.ghostContext.clearRect(0, 0, width, height);
    
    // Render each ghost
    this.ghosts.forEach((ghost, index) => {
      if (!ghost.imageData) return;
      
      const ctx = this.ghostContext;
      ctx.save();
      
      // Apply ghost transformations
      ctx.globalAlpha = ghost.opacity;
      ctx.globalCompositeOperation = this.config.blendMode;
      
      // Apply drift
      if (this.config.driftEnabled) {
        ctx.translate(width / 2, height / 2);
        ctx.rotate(ghost.drift.rotation);
        ctx.scale(ghost.drift.scale, ghost.drift.scale);
        ctx.translate(-width / 2 + ghost.drift.x, -height / 2 + ghost.drift.y);
      }
      
      // Draw the ghost (scaled back up)
      ctx.drawImage(
        ghost.imageData,
        0, 0, ghost.imageData.width, ghost.imageData.height,
        0, 0, width, height
      );
      
      ctx.restore();
    });
    
    // Composite ghosts onto target
    targetContext.save();
    targetContext.globalAlpha = 1;
    targetContext.globalCompositeOperation = this.config.blendMode;
    targetContext.drawImage(this.ghostCanvas, 0, 0);
    targetContext.restore();
    
    this.renderingGhosts = false;
  }

  // Get ghosts with specific metadata
  getGhostsByMetadata(key, value) {
    return this.ghosts.filter(ghost => 
      ghost.metadata && ghost.metadata[key] === value
    );
  }

  // Get emotional history
  getEmotionalHistory() {
    return this.ghosts.map(g => ({
      tone: g.metadata.emotionalTone,
      age: g.age,
      opacity: g.opacity
    }));
  }

  // Clear all ghosts
  clearGhosts() {
    this.ghosts = [];
    if (this.ghostContext) {
      this.ghostContext.clearRect(0, 0, this.ghostCanvas.width, this.ghostCanvas.height);
    }
    console.log('👻 All ghosts cleared');
  }

  // Update current context
  setContext(mutation, phase) {
    this.currentMutation = mutation;
    this.currentPhase = phase;
  }

  // Get memory statistics
  getStats() {
    return {
      ghostCount: this.ghosts.length,
      oldestGhost: this.ghosts[0]?.age || 0,
      newestGhost: this.ghosts[this.ghosts.length - 1]?.age || 0,
      totalCaptures: this.captureCount,
      averageOpacity: this.ghosts.reduce((sum, g) => sum + g.opacity, 0) / (this.ghosts.length || 1),
      mutations: [...new Set(this.ghosts.map(g => g.metadata.mutation))],
      emotionalTones: [...new Set(this.ghosts.map(g => g.metadata.emotionalTone))]
    };
  }

  // Destroy and cleanup
  destroy() {
    this.clearGhosts();
    this.ghostCanvas = null;
    this.ghostContext = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
const memoryGhostEngine = new MemoryGhostEngine();
export default memoryGhostEngine;