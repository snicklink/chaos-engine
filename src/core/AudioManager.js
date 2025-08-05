import AudioChaos from './AudioChaos';

class AudioManager {
  constructor() {
    this.audioChaos = AudioChaos;
    this.isEnabled = false;
    this.currentPhase = 'calm';
    this.currentIntensity = 0;
    this.phaseIntervals = {};
    this.collageMode = false;
    this.collageAudios = [];
    this.ambientTrack = null;
    this.usedAudioHistory = [];
    this.maxHistorySize = 10;
    
    // Full curated audio catalog
    this.audioLibrary = {
      ambient: [
        '/assets-curated/essentials/rosebud/audio/Die Willy Theme.mp3',
        '/assets-curated/essentials/rosebud/audio/Willy im Hyperflow.mp3',
        '/assets-curated/essentials/vibetales/audio/beat1.mp3',
        '/assets-curated/essentials/vibetales/audio/electro.mp3',
        '/assets-curated/essentials/miami-voice/audio/miami.mp3',
        '/assets-curated/essentials/neo-neukoelln/audio/techno.mp3'
      ],
      effects: [
        '/assets-curated/essentials/miami-voice/audio/disco.mp3',
        '/assets-curated/essentials/miami-voice/audio/weee.mp3',
        '/assets-curated/essentials/rosebud/audio/blips.mp3',
        '/assets-curated/essentials/rosebud/audio/computer.mp3',
        '/assets-curated/essentials/royal-rumble/audio/kick.mp3',
        '/assets-curated/essentials/royal-rumble/audio/punch.mp3',
        '/assets-curated/essentials/vibetales/audio/jingle1.mp3'
      ],
      videos: [
        '/assets-curated/essentials/vibetales/audio/blobby_states.webm',
        '/assets-curated/essentials/vibetales/audio/marco_states.webm',
        '/assets-curated/essentials/vibetales/audio/blobby_states_glitch.mp4',
        '/assets-curated/essentials/vibetales/audio/blobby_states_inverted.mp4',
        '/assets-curated/essentials/vibetales/audio/marco_states_inverted.mp4'
      ]
    };
  }

  // Get a random audio avoiding recent plays
  getRandomAudio(category = 'all') {
    let audioPool = [];
    
    if (category === 'all') {
      audioPool = [...this.audioLibrary.ambient, ...this.audioLibrary.effects];
    } else if (this.audioLibrary[category]) {
      audioPool = this.audioLibrary[category];
    }
    
    // Filter out recently used audio
    const availableAudio = audioPool.filter(audio => !this.usedAudioHistory.includes(audio));
    
    // If all have been used, reset history
    if (availableAudio.length === 0) {
      this.usedAudioHistory = [];
      return audioPool[Math.floor(Math.random() * audioPool.length)];
    }
    
    const selected = availableAudio[Math.floor(Math.random() * availableAudio.length)];
    
    // Add to history
    this.usedAudioHistory.push(selected);
    if (this.usedAudioHistory.length > this.maxHistorySize) {
      this.usedAudioHistory.shift();
    }
    
    return selected;
  }

  // Initialize audio system (requires user interaction)
  async init() {
    if (!this.isEnabled) {
      await this.audioChaos.init();
      this.isEnabled = true;
      console.log('🔊 Audio Manager initialized with full asset variety');
    }
  }

  // Update phase and intensity
  updatePhase(phase, intensity) {
    console.log('🎶 AudioManager phase update:', phase, 'intensity:', intensity);
    this.currentPhase = phase;
    this.currentIntensity = intensity;
    
    // FIRST: Clean up all previous audio completely
    this.cleanupAllAudio();
    
    // THEN: Handle new phase with variety
    switch(phase) {
      case 'calm':
        this.playAmbientLayer();
        break;
        
      case 'build':
        this.startBuildUp();
        break;
        
      case 'chaos':
        this.startCollageMode();
        break;
        
      case 'fade':
        this.fadeOutAll();
        break;
    }
  }

  // Clean up all audio before phase transition
  cleanupAllAudio() {
    console.log('🧹 Cleaning up all audio...');
    
    // Clear all intervals
    Object.values(this.phaseIntervals).forEach(interval => clearInterval(interval));
    this.phaseIntervals = {};
    
    // Stop collage mode immediately
    this.collageMode = false;
    
    // Stop all collage audios immediately
    this.collageAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.collageAudios = [];
    
    // Stop ambient track immediately
    if (this.ambientTrack) {
      this.ambientTrack.pause();
      this.ambientTrack.currentTime = 0;
      this.ambientTrack = null;
    }
    
    // Stop any AudioChaos sounds
    this.audioChaos.stopAllSounds();
  }

  // Play ambient background layer with variety
  playAmbientLayer() {
    if (!this.isEnabled) return;
    
    const randomAmbient = this.getRandomAudio('ambient');
    
    try {
      this.ambientTrack = new Audio(randomAmbient);
      this.ambientTrack.volume = 0.15;
      this.ambientTrack.loop = true;
      this.ambientTrack.play()
        .then(() => console.log('🎵 Playing ambient:', randomAmbient.split('/').pop()))
        .catch(e => console.log('Ambient play failed:', e));
    } catch (error) {
      console.log('Ambient layer error:', error);
    }
  }

