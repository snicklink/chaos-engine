// MOTION SYSTEM - Perpetual movement engine for all elements
// Ensures nothing is ever completely static

class MotionSystem {
  constructor() {
    this.motionProfiles = {
      // Gentle movements for calm phases
      float: {
        duration: 8000,
        easing: 'ease-in-out',
        transforms: ['translateY', 'rotate'],
        amplitude: { translateY: 10, rotate: 5 }
      },
      drift: {
        duration: 12000,
        easing: 'linear',
        transforms: ['translateX', 'translateY'],
        amplitude: { translateX: 20, translateY: 15 }
      },
      breathe: {
        duration: 4000,
        easing: 'ease-in-out',
        transforms: ['scale'],
        amplitude: { scale: 0.05 }
      },
      sway: {
        duration: 6000,
        easing: 'ease-in-out',
        transforms: ['rotate', 'translateX'],
        amplitude: { rotate: 10, translateX: 5 }
      },
      
      // Active movements for build phases
      pulse: {
        duration: 2000,
        easing: 'ease-in-out',
        transforms: ['scale', 'opacity'],
        amplitude: { scale: 0.1, opacity: 0.2 }
      },
      orbit: {
        duration: 10000,
        easing: 'linear',
        transforms: ['rotate'],
        amplitude: { rotate: 360 }
      },
      bounce: {
        duration: 3000,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        transforms: ['translateY', 'scaleY'],
        amplitude: { translateY: 30, scaleY: 0.1 }
      },
      shake: {
        duration: 500,
        easing: 'ease-in-out',
        transforms: ['translateX', 'translateY'],
        amplitude: { translateX: 3, translateY: 3 }
      },
      
      // Intense movements for chaos phases
      glitch: {
        duration: 100,
        easing: 'steps(5)',
        transforms: ['translateX', 'translateY', 'skew'],
        amplitude: { translateX: 10, translateY: 10, skew: 5 }
      },
      spin: {
        duration: 1000,
        easing: 'linear',
        transforms: ['rotate'],
        amplitude: { rotate: 360 }
      },
      warp: {
        duration: 2000,
        easing: 'ease-in-out',
        transforms: ['scaleX', 'scaleY', 'rotate'],
        amplitude: { scaleX: 0.3, scaleY: 0.2, rotate: 45 }
      },
      teleport: {
        duration: 3000,
        easing: 'steps(10)',
        transforms: ['translateX', 'translateY', 'opacity'],
        amplitude: { translateX: 100, translateY: 100, opacity: 0.5 }
      },
      
      // Fading movements for fade phases
      dissolve: {
        duration: 5000,
        easing: 'ease-out',
        transforms: ['opacity', 'blur'],
        amplitude: { opacity: 0.5, blur: 2 }
      },
      sink: {
        duration: 8000,
        easing: 'ease-in',
        transforms: ['translateY', 'scale'],
        amplitude: { translateY: 50, scale: -0.2 }
      },
      fadeAway: {
        duration: 6000,
        easing: 'ease-out',
        transforms: ['translateY', 'opacity', 'rotate'],
        amplitude: { translateY: -20, opacity: 0.8, rotate: -10 }
      }
    };
    
    this.activeElements = new Map();
    this.animationFrame = null;
    this.isRunning = false;
  }
  
  // Apply motion to an element
  applyMotion(element, options = {}) {
    const {
      motion = 'float',
      intensity = 0.5,
      phase = 'calm',
      delay = 0,
      customAmplitude = {},
      composite = false
    } = options;
    
    // Get motion profile
    const profile = this.getMotionProfile(motion, phase);
    
    // Create unique ID for element
    const id = element.dataset.motionId || `motion-${Date.now()}-${Math.random()}`;
    element.dataset.motionId = id;
    
    // Calculate actual amplitude based on intensity
    const amplitude = {};
    Object.keys(profile.amplitude).forEach(transform => {
      amplitude[transform] = (customAmplitude[transform] || profile.amplitude[transform]) * intensity;
    });
    
    // Store element data
    this.activeElements.set(id, {
      element,
      profile,
      amplitude,
      startTime: Date.now() + delay,
      composite,
      phase: 0,
      lastUpdate: Date.now()
    });
    
    // Start animation loop if not running
    if (!this.isRunning) {
      this.start();
    }
    
    return id;
  }
  
  // Apply composite motion (multiple motions at once)
  applyCompositeMotion(element, motions, options = {}) {
    const ids = [];
    
    motions.forEach((motion, index) => {
      const motionOptions = {
        ...options,
        motion: motion.type || motion,
        intensity: motion.intensity || options.intensity,
        delay: (motion.delay || 0) + (options.delay || 0),
        customAmplitude: motion.amplitude || {},
        composite: true
      };
      
      ids.push(this.applyMotion(element, motionOptions));
    });
    
    return ids;
  }
  
  // Remove motion from element
  removeMotion(elementOrId) {
    let id;
    
    if (typeof elementOrId === 'string') {
      id = elementOrId;
    } else {
      id = elementOrId.dataset.motionId;
    }
    
    if (id && this.activeElements.has(id)) {
      const data = this.activeElements.get(id);
      // Reset transform
      if (!data.composite) {
        data.element.style.transform = '';
      }
      this.activeElements.delete(id);
    }
  }
  
  // Get motion profile based on phase
  getMotionProfile(motion, phase) {
    // If motion exists, use it
    if (this.motionProfiles[motion]) {
      return this.motionProfiles[motion];
    }
    
    // Otherwise select based on phase
    const phaseMotions = {
      calm: ['float', 'drift', 'breathe', 'sway'],
      build: ['pulse', 'orbit', 'bounce', 'shake'],
      chaos: ['glitch', 'spin', 'warp', 'teleport'],
      fade: ['dissolve', 'sink', 'fadeAway']
    };
    
    const available = phaseMotions[phase] || phaseMotions.calm;
    const selected = available[Math.floor(Math.random() * available.length)];
    
    return this.motionProfiles[selected];
  }
  
  // Animation loop
  animate = (timestamp) => {
    this.activeElements.forEach((data, id) => {
      const { element, profile, amplitude, startTime, composite } = data;
      
      // Skip if not started yet
      if (timestamp < startTime) return;
      
      // Calculate progress
      const elapsed = timestamp - startTime;
      const progress = (elapsed % profile.duration) / profile.duration;
      
      // Apply easing
      const easedProgress = this.applyEasing(progress, profile.easing);
      
      // Build transform string
      const transforms = [];
      
      profile.transforms.forEach(transform => {
        const value = this.calculateTransform(transform, easedProgress, amplitude[transform]);
        
        switch(transform) {
          case 'translateX':
          case 'translateY':
            transforms.push(`${transform}(${value}px)`);
            break;
          case 'rotate':
          case 'skew':
          case 'skewX':
          case 'skewY':
            transforms.push(`${transform}(${value}deg)`);
            break;
          case 'scale':
          case 'scaleX':
          case 'scaleY':
            transforms.push(`${transform}(${1 + value})`);
            break;
          case 'opacity':
            element.style.opacity = Math.max(0, Math.min(1, 1 - value));
            break;
          case 'blur':
            element.style.filter = `blur(${Math.abs(value)}px)`;
            break;
        }
      });
      
      // Apply transforms
      if (transforms.length > 0) {
        if (composite) {
          // For composite motions, append to existing transform
          const existingTransform = element.style.transform || '';
          element.style.transform = existingTransform + ' ' + transforms.join(' ');
        } else {
          element.style.transform = transforms.join(' ');
        }
      }
      
      // Update phase
      data.phase = easedProgress;
      data.lastUpdate = timestamp;
    });
    
    // Continue animation
    if (this.isRunning) {
      this.animationFrame = requestAnimationFrame(this.animate);
    }
  };
  
  // Calculate transform value based on type and progress
  calculateTransform(transform, progress, amplitude) {
    switch(transform) {
      case 'translateX':
      case 'translateY':
      case 'rotate':
      case 'skew':
      case 'skewX':
      case 'skewY':
        // Sine wave motion
        return Math.sin(progress * Math.PI * 2) * amplitude;
        
      case 'scale':
      case 'scaleX':
      case 'scaleY':
      case 'opacity':
      case 'blur':
        // Cosine wave motion (starts and ends at same value)
        return (1 - Math.cos(progress * Math.PI * 2)) * 0.5 * amplitude;
        
      default:
        return 0;
    }
  }
  
  // Apply easing function
  applyEasing(progress, easing) {
    switch(easing) {
      case 'linear':
        return progress;
        
      case 'ease-in':
        return progress * progress;
        
      case 'ease-out':
        return progress * (2 - progress);
        
      case 'ease-in-out':
        return progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;
          
      case 'cubic-bezier(0.68, -0.55, 0.265, 1.55)': // Bounce
        const c1 = 0.68;
        const c2 = -0.55;
        const c3 = 0.265;
        const c4 = 1.55;
        return this.cubicBezier(progress, c1, c2, c3, c4);
        
      default:
        // Handle steps() easing
        if (easing.startsWith('steps(')) {
          const steps = parseInt(easing.match(/\d+/)[0]);
          return Math.floor(progress * steps) / steps;
        }
        return progress;
    }
  }
  
  // Cubic bezier calculation
  cubicBezier(t, c1, c2, c3, c4) {
    const inv = 1 - t;
    return 3 * inv * inv * t * c1 + 3 * inv * t * t * c3 + t * t * t;
  }
  
  // Start animation loop
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animationFrame = requestAnimationFrame(this.animate);
    }
  }
  
  // Stop animation loop
  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  // Clear all motions
  clear() {
    this.activeElements.forEach((data, id) => {
      if (data.element) {
        data.element.style.transform = '';
        data.element.style.opacity = '';
        data.element.style.filter = '';
      }
    });
    this.activeElements.clear();
  }
  
  // Apply motion to multiple elements with stagger
  applyStaggeredMotion(elements, options = {}) {
    const {
      stagger = 100,
      ...motionOptions
    } = options;
    
    const ids = [];
    
    elements.forEach((element, index) => {
      const id = this.applyMotion(element, {
        ...motionOptions,
        delay: (motionOptions.delay || 0) + (index * stagger)
      });
      ids.push(id);
    });
    
    return ids;
  }
  
  // Get suggested motions for a phase
  getSuggestedMotions(phase, intensity) {
    const suggestions = {
      calm: [
        { type: 'float', intensity: intensity * 0.5 },
        { type: 'drift', intensity: intensity * 0.3 },
        { type: 'breathe', intensity: intensity * 0.7 }
      ],
      build: [
        { type: 'pulse', intensity: intensity * 0.8 },
        { type: 'orbit', intensity: intensity * 0.5 },
        { type: 'bounce', intensity: intensity * 0.6 }
      ],
      chaos: [
        { type: 'spin', intensity: Math.min(intensity * 1.5, 1) },
        { type: 'warp', intensity: intensity },
        { type: 'glitch', intensity: intensity * 0.7 }
      ],
      fade: [
        { type: 'fadeAway', intensity: intensity },
        { type: 'sink', intensity: intensity * 0.8 },
        { type: 'dissolve', intensity: intensity * 1.2 }
      ]
    };
    
    return suggestions[phase] || suggestions.calm;
  }
}

export default MotionSystem;