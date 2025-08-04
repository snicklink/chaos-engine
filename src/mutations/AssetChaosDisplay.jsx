import { useEffect, useRef, useState } from 'react';
import AssetPreloader from '../core/AssetPreloader';
import './mutations.css';

const AssetChaosDisplay = ({ assetLibrary, phase, intensity }) => {
  const containerRef = useRef(null);
  const [displayedAssets, setDisplayedAssets] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const preloader = useRef(new AssetPreloader());
  
  useEffect(() => {
    if (!assetLibrary || !assetLibrary.allAssets) return;
    
    // Preload assets for overflow chaos
    preloader.current.preloadMutationAssets('asset-chaos-overflow', assetLibrary);
    
    // Load random images
    const loadImages = async () => {
      const imageAssets = assetLibrary.assetsByType?.images || [];
      const randomImages = [];
      const count = Math.floor(intensity * 20) + 5;
      
      for (let i = 0; i < count && i < imageAssets.length; i++) {
        const randomIndex = Math.floor(Math.random() * imageAssets.length);
        const asset = imageAssets[randomIndex];
        
        if (asset && !randomImages.find(img => img.path === asset.path)) {
          randomImages.push({
            ...asset,
            id: `${asset.path}-${Date.now()}-${i}`,
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: 0.5 + Math.random() * intensity,
            rotation: Math.random() * 360,
            opacity: 0.5 + intensity * 0.5,
            speed: 0.5 + Math.random() * 2,
            rotationSpeed: (Math.random() - 0.5) * 5
          });
        }
      }
      
      setDisplayedAssets(randomImages);
    };
    
    loadImages();
    
    // Refresh assets periodically based on phase
    const refreshInterval = phase === 'chaos' ? 500 : 2000;
    const interval = setInterval(loadImages, refreshInterval);
    
    return () => clearInterval(interval);
  }, [assetLibrary, phase, intensity]);
  
  // Animate assets
  useEffect(() => {
    const animate = () => {
      setDisplayedAssets(prev => prev.map(asset => ({
        ...asset,
        x: (asset.x + asset.speed * 0.1) % 110 - 10,
        y: phase === 'chaos' 
          ? (asset.y + Math.sin(Date.now() * 0.001 + asset.id) * intensity * 2) % 110 - 10
          : asset.y,
        rotation: asset.rotation + asset.rotationSpeed,
        scale: asset.scale + Math.sin(Date.now() * 0.002) * 0.1 * intensity
      })));
    };
    
    const animationId = requestAnimationFrame(function animateFrame() {
      animate();
      requestAnimationFrame(animateFrame);
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [phase, intensity]);
  
  return (
    <div className="mutation-asset-chaos" ref={containerRef}>
      <div className="chaos-background" style={{
        background: `radial-gradient(circle, 
          ${assetLibrary?.getRandomColor() || '#ff00ff'}22 0%, 
          transparent 50%)`
      }}>
        {displayedAssets.map(asset => (
          <div
            key={asset.id}
            className="chaos-asset"
            style={{
              left: `${asset.x}%`,
              top: `${asset.y}%`,
              transform: `translate(-50%, -50%) scale(${asset.scale}) rotate(${asset.rotation}deg)`,
              opacity: asset.opacity,
              filter: phase === 'chaos' ? 'hue-rotate(180deg) saturate(2)' : 'none',
              transition: phase === 'chaos' ? 'none' : 'all 0.3s ease-out'
            }}
          >
            <img 
              src={asset.path} 
              alt={asset.name}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                width: 'auto',
                height: 'auto'
              }}
            />
            <div className="asset-label">
              {asset.project} :: {asset.name}
            </div>
          </div>
        ))}
      </div>
      
      <div className="chaos-overlay">
        <h2 className="chaos-title">
          {phase === 'calm' && 'ASSET EXTRACTION INITIATED'}
          {phase === 'build' && `LOADING ${displayedAssets.length} ORPHAN ASSETS...`}
          {phase === 'chaos' && 'MAXIMUM ASSET OVERFLOW!!!'}
          {phase === 'fade' && 'ASSETS RETURNING TO VOID...'}
        </h2>
        
        {assetLibrary && (
          <div className="asset-stats">
            <div>Total Assets: {assetLibrary.allAssets?.length || 0}</div>
            <div>Active Chaos: {displayedAssets.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetChaosDisplay;