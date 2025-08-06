import { useEffect, useRef, useState } from 'react';
import AssetPreloader from '../core/AssetPreloader';
import BackgroundGenerator from '../core/BackgroundGenerator';
import MotionSystem from '../core/MotionSystem';
import FontLoader from '../core/FontLoader';
import './mutations.css';

const AssetChaosDisplay = ({ assetLibrary, phase, intensity }) => {
  const containerRef = useRef(null);
  const [displayedAssets, setDisplayedAssets] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const preloader = useRef(new AssetPreloader());
  const backgroundGenerator = useRef(new BackgroundGenerator());
  const motionSystem = useRef(new MotionSystem());
  const fontLoader = useRef(new FontLoader());
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [assetPools, setAssetPools] = useState({ main: [], rotating: [], physics: [] });
  const velocitiesRef = useRef({});
  
  // Movement patterns for variety
  const movementPatterns = {
    spiral: (asset, time) => ({
      x: 50 + Math.cos(time * asset.speed) * (20 + time * 0.5) % 100,
      y: 50 + Math.sin(time * asset.speed) * (20 + time * 0.5) % 100
    }),
    zigzag: (asset, time) => ({
      x: (asset.x + Math.sin(time * 3) * 5 * intensity) % 100,
      y: (asset.y + asset.speed) % 100
    }),
    bounce: (asset, time) => ({
      x: asset.x + Math.sin(time * 2) * 10,
      y: 50 + Math.abs(Math.sin(time * asset.speed)) * 40
    }),
    orbit: (asset, time) => ({
      x: 50 + Math.cos(time * asset.speed + asset.phase) * asset.radius,
      y: 50 + Math.sin(time * asset.speed + asset.phase) * asset.radius
    }),
    wave: (asset, time) => ({
      x: (asset.x + asset.speed * 0.2) % 100,
      y: 50 + Math.sin((asset.x / 10) + time) * 20 * intensity
    }),
    swarm: (asset, time, allAssets) => {
      // Flocking behavior
      let centerX = 0, centerY = 0;
      let count = 0;
      allAssets.forEach(other => {
        if (other.id !== asset.id && Math.abs(other.x - asset.x) < 20) {
          centerX += other.x;
          centerY += other.y;
          count++;
        }
      });
      if (count > 0) {
        return {
          x: asset.x + (centerX / count - asset.x) * 0.02,
          y: asset.y + (centerY / count - asset.y) * 0.02
        };
      }
      return { x: asset.x, y: asset.y };
    },
    teleport: (asset, time) => {
      if (Math.random() < 0.01) {
        return {
          x: Math.random() * 100,
          y: Math.random() * 100
        };
      }
      return { x: asset.x, y: asset.y };
    },
    gravity: (asset, time) => ({
      x: asset.x,
      y: Math.min(90, asset.y + asset.fallSpeed * (time - asset.startTime))
    })
  };
  
  // Initialize background
  useEffect(() => {
    const bgStyle = backgroundGenerator.current.generateBackground(phase, intensity, assetLibrary);
    setBackgroundStyle(bgStyle);
  }, [phase, intensity, assetLibrary]);
  
  useEffect(() => {
    if (!assetLibrary || !assetLibrary.allAssets) return;
    
    // Preload assets for overflow chaos
    if (preloader.current.isMutationCached('asset-chaos-overflow')) {
      console.log('⚡ ASSET CHAOS OVERFLOW - INSTANT LOAD!');
    } else {
      preloader.current.preloadMutationAssets('asset-chaos-overflow', assetLibrary);
    }
    
    // Enable physics in chaos phase
    setPhysicsEnabled(phase === 'chaos');
    
    // Create asset pools for variety
    const createAssetPools = () => {
      const imageAssets = assetLibrary.assetsByType?.images || [];
      const pools = {
        main: [],
        rotating: [],
        physics: []
      };
      
      // Distribute assets into different behavior pools
      imageAssets.forEach((asset, index) => {
        if (index % 3 === 0) pools.main.push(asset);
        else if (index % 3 === 1) pools.rotating.push(asset);
        else pools.physics.push(asset);
      });
      
      setAssetPools(pools);
    };
    
    createAssetPools();
  }, [assetLibrary, phase]);
  
  // Load and animate assets with variety
  useEffect(() => {
    if (!assetLibrary || !assetLibrary.allAssets) return;
    
    const loadImages = async () => {
      const randomAssets = [];
      const count = Math.min(25, Math.floor(intensity * 20) + 8); // Cap at 25 for performance
      const patterns = Object.keys(movementPatterns);
      
      // Mix assets from different pools
      for (let i = 0; i < count; i++) {
        const poolType = i % 3 === 0 ? 'main' : i % 3 === 1 ? 'rotating' : 'physics';
        const pool = assetPools[poolType];
        if (!pool || pool.length === 0) continue;
        
        const asset = pool[Math.floor(Math.random() * pool.length)];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        const newAsset = {
          ...asset,
          id: `${asset.path}-${Date.now()}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: 0.3 + Math.random() * intensity * 1.5,
          rotation: Math.random() * 360,
          opacity: 0.4 + intensity * 0.6,
          speed: 0.5 + Math.random() * 3,
          rotationSpeed: (Math.random() - 0.5) * 10,
          pattern: pattern,
          phase: Math.random() * Math.PI * 2,
          radius: 20 + Math.random() * 30,
          fallSpeed: 0.5 + Math.random() * 2,
          startTime: Date.now() / 1000,
          poolType: poolType,
          colorShift: Math.random() * 360,
          blendMode: ['normal', 'multiply', 'screen', 'overlay'][Math.floor(Math.random() * 4)]
        };
        
        // Initialize physics velocity
        if (physicsEnabled && poolType === 'physics') {
          velocitiesRef.current[newAsset.id] = {
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5
          };
        }
        
        randomAssets.push(newAsset);
      }
      
      setDisplayedAssets(randomAssets);
    };
    
    loadImages();
    
    // Refresh at different rates based on phase
    const refreshInterval = phase === 'chaos' ? 200 : phase === 'build' ? 1000 : 3000;
    const interval = setInterval(loadImages, refreshInterval);
    
    return () => clearInterval(interval);
  }, [assetLibrary, phase, intensity, assetPools, physicsEnabled]);
  
  // Animate assets with various patterns
  useEffect(() => {
    let animationId;
    
    const animate = () => {
      const time = Date.now() / 1000;
      
      setDisplayedAssets(prev => prev.map(asset => {
        let newX = asset.x;
        let newY = asset.y;
        
        // Apply movement pattern
        const pattern = movementPatterns[asset.pattern];
        if (pattern) {
          const newPos = pattern(asset, time, prev);
          newX = newPos.x;
          newY = newPos.y;
        }
        
        // Apply physics if enabled
        if (physicsEnabled && asset.poolType === 'physics') {
          const vel = velocitiesRef.current[asset.id] || { vx: 0, vy: 0 };
          
          // Gravity
          vel.vy += 0.2;
          
          // Update position
          newX += vel.vx;
          newY += vel.vy;
          
          // Bounce off walls
          if (newX < 0 || newX > 100) {
            vel.vx *= -0.8;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY < 0 || newY > 100) {
            vel.vy *= -0.8;
            newY = Math.max(0, Math.min(100, newY));
          }
          
          velocitiesRef.current[asset.id] = vel;
        }
        
        // Apply rotation based on pool type
        let newRotation = asset.rotation;
        if (asset.poolType === 'rotating') {
          newRotation += asset.rotationSpeed * (1 + intensity);
        } else if (phase === 'chaos') {
          newRotation += Math.sin(time * 5) * intensity * 10;
        }
        
        // Dynamic scaling
        const scaleModifier = asset.poolType === 'main' 
          ? Math.sin(time * 2 + asset.phase) * 0.2 * intensity
          : Math.cos(time * 3) * 0.1;
        
        return {
          ...asset,
          x: newX,
          y: newY,
          rotation: newRotation,
          scale: Math.max(0.1, asset.scale + scaleModifier),
          opacity: phase === 'fade' 
            ? asset.opacity * 0.95 
            : asset.opacity + Math.sin(time * 4) * 0.1,
          colorShift: (asset.colorShift + intensity * 2) % 360
        };
      }));
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [phase, intensity, physicsEnabled]);
  
  // Apply motion system to elements
  useEffect(() => {
    if (displayedAssets.length === 0) return;
    
    const applyMotionTimeout = setTimeout(() => {
      displayedAssets.forEach((asset, index) => {
        const element = document.getElementById(asset.id);
        if (element && asset.poolType === 'main') {
          const motions = motionSystem.current.getSuggestedMotions(phase, intensity);
          const motion = motions[index % motions.length];
          
          motionSystem.current.applyMotion(element, {
            motion: motion.type,
            intensity: motion.intensity * 0.5,
            phase: phase,
            delay: index * 30
          });
        }
      });
    }, 100);
    
    return () => {
      clearTimeout(applyMotionTimeout);
      motionSystem.current.clear();
    };
  }, [displayedAssets, phase, intensity]);
  
  // Get dynamic title font
  const titleFontStyle = fontLoader.current.getRandomStyle(phase, intensity);
  
  return (
    <div className="mutation-asset-chaos" ref={containerRef}>
      <div className="chaos-background" style={backgroundStyle}>
        {displayedAssets.map(asset => (
          <div
            key={asset.id}
            id={asset.id}
            className={`chaos-asset ${asset.poolType}`}
            style={{
              left: `${asset.x}%`,
              top: `${asset.y}%`,
              transform: `translate(-50%, -50%) scale(${asset.scale}) rotate(${asset.rotation}deg)`,
              opacity: asset.opacity,
              filter: `hue-rotate(${asset.colorShift}deg) ${
                phase === 'chaos' ? 'saturate(3) brightness(1.2)' : 
                phase === 'build' ? 'contrast(1.2)' : 
                'none'
              }`,
              mixBlendMode: asset.blendMode,
              transition: asset.poolType === 'physics' || phase === 'chaos' 
                ? 'none' 
                : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: Math.floor(asset.y)
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
        <h2 className="chaos-title" style={titleFontStyle}>
          {phase === 'calm' && 'ASSET EXTRACTION INITIATED'}
          {phase === 'build' && `LOADING ${displayedAssets.length} ORPHAN ASSETS...`}
          {phase === 'chaos' && 'MAXIMUM ASSET OVERFLOW!!!'}
          {phase === 'fade' && 'ASSETS RETURNING TO VOID...'}
        </h2>
        
        {assetLibrary && (
          <div className="asset-stats">
            <div>Total Assets: {assetLibrary.allAssets?.length || 0}</div>
            <div>Active Chaos: {displayedAssets.length}</div>
            <div>Physics: {physicsEnabled ? 'ENABLED' : 'DISABLED'}</div>
            <div>Patterns: {Object.keys(movementPatterns).length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetChaosDisplay;