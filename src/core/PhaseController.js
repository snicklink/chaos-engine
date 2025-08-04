class PhaseController {
  constructor(options = {}) {
    this.phases = ['calm', 'build', 'chaos', 'fade'];
    this.currentPhaseIndex = 0;
    this.phaseStartTime = Date.now();
    this.phaseDuration = this.getRandomDuration(options.minDuration, options.maxDuration);
    
    this.options = {
      minDuration: options.minDuration || 30000,
      maxDuration: options.maxDuration || 120000,
      onPhaseChange: options.onPhaseChange || (() => {})
    };
    
    this.timer = null;
    this.running = false;
  }
  
  start() {
    if (this.running) return;
    
    this.running = true;
    this.scheduleNextPhase();
  }
  
  stop() {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  
  reset() {
    this.stop();
    this.currentPhaseIndex = 0;
    this.phaseStartTime = Date.now();
    this.phaseDuration = this.getRandomDuration();
    this.options.onPhaseChange(this.phases[this.currentPhaseIndex]);
    this.start();
  }
  
  scheduleNextPhase() {
    if (!this.running) return;
    
    this.timer = setTimeout(() => {
      this.nextPhase();
    }, this.phaseDuration);
  }
  
  nextPhase() {
    this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.phases.length;
    this.phaseStartTime = Date.now();
    this.phaseDuration = this.getRandomDuration();
    
    const currentPhase = this.phases[this.currentPhaseIndex];
    console.log(`🔄 Phase transition: ${currentPhase.toUpperCase()}`);
    
    this.options.onPhaseChange(currentPhase);
    this.scheduleNextPhase();
  }
  
  getRandomDuration(min, max) {
    min = min || this.options.minDuration;
    max = max || this.options.maxDuration;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  getCurrentPhase() {
    return this.phases[this.currentPhaseIndex];
  }
  
  getPhaseProgress() {
    const elapsed = Date.now() - this.phaseStartTime;
    return Math.min(elapsed / this.phaseDuration, 1);
  }
  
  getIntensity() {
    // Returns a value between 0 and 1 based on current phase and progress
    const phase = this.getCurrentPhase();
    const progress = this.getPhaseProgress();
    
    switch(phase) {
      case 'calm':
        return 0.1 + (progress * 0.2); // 0.1 to 0.3
      case 'build':
        return 0.3 + (progress * 0.4); // 0.3 to 0.7
      case 'chaos':
        return 0.7 + (progress * 0.3); // 0.7 to 1.0
      case 'fade':
        return 1.0 - (progress * 0.9); // 1.0 to 0.1
      default:
        return 0.5;
    }
  }
  
  getTimeUntilNextPhase() {
    const elapsed = Date.now() - this.phaseStartTime;
    return Math.max(0, this.phaseDuration - elapsed);
  }
}

export default PhaseController;