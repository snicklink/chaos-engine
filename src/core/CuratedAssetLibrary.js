// CURATED ASSET LIBRARY - Optimized for deployment
// Uses curated assets instead of full 2.5GB collection

class CuratedAssetLibrary {
  constructor() {
    this.manifest = null;
    this.assets = {
      images: {},
      audio: {},
      video: {},
      models: {},
      data: {},
      code: {},
      text: {},
      fonts: {}
    };
    
    this.allAssets = [];
    this.assetsByType = {};
    this.assetsByProject = {};
    this.manualPicks = [];
    
    // Use curated assets for deployment, original for dev
    this.assetBasePath = process.env.NODE_ENV === 'production' 
      ? '/assets-curated' 
      : '/assets-curated'; // Always use curated now
    
    this.essentialsPath = `${this.assetBasePath}/essentials`;
    this.manualPicksPath = `${this.assetBasePath}/manual-picks`;
  }
  
  async loadAllAssets() {
    try {
      // Load manifest
      const manifestResponse = await fetch(`${this.assetBasePath}/manifest.json`);
      this.manifest = await manifestResponse.json();
      
      console.log('📦 Loading curated assets...');
      console.log(`📊 Total size: ${this.manifest.stats.totalSizeMB}MB`);
      
      // Load manual picks first (priority)
      await this.loadManualPicks();
      
      // Load essential assets
      await this.loadEssentialAssets();
      
      console.log('✅ Curated assets loaded!');
      console.log(`🎯 Loaded ${this.allAssets.length} curated assets`);
      console.log(`🎨 Including ${this.manualPicks.length} manual picks`);
      
      return this.assets;
    } catch (error) {
      console.error('❌ Failed to load curated assets:', error);
      // Fallback to procedural generation
      this.loadProceduralAssets();
      return this.assets;
    }
  }
  
  async loadManualPicks() {
    if (!this.manifest?.manualPicks?.assets) return;
    
    console.log(`🎨 Loading ${this.manifest.manualPicks.assets.length} manual picks...`);
    
    for (const pick of this.manifest.manualPicks.assets) {
      const asset = {
        name: pick.path.split('/').pop(),
        path: `${this.manualPicksPath}/${pick.path}`,
        type: pick.type,
        project: 'manual-picks',
        priority: pick.priority || 'normal',
        isManualPick: true
      };
      
      this.manualPicks.push(asset);
      this.allAssets.push(asset);
      
      // Add to type collections
      if (!this.assetsByType[asset.type]) {
        this.assetsByType[asset.type] = [];
      }
      this.assetsByType[asset.type].push(asset);
    }
  }
  
  async loadEssentialAssets() {
    if (!this.manifest?.essentials) return;
    
    console.log(`📦 Loading ${this.manifest.essentials.length} essential assets...`);
    
    // Process each essential asset from manifest
    for (const essential of this.manifest.essentials) {
      const project = essential.project || 'core';
      const asset = {
        name: essential.name,
        path: `${this.assetBasePath}/${essential.path}`, // Full path to curated asset
        type: essential.type,
        project: project,
        size: essential.size,
        isEssential: true
      };
      
      // Initialize structures if needed
      if (!this.assets[essential.type]) {
        this.assets[essential.type] = {};
      }
      if (!this.assets[essential.type][project]) {
        this.assets[essential.type][project] = [];
      }
      if (!this.assetsByProject[project]) {
        this.assetsByProject[project] = [];
      }
      if (!this.assetsByType[essential.type]) {
        this.assetsByType[essential.type] = [];
      }
      
      // Add to collections
      this.assets[essential.type][project].push(essential.name);
      this.allAssets.push(asset);
      this.assetsByProject[project].push(asset);
      this.assetsByType[essential.type].push(asset);
    }
    
    // Log loaded projects
    const projects = Object.keys(this.assetsByProject);
    console.log(`📁 Assets loaded from ${projects.length} projects:`, projects);
  }
  
  getEssentialAssetsForProject(project, type) {
    // Hardcoded essentials based on our mutations
    const essentials = {
      'neo-neukoelln': {
        images: ['mutumbo.png', 'doener_kebap.webp', 'gamelogo.png', 'sidewalk.webp', 
                 'ubahn1.webp', 'doener_dealer.png', 'hipster.png', 'techno_girl.png'],
        audio: ['techno.mp3'],
        video: []
      },
      'miami-voice': {
        images: ['tico.png', 'palm.png', 'skyline.png', 'sun.svg', 'cocktail.png'],
        audio: ['miami.mp3', 'weee.mp3'],
        video: []
      },
      'blobtv': {
        images: ['blobtv_logo.png', 'SimWilly_sm.png', 'offline.jpg'],
        audio: [],
        video: []
      },
      'derpaket': {
        images: ['DerPaket_logo.png', 'snicklink-logo.png'],
        audio: [],
        video: []
      },
      'ikigaii': {
        images: ['logo.png'],
        audio: [],
        video: []
      },
      'rosebud': {
        images: [],
        audio: ['Die Willy Theme.mp3', 'Willy im Hyperflow.mp3'],
        video: []
      },
      'vibegame-site': {
        images: ['simwilly.jpg'],
        audio: [],
        video: []
      }
    };
    
    return essentials[project]?.[type] || [];
  }
  
