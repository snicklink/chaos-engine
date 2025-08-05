// Enhanced Asset Loader - Properly loads and manages curated assets with diversity

class EnhancedAssetLoader {
  constructor() {
    this.basePath = '/assets-curated/essentials';
    this.assetHistory = new Map(); // Track usage per type
    this.maxHistorySize = 15;
    
    // Complete asset catalog from your curated collection
    this.assetCatalog = {
      images: {
        blobtv: [
          'SimWilly_sm.webp',
          'blobtv_logo.webp',
          'offline.webp'
        ],
        derpaket: [
          'DerPaket_logo.webp',
          'snicklink-logo.webp'
        ],
        ikigaii: [
          'logo.webp'
        ],
        'miami-voice': [
          'chrome.webp',
          'cocktail.webp',
          'heli.webp',
          'logo.webp',
          'palm.webp',
          'skyline.webp',
          'sun.svg',
          'tico.webp'
        ],
        'neo-neukoelln': [
          'aggressive_pigeon.webp',
          'brandenburg_gate.webp',
          'bvg_ticket.webp',
          'currywurst.webp',
          'doener_dealer.webp',
          'doener_kebap.webp',
          'doenerbude.webp',
          'gamelogo.webp',
          'giant_rat.webp',
          'hipster.webp',
          'mutumbo.webp',
          'shisha_lounge.webp',
          'sidewalk.webp',
          'spaeti.webp',
          'street_artist.webp',
          'techno_girl.webp',
          'ubahn1.webp'
        ],
        rosebud: [
          'snicklink_logo copy.webp'
        ],
        'vibegame-site': [
          'simwilly.webp',
          'snick_vibe_logo.webp'
        ],
        vibetales: [
          'blobtv_logo.webp'
        ]
      },
      videos: {
        blobtv: [
          'blobgpt-animation.mp4',
          'blobgpt-animation_colorshift.mp4',
          'blobgpt-animation_inverted.mp4'
        ],
        vibetales: [
          'BrentWilly_16_9.mp4',
          'BrentWilly_16_9_2x.mp4',
          'Der Kanzler Simulator 👾.mp4',
          'Der Kanzler Simulator 👾_2x.mp4',
          'GehWeidaRoboter2.mp4',
          'GehWeidaRoboter2_mirror.mp4',
          'mixkit-abstract-video-of-a-liquid-with-dark-ink-flowing-44818-hd-ready.mp4',
          'mixkit-abstract-video-of-a-liquid-with-dark-ink-flowing-44818-hd-ready_colorshift.mp4',
          'mixkit-abstract-video-of-a-liquid-with-dark-ink-flowing-44818-hd-ready_inverted.mp4',
          'mixkit-colorful-dance-of-a-young-dancer-51277-hd-ready.mp4',
          'mixkit-colorful-dance-of-a-young-dancer-51277-hd-ready_mirror.mp4'
        ]
      },
      audio: {
        'miami-voice': [
          'disco.mp3',
          'miami.mp3',
          'weee.mp3'
        ],
        'neo-neukoelln': [
          'gametheme.mp3',
          'techno.mp3'
        ],
        rosebud: [
          'Die Willy Theme.mp3',
          'Willy im Hyperflow.mp3',
          'blips.mp3',
          'computer.mp3'
        ],
        'royal-rumble': [
          'kick.mp3',
          'punch.mp3'
        ],
        vibetales: [
          'beat1.mp3',
          'blobby_states.webm',
          'blobby_states_glitch.mp4',
          'blobby_states_inverted.mp4',
          'electro.mp3',
          'jingle1.mp3',
          'marco_states.webm',
          'marco_states_inverted.mp4'
        ]
      }
    };
  }

  // Get full path for an asset
  getAssetPath(project, type, filename) {
    return `${this.basePath}/${project}/${type}/${filename}`;
  }

