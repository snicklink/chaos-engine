#!/bin/bash

# Create asset directories
echo "🧬 Creating asset directories..."
mkdir -p public/assets/{neo-neukoelln,rosebud,miami-voice,blobtv,vibetales}/{images,audio,data}

# NEO_NEUKOELLN assets
echo "📦 Copying NEO_NEUKOELLN assets..."
cp -r /Users/willykramer/Desktop/PROJECTS/NEO_NEUKOELLN/client-react/public/img/characters/*.png public/assets/neo-neukoelln/images/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/NEO_NEUKOELLN/client-react/public/img/sprites/*.png public/assets/neo-neukoelln/images/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/NEO_NEUKOELLN/client-react/public/img/sprites/*.webp public/assets/neo-neukoelln/images/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/NEO_NEUKOELLN/client-react/public/audio/*.mp3 public/assets/neo-neukoelln/audio/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/NEO_NEUKOELLN/client-react/public/data/*.json public/assets/neo-neukoelln/data/ 2>/dev/null

# ROSEBUD assets
echo "🪑 Copying ROSEBUD assets..."
cp -r /Users/willykramer/Desktop/PROJECTS/ROSEBUD/assets/audio/fx/*.mp3 public/assets/rosebud/audio/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/ROSEBUD/assets/audio/radio/*.mp3 public/assets/rosebud/audio/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/ROSEBUD/assets/decorations/*.png public/assets/rosebud/images/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/ROSEBUD/assets/decorations/*.jpg public/assets/rosebud/images/ 2>/dev/null

# MIAMI VOICE assets
echo "🌴 Copying MIAMI VOICE assets..."
cp -r "/Volumes/T7 BACKUP/Projects_2025_nicht aktuell/MIAMI VOICE/assets/sounds"/*.mp3 public/assets/miami-voice/audio/ 2>/dev/null
cp -r "/Volumes/T7 BACKUP/Projects_2025_nicht aktuell/MIAMI VOICE/assets/images"/*.png public/assets/miami-voice/images/ 2>/dev/null

# Royal Rumble assets
echo "👊 Copying Royal Rumble assets..."
cp -r /Users/willykramer/Desktop/PROJECTS/royal-rumble-rpm/client/public/audio/sounds/*.mp3 public/assets/royal-rumble/audio/ 2>/dev/null
cp -r /Users/willykramer/Desktop/PROJECTS/royal-rumble-rpm/client/public/grafittis/*.webp public/assets/royal-rumble/images/ 2>/dev/null

echo "✅ Asset gathering complete! Check public/assets/ for your orphan fragments."
echo "🎨 Now update AssetLibrary.js to use real paths instead of emojis!"