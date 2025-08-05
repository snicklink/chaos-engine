// Asset Library Wrapper - Chooses between full and curated assets

import AssetLibrary from './AssetLibrary';
import CuratedAssetLibrary from './CuratedAssetLibrary';

// Configuration
const USE_CURATED_ASSETS = true; // Set to false for development with full 2.5GB assets

// Check if curated assets exist
const checkCuratedAssets = async () => {
  try {
    const response = await fetch('/assets-curated/manifest.json');
    return response.ok;
  } catch {
    return false;
  }
};

// Export the appropriate library
let LibraryClass;

if (USE_CURATED_ASSETS) {
  console.log('🎯 Using curated asset library for optimal performance');
  LibraryClass = CuratedAssetLibrary;
} else {
  console.log('📦 Using full asset library (2.5GB) for development');
  LibraryClass = AssetLibrary;
}

export default LibraryClass;