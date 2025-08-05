import { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedAssetLoader from '../core/EnhancedAssetLoader';
import './mutations.css';

const FluidDistortionField = ({ assetLibrary, phase, intensity, assets }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [distortionElements, setDistortionElements] = useState([]);
  const [currentAssets, setCurrentAssets] = useState([]);
  const [waveOffset, setWaveOffset] = useState(0);
  
  // Get diverse assets for distortion
  const getRandomAssets = useCallback(() => {
    // Use Enhanced Asset Loader for proper diversity
    const assetCount = 20 + Math.floor(intensity * 30);
    const mixedAssets = EnhancedAssetLoader.getMixedAssets(assetCount);
    
    // Add some themed assets based on phase
    if (phase === 'chaos') {
      mixedAssets.push(...EnhancedAssetLoader.getThemedAssets('berlin', 5));
    } else if (phase === 'build') {
      mixedAssets.push(...EnhancedAssetLoader.getMascotAssets().slice(0, 5));
    }
    
    return mixedAssets;
  }, [intensity, phase]);

  // Create fluid distortion elements
  const createDistortionElements = useCallback(() => {
    const assetList = getRandomAssets();
    setCurrentAssets(assetList);
    
    const elements = assetList.map((asset, index) => ({
      id: `distort-${index}`,
      asset,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.3 + Math.random() * 1.2,
      rotation: Math.random() * 360,
      opacity: 0.4 + Math.random() * 0.6,
      wavePhase: Math.random() * Math.PI * 2,
      waveAmplitude: 10 + Math.random() * 30,
      waveFrequency: 0.5 + Math.random() * 2,
      distortionType: ['wave', 'ripple', 'spiral', 'liquify', 'bulge'][Math.floor(Math.random() * 5)],
      blendMode: ['multiply', 'screen', 'overlay', 'difference', 'color-dodge', 'exclusion'][Math.floor(Math.random() * 6)]
    }));
    
    setDistortionElements(elements);
  }, [getRandomAssets]);

  // Animation loop
  useEffect(() => {
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      
      setWaveOffset(elapsed);
      
      // Update element positions based on phase
      setDistortionElements(prev => prev.map(el => {
        const phaseMultiplier = phase === 'chaos' ? 2 : phase === 'build' ? 1.5 : 1;
        const newX = el.x + Math.sin(elapsed * el.waveFrequency + el.wavePhase) * el.waveAmplitude * 0.1 * phaseMultiplier;
        const newY = el.y + Math.cos(elapsed * el.waveFrequency * 0.7 + el.wavePhase) * el.waveAmplitude * 0.1 * phaseMultiplier;
        
        return {
          ...el,
          x: ((newX % 100) + 100) % 100,
          y: ((newY % 100) + 100) % 100,
          rotation: el.rotation + elapsed * 10 * phaseMultiplier,
          scale: el.scale + Math.sin(elapsed * 2 + el.wavePhase) * 0.1 * intensity
        };
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, intensity]);

  // Initialize distortion field
  useEffect(() => {
    createDistortionElements();
    
    // Refresh elements periodically based on intensity
    const interval = setInterval(createDistortionElements, 8000 / (1 + intensity));
    
    return () => clearInterval(interval);
  }, [createDistortionElements, intensity]);

  // Generate CSS filter based on distortion type
  const getDistortionFilter = (element, offset) => {
    const wave = Math.sin(offset * element.waveFrequency + element.wavePhase);
    const baseBlur = 2 + intensity * 8;
    
    const filters = [];
    
    switch (element.distortionType) {
      case 'wave':
        filters.push(`blur(${baseBlur + wave * 4}px)`);
        filters.push(`hue-rotate(${wave * 60}deg)`);
        break;
      case 'ripple':
        filters.push(`blur(${baseBlur}px)`);
        filters.push(`contrast(${100 + wave * 80}%)`);
        filters.push(`saturate(${120 + wave * 60}%)`);
        break;
      case 'spiral':
        filters.push(`blur(${baseBlur + wave * 6}px)`);
        filters.push(`brightness(${80 + wave * 40}%)`);
        filters.push(`sepia(${wave * 40}%)`);
        break;
      case 'liquify':
        filters.push(`blur(${baseBlur * 1.5}px)`);
        filters.push(`contrast(${150 + wave * 100}%)`);
        break;
      case 'bulge':
        filters.push(`blur(${baseBlur + Math.abs(wave) * 10}px)`);
        filters.push(`invert(${Math.abs(wave) * 30}%)`);
        break;
      default:
        filters.push(`blur(${baseBlur}px)`);
    }
    
    return filters.join(' ');
  };

  // Generate distortion transform
  const getDistortionTransform = (element, offset) => {
    const wave = Math.sin(offset * element.waveFrequency + element.wavePhase);
    const wave2 = Math.cos(offset * element.waveFrequency * 1.3 + element.wavePhase);
    
    const transforms = [];
    
    transforms.push(`translate(${element.x}vw, ${element.y}vh)`);
    transforms.push(`scale(${element.scale + wave * 0.2})`);
    transforms.push(`rotate(${element.rotation + wave * 45}deg)`);
    
    // Add distortion-specific transforms
    switch (element.distortionType) {
      case 'wave':
        transforms.push(`skewX(${wave * 15}deg)`);
        transforms.push(`skewY(${wave2 * 10}deg)`);
        break;
      case 'ripple':
        transforms.push(`scaleX(${1 + wave * 0.3})`);
        transforms.push(`scaleY(${1 + wave2 * 0.3})`);
        break;
      case 'spiral':
        transforms.push(`rotate(${wave * 180}deg)`);
        transforms.push(`scale(${1 + Math.abs(wave) * 0.5})`);
        break;
      case 'liquify':
        transforms.push(`perspective(100px) rotateX(${wave * 30}deg) rotateY(${wave2 * 30}deg)`);
        break;
      case 'bulge':
        const bulge = 1 + Math.abs(wave) * 0.8;
        transforms.push(`scale(${bulge}, ${1/bulge})`);
        break;
    }
    
    return transforms.join(' ');
  };

  return (
    <div className="fluid-distortion-field" ref={containerRef}>
      {/* Background gradient that shifts with intensity */}
      <div 
        className="fluid-background"
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(waveOffset) * 30}% ${50 + Math.cos(waveOffset * 0.7) * 30}%, 
            rgba(${Math.floor(100 + intensity * 155)}, ${Math.floor(50 + intensity * 100)}, ${Math.floor(200 + intensity * 55)}, 0.1),
            rgba(${Math.floor(200 + intensity * 55)}, ${Math.floor(100 + intensity * 100)}, ${Math.floor(50 + intensity * 155)}, 0.1))`
        }}
      />
      
      {/* Distorted asset elements */}
      {distortionElements.map((element) => (
        <div
          key={element.id}
          className="distortion-element"
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '120px',
            height: '120px',
            transform: getDistortionTransform(element, waveOffset),
            filter: getDistortionFilter(element, waveOffset),
            mixBlendMode: element.blendMode,
            opacity: element.opacity * (0.6 + intensity * 0.4),
            transformOrigin: 'center center',
            transition: 'opacity 0.3s ease-out',
            zIndex: Math.floor(element.scale * 100)
          }}
        >
          {element.asset.type === 'images' && (
            <img
              src={element.asset.url}
              alt={`Distorted ${element.asset.name}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: `${20 + Math.sin(waveOffset + element.wavePhase) * 30}px`,
                border: `2px solid rgba(255, 255, 255, ${0.1 + intensity * 0.2})`
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          {element.asset.type === 'videos' && (
            <video
              src={element.asset.url}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: `${20 + Math.sin(waveOffset + element.wavePhase) * 30}px`,
                border: `2px solid rgba(255, 255, 255, ${0.1 + intensity * 0.2})`
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      ))}
      
      {/* Overlay effects */}
      <div 
        className="fluid-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            ${waveOffset * 30}deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.02) 11px,
            rgba(255, 255, 255, 0.02) 12px
          )`,
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }}
      />
      
      {/* Mutation info */}
      <div className="mutation-info">
        <h3>FLUID DISTORTION FIELD</h3>
        <p>Your projects liquified through dimensional tears</p>
        <div className="mutation-stats">
          <span>ASSETS: {currentAssets.length}</span>
          <span>PROJECTS: {[...new Set(currentAssets.map(a => a.project))].join(', ')}</span>
          <span>INTENSITY: {Math.floor(intensity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default FluidDistortionField;