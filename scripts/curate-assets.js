#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  sourceDir: path.join(process.cwd(), 'public', 'assets'),
  targetDir: path.join(process.cwd(), 'public', 'assets-curated'),
  essentialsDir: path.join(process.cwd(), 'public', 'assets-curated', 'essentials'),
  manualPicksDir: path.join(process.cwd(), 'public', 'assets-curated', 'manual-picks'),
  mutationsDir: path.join(process.cwd(), 'src', 'mutations'),
  maxImageWidth: 1920,
  webpQuality: 85,
  jpegQuality: 85,
  targetSizeMB: 40,
  preserveOriginalQuality: ['svg', 'ico']
};

// Track essential assets found in mutations
const ESSENTIAL_ASSETS = new Set();

// Asset type mappings
const ASSET_TYPES = {
  images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico'],
  audio: ['.mp3', '.wav', '.webm', '.ogg', '.m4a'],
  video: ['.mp4', '.webm', '.mov'],
  models: ['.glb', '.gltf'],
  data: ['.json'],
  code: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  text: ['.md', '.txt'],
  fonts: ['.ttf', '.otf', '.woff', '.woff2']
};

// Core assets that should always be included - EXPANDED 5X FOR MAXIMUM CHAOS!
const CORE_ASSETS = [
  '/assets/chaos-manifest.json',
  
  // VIBETALES VIDEOS - Curated Selection for Deployment
  '/assets/vibetales/video/Der Kanzler Simulator 👾.mp4',
  '/assets/vibetales/video/mixkit-abstract-video-of-a-liquid-with-dark-ink-flowing-44818-hd-ready.mp4',
  '/assets/vibetales/video/mixkit-colorful-dance-of-a-young-dancer-51277-hd-ready.mp4',
  '/assets/vibetales/video/GehWeidaRoboter2.mp4',
  '/assets/vibetales/video/BrentWilly_16_9.mp4',
  
  // VIBETALES AUDIO - Character Voices & Effects (Curated)
  '/assets/vibetales/audio/marco_states.webm',
  '/assets/vibetales/audio/blobby_states.webm',
  '/assets/vibetales/audio/beat1.mp3',
  '/assets/vibetales/audio/jingle1.mp3',
  '/assets/vibetales/audio/electro.mp3',
  
  // NEO-NEUKOELLN - Berlin Game Assets (Curated)
  '/assets/neo-neukoelln/images/doener_kebap.webp',
  '/assets/neo-neukoelln/images/mutumbo.png',
  '/assets/neo-neukoelln/images/techno_girl.png',
  '/assets/neo-neukoelln/images/aggressive_pigeon.png',
  '/assets/neo-neukoelln/images/brandenburg_gate.webp',
  '/assets/neo-neukoelln/audio/techno.mp3',
  '/assets/neo-neukoelln/audio/gametheme.mp3',
  
  // MIAMI VOICE - Colorful Game Assets (Curated)
  '/assets/miami-voice/images/tico.png',
  '/assets/miami-voice/images/skyline.png',
  '/assets/miami-voice/images/sun.svg',
  '/assets/miami-voice/audio/miami.mp3',
  '/assets/miami-voice/audio/disco.mp3',
  '/assets/miami-voice/audio/weee.mp3',
  
  // ROSEBUD - Willy Universe (Curated)
  '/assets/rosebud/audio/Die Willy Theme.mp3',
  '/assets/rosebud/audio/blips.mp3',
  '/assets/rosebud/audio/computer.mp3',
  
  // ROYAL RUMBLE - Fighting Game Audio (Curated)
  '/assets/royal-rumble/audio/punch.mp3',
  '/assets/royal-rumble/audio/kick.mp3',
  
  // PROJECT LOGOS & BRANDING
  '/assets/vibegame-site/images/simwilly.jpg',
  '/assets/blobtv/images/blobtv_logo.png',
  '/assets/ikigaii/images/logo.png',
  '/assets/derpaket/images/DerPaket_logo.png',
  '/assets/derpaket/images/snicklink-logo.png',
  
  // BLOBTV VIDEO
  '/assets/blobtv/video/blobgpt-animation.mp4'
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
}

