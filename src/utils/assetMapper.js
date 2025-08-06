// Asset Path Mapper - Maps hardcoded /assets/ paths to actual /assets-curated/ paths

const assetMappings = {
  // Neo-Neukoelln mappings
  '/assets/neo-neukoelln/images/doener_kebap.webp': '/assets-curated/essentials/neo-neukoelln/images/doener_kebap.webp',
  '/assets/neo-neukoelln/images/hipster.png': '/assets-curated/essentials/neo-neukoelln/images/hipster.webp',
  '/assets/neo-neukoelln/images/techno_girl.png': '/assets-curated/essentials/neo-neukoelln/images/techno_girl.webp',
  '/assets/neo-neukoelln/images/bvg_ticket.webp': '/assets-curated/essentials/neo-neukoelln/images/bvg_ticket.webp',
  '/assets/neo-neukoelln/images/aggressive_pigeon.png': '/assets-curated/essentials/neo-neukoelln/images/aggressive_pigeon.webp',
  '/assets/neo-neukoelln/images/giant_rat.png': '/assets-curated/essentials/neo-neukoelln/images/giant_rat.webp',
  '/assets/neo-neukoelln/images/mutumbo.png': '/assets-curated/essentials/neo-neukoelln/images/mutumbo.webp',
  '/assets/neo-neukoelln/images/doener_dealer.png': '/assets-curated/essentials/neo-neukoelln/images/doener_dealer.webp',
  '/assets/neo-neukoelln/images/gamelogo.png': '/assets-curated/essentials/neo-neukoelln/images/gamelogo.webp',
  '/assets/neo-neukoelln/images/doenerbude.webp': '/assets-curated/essentials/neo-neukoelln/images/doenerbude.webp',
  '/assets/neo-neukoelln/images/currywurst.webp': '/assets-curated/essentials/neo-neukoelln/images/currywurst.webp',
  '/assets/neo-neukoelln/images/spaeti.webp': '/assets-curated/essentials/neo-neukoelln/images/spaeti.webp',
  '/assets/neo-neukoelln/images/street_artist.png': '/assets-curated/essentials/neo-neukoelln/images/street_artist.webp',
  '/assets/neo-neukoelln/images/sidewalk.webp': '/assets-curated/essentials/neo-neukoelln/images/sidewalk.webp',
  '/assets/neo-neukoelln/images/ubahn1.webp': '/assets-curated/essentials/neo-neukoelln/images/ubahn1.webp',
  '/assets/neo-neukoelln/images/brandenburg_gate.webp': '/assets-curated/essentials/neo-neukoelln/images/brandenburg_gate.webp',
  '/assets/neo-neukoelln/images/shisha_lounge.webp': '/assets-curated/essentials/neo-neukoelln/images/shisha_lounge.webp',
  
  // Miami Voice mappings  
  '/assets/miami-voice/images/sun.svg': '/assets-curated/essentials/miami-voice/images/sun.svg',
  '/assets/miami-voice/images/palm.png': '/assets-curated/essentials/miami-voice/images/palm.webp',
  '/assets/miami-voice/images/cocktail.png': '/assets-curated/essentials/miami-voice/images/cocktail.webp',
  '/assets/miami-voice/images/chrome.png': '/assets-curated/essentials/miami-voice/images/chrome.webp',
  '/assets/miami-voice/images/tico.png': '/assets-curated/essentials/miami-voice/images/tico.webp',
  '/assets/miami-voice/images/heli.png': '/assets-curated/essentials/miami-voice/images/heli.webp',
  '/assets/miami-voice/images/logo.png': '/assets-curated/essentials/miami-voice/images/logo.webp',
  '/assets/miami-voice/images/mc_willy.png': '/assets-curated/manual-picks/mogen_logo_w.jpg',
  '/assets/miami-voice/images/skyline.png': '/assets-curated/essentials/miami-voice/images/skyline.webp',
  
  // BlobTV mappings
  '/assets/blobtv/images/blobtv_logo.png': '/assets-curated/essentials/blobtv/images/blobtv_logo.webp',
  '/assets/blobtv/images/SimWilly_sm.png': '/assets-curated/essentials/blobtv/images/SimWilly_sm.webp',
  '/assets/blobtv/images/offline.jpg': '/assets-curated/essentials/blobtv/images/offline.webp',
  
  // Other project mappings
  '/assets/rosebud/images/snicklink_logo copy.png': '/assets-curated/essentials/rosebud/images/snicklink_logo copy.webp',
  '/assets/vibegame-site/images/simwilly.jpg': '/assets-curated/essentials/vibegame-site/images/simwilly.webp',
  '/assets/derpaket/images/DerPaket_logo.png': '/assets-curated/essentials/derpaket/images/DerPaket_logo.webp',
  '/assets/ikigaii/images/logo.png': '/assets-curated/essentials/ikigaii/images/logo.webp',
  '/assets/vibetales/images/blobtv_logo.png': '/assets-curated/essentials/vibetales/images/blobtv_logo.webp',
  '/assets/vibegame-site/images/snick_vibe_logo.png': '/assets-curated/essentials/vibegame-site/images/snick_vibe_logo.webp',
  '/assets/derpaket/images/snicklink-logo.png': '/assets-curated/essentials/derpaket/images/snicklink-logo.webp',
  '/assets/rosebud/images/background.jpg': '/assets-curated/manual-picks/bg1.jpg',
  '/assets/vibetales/images/space.png': '/assets-curated/manual-picks/kanzler.jpg',
  
  // Audio mappings
  '/assets/rosebud/audio/Die Willy Theme.mp3': '/assets-curated/essentials/rosebud/audio/Die Willy Theme.mp3',
  '/assets/rosebud/audio/Willy im Hyperflow.mp3': '/assets-curated/essentials/rosebud/audio/Willy im Hyperflow.mp3',
  '/assets/neo-neukoelln/audio/techno.mp3': '/assets-curated/essentials/neo-neukoelln/audio/techno.mp3',
  '/assets/neo-neukoelln/audio/gametheme.mp3': '/assets-curated/essentials/neo-neukoelln/audio/gametheme.mp3',
  '/assets/miami-voice/audio/miami.mp3': '/assets-curated/essentials/miami-voice/audio/miami.mp3',
  '/assets/miami-voice/audio/disco.mp3': '/assets-curated/essentials/miami-voice/audio/disco.mp3',
  '/assets/miami-voice/audio/weee.mp3': '/assets-curated/essentials/miami-voice/audio/weee.mp3',
  '/assets/rosebud/audio/blips.mp3': '/assets-curated/essentials/rosebud/audio/blips.mp3',
  '/assets/rosebud/audio/computer.mp3': '/assets-curated/essentials/rosebud/audio/computer.mp3',
  '/assets/royal-rumble/audio/punch.mp3': '/assets-curated/essentials/royal-rumble/audio/punch.mp3',
  '/assets/royal-rumble/audio/kick.mp3': '/assets-curated/essentials/royal-rumble/audio/kick.mp3',
  
  // Video mappings
  '/assets/vibetales/video/Der Kanzler Simulator 👾.mp4': '/assets-curated/manual-picks/kanzler.jpg',
  '/assets/vibetales/video/mixkit-abstract-video-of-a-liquid-with-dark-ink-flowing-44818-hd-ready.mp4': '/assets-curated/essentials/vibetales/video/kannz_states.webm',
  '/assets/vibetales/video/mixkit-colorful-dance-of-a-young-dancer-51277-hd-ready.mp4': '/assets-curated/essentials/vibetales/video/klaro_states.webm',
  '/assets/vibetales/video/GehWeidaRoboter2.mp4': '/assets-curated/essentials/vibetales/video/GehWeidaRoboter2.mp4',
  '/assets/vibetales/video/BrentWilly_16_9.mp4': '/assets-curated/essentials/vibetales/video/memenews_states.webm',
  '/assets/blobtv/video/blobgpt-animation.mp4': '/assets-curated/essentials/vibetales/video/alex_states.webm',
  '/assets/vibetales/audio/marco_states.webm': '/assets-curated/essentials/vibetales/video/troy_states.webm',
  '/assets/vibetales/audio/blobby_states.webm': '/assets-curated/essentials/vibetales/video/milly_states.webm',
  '/assets/vibetales/audio/beat1.mp3': '/assets-curated/essentials/vibetales/audio/beat1.mp3',
  '/assets/vibetales/audio/jingle1.mp3': '/assets-curated/essentials/vibetales/audio/jingle1.mp3',
  '/assets/vibetales/audio/electro.mp3': '/assets-curated/essentials/vibetales/audio/electro.mp3'
};

export function mapAssetPath(originalPath) {
  // Direct mapping
  if (assetMappings[originalPath]) {
    return assetMappings[originalPath];
  }
  
  // Try to find a manual pick with similar name
  if (originalPath.includes('/assets/')) {
    const filename = originalPath.split('/').pop();
    const nameWithoutExt = filename.split('.')[0];
    
    // Check if we have a manual pick with similar name
    const possibleManualPick = `/assets-curated/manual-picks/${nameWithoutExt}.jpg`;
    return possibleManualPick;
  }
  
  return originalPath;
}

// Install global interceptors for asset loading
if (typeof window !== 'undefined') {
  // Intercept Image.src
  const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set: function(value) {
      const mappedPath = mapAssetPath(value);
      originalImageSrc.set.call(this, mappedPath);
    },
    get: function() {
      return originalImageSrc.get.call(this);
    }
  });
  
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(url, ...args) {
    const mappedUrl = typeof url === 'string' ? mapAssetPath(url) : url;
    return originalFetch.call(this, mappedUrl, ...args);
  };
  
  // Log mapper activation
  console.log('🗺️ Asset path mapper activated - redirecting /assets/ to /assets-curated/');
}