#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// CHAOS ASSET HARVESTER - Extracts EVERYTHING valuable
const ASSET_TYPES = {
  images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'],
  audio: ['.mp3', '.wav', '.webm', '.ogg', '.m4a', '.aac', '.flac'],
  video: ['.mp4', '.webm', '.mov', '.avi'],
  models: ['.glb', '.gltf', '.fbx', '.obj'],
  data: ['.json', '.xml', '.yaml', '.yml'],
  code: ['.js', '.jsx', '.ts', '.tsx', '.css', '.glsl', '.frag', '.vert'],
  text: ['.md', '.txt', '.log', '.csv'],
  fonts: ['.ttf', '.otf', '.woff', '.woff2']
};

const PROJECTS = [
  { name: 'blobtv', path: '/Users/willykramer/Desktop/PROJECTS/BlobTV_cleanStable' },
  { name: 'neo-neukoelln', path: '/Users/willykramer/Desktop/PROJECTS/NEO_NEUKOELLN' },
  { name: 'rosebud', path: '/Users/willykramer/Desktop/PROJECTS/ROSEBUD' },
  { name: 'royal-rumble', path: '/Users/willykramer/Desktop/PROJECTS/royal-rumble-rpm' },
  { name: 'vibetales', path: '/Users/willykramer/Desktop/PROJECTS/vibetales' },
  { name: 'derpaket', path: '/Volumes/T7 BACKUP/Projects_2025_nicht aktuell/DerPaket' },
  { name: 'miami-voice', path: '/Volumes/T7 BACKUP/Projects_2025_nicht aktuell/MIAMI VOICE' },
  { name: 'ikigaii', path: '/Volumes/T7 BACKUP/Projects_2025_nicht aktuell/CODING/IKIGAII' },
  { name: 'vibegame-site', path: '/Volumes/T7 BACKUP/Projects_2025_nicht aktuell/CODING/VIBEGAME SITE' }
];

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'tmp', 'temp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

class ChaosAssetHarvester {
  constructor() {
    this.assets = {
      images: [],
      audio: [],
      video: [],
      models: [],
      data: [],
      code: [],
      text: [],
      fonts: [],
      colors: new Set(),
      snippets: []
    };
    this.assetCount = 0;
  }

  isValidPath(filePath) {
    return !IGNORE_DIRS.some(dir => filePath.includes(`/${dir}/`));
  }

  getFileType(ext) {
    for (const [type, extensions] of Object.entries(ASSET_TYPES)) {
      if (extensions.includes(ext.toLowerCase())) {
        return type;
      }
    }
    return null;
  }