  // Build phase - increasing intensity with variety
  startBuildUp() {
    if (!this.isEnabled) return;
    
    // Play varied sounds at increasing frequency
    this.phaseIntervals.build = setInterval(() => {
      const chance = this.currentIntensity;
      if (Math.random() < chance) {
        this.playEventSound('random', { volume: this.currentIntensity * 0.3 });
      }
    }, 2000 - (this.currentIntensity * 1500));
  }

  // Chaos phase - diverse audio collage
  startCollageMode() {
    if (!this.isEnabled) return;
    
    this.collageMode = true;
    console.log('🎵 Starting diverse audio collage mode!');
    
    // Stop ambient
    if (this.ambientTrack) {
      this.ambientTrack.pause();
      this.ambientTrack = null;
    }
    
    // Create layered audio collage with full variety
    const createCollageLayer = () => {
      if (!this.collageMode) return;
      
      const randomAudio = this.getRandomAudio('all');
      
      try {
        const audio = new Audio(randomAudio);
        audio.volume = 0.08 + Math.random() * 0.12; // Keep layers quiet but audible
        audio.playbackRate = 0.7 + Math.random() * 1.6;
        
        // Random start time for variety
        audio.currentTime = Math.random() * 5;
        
        audio.play()
          .then(() => console.log('🔊 Collage layer:', randomAudio.split('/').pop()))
          .catch(e => console.log('Collage layer failed:', e));
          
        this.collageAudios.push(audio);
        
        // Remove finished audios
        audio.addEventListener('ended', () => {
          const index = this.collageAudios.indexOf(audio);
          if (index > -1) {
            this.collageAudios.splice(index, 1);
          }
        });
        
        // Keep max 6 diverse layers
        if (this.collageAudios.length > 6) {
          const oldest = this.collageAudios.shift();
          oldest.pause();
        }
        
      } catch (error) {
        console.log('Collage layer error:', error);
      }
    };
    
    // Start creating diverse layers
    createCollageLayer(); // First layer immediately
    this.phaseIntervals.chaos = setInterval(() => {
      if (this.collageMode && Math.random() < this.currentIntensity) {
        createCollageLayer();
      }
    }, 800 + Math.random() * 1500);
  }

  // Stop collage mode
  stopCollageMode() {
    this.collageMode = false;
    
    // Stop immediately for cleaner transitions
    this.collageAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    this.collageAudios = [];
  }

  // Fade phase - fade everything out
  fadeOutAll() {
    // Use cleanup for immediate stop
    this.cleanupAllAudio();
  }

  // Play sound effect for specific events with variety
  playEventSound(event, options = {}) {
    if (!this.isEnabled) return;
    
    const eventSounds = {
      collision: [
        '/assets-curated/essentials/royal-rumble/audio/punch.mp3', 
        '/assets-curated/essentials/royal-rumble/audio/kick.mp3',
        '/assets-curated/essentials/miami-voice/audio/weee.mp3'
      ],
      portal: [
        '/assets-curated/essentials/rosebud/audio/blips.mp3', 
        '/assets-curated/essentials/rosebud/audio/computer.mp3',
        '/assets-curated/essentials/vibetales/audio/jingle1.mp3'
      ],
      transformation: [
        '/assets-curated/essentials/miami-voice/audio/disco.mp3',
        '/assets-curated/essentials/vibetales/audio/electro.mp3'
      ],
      achievement: [
        '/assets-curated/essentials/rosebud/audio/Die Willy Theme.mp3',
        '/assets-curated/essentials/vibetales/audio/beat1.mp3'
      ],
      random: [...this.audioLibrary.effects]
    };
    
    const sounds = eventSounds[event] || eventSounds.random;
    const soundPath = sounds[Math.floor(Math.random() * sounds.length)];
    
    try {
      const audio = new Audio(soundPath);
      audio.volume = options.volume || 0.25;
      audio.playbackRate = options.playbackRate || (0.9 + Math.random() * 0.2);
      audio.play()
        .then(() => console.log('🎵 Event sound:', soundPath.split('/').pop()))
        .catch(e => console.log('Event sound failed:', e));
    } catch (error) {
      console.log('Event sound error:', error);
    }
  }

  // Set master volume
  setMasterVolume(volume) {
    this.audioChaos.setVolume(volume);
    if (this.ambientTrack) {
      this.ambientTrack.volume = volume * 0.5;
    }
    this.collageAudios.forEach(audio => {
      audio.volume = volume * 0.2;
    });
  }

  // Clean up
  destroy() {
    console.log('🔇 Destroying AudioManager...');
    this.cleanupAllAudio();
    this.isEnabled = false;
  }
}

// Export singleton instance
export default new AudioManager();