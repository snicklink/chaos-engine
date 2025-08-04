# 🎨 Asset Integration Guide

This guide explains how to integrate real assets from your orphan projects into The Orphanarium.

## 📁 Asset Organization

### 1. Copy Assets to Orphan Folders

For each project, copy relevant assets to the corresponding folder:

```
src/orphans/
├── blobtv/
│   ├── images/
│   ├── audio/
│   └── config/
├── neo-neukoelln/
│   ├── sprites/
│   ├── sounds/
│   └── data/
├── rosebud/
│   ├── models/
│   ├── animations/
│   └── audio/
└── ...
```

### 2. Update AssetLibrary.js

Add references to your actual assets in `src/core/AssetLibrary.js`:

```javascript
// Example: Adding real NEO_NEUKOELLN sprites
this.assets.images.neoNeukoelln = {
  characters: [
    '/orphans/neo-neukoelln/doener_dealer.png',
    '/orphans/neo-neukoelln/hipster.png',
    '/orphans/neo-neukoelln/mutumbo.png'
  ],
  items: [
    '/orphans/neo-neukoelln/doener_kebap.webp',
    '/orphans/neo-neukoelln/clubmate.png'
  ]
};
```

### 3. Asset Types to Gather

#### Images (PNG, JPG, WEBP, GIF)
- Character sprites
- UI elements  
- Backgrounds
- Icons
- Logos

#### Audio (MP3, WAV, WEBM)
- Music tracks
- Sound effects
- Voice samples
- Ambient sounds

#### 3D Assets (GLB, GLTF)
- Character models
- Animations
- Environment objects

#### Text/Data (JSON, TXT)
- Dialogue snippets
- Character descriptions
- Game data
- Configuration files

#### Code Snippets
- Interesting algorithms
- Visual effects
- Game mechanics

## 🔧 Advanced Mutations

### Creating Asset-Specific Mutations

1. **Sprite Injection**: Take 2D sprites and inject them into 3D environments
2. **Audio Remixing**: Layer sound effects from different projects
3. **Dialogue Mashups**: Combine text from VibeTales with UI from other projects
4. **Visual Corruption**: Apply shaders/effects from one project to visuals from another

### Example: Real Asset Implementation

```javascript
// In AssetParasite.jsx
const loadRealAsset = (project, type, filename) => {
  const basePath = `/orphans/${project}`;
  
  switch(type) {
    case 'sprite':
      return `${basePath}/sprites/${filename}`;
    case 'audio':
      return new Audio(`${basePath}/audio/${filename}`);
    case 'data':
      return fetch(`${basePath}/data/${filename}`).then(r => r.json());
  }
};
```

## 🌀 Performance Considerations

1. **Lazy Loading**: Load assets only when needed
2. **Asset Optimization**: Compress images, convert audio to web formats
3. **Memory Management**: Unload assets when switching mutations
4. **Preloading**: Cache frequently used assets

## 🎯 Creative Suggestions

### Cross-Project Pollination
- BlobTV chat messages appearing as graffiti in Royal Rumble
- NEO_NEUKOELLN döner physics applied to ROSEBUD furniture
- MIAMI VOICE pitch detection controlling VibeTales character emotions
- IKIGAII philosophy questions answered by fighting game combos

### Temporal Mixing
- Start with functional UI from one project
- Gradually corrupt with assets from another
- End in complete visual/logical chaos
- Reset to different combination

### Asset Transformation
- Convert 2D sprites to 3D particles
- Turn audio waveforms into visual patterns
- Transform game data into abstract visualizations
- Use code comments as dialogue

## 📝 Notes

- The more diverse your assets, the more interesting the mutations
- Don't worry about "breaking" things - chaos is the goal
- Experiment with unexpected combinations
- Document interesting mutations for future reference

Remember: The Orphanarium thrives on creative chaos. Feed it everything!