  extractColors(content) {
    // Extract hex colors
    const hexColors = content.match(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g) || [];
    hexColors.forEach(color => this.assets.colors.add(color));
    
    // Extract rgb/rgba colors
    const rgbColors = content.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/g) || [];
    rgbColors.forEach(color => this.assets.colors.add(color));
  }

  extractCodeSnippets(content, filePath) {
    // Extract interesting code patterns
    const patterns = [
      { regex: /function\s+(\w+)\s*\([^)]*\)\s*{[^}]+}/g, type: 'function' },
      { regex: /class\s+(\w+)\s*{[^}]+}/g, type: 'class' },
      { regex: /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{[^}]+}/g, type: 'arrow' },
      { regex: /\/\*\*[\s\S]*?\*\//g, type: 'comment' },
      { regex: /animate\w*\s*:\s*{[^}]+}/g, type: 'animation' },
      { regex: /shader\s*=\s*`[\s\S]+?`/g, type: 'shader' }
    ];

    patterns.forEach(({ regex, type }) => {
      const matches = content.match(regex) || [];
      matches.forEach(match => {
        if (match.length < 500) { // Keep snippets reasonable
          this.assets.snippets.push({
            type,
            code: match,
            source: path.basename(filePath)
          });
        }
      });
    });
  }

  scanFile(filePath, projectName) {
    try {
      const stats = fs.statSync(filePath);
      if (stats.size > MAX_FILE_SIZE) return;

      const ext = path.extname(filePath);
      const type = this.getFileType(ext);
      
      if (!type) return;

      const relativePath = filePath.replace(process.cwd(), '');
      const publicPath = `/assets/${projectName}/${type}/${path.basename(filePath)}`;
      
      const assetInfo = {
        original: filePath,
        public: publicPath,
        name: path.basename(filePath),
        size: stats.size,
        project: projectName,
        type: type
      };

      // Extract additional metadata based on type
      if (type === 'code' || type === 'text' || type === 'data') {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract colors
        this.extractColors(content);
        
        // Extract code snippets
        if (type === 'code') {
          this.extractCodeSnippets(content, filePath);
        }
        
        // Extract interesting text
        if (type === 'text' && content.length < 1000) {
          assetInfo.preview = content.substring(0, 200);
        }
        
        // Parse JSON data
        if (ext === '.json') {
          try {
            const jsonData = JSON.parse(content);
            assetInfo.keys = Object.keys(jsonData).slice(0, 10);
          } catch (e) {}
        }
      }

      this.assets[type].push(assetInfo);
      this.assetCount++;
      
      if (this.assetCount % 10 === 0) {
        console.log(`🧬 Harvested ${this.assetCount} assets...`);
      }

    } catch (error) {
      // Silently skip problematic files
    }
  }

  scanDirectory(dir, projectName) {
    if (!fs.existsSync(dir)) return;
    
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        
        if (!this.isValidPath(fullPath)) return;
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.scanDirectory(fullPath, projectName);
        } else {
          this.scanFile(fullPath, projectName);
        }
      });
    } catch (error) {
      console.log(`⚠️  Skipping ${dir}: ${error.message}`);
    }
  }

  async harvest() {
    console.log('🔥 CHAOS ASSET HARVESTER ACTIVATED');
    console.log('🧬 Scanning for creative fragments...\n');

    // Create asset directories
    const baseDir = 'public/assets';
    PROJECTS.forEach(project => {
      Object.keys(ASSET_TYPES).forEach(type => {
        const dir = path.join(baseDir, project.name, type);
        fs.mkdirSync(dir, { recursive: true });
      });
    });

    // Scan all projects
    PROJECTS.forEach(project => {
      console.log(`\n📁 Harvesting ${project.name}...`);
      this.scanDirectory(project.path, project.name);
    });

    // Generate manifest
    const manifest = {
      totalAssets: this.assetCount,
      colors: Array.from(this.assets.colors),
      breakdown: Object.entries(this.assets).reduce((acc, [type, items]) => {
        if (type !== 'colors' && type !== 'snippets') {
          acc[type] = items.length;
        }
        return acc;
      }, {}),
      snippets: this.assets.snippets.length,
      projects: PROJECTS.map(p => p.name)
    };

    // Write manifest
    fs.writeFileSync(
      'public/assets/chaos-manifest.json',
      JSON.stringify(manifest, null, 2)
    );

    // Write detailed asset library
    fs.writeFileSync(
      'src/core/ChaosAssetLibrary.json',
      JSON.stringify(this.assets, null, 2)
    );

    console.log('\n✨ CHAOS HARVEST COMPLETE!');
    console.log(`📊 Total assets: ${this.assetCount}`);
    console.log(`🎨 Unique colors: ${this.assets.colors.size}`);
    console.log(`💻 Code snippets: ${this.assets.snippets.length}`);
    console.log('\n🧬 The Orphanarium grows stronger...');

    // Copy actual files
    console.log('\n📦 Copying files to public/assets...');
    await this.copyAssets();
  }

  async copyAssets() {
    let copied = 0;
    
    for (const [type, assets] of Object.entries(this.assets)) {
      if (type === 'colors' || type === 'snippets') continue;
      
      for (const asset of assets) {
        try {
          const destPath = path.join('public', asset.public);
          const destDir = path.dirname(destPath);
          
          // Ensure directory exists
          fs.mkdirSync(destDir, { recursive: true });
          
          // Copy file
          if (fs.existsSync(asset.original)) {
            fs.copyFileSync(asset.original, destPath);
            copied++;
            
            if (copied % 25 === 0) {
              console.log(`📦 Copied ${copied} files...`);
            }
          }
        } catch (error) {
          // Skip files that can't be copied
        }
      }
    }
    
    console.log(`\n✅ Successfully copied ${copied} assets!`);
  }
}

// Run the harvester
const harvester = new ChaosAssetHarvester();
harvester.harvest();