  // Get diverse assets avoiding repetition
  getDiverseAssets(type, count = 10) {
    const assets = [];
    const projects = Object.keys(this.assetCatalog[type] || {});
    
    if (projects.length === 0) return assets;

    // Initialize history for this type if needed
    if (!this.assetHistory.has(type)) {
      this.assetHistory.set(type, []);
    }
    
    const history = this.assetHistory.get(type);
    let attempts = 0;
    
    while (assets.length < count && attempts < count * 3) {
      attempts++;
      
      // Pick a random project
      const project = projects[Math.floor(Math.random() * projects.length)];
      const projectAssets = this.assetCatalog[type][project];
      
      if (!projectAssets || projectAssets.length === 0) continue;
      
      // Pick a random asset from that project
      const filename = projectAssets[Math.floor(Math.random() * projectAssets.length)];
      const assetPath = this.getAssetPath(project, type, filename);
      
      // Check if recently used
      if (!history.includes(assetPath)) {
        assets.push({
          url: assetPath,
          project,
          filename,
          type,
          name: filename.replace(/\.(webp|mp4|mp3|webm|svg)$/, '')
        });
        
        // Add to history
        history.push(assetPath);
        if (history.length > this.maxHistorySize) {
          history.shift();
        }
      }
    }
    
    // If we couldn't get enough unique assets, reset history and try again
    if (assets.length < count / 2) {
      this.assetHistory.set(type, []);
      return this.getDiverseAssets(type, count);
    }
    
    return assets;
  }

  // Get assets from specific projects for more personal touch
  getProjectAssets(projectNames, type, count = 5) {
    const assets = [];
    
    projectNames.forEach(project => {
      const projectAssets = this.assetCatalog[type]?.[project] || [];
      projectAssets.slice(0, count).forEach(filename => {
        assets.push({
          url: this.getAssetPath(project, type, filename),
          project,
          filename,
          type,
          name: filename.replace(/\.(webp|mp4|mp3|webm|svg)$/, '')
        });
      });
    });
    
    return assets;
  }

  // Get a themed collection (e.g., all Berlin stuff, all Willy stuff)
  getThemedAssets(theme, count = 15) {
    const themes = {
      berlin: {
        projects: ['neo-neukoelln'],
        keywords: ['doener', 'ubahn', 'brandenburg', 'currywurst', 'spaeti', 'techno', 'hipster']
      },
      willy: {
        projects: ['rosebud', 'vibetales', 'blobtv', 'vibegame-site'],
        keywords: ['willy', 'simwilly', 'blobtv']
      },
      miami: {
        projects: ['miami-voice'],
        keywords: ['miami', 'palm', 'tico', 'cocktail', 'skyline']
      },
      games: {
        projects: ['neo-neukoelln', 'royal-rumble', 'vibetales'],
        keywords: ['game', 'kick', 'punch', 'beat']
      }
    };
    
    const themeConfig = themes[theme] || themes.willy;
    const assets = [];
    
    // Get images
    const images = this.getDiverseAssets('images', Math.floor(count * 0.6));
    
    // Filter by theme
    const themedImages = images.filter(asset => 
      themeConfig.projects.includes(asset.project) ||
      themeConfig.keywords.some(keyword => asset.name.toLowerCase().includes(keyword))
    );
    
    assets.push(...themedImages);
    
    // Add some videos
    const videos = this.getDiverseAssets('videos', Math.floor(count * 0.4));
    assets.push(...videos);
    
    return assets;
  }

  // Get all asset types mixed for maximum variety
  getMixedAssets(count = 20) {
    const assets = [];
    
    // 60% images, 30% videos, 10% text references
    const imageCount = Math.floor(count * 0.6);
    const videoCount = Math.floor(count * 0.3);
    
    assets.push(...this.getDiverseAssets('images', imageCount));
    assets.push(...this.getDiverseAssets('videos', videoCount));
    
    // Shuffle for variety
    return assets.sort(() => 0.5 - Math.random());
  }

  // Get specific character/mascot assets
  getMascotAssets() {
    return [
      ...this.getProjectAssets(['miami-voice'], 'images', 10),
      ...this.getProjectAssets(['neo-neukoelln'], 'images', 10),
      ...this.getProjectAssets(['blobtv', 'vibetales'], 'images', 5)
    ].filter(asset => 
      ['tico', 'willy', 'pigeon', 'rat', 'hipster', 'techno_girl', 'doener_dealer'].some(
        mascot => asset.name.toLowerCase().includes(mascot)
      )
    );
  }

  // Reset history for a specific type
  resetHistory(type) {
    if (type) {
      this.assetHistory.set(type, []);
    } else {
      this.assetHistory.clear();
    }
  }
}

// Export singleton
export default new EnhancedAssetLoader();