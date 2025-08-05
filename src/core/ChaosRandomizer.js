// CHAOS RANDOMIZER - The brain of asset chaos
// This ensures EVERY mutation gets DIFFERENT, RANDOM assets every time

class ChaosRandomizer {
  constructor() {
    this.assetPool = {
      images: [],
      videos: [],
      audio: [],
      text: [],
      all: []
    };
    
    this.recentlyUsed = new Set();
    this.maxRecentSize = 50;
    this.manualAssets = [];
    this.initialized = false;
  }

  async initialize(assetLibrary) {
    if (this.initialized) return;
    
    console.log('🎲 Initializing Chaos Randomizer...');
    
    // Load all assets from library
    await this.loadAssetPool(assetLibrary);
    
    // Load manual picks with priority
    await this.loadManualPicks();
    
    this.initialized = true;
    console.log(`🎰 Chaos Randomizer ready! Total assets: ${this.assetPool.all.length}`);
    console.log(`📹 Videos: ${this.assetPool.videos.length}`);
    console.log(`🖼️ Images: ${this.assetPool.images.length}`);
    console.log(`🎵 Audio: ${this.assetPool.audio.length}`);
  }

  async loadAssetPool(assetLibrary) {
    if (!assetLibrary) return;

    // Get manifest for curated assets
    const manifest = assetLibrary.getCuratedManifest ? assetLibrary.getCuratedManifest() : null;
    
    // Process essentials
    if (manifest?.essentials) {
      manifest.essentials.forEach(asset => {
        const assetObj = {
          url: asset.curated,
          path: asset.curated,
          type: asset.type,
          name: asset.original.split('/').pop(),
          project: asset.original.split('/')[2],
          isEssential: true
        };
        
        // Add to specific type pool
        if (asset.type === 'images') {
          this.assetPool.images.push(assetObj);
        } else if (asset.type === 'video') {
          this.assetPool.videos.push(assetObj);
        } else if (asset.type === 'audio') {
          this.assetPool.audio.push(assetObj);
        }
        
        this.assetPool.all.push(assetObj);
      });
    }

    // Add hardcoded video paths for vibetales characters
    const characterVideos = [
      'abu', 'alex', 'banane', 'bikolai', 'blobby', 'boehmi', 
      'dattel', 'fluffi', 'georg', 'gisela', 'henning', 'jordan',
      'kannz', 'karl_kowalski', 'klaro', 'marco', 'memenews',
      'milly', 'npc', 'pumukinski', 'ranicki', 'sim_willy', 'solveigh', 'troy'
    ];

    characterVideos.forEach(character => {
      const videoObj = {
        url: `/assets-curated/essentials/vibetales/video/${character}_states.webm`,
        path: `/assets-curated/essentials/vibetales/video/${character}_states.webm`,
        type: 'video',
        name: `${character}_states.webm`,
        project: 'vibetales',
        character: character,
        isCharacterVideo: true
      };
      this.assetPool.videos.push(videoObj);
      this.assetPool.all.push(videoObj);
    });

    // Also add any videos already in the curated folder
    const existingVideos = [
      'blobgpt-animation.mp4',
      'blobgpt-animation_inverted.mp4',
      'blobgpt-animation_colorshift.mp4',
      'Der Kanzler Simulator 👾.mp4',
      'Der Kanzler Simulator 👾_2x.mp4',
      'BrentWilly_16_9.mp4',
      'BrentWilly_16_9_2x.mp4',
      'GehWeidaRoboter2.mp4',
      'GehWeidaRoboter2_mirror.mp4'
    ];

    existingVideos.forEach(video => {
      const project = video.includes('blob') ? 'blobtv' : 'vibetales';
      const videoObj = {
        url: `/assets-curated/essentials/${project}/video/${video}`,
        path: `/assets-curated/essentials/${project}/video/${video}`,
        type: 'video',
        name: video,
        project: project,
        isVideo: true
      };
      this.assetPool.videos.push(videoObj);
      this.assetPool.all.push(videoObj);
    });
  }

