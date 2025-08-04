class AssetLibrary {
  constructor() {
    this.assets = {
      images: {},
      audio: {},
      text: {},
      code: {},
      video: {},
      models: {},
      data: {},
      fonts: {}
    };
    
    this.manifest = null;
    this.allAssets = [];
    this.assetsByType = {};
    this.assetsByProject = {};
    
    this.assetBasePath = '/assets';
    this.projectMap = {
      'blobtv': 'blobtv',
      'neo-neukoelln': 'neo-neukoelln',
      'neoNeukoelln': 'neo-neukoelln',
      'rosebud': 'rosebud',
      'royal-rumble': 'royal-rumble',
      'royalRumble': 'royal-rumble',
      'vibetales': 'vibetales',
      'derpaket': 'derpaket',
      'miami-voice': 'miami-voice',
      'miamiVoice': 'miami-voice',
      'ikigaii': 'ikigaii',
      'vibegame-site': 'vibegame-site',
      'vibegameSite': 'vibegame-site'
    };
  }
  
  async loadAllAssets() {
    console.log('🧬 Loading chaos manifest...');
    
    try {
      // Load the manifest
      const manifestResponse = await fetch('/assets/chaos-manifest.json');
      this.manifest = await manifestResponse.json();
      
      console.log(`📊 Found ${this.manifest.totalAssets} total assets across ${this.manifest.projects.length} projects`);
      console.log(`🎨 ${this.manifest.colors.length} unique colors`);
      console.log(`📝 ${this.manifest.snippets} code snippets`);
      console.log('📦 Asset breakdown:', this.manifest.breakdown);
      
      // Scan actual asset directories
      await this.scanAssetDirectories();
      
      console.log('✅ Asset loading complete!');
      console.log(`🎯 Loaded ${this.allAssets.length} actual assets`);
      
      return this.assets;
    } catch (error) {
      console.error('❌ Failed to load chaos manifest:', error);
      // Fallback to basic assets
      this.loadFallbackAssets();
      return this.assets;
    }
  }
  
  async scanAssetDirectories() {
    const assetTypes = {
      images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'],
      audio: ['.mp3', '.wav', '.webm', '.ogg', '.m4a'],
      video: ['.mp4', '.webm', '.mov'],
      models: ['.glb', '.gltf'],
      data: ['.json'],
      code: ['.js', '.jsx', '.ts', '.tsx', '.css'],
      text: ['.md', '.txt'],
      fonts: ['.ttf', '.otf', '.woff', '.woff2']
    };
    
    // Scan each project directory
    for (const project of this.manifest.projects) {
      const projectPath = `${this.assetBasePath}/${project}`;
      this.assets.images[project] = [];
      this.assets.audio[project] = [];
      this.assets.video[project] = [];
      this.assets.models[project] = [];
      this.assets.data[project] = [];
      this.assets.code[project] = [];
      this.assets.text[project] = [];
      this.assets.fonts[project] = [];
      
      this.assetsByProject[project] = [];
      
      // Check each asset type directory
      for (const [type, extensions] of Object.entries(assetTypes)) {
        try {
          const typePath = `${projectPath}/${type}`;
          const response = await fetch(typePath + '/');
          
          if (response.ok) {
            // Parse directory listing (this is a simplified approach)
            // In reality, we'd need a proper directory listing API
            const text = await response.text();
            const files = this.parseDirectoryListing(text, extensions);
            
            files.forEach(file => {
              const asset = {
                name: file,
                path: this.cleanPath(`${typePath}/${file}`),
                type: type,
                project: project
              };
              
              this.assets[type][project].push(file);
              this.allAssets.push(asset);
              this.assetsByProject[project].push(asset);
              
              if (!this.assetsByType[type]) {
                this.assetsByType[type] = [];
              }
              this.assetsByType[type].push(asset);
            });
          }
        } catch (e) {
          // Directory might not exist, that's ok
        }
      }
    }
    
    // Also load some known assets directly
    this.loadKnownAssets();
  }
  
  cleanPath(path) {
    // Remove double slashes and normalize path
    return path.replace(/\/+/g, '/');
  }

  parseDirectoryListing(html, extensions) {
    // Simple parser for directory listings
    const files = [];
    const links = html.match(/href="([^"]+)"/g) || [];
    
    links.forEach(link => {
      const filename = link.replace('href="', '').replace('"', '');
      // Filter out empty filenames, parent directories, and vite.svg
      if (filename && 
          filename !== '..' && 
          filename !== '.' && 
          !filename.includes('vite.svg') &&
          extensions.some(ext => filename.endsWith(ext))) {
        files.push(filename);
      }
    });
    
    return files;
  }
  
  loadKnownAssets() {
    // Add known assets that definitely exist
    const knownAssets = {
      'neo-neukoelln': {
        images: ['gamelogo.png', 'doener_kebap.webp'],
        audio: ['techno.mp3', 'gametheme.mp3', 'boss_theme.mp3', 'ubahn.mp3']
      },
      'miami-voice': {
        images: ['tico.png', 'tula1.png', 'sun.svg', 'skyline.png', 'palm.png'],
        audio: ['miami.mp3', 'copa.mp3', 'disco.mp3', 'shoot.mp3', 'weee.mp3']
      },
      'blobtv': {
        images: ['blobtv_logo.png', 'offline.jpg'],
        video: ['blobgpt-animation.mp4']
      },
      'ikigaii': {
        images: ['logo.png', 'ikigai_social.jpg'],
        audio: ['gong.mp3']
      },
      'derpaket': {
        images: ['DerPaket_logo.png', 'snicklink-logo.png'],
        audio: ['download (15).mp3', 'download (16).mp3']
      }
    };
    
    Object.entries(knownAssets).forEach(([project, assets]) => {
      Object.entries(assets).forEach(([type, files]) => {
        files.forEach(file => {
          const asset = {
            name: file,
            path: this.cleanPath(`${this.assetBasePath}/${project}/${type}/${file}`),
            type: type,
            project: project
          };
          
          if (!this.assets[type][project]) {
            this.assets[type][project] = [];
          }
          
          if (!this.assets[type][project].includes(file)) {
            this.assets[type][project].push(file);
            this.allAssets.push(asset);
            
            if (!this.assetsByProject[project]) {
              this.assetsByProject[project] = [];
            }
            this.assetsByProject[project].push(asset);
            
            if (!this.assetsByType[type]) {
              this.assetsByType[type] = [];
            }
            this.assetsByType[type].push(asset);
          }
        });
      });
    });
  }
  
  loadFallbackAssets() {
    // Minimal fallback assets
    this.assets.images.fallback = ['placeholder.svg'];
    this.assets.audio.fallback = [];
    console.log('⚠️ Using fallback assets');
  }
  
  getRandomAsset(category, project, type) {
    try {
      // Normalize project name
      const normalizedProject = this.projectMap[project] || project;
      
      // If type is provided, use the old logic
      if (type) {
        const projectAssets = this.assets[category]?.[normalizedProject]?.[type];
        if (!projectAssets || projectAssets.length === 0) return null;
        return projectAssets[Math.floor(Math.random() * projectAssets.length)];
      }
      
      // Otherwise get any asset from that category and project
      const projectAssets = this.assets[category]?.[normalizedProject];
      if (!projectAssets || projectAssets.length === 0) return null;
      
      // If it's an array, return random element
      if (Array.isArray(projectAssets)) {
        return projectAssets[Math.floor(Math.random() * projectAssets.length)];
      }
      
      // If it's an object with sub-categories, pick from all
      const allAssets = Object.values(projectAssets).flat();
      if (allAssets.length === 0) return null;
      
      return allAssets[Math.floor(Math.random() * allAssets.length)];
    } catch (error) {
      console.error('Asset retrieval error:', error);
      return null;
    }
  }
  
  getRandomAssetWithPath(type) {
    const assets = this.assetsByType[type];
    if (!assets || assets.length === 0) return null;
    
    return assets[Math.floor(Math.random() * assets.length)];
  }
  
  getRandomProjectAsset(project) {
    const normalizedProject = this.projectMap[project] || project;
    const assets = this.assetsByProject[normalizedProject];
    if (!assets || assets.length === 0) return null;
    
    return assets[Math.floor(Math.random() * assets.length)];
  }
  
  getRandomColor() {
    if (!this.manifest || !this.manifest.colors || this.manifest.colors.length === 0) {
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
    return this.manifest.colors[Math.floor(Math.random() * this.manifest.colors.length)];
  }
  
  getMixedAssets(count = 5) {
    const mixed = [];
    
    // If we have the full asset list, use it
    if (this.allAssets.length > 0) {
      for (let i = 0; i < count && i < this.allAssets.length; i++) {
        const randomAsset = this.allAssets[Math.floor(Math.random() * this.allAssets.length)];
        mixed.push(randomAsset);
      }
      return mixed;
    }
    
    // Fallback to old method
    const categories = Object.keys(this.assets).filter(cat => Object.keys(this.assets[cat]).length > 0);
    
    for (let i = 0; i < count; i++) {
      if (categories.length === 0) break;
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const projects = Object.keys(this.assets[category]).filter(proj => {
        const projAssets = this.assets[category][proj];
        return Array.isArray(projAssets) ? projAssets.length > 0 : Object.keys(projAssets).length > 0;
      });
      
      if (projects.length > 0) {
        const project = projects[Math.floor(Math.random() * projects.length)];
        const asset = this.getRandomAsset(category, project);
        
        if (asset) {
          mixed.push({
            category,
            project,
            type: category,
            asset,
            path: `${this.assetBasePath}/${project}/${category}/${asset}`
          });
        }
      }
    }
    
    return mixed;
  }
  
  getStats() {
    const stats = {
      total: this.allAssets.length,
      byType: {},
      byProject: {},
      manifest: this.manifest
    };
    
    Object.entries(this.assetsByType).forEach(([type, assets]) => {
      stats.byType[type] = assets.length;
    });
    
    Object.entries(this.assetsByProject).forEach(([project, assets]) => {
      stats.byProject[project] = assets.length;
    });
    
    return stats;
  }
}

export default AssetLibrary;