  loadProceduralAssets() {
    // Fallback: Generate procedural assets
    console.log('🎨 Generating procedural fallback assets...');
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const shapes = ['circle', 'square', 'triangle', 'hexagon'];
    
    // Generate colored shape "assets"
    for (let i = 0; i < 20; i++) {
      const asset = {
        name: `procedural-${i}.svg`,
        path: `data:image/svg+xml,${this.generateSVG(colors[i % colors.length], shapes[i % shapes.length])}`,
        type: 'images',
        project: 'procedural',
        isProcedural: true
      };
      
      this.allAssets.push(asset);
    }
  }
  
  generateSVG(color, shape) {
    const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${color}" />
    </svg>`;
    return encodeURIComponent(svg);
  }
  
  detectAssetType(path) {
    const ext = path.split('.').pop().toLowerCase();
    const typeMap = {
      'png': 'images', 'jpg': 'images', 'jpeg': 'images', 'webp': 'images', 'gif': 'images', 'svg': 'images',
      'mp3': 'audio', 'wav': 'audio', 'ogg': 'audio', 'webm': 'audio',
      'mp4': 'video', 'mov': 'video',
      'glb': 'models', 'gltf': 'models',
      'json': 'data',
      'js': 'code', 'jsx': 'code', 'ts': 'code', 'tsx': 'code',
      'md': 'text', 'txt': 'text',
      'ttf': 'fonts', 'otf': 'fonts', 'woff': 'fonts', 'woff2': 'fonts'
    };
    return typeMap[ext] || 'data';
  }
  
  
  getRandomAssetWithPath(type = null) {
    const asset = this.getRandomAsset(type);
    
    // If asset is already an object with path, return it
    if (asset && typeof asset === 'object' && asset.path) {
      return asset;
    }
    
    // Fallback to placeholder
    return { 
      path: '/assets-curated/essentials/placeholder.svg', 
      name: 'placeholder',
      type: 'images',
      project: 'fallback'
    };
  }
  
  getAssetsByProject(project) {
    return this.assetsByProject[project] || [];
  }
  
  getManualPicks() {
    return this.manualPicks;
  }
  
  hasManualPicks() {
    return this.manualPicks.length > 0;
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  getStats() {
    return {
      total: this.allAssets.length,
      byType: this.assetsByType,
      byProject: this.assetsByProject,
      manifest: this.manifest,
      manualPicks: this.manualPicks.length,
      totalSize: this.manifest?.stats?.totalSize || 0,
      totalSizeMB: this.manifest?.stats?.totalSizeMB || '0'
    };
  }
  
  getRandomColor() {
    // Use colors from manifest if available
    if (this.manifest?.colors && this.manifest.colors.length > 0) {
      return this.manifest.colors[Math.floor(Math.random() * this.manifest.colors.length)];
    }
    
    // Fallback to a curated palette of chaos colors
    const chaosColors = [
      '#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF',
      '#06FFB4', '#FF4365', '#FE6B35', '#F7931E', '#C1FF72',
      '#00F5FF', '#FF10F0', '#39FF14', '#FF073A', '#04E762'
    ];
    
    return chaosColors[Math.floor(Math.random() * chaosColors.length)];
  }
  
  getRandomProjectAsset(project) {
    const assets = this.assetsByProject[project];
    if (!assets || assets.length === 0) return null;
    return assets[Math.floor(Math.random() * assets.length)];
  }
  
  getMixedAssets(count = 5) {
    const mixed = [];
    
    // Prioritize manual picks
    if (this.manualPicks.length > 0) {
      const pickCount = Math.min(Math.floor(count * 0.4), this.manualPicks.length);
      for (let i = 0; i < pickCount; i++) {
        mixed.push(this.manualPicks[Math.floor(Math.random() * this.manualPicks.length)]);
      }
    }
    
    // Fill rest with random assets
    const remaining = count - mixed.length;
    for (let i = 0; i < remaining && i < this.allAssets.length; i++) {
      mixed.push(this.allAssets[Math.floor(Math.random() * this.allAssets.length)]);
    }
    
    return mixed;
  }
  
  // Compatible with both old and new style calls
  getRandomAsset(category, project, type) {
    // If called with one parameter or less, treat as type filter
    if (arguments.length <= 1) {
      // Prioritize manual picks (40% chance)
      if (Math.random() < 0.4 && this.manualPicks.length > 0) {
        const picks = category ? 
          this.manualPicks.filter(a => a.type === category) : 
          this.manualPicks;
        
        if (picks.length > 0) {
          return picks[Math.floor(Math.random() * picks.length)];
        }
      }
      
      // Otherwise use normal selection
      const assets = category ? 
        (this.assetsByType[category] || []) : 
        this.allAssets;
      
      return assets[Math.floor(Math.random() * assets.length)] || null;
    }
    
    // Old style compatibility (category, project, type)
    const projectAssets = this.assetsByProject[project];
    if (!projectAssets || projectAssets.length === 0) return null;
    
    const filtered = projectAssets.filter(a => a.type === category);
    if (filtered.length === 0) return null;
    
    return filtered[Math.floor(Math.random() * filtered.length)]?.name || null;
  }
}

export default CuratedAssetLibrary;