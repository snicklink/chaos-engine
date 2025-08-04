class AudioChaos {
  constructor() {
    this.audioContext = null;
    this.currentSounds = [];
    this.soundLibrary = {
      // NEO_NEUKOELLN sounds
      techno: '/assets/neo-neukoelln/audio/techno.mp3',
      ubahn: '/assets/neo-neukoelln/audio/ubahn.mp3',
      gametheme: '/assets/neo-neukoelln/audio/gametheme.mp3',
      boss: '/assets/neo-neukoelln/audio/boss_theme.mp3',
      
      // ROSEBUD sounds
      blips: '/assets/rosebud/audio/blips.mp3',
      boxing: '/assets/rosebud/audio/boxing1.mp3',
      computer: '/assets/rosebud/audio/computer.mp3',
      sleep: '/assets/rosebud/audio/sleep.mp3',
      
      // MIAMI VOICE sounds
      miami: '/assets/miami-voice/audio/miami.mp3',
      copa: '/assets/miami-voice/audio/copa.mp3',
      rainbow: '/assets/miami-voice/audio/rainbow.mp3',
      
      // Royal Rumble sounds
      punch: '/assets/royal-rumble/audio/punch.mp3',
      kick: '/assets/royal-rumble/audio/kick.mp3'
    };
  }
  
  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  
  async playRandomSound(intensity = 0.5) {
    await this.init();
    
    const sounds = Object.keys(this.soundLibrary);
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const soundPath = this.soundLibrary[randomSound];
    
    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.1 + (intensity * 0.3); // Keep it reasonable
      audio.playbackRate = 0.5 + (Math.random() * 2); // Random speed
      
      // Add random effects based on intensity
      if (intensity > 0.7) {
        // Chaos mode - play multiple sounds
        audio.loop = Math.random() > 0.5;
        setTimeout(() => {
          if (intensity > 0.9) {
            this.playRandomSound(intensity * 0.8); // Recursive chaos!
          }
        }, Math.random() * 2000);
      }
      
      audio.play().catch(e => console.log('Audio play failed:', e));
      this.currentSounds.push(audio);
      
      // Clean up finished sounds
      audio.addEventListener('ended', () => {
        const index = this.currentSounds.indexOf(audio);
        if (index > -1) {
          this.currentSounds.splice(index, 1);
        }
      });
      
    } catch (error) {
      console.log('Audio chaos error:', error);
    }
  }
  
  stopAllSounds() {
    this.currentSounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.currentSounds = [];
  }
  
  setVolume(volume) {
    this.currentSounds.forEach(audio => {
      audio.volume = Math.max(0, Math.min(1, volume));
    });
  }
}

export default new AudioChaos();