async function scanMutationsForAssets() {
  console.log('🔍 Scanning mutations for asset references...');
  
  try {
    const files = await fs.readdir(CONFIG.mutationsDir);
    
    for (const file of files) {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const filePath = path.join(CONFIG.mutationsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Find all asset references
        const assetMatches = content.matchAll(/['"`](\/assets\/[^'"`]+)['"`]/g);
        for (const match of assetMatches) {
          ESSENTIAL_ASSETS.add(match[1]);
        }
      }
    }
    
    console.log(`📊 Found ${ESSENTIAL_ASSETS.size} unique asset references in mutations`);
  } catch (error) {
    console.error('Error scanning mutations:', error);
  }
}

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function optimizeImage(sourcePath, destPath) {
  const ext = path.extname(sourcePath).toLowerCase();
  
  // Don't optimize SVGs and ICOs
  if (CONFIG.preserveOriginalQuality.includes(ext.substring(1))) {
    await fs.copyFile(sourcePath, destPath);
    return;
  }
  
  try {
    // Create output directory
    await ensureDirectory(path.dirname(destPath));
    
    // Optimize based on file type
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      // Convert to WebP for better compression
      await sharp(sourcePath)
        .resize(CONFIG.maxImageWidth, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: CONFIG.webpQuality })
        .toFile(destPath.replace(ext, '.webp'));
    } else if (ext === '.webp') {
      // Re-compress WebP
      await sharp(sourcePath)
        .resize(CONFIG.maxImageWidth, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: CONFIG.webpQuality })
        .toFile(destPath);
    } else if (ext === '.gif') {
      // Keep GIFs as-is (sharp doesn't handle animated GIFs well)
      await fs.copyFile(sourcePath, destPath);
    } else {
      // Copy other formats as-is
      await fs.copyFile(sourcePath, destPath);
    }
  } catch (error) {
    console.error(`Error optimizing ${sourcePath}:`, error);
    // Fall back to copy
    await fs.copyFile(sourcePath, destPath);
  }
}

async function copyAsset(assetPath, targetCategory = 'essentials') {
  const sourcePath = path.join(process.cwd(), 'public', assetPath);
  const relativePath = assetPath.replace('/assets/', '');
  let targetPath = path.join(CONFIG.targetDir, targetCategory, relativePath);
  
  if (!await fileExists(sourcePath)) {
    console.log(`⚠️  Asset not found: ${assetPath}`);
    return null;
  }
  
  await ensureDirectory(path.dirname(targetPath));
  
  const ext = path.extname(sourcePath).toLowerCase();
  const isImage = ASSET_TYPES.images.includes(ext);
  const isVideo = ASSET_TYPES.video.includes(ext);
  
  // Track actual output path for converted images
  let actualTargetPath = targetPath;
  let videoMutations = [];
  
  if (isImage && targetCategory === 'essentials') {
    // Update target path for converted images
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      actualTargetPath = targetPath.replace(ext, '.webp');
    }
    await optimizeImage(sourcePath, targetPath);
  } else if (isVideo && targetCategory === 'essentials') {
    // 🎭 CHAOS TIME - Mutate videos for maximum variety!
    console.log(`🎬 Processing video with CHAOS mutations: ${path.basename(sourcePath)}`);
    const videoResult = await processVideo(sourcePath, targetPath);
    videoMutations = videoResult.mutations;
  } else {
    await fs.copyFile(sourcePath, targetPath);
  }
  
  const size = await getFileSize(actualTargetPath);
  const result = {
    original: assetPath,
    curated: actualTargetPath.replace(process.cwd() + '/public', ''),
    size: size,
    type: getAssetType(ext)
  };
  
  // Include video mutation info if any
  if (videoMutations.length > 0) {
    result.mutations = videoMutations.map(m => ({
      path: m.mutated.replace(process.cwd() + '/public', ''),
      mutation: m.mutation,
      size: m.size
    }));
    result.totalVariations = 1 + videoMutations.length;
    console.log(`🎭 Created ${videoMutations.length} video mutations!`);
  }
  
  return result;
}

function getAssetType(ext) {
  for (const [type, extensions] of Object.entries(ASSET_TYPES)) {
    if (extensions.includes(ext)) {
      return type;
    }
  }
  return 'other';
}

// 🎭 VIDEO CHAOS MUTATIONS - Transform videos for maximum chaos!
const VIDEO_MUTATIONS = [
  {
    name: 'invert',
    ffmpegFilter: 'negate',
    suffix: '_inverted'
  },
  {
    name: 'stretch_wide',
    ffmpegFilter: 'scale=1920:540:force_original_aspect_ratio=ignore',
    suffix: '_stretched'
  },
  {
    name: 'speed_chaos',
    ffmpegFilter: 'setpts=0.5*PTS',
    suffix: '_2x'
  },
  {
    name: 'mirror_chaos',
    ffmpegFilter: 'crop=iw/2:ih:0:0,split[left][tmp];[tmp]hflip[right];[left][right]hstack',
    suffix: '_mirror'
  },
  {
    name: 'color_chaos',
    ffmpegFilter: 'hue=h=180:s=1.5',
    suffix: '_colorshift'
  },
  {
    name: 'glitch_chaos',
    ffmpegFilter: 'noise=alls=20:allf=t+u',
    suffix: '_glitch'
  }
];

async function mutateVideo(sourcePath, destDir, baseName) {
  const mutations = [];
  
  // Pick 1-2 random mutations per video to keep things interesting
  const selectedMutations = VIDEO_MUTATIONS
    .sort(() => Math.random() - 0.5)
    .slice(0, 1 + Math.floor(Math.random() * 2));
  
  for (const mutation of selectedMutations) {
    const outputName = `${baseName}${mutation.suffix}.mp4`;
    const outputPath = path.join(destDir, outputName);
    
    try {
      console.log(`🎭 Mutating video: ${mutation.name}`);
      
      // Use ffmpeg to apply video mutations
      const ffmpegCmd = `ffmpeg -i "${sourcePath}" -vf "${mutation.ffmpegFilter}" -c:a copy -y "${outputPath}"`;
      
      await execAsync(ffmpegCmd);
      
      const size = await getFileSize(outputPath);
      mutations.push({
        original: sourcePath,
        mutated: outputPath,
        mutation: mutation.name,
        size: size
      });
      
    } catch (error) {
      console.log(`⚠️  Video mutation ${mutation.name} failed: ${error.message}`);
      // Skip failed mutations, continue with others
    }
  }
  
  return mutations;
}

async function processVideo(sourcePath, destPath) {
  const destDir = path.dirname(destPath);
  const baseName = path.basename(destPath, path.extname(destPath));
  
  await ensureDirectory(destDir);
  
  // Copy original
  await fs.copyFile(sourcePath, destPath);
  
  // Create mutations for EXTRA CHAOS
  const mutations = await mutateVideo(sourcePath, destDir, baseName);
  
  return {
    original: destPath,
    mutations: mutations,
    totalFiles: 1 + mutations.length
  };
}

async function scanManualPicks() {
  console.log('🎨 Scanning manual picks directory...');
  const manifest = {
    timestamp: new Date().toISOString(),
    assets: []
  };
  
  async function scanDir(dir, baseDir = '') {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDir(fullPath, relativePath);
        } else if (!entry.name.startsWith('.') && entry.name !== 'README.md') {
          const ext = path.extname(entry.name).toLowerCase();
          const size = await getFileSize(fullPath);
          
          manifest.assets.push({
            name: entry.name,
            path: relativePath.replace(/\\/g, '/'),
            type: getAssetType(ext),
            size: size,
            priority: 'high' // Manual picks are always high priority
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error);
    }
  }
  
  await scanDir(CONFIG.manualPicksDir);
  
  // Save manual picks manifest
  await fs.writeFile(
    path.join(CONFIG.manualPicksDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`📦 Found ${manifest.assets.length} manual picks`);
  return manifest;
}

async function generateManifest(curatedAssets, manualPicks) {
  const manifest = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    stats: {
      totalAssets: curatedAssets.length + manualPicks.assets.length,
      totalSize: 0,
      byType: {},
      byProject: {}
    },
    essentials: curatedAssets,
    manualPicks: manualPicks
  };
  
  // Calculate stats
  let totalSize = 0;
  
  // Process essential assets
  for (const asset of curatedAssets) {
    totalSize += asset.size || 0;
    
    // By type
    if (!manifest.stats.byType[asset.type]) {
      manifest.stats.byType[asset.type] = { count: 0, size: 0 };
    }
    manifest.stats.byType[asset.type].count++;
    manifest.stats.byType[asset.type].size += asset.size || 0;
    
    // By project
    const projectMatch = asset.original.match(/\/assets\/([^\/]+)\//);
    if (projectMatch) {
      const project = projectMatch[1];
      if (!manifest.stats.byProject[project]) {
        manifest.stats.byProject[project] = { count: 0, size: 0 };
      }
      manifest.stats.byProject[project].count++;
      manifest.stats.byProject[project].size += asset.size || 0;
    }
  }
  
  // Process manual picks
  for (const pick of manualPicks.assets) {
    totalSize += pick.size || 0;
    
    if (!manifest.stats.byType[pick.type]) {
      manifest.stats.byType[pick.type] = { count: 0, size: 0 };
    }
    manifest.stats.byType[pick.type].count++;
    manifest.stats.byType[pick.type].size += pick.size || 0;
  }
  
  manifest.stats.totalSize = totalSize;
  manifest.stats.totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  return manifest;
}

async function main() {
  console.log('🧬 CHAOS ENGINE ASSET CURATOR');
  console.log('============================');
  console.log(`Target size: ${CONFIG.targetSizeMB}MB`);
  console.log('');
  
  // Clean and create directories
  console.log('🧹 Preparing directories...');
  await ensureDirectory(CONFIG.targetDir);
  await ensureDirectory(CONFIG.essentialsDir);
  await ensureDirectory(CONFIG.manualPicksDir);
  
  // Create README for manual picks if it doesn't exist
  const readmePath = path.join(CONFIG.manualPicksDir, 'README.md');
  if (!await fileExists(readmePath)) {
    await fs.writeFile(readmePath, `# 🎨 Manual Asset Drop Zone

This is YOUR creative space. Any assets you drop here will be:
- **Automatically included** in the Chaos Engine
- **Prioritized** over auto-curated assets  
- **Preserved** in their original quality

## How to use:
1. Drop your favorite assets here (images, audio, video, etc.)
2. Organize in subfolders if you want (optional)
3. Run \`npm run curate-assets\` to rebuild the manifest
4. Your picks will be given priority in mutations!

## Current Structure:
\`\`\`
manual-picks/
├── README.md (this file)
├── images/     (your special images)
├── audio/      (your favorite sounds)
└── ...         (any structure you want!)
\`\`\`

Happy curating! 🎉
`);
  }
  
  // Scan mutations for essential assets
  await scanMutationsForAssets();
  
  // Add core assets to essentials
  CORE_ASSETS.forEach(asset => ESSENTIAL_ASSETS.add(asset));
  
  // Copy essential assets
  console.log('📦 Copying essential assets...');
  const curatedAssets = [];
  let processedCount = 0;
  
  for (const assetPath of ESSENTIAL_ASSETS) {
    processedCount++;
    process.stdout.write(`\r  Processing ${processedCount}/${ESSENTIAL_ASSETS.size} assets...`);
    
    const result = await copyAsset(assetPath, 'essentials');
    if (result) {
      curatedAssets.push(result);
    }
  }
  console.log('\n✅ Essential assets copied');
  
  // Scan manual picks
  const manualPicks = await scanManualPicks();
  
  // Generate manifest
  console.log('📝 Generating manifest...');
  const manifest = await generateManifest(curatedAssets, manualPicks);
  
  await fs.writeFile(
    path.join(CONFIG.targetDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  // Report results
  console.log('\n🎉 CURATION COMPLETE!');
  console.log('====================');
  console.log(`📊 Total assets: ${manifest.stats.totalAssets}`);
  console.log(`💾 Total size: ${manifest.stats.totalSizeMB}MB`);
  console.log('\n📈 Breakdown by type:');
  
  Object.entries(manifest.stats.byType).forEach(([type, stats]) => {
    console.log(`  ${type}: ${stats.count} files (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
  });
  
  console.log('\n🎮 Breakdown by project:');
  Object.entries(manifest.stats.byProject).forEach(([project, stats]) => {
    console.log(`  ${project}: ${stats.count} files (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
  });
  
  if (parseFloat(manifest.stats.totalSizeMB) > CONFIG.targetSizeMB) {
    console.log(`\n⚠️  WARNING: Total size (${manifest.stats.totalSizeMB}MB) exceeds target (${CONFIG.targetSizeMB}MB)`);
    console.log('   Consider removing some assets or increasing compression');
  } else {
    console.log(`\n✅ Size target achieved! (${manifest.stats.totalSizeMB}MB < ${CONFIG.targetSizeMB}MB)`);
  }
  
  console.log('\n💡 Next steps:');
  console.log('1. Drop your favorite assets in public/assets-curated/manual-picks/');
  console.log('2. Run this script again to update the manifest');
  console.log('3. Deploy with confidence! 🚀');
}

// Run the curator
main().catch(console.error);