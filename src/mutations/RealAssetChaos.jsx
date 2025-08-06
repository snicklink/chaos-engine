import { useState, useEffect, useRef } from 'react';
import AssetPreloader from '../core/AssetPreloader';
import './mutations.css';

const RealAssetChaos = ({ assetLibrary, phase, intensity }) => {
  const [chaosAssets, setChaosAssets] = useState([]);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef(null);
  const preloader = useRef(new AssetPreloader());
  
  // Preload assets on mount
  useEffect(() => {
    if (!assetLibrary) return;
    
    const preloadAssets = async () => {
      // Check if already cached from GlobalPreloader
      if (preloader.current.isMutationCached('real-asset-chaos')) {
        console.log('⚡ INSTANT LOAD - assets already cached!');
        setLoadingProgress(100);
        setIsPreloaded(true);
        
        const assetSet = await preloader.current.preloadMutationAssets('real-asset-chaos', assetLibrary);
        generateChaosFromPreloaded(assetSet);
        return;
      }
      
      setLoadingProgress(10);
      
      try {
        const assetSet = await preloader.current.preloadMutationAssets('real-asset-chaos', assetLibrary);
        setLoadingProgress(80);
        
        // Preload upcoming mutations in background
        preloader.current.preloadUpcoming({ id: 'real-asset-chaos' }, assetLibrary);
        setLoadingProgress(100);
        setIsPreloaded(true);
        
        // Generate initial chaos with preloaded assets
        generateChaosFromPreloaded(assetSet);
        
      } catch (error) {
        console.error('Preload failed, using fallback:', error);
        setIsPreloaded(true);
        generateChaosFromLibrary();
      }
    };
    
    preloadAssets();
  }, [assetLibrary]);
  
  const generateChaosFromPreloaded = (assetSet) => {
    const count = Math.min(20, Math.floor(intensity * 15) + 8); // Cap at 20
    const assets = [];
    
    for (let i = 0; i < count; i++) {
      const randomAsset = assetSet.images[Math.floor(Math.random() * assetSet.images.length)];
      
      if (randomAsset && preloader.current.isImageCached(randomAsset.path)) {
        assets.push({
          id: `chaos-${Date.now()}-${i}`,
          path: randomAsset.path,
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * 1.5, // Reduced speed for smoothness
          vy: (Math.random() - 0.5) * 1.5,
          scale: 0.4 + Math.random() * 0.6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          opacity: 0.6 + Math.random() * 0.4,
          hue: Math.random() * 360,
          glitchAmount: 0,
          preloaded: true
        });
      }
    }
    
    setChaosAssets(assets);
  };
  
  const generateChaosFromLibrary = () => {
    // Fallback to library method (reduced count for performance)
    const count = Math.min(12, Math.floor(intensity * 10) + 4); // Cap at 12
    const assets = [];
    
    const guaranteedAssets = [
      '/assets/neo-neukoelln/images/mutumbo.png',
      '/assets/miami-voice/images/tico.png',
      '/assets/blobtv/images/blobtv_logo.png',
      '/assets/neo-neukoelln/images/gamelogo.png'
    ];
    
    for (let i = 0; i < count; i++) {
      const randomAsset = guaranteedAssets[Math.floor(Math.random() * guaranteedAssets.length)];
      
      assets.push({
        id: `chaos-${Date.now()}-${i}`,
        path: randomAsset,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        opacity: 0.7 + Math.random() * 0.3,
        hue: Math.random() * 360,
        glitchAmount: 0,
        preloaded: false
      });
    }
    
    setChaosAssets(assets);
  };
  
  // Regenerate chaos based on phase
  useEffect(() => {
    if (!isPreloaded) return;
    
    const assetSet = preloader.current.getPreloadedSet('real-asset-chaos');
    
    if (phase === 'chaos' && assetSet) {
      const interval = setInterval(() => {
        generateChaosFromPreloaded(assetSet);
      }, 3000); // Increased interval for smoothness
      return () => clearInterval(interval);
    }
  }, [phase, intensity, isPreloaded]);
  
  // Animation loop
  useEffect(() => {
    let animationId;
    
    const animate = () => {
      setChaosAssets(prev => prev.map(asset => {
        let newX = asset.x + asset.vx * intensity;
        let newY = asset.y + asset.vy * intensity;
        let newVx = asset.vx;
        let newVy = asset.vy;
        
        // Bounce off edges
        if (newX < 0 || newX > 100) {
          newVx = -asset.vx;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY < 0 || newY > 100) {
          newVy = -asset.vy;
          newY = Math.max(0, Math.min(100, newY));
        }
        
        // Chaos phase effects
        const glitchAmount = phase === 'chaos' ? Math.random() * 20 : 0;
        const scaleWobble = Math.sin(Date.now() * 0.001 + asset.id) * 0.1 * intensity;
        
        return {
          ...asset,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: asset.rotation + asset.rotationSpeed,
          scale: asset.scale + scaleWobble,
          glitchAmount,
          hue: asset.hue + (phase === 'chaos' ? 5 : 1)
        };
      }));
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [phase, intensity]);
  
  const getPhaseStyle = () => {
    switch (phase) {
      case 'calm':
        return { 
          background: 'radial-gradient(circle at center, #1a1a2e, #000)',
          filter: 'contrast(0.9)'
        };
      case 'build':
        return { 
          background: 'radial-gradient(circle at center, #2a1a3e, #1a0a2e)',
          filter: 'contrast(1.1) saturate(1.2)'
        };
      case 'chaos':
        return { 
          background: `conic-gradient(from ${Date.now() * 0.1}deg, #ff0066, #6600ff, #00ffff, #ff0066)`,
          filter: 'contrast(1.5) saturate(2)'
        };
      case 'fade':
        return { 
          background: 'radial-gradient(circle at center, #0a0a1e, #000)',
          filter: 'contrast(0.5) brightness(0.5)'
        };
      default:
        return {};
    }
  };
  
  return (
    <div 
      className="mutation-real-chaos"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        ...getPhaseStyle()
      }}
    >
      {/* Chaos assets */}
      {chaosAssets.map((asset) => (
        <div
          key={asset.id}
          className="real-chaos-asset"
          style={{
            position: 'absolute',
            left: `${asset.x}%`,
            top: `${asset.y}%`,
            transform: `
              translate(-50%, -50%) 
              scale(${asset.scale}) 
              rotate(${asset.rotation}deg)
              translateX(${asset.glitchAmount}px)
            `,
            opacity: asset.opacity,
            filter: `hue-rotate(${asset.hue}deg) saturate(${1 + intensity})`,
            transition: phase === 'chaos' ? 'none' : 'all 0.3s ease-out'
          }}
        >
{asset.preloaded && preloader.current.isImageCached(asset.path) ? (
            <img 
              src={preloader.current.getCachedImage(asset.path).src}
              alt="chaos asset"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                mixBlendMode: phase === 'chaos' ? 'screen' : 'normal',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
              }}
              onLoad={() => {
                // Cached image loaded successfully
              }}
            />
          ) : (
            <img 
              src={asset.path} 
              alt="chaos asset"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                mixBlendMode: phase === 'chaos' ? 'screen' : 'normal',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
                opacity: asset.preloaded ? 1 : 0.7  // Dimmer for non-preloaded
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      ))}
      
      {/* Status overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '2rem',
        textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
          {phase === 'calm' && '🌊 GATHERING FRAGMENTS...'}
          {phase === 'build' && '⚡ ACCELERATING CHAOS...'}
          {phase === 'chaos' && '🔥 MAXIMUM ENTROPY ACHIEVED!!!'}
          {phase === 'fade' && '💫 COLLAPSING TO SINGULARITY...'}
        </div>
        <div style={{ fontSize: '1rem' }}>
          {chaosAssets.length} ASSETS IN MOTION | INTENSITY: {(intensity * 100).toFixed(0)}%
        </div>
      </div>
      
      {/* Glitch lines for chaos phase */}
      {phase === 'chaos' && (
        <>
          {[...Array(5)].map((_, i) => (
            <div
              key={`glitch-${i}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
                top: `${Math.random() * 100}%`,
                animation: `glitchScan ${0.5 + Math.random()}s linear infinite`
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default RealAssetChaos;