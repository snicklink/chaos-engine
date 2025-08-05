// 👻 GHOST RENDERER
// Advanced visual effects and blending for memory ghosts
// Creates dreamlike distortions and spectral overlays

class GhostRenderer {
  constructor() {
    this.effects = {
      spectral: true,
      chromatic: true,
      noise: true,
      feedback: false
    };
    
    this.shaderCanvas = null;
    this.shaderContext = null;
    this.noiseOffset = 0;
    this.time = 0;
  }

  // Initialize shader canvas
  initialize(width, height) {
    this.shaderCanvas = document.createElement('canvas');
    this.shaderCanvas.width = width;
    this.shaderCanvas.height = height;
    this.shaderContext = this.shaderCanvas.getContext('2d', {
      alpha: true
    });
  }

  // Apply spectral distortion to ghost
  applySpectralDistortion(ghost, ctx, width, height) {
    if (!this.effects.spectral) return;
    
    const time = Date.now() * 0.001;
    const frequency = 0.01 + ghost.age * 0.00001;
    
    // Create rainbow shimmer based on age
    const hueShift = (time * 20 + ghost.age * 0.01) % 360;
    ctx.filter = `hue-rotate(${hueShift}deg) saturate(${50 + ghost.opacity * 100}%)`;
  }

  // Apply chromatic aberration
  applyChromaticAberration(imageData, ghost) {
    if (!this.effects.chromatic || !imageData) return imageData;
    
    const aberrationAmount = 2 + ghost.age * 0.0001;
    
    // This would require pixel manipulation
    // Simplified version using CSS filters
    return {
      ...imageData,
      chromaticOffset: aberrationAmount
    };
  }

  // Generate noise overlay
  generateNoise(ctx, width, height, opacity = 0.05) {
    if (!this.effects.noise) return;
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = opacity * 255; // A
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // Create feedback loop effect
  applyFeedback(ctx, width, height, amount = 0.95) {
    if (!this.effects.feedback) return;
    
    ctx.save();
    ctx.globalAlpha = amount;
    ctx.globalCompositeOperation = 'multiply';
    ctx.translate(width / 2, height / 2);
    ctx.scale(1.01, 1.01);
    ctx.translate(-width / 2, -height / 2);
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.restore();
  }

  // Render ghost with effects
  renderGhostWithEffects(ghost, targetCtx, width, height) {
    if (!ghost.imageData) return;
    
    const ctx = targetCtx;
    ctx.save();
    
    // Base transformations
    ctx.globalAlpha = ghost.opacity;
    ctx.globalCompositeOperation = ghost.metadata.phase === 'chaos' ? 'difference' : 'screen';
    
    // Apply spectral effects based on emotional tone
    switch (ghost.metadata.emotionalTone) {
      case 'frantic':
        ctx.filter = 'contrast(150%) saturate(120%)';
        break;
      case 'melancholic':
        ctx.filter = 'brightness(80%) sepia(20%)';
        break;
      case 'euphoric':
        ctx.filter = 'brightness(120%) hue-rotate(30deg)';
        break;
      default:
        this.applySpectralDistortion(ghost, ctx, width, height);
    }
    
    // Apply transformations
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.translate(centerX, centerY);
    
    // Rotation based on age
    if (ghost.drift.rotation) {
      ctx.rotate(ghost.drift.rotation);
    }
    
    // Scale pulsation
    const pulsation = 1 + Math.sin(this.time * 0.001 + ghost.age * 0.0001) * 0.05;
    ctx.scale(ghost.drift.scale * pulsation, ghost.drift.scale * pulsation);
    
    // Position offset
    ctx.translate(
      -centerX + ghost.drift.x,
      -centerY + ghost.drift.y
    );
    
    // Draw the ghost
    ctx.drawImage(
      ghost.imageData,
      0, 0, ghost.imageData.width, ghost.imageData.height,
      0, 0, width, height
    );
    
    ctx.restore();
  }

  // Create dream-like blur
  applyDreamBlur(ctx, width, height, amount = 2) {
    ctx.filter = `blur(${amount}px)`;
    ctx.globalAlpha = 0.5;
    ctx.drawImage(ctx.canvas, 0, 0, width, height);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
  }

  // Render multiple ghosts with layered effects
  renderGhostLayers(ghosts, targetCtx, width, height) {
    this.time = Date.now();
    
    // Sort ghosts by age (oldest first)
    const sortedGhosts = [...ghosts].sort((a, b) => b.age - a.age);
    
    // Clear shader canvas
    if (this.shaderContext) {
      this.shaderContext.clearRect(0, 0, width, height);
    }
    
    // Render each ghost with effects
    sortedGhosts.forEach((ghost, index) => {
      // Deeper ghosts get more distortion
      const depthFactor = index / sortedGhosts.length;
      
      // Modify opacity based on depth
      const modifiedGhost = {
        ...ghost,
        opacity: ghost.opacity * (1 - depthFactor * 0.3)
      };
      
      this.renderGhostWithEffects(modifiedGhost, targetCtx, width, height);
    });
    
    // Apply overall effects
    if (ghosts.length > 3) {
      this.applyDreamBlur(targetCtx, width, height, 1);
    }
    
    // Add noise for texture
    if (this.effects.noise && Math.random() < 0.3) {
      this.generateNoise(targetCtx, width, height, 0.02);
    }
    
    // Feedback for persistence
    if (this.effects.feedback && ghosts.length > 5) {
      this.applyFeedback(targetCtx, width, height, 0.98);
    }
  }

  // Get effect preset based on phase
  setPhaseEffects(phase) {
    switch (phase) {
      case 'calm':
        this.effects = {
          spectral: false,
          chromatic: false,
          noise: true,
          feedback: false
        };
        break;
      case 'build':
        this.effects = {
          spectral: true,
          chromatic: false,
          noise: true,
          feedback: false
        };
        break;
      case 'chaos':
        this.effects = {
          spectral: true,
          chromatic: true,
          noise: true,
          feedback: true
        };
        break;
      case 'fade':
        this.effects = {
          spectral: true,
          chromatic: false,
          noise: false,
          feedback: true
        };
        break;
    }
  }

  // Clean up
  destroy() {
    this.shaderCanvas = null;
    this.shaderContext = null;
  }
}

// Export singleton
const ghostRenderer = new GhostRenderer();
export default ghostRenderer;