// ASSET PRELOADER - Aggressive caching and optimization for smooth chaos

class AssetPreloader {
  constructor() {
    if (AssetPreloader.instance) {
      return AssetPreloader.instance;
    }
    
    this.cache = new Map();
    this.loadingQueue = [];
    this.preloadedSets = new Map();
    this.maxCacheSize = 200; // Limit memory usage
    this.loadingPromises = new Map();
    
    // Performance tracking
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      totalLoaded: 0,
      failedLoads: 0
    };
    
    AssetPreloader.instance = this;
  }
  
  // Quick check if mutation is already cached
  isMutationCached(mutationId) {
    return this.preloadedSets.has(mutationId);
  }

  // Preload asset sets for specific mutations
  async preloadMutationAssets(mutationId, assetLibrary) {
    if (this.preloadedSets.has(mutationId)) {
      console.log(`⚡ Using cached assets for ${mutationId} - INSTA SMOOTH!`);
      return this.preloadedSets.get(mutationId);
    }
    
    console.log(`🚀 Preloading assets for ${mutationId}...`);
    
    const assetSet = this.generateAssetSet(mutationId, assetLibrary);
    const preloadPromises = [];
    
    // Preload images (filter out invalid paths first)
    assetSet.images.forEach(asset => {
      if (!asset?.path) return;
      if (asset.path.includes('//') || asset.path.includes('vite.svg')) return;
      if (!this.cache.has(asset.path)) {
        const promise = this.preloadImage(asset.path);
        preloadPromises.push(promise);
      }
    });
    
    // Wait for critical assets (first batch)
    const criticalAssets = preloadPromises.slice(0, 10);
    await Promise.allSettled(criticalAssets);
    
    // Load remaining assets in background
    if (preloadPromises.length > 10) {
      Promise.allSettled(preloadPromises.slice(10)).then(() => {
        console.log(`✅ Background preload complete for ${mutationId}`);
      });
    }
    
    this.preloadedSets.set(mutationId, assetSet);
    return assetSet;
  }
  
  generateAssetSet(mutationId, assetLibrary) {
    const sets = {
      'real-asset-chaos': this.generateChaosAssetSet(assetLibrary),
      'quantum-evolution': this.generateQuantumAssetSet(assetLibrary),
      'sophisticated-chaos': this.generateSophisticatedAssetSet(assetLibrary),
      'asset-chaos-overflow': this.generateOverflowAssetSet(assetLibrary)
    };
    
    return sets[mutationId] || this.generateDefaultAssetSet(assetLibrary);
  }
  
  generateChaosAssetSet(assetLibrary) {
    const assets = {
      images: [],
      audio: [],
      video: []
    };
    
    // Pre-select guaranteed working assets (verified paths only)
    const guaranteedAssets = [
      '/assets/neo-neukoelln/images/mutumbo.png',
      '/assets/neo-neukoelln/images/doener_kebap.webp',
      '/assets/neo-neukoelln/images/hipster.png',
      '/assets/neo-neukoelln/images/techno_girl.png',
      '/assets/miami-voice/images/tico.png',
      '/assets/miami-voice/images/palm.png',
      '/assets/blobtv/images/blobtv_logo.png',
      '/assets/derpaket/images/DerPaket_logo.png',
      '/assets/ikigaii/images/logo.png',
      '/assets/neo-neukoelln/images/gamelogo.png',
      '/assets/miami-voice/images/heli.png',
      '/assets/miami-voice/images/cocktail.png',
      '/assets/neo-neukoelln/images/aggressive_pigeon.png',
      '/assets/vibegame-site/images/simwilly.jpg'
    ].filter(path => !path.includes('//') && !path.includes('vite.svg'));
    
    guaranteedAssets.forEach(path => {
      assets.images.push({ path, name: path.split('/').pop() });
    });
    
    // Add random selections
    if (assetLibrary?.assetsByType?.images) {
      const randomImages = assetLibrary.assetsByType.images
        .slice(0, 30) // Limit for performance
        .filter(asset => !guaranteedAssets.includes(asset.path));
      
      assets.images.push(...randomImages);
    }
    
    return assets;
  }
  
  generateQuantumAssetSet(assetLibrary) {
    return {
      images: this.selectBestAssets(assetLibrary, 'images', 25),
      audio: this.selectBestAssets(assetLibrary, 'audio', 5),
      video: this.selectBestAssets(assetLibrary, 'video', 3)
    };
  }
  
  generateSophisticatedAssetSet(assetLibrary) {
    // Select high-quality, diverse assets
    const curated = {
      images: [],
      audio: [],
      video: []
    };
    
    // Curated selection for sophisticated modes
    const sophisticatedAssets = [
      '/assets/ikigaii/images/logo.png',
      '/assets/blobtv/images/blobtv_logo.png',
      '/assets/derpaket/images/DerPaket_logo.png',
      '/assets/neo-neukoelln/images/gamelogo.png',
      '/assets/miami-voice/images/logo.png',
      '/assets/neo-neukoelln/images/mutumbo.png',
      '/assets/miami-voice/images/tico.png',
      '/assets/vibegame-site/images/simwilly.jpg'
    ];
    
    sophisticatedAssets.forEach(path => {
      curated.images.push({ path, name: path.split('/').pop() });
    });
    
    return curated;
  }
  
  generateOverflowAssetSet(assetLibrary) {
    // Maximum chaos - load everything we can
    return {
      images: this.selectBestAssets(assetLibrary, 'images', 50),
      audio: this.selectBestAssets(assetLibrary, 'audio', 10),
      video: this.selectBestAssets(assetLibrary, 'video', 5)
    };
  }
  
  generateDefaultAssetSet(assetLibrary) {
    return {
      images: this.selectBestAssets(assetLibrary, 'images', 15),
      audio: this.selectBestAssets(assetLibrary, 'audio', 3),
      video: this.selectBestAssets(assetLibrary, 'video', 1)
    };
  }
  
  selectBestAssets(assetLibrary, type, count) {
    if (!assetLibrary?.assetsByType?.[type]) return [];
    
    // Prioritize known working assets and fix path issues
    const assets = assetLibrary.assetsByType[type]
      .filter(asset => {
        if (!asset?.path) return false;
        if (asset.path.includes('undefined')) return false;
        // Filter out double slashes and vite.svg files
        if (asset.path.includes('//') || asset.path.includes('vite.svg')) return false;
        return true;
      })
      .slice(0, count);
    
    return assets;
  }
  
  async preloadImage(src) {
    if (this.cache.has(src)) {
      this.stats.cacheHits++;
      return this.cache.get(src);
    }
    
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }
    
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.stats.totalLoaded++;
        this.stats.cacheMisses++;
        this.cleanupCache();
        resolve(img);
      };
      
      img.onerror = () => {
        this.stats.failedLoads++;
        console.warn(`Failed to load asset: ${src}`);
        // Don't reject - just resolve with null to continue loading others
        resolve(null);
      };
      
      // Set timeout to prevent hanging
      setTimeout(() => {
        if (!img.complete) {
          this.stats.failedLoads++;
          console.warn(`Timeout loading asset: ${src}`);
          resolve(null);
        }
      }, 5000);
      
      img.src = src;
    });
    
    this.loadingPromises.set(src, promise);
    
    promise.finally(() => {
      this.loadingPromises.delete(src);
    });
    
    return promise;
  }
  
  cleanupCache() {
    if (this.cache.size > this.maxCacheSize) {
      // Remove oldest entries (simple LRU)
      const entries = Array.from(this.cache.entries());
      const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize + 10);
      
      toRemove.forEach(([key]) => {
        this.cache.delete(key);
      });
      
      console.log(`🧹 Cleaned up cache, removed ${toRemove.length} assets`);
    }
  }
  
  getCachedImage(src) {
    return this.cache.get(src);
  }
  
  isImageCached(src) {
    return this.cache.has(src);
  }
  
  getPreloadedSet(mutationId) {
    return this.preloadedSets.get(mutationId);
  }
  
  // Preload next likely mutations
  async preloadUpcoming(currentMutation, assetLibrary) {
    const upcomingMutations = this.predictNextMutations(currentMutation);
    
    const preloadPromises = upcomingMutations.map(mutationId => 
      this.preloadMutationAssets(mutationId, assetLibrary)
    );
    
    // Preload in background
    Promise.allSettled(preloadPromises).then(() => {
      console.log('📦 Upcoming mutations preloaded');
    });
  }
  
  predictNextMutations(currentMutation) {
    // Simple prediction based on common transitions
    const transitions = {
      'real-asset-chaos': ['sophisticated-chaos', 'quantum-evolution'],
      'sophisticated-chaos': ['real-asset-chaos', 'quantum-evolution'],
      'quantum-evolution': ['sophisticated-chaos', 'asset-chaos-overflow'],
      'asset-chaos-overflow': ['real-asset-chaos', 'sophisticated-chaos']
    };
    
    return transitions[currentMutation?.id] || ['sophisticated-chaos'];
  }
  
  getStats() {
    const hitRate = this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) || 0;
    
    return {
      ...this.stats,
      hitRate: (hitRate * 100).toFixed(1) + '%',
      cacheSize: this.cache.size,
      preloadedSets: this.preloadedSets.size
    };
  }
  
  // Memory management
  clearCache() {
    this.cache.clear();
    this.preloadedSets.clear();
    this.loadingPromises.clear();
    console.log('🗑️ Asset cache cleared');
  }
  
  // Get optimized asset for rendering
  getOptimizedAsset(src, mutation) {
    const cached = this.getCachedImage(src);
    
    if (cached) {
      return {
        src: cached.src,
        loaded: true,
        width: cached.naturalWidth,
        height: cached.naturalHeight
      };
    }
    
    // Return placeholder while loading
    return {
      src: src,
      loaded: false,
      placeholder: true
    };
  }
}

// Singleton instance
AssetPreloader.instance = null;

export default AssetPreloader;