  async loadManualPicks() {
    try {
      const response = await fetch('/assets-curated/manual-picks/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        if (manifest.assets) {
          manifest.assets.forEach(asset => {
            const assetObj = {
              url: `/assets-curated/manual-picks/${asset.path}`,
              path: `/assets-curated/manual-picks/${asset.path}`,
              type: asset.type,
              name: asset.path.split('/').pop(),
              project: 'manual-picks',
              priority: asset.priority || 'high',
              isManualPick: true
            };
            
            this.manualAssets.push(assetObj);
            this.assetPool.all.push(assetObj);
            
            // Add to type-specific pools
            if (asset.type === 'images') {
              this.assetPool.images.push(assetObj);
            } else if (asset.type === 'video') {
              this.assetPool.videos.push(assetObj);
            } else if (asset.type === 'audio') {
              this.assetPool.audio.push(assetObj);
            }
          });
          console.log(`🎨 Loaded ${this.manualAssets.length} manual picks`);
        }
      }
    } catch (error) {
      console.log('📁 No manual picks found (this is normal)');
    }
  }

  // Get random assets with anti-repetition
  getRandomAssets(type = 'all', count = 10, options = {}) {
    const pool = type === 'all' ? this.assetPool.all : this.assetPool[type] || [];
    
    if (pool.length === 0) {
      console.warn(`⚠️ No assets in pool for type: ${type}`);
      return [];
    }

    // Filter out recently used if we have enough assets
    let availablePool = pool;
    if (pool.length > count * 2) {
      availablePool = pool.filter(asset => !this.recentlyUsed.has(asset.url));
    }

    // If we filtered too much, use full pool
    if (availablePool.length < count) {
      availablePool = pool;
      this.recentlyUsed.clear(); // Reset recently used
    }

    // Prioritize manual picks (30% chance if available)
    const selected = [];
    const manualInType = this.manualAssets.filter(a => 
      type === 'all' || a.type === type
    );

    // Add some manual picks first (if any)
    if (manualInType.length > 0 && Math.random() < 0.3) {
      const manualCount = Math.min(
        Math.ceil(count * 0.3),
        manualInType.length
      );
      for (let i = 0; i < manualCount; i++) {
        const randomManual = manualInType[Math.floor(Math.random() * manualInType.length)];
        selected.push(randomManual);
        this.recentlyUsed.add(randomManual.url);
      }
    }

    // Fill the rest with random selections
    const remaining = count - selected.length;
    const shuffled = [...availablePool].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(remaining, shuffled.length); i++) {
      selected.push(shuffled[i]);
      this.recentlyUsed.add(shuffled[i].url);
    }

    // Maintain max recent size
    if (this.recentlyUsed.size > this.maxRecentSize) {
      const items = Array.from(this.recentlyUsed);
      this.recentlyUsed = new Set(items.slice(-this.maxRecentSize));
    }

    return selected;
  }

  // Get a diverse mix of asset types
  getDiverseMix(counts = { images: 10, videos: 5, audio: 3 }) {
    const mix = {
      images: this.getRandomAssets('images', counts.images || 10),
      videos: this.getRandomAssets('videos', counts.videos || 5),
      audio: this.getRandomAssets('audio', counts.audio || 3)
    };

    mix.all = [...mix.images, ...mix.videos, ...mix.audio];
    return mix;
  }

  // Get assets with specific characteristics
  getThemedAssets(theme, count = 10) {
    let filtered = this.assetPool.all;

    // Filter by theme/project if specified
    if (theme) {
      filtered = filtered.filter(asset => {
        return asset.project === theme || 
               asset.name.toLowerCase().includes(theme.toLowerCase()) ||
               (asset.character && asset.character.includes(theme));
      });
    }

    // Randomize and return
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Special method for getting character videos
  getCharacterVideos(count = 5) {
    const characterVideos = this.assetPool.videos.filter(v => v.isCharacterVideo);
    const shuffled = [...characterVideos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Get high-priority assets (manual picks + featured)
  getPriorityAssets(type = 'all', count = 5) {
    const priority = this.manualAssets.filter(a => 
      type === 'all' || a.type === type
    );
    
    const shuffled = [...priority].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    // If we need more, add random ones
    if (selected.length < count) {
      const additional = this.getRandomAssets(type, count - selected.length);
      selected.push(...additional);
    }
    
    return selected;
  }

  // Force refresh the randomizer (clears recently used)
  refresh() {
    this.recentlyUsed.clear();
    console.log('🔄 Chaos Randomizer refreshed!');
  }

  // Get statistics
  getStats() {
    return {
      totalAssets: this.assetPool.all.length,
      images: this.assetPool.images.length,
      videos: this.assetPool.videos.length,
      audio: this.assetPool.audio.length,
      manualPicks: this.manualAssets.length,
      recentlyUsedCount: this.recentlyUsed.size
    };
  }
}

// Export singleton instance
const chaosRandomizer = new ChaosRandomizer();
export default chaosRandomizer;