import { useState, useEffect, useRef, useCallback } from 'react';
import chaosRandomizer from '../core/ChaosRandomizer';
import './mutations.css';

const QuantumRealityGlitch = ({ assetLibrary, phase, intensity, assets }) => {
  const containerRef = useRef(null);
  const [quantumLayers, setQuantumLayers] = useState([]);
  const [realityStates, setRealityStates] = useState([]);
  const [currentDimension, setCurrentDimension] = useState(0);
  const [quantumCollapse, setQuantumCollapse] = useState(false);
  const [dimensionTears, setDimensionTears] = useState([]);
  const [superposition, setSuperposition] = useState(true);

  // Quantum dimensions with different visual properties
  const quantumDimensions = [
    { name: 'ALPHA', filter: 'hue-rotate(0deg) saturate(120%)', blend: 'normal' },
    { name: 'BETA', filter: 'hue-rotate(120deg) saturate(150%)', blend: 'multiply' },
    { name: 'GAMMA', filter: 'hue-rotate(240deg) saturate(180%)', blend: 'screen' },
    { name: 'DELTA', filter: 'invert(50%) hue-rotate(60deg)', blend: 'overlay' },
    { name: 'EPSILON', filter: 'sepia(70%) hue-rotate(200deg)', blend: 'difference' },
    { name: 'ZETA', filter: 'contrast(200%) brightness(80%)', blend: 'color-dodge' },
    { name: 'ETA', filter: 'blur(3px) contrast(150%)', blend: 'exclusion' }
  ];

  // Get quantum asset variants - LOTS OF THEM!
  const getQuantumAssets = useCallback(() => {
    // Get a diverse mix of assets for each dimension
    const mix = chaosRandomizer.getDiverseMix({
      images: 40,  // 40 random images
      videos: 20,  // 20 random videos - VIDEOS ARE KEY!
      audio: 0
    });
    
    const quantumAssets = [];
    
    // Add all images
    mix.images.forEach(img => {
      quantumAssets.push({
        type: 'image',
        url: img.url,
        name: img.name,
        project: img.project,
        quantum: true
      });
    });
    
    // Add all videos - CRITICAL FOR DENSITY
    mix.videos.forEach(vid => {
      quantumAssets.push({
        type: 'video',
        url: vid.url,
        name: vid.name,
        project: vid.project,
        quantum: true,
        isVideo: true
      });
    });
    
    console.log('🌌 Quantum assets loaded:', mix.images.length, 'images,', mix.videos.length, 'videos');
    return quantumAssets;
  }, []);

  // Create quantum reality layers
  const createQuantumLayers = useCallback(() => {
    const assetList = getQuantumAssets();
    if (assetList.length === 0) return;

    const layers = quantumDimensions.map((dimension, dimIndex) => {
      const layerAssets = assetList
        .sort(() => 0.5 - Math.random())
        .slice(0, 15 + Math.floor(intensity * 20)) // MORE ASSETS PER DIMENSION!
        .map((asset, index) => ({
          ...asset,
          id: `quantum-${dimIndex}-${index}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 80 + Math.random() * 120,
          opacity: 0.3 + Math.random() * 0.5,
          rotation: Math.random() * 360,
          phase: Math.random() * Math.PI * 2,
          frequency: 0.5 + Math.random() * 2,
          quantumState: ['superposition', 'collapsed', 'entangled'][Math.floor(Math.random() * 3)],
          probability: Math.random()
        }));

      return {
        dimension: dimensionIndex = dimIndex,
        name: dimension.name,
        filter: dimension.filter,
        blend: dimension.blend,
        assets: layerAssets,
        visible: superposition || dimIndex === currentDimension,
        coherence: Math.random(),
        entanglement: Math.random() > 0.7
      };
    });

    setQuantumLayers(layers);
  }, [getQuantumAssets, intensity, superposition, currentDimension]);

  // Create dimensional tears/portals - MORE OF THEM!
  const createDimensionTears = useCallback(() => {
    const tearCount = 10 + Math.floor(intensity * 15); // More tears!
    const tears = [];

    for (let i = 0; i < tearCount; i++) {
      tears.push({
        id: `tear-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: 50 + Math.random() * 150,
        height: 30 + Math.random() * 100,
        sourceDimension: Math.floor(Math.random() * quantumDimensions.length),
        targetDimension: Math.floor(Math.random() * quantumDimensions.length),
        intensity: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 180,
        pulsing: Math.random() > 0.5
      });
    }

    setDimensionTears(tears);
  }, [intensity]);

  // Quantum collapse effect
  const triggerQuantumCollapse = useCallback(() => {
    setQuantumCollapse(true);
    setSuperposition(false);
    setCurrentDimension(Math.floor(Math.random() * quantumDimensions.length));
    
    setTimeout(() => {
      setQuantumCollapse(false);
    }, 2000);
    
    setTimeout(() => {
      setSuperposition(true);
    }, 4000);
  }, []);

  // Quantum measurement effect
  const performQuantumMeasurement = useCallback(() => {
    setQuantumLayers(prev => prev.map(layer => ({
      ...layer,
      assets: layer.assets.map(asset => ({
        ...asset,
        quantumState: asset.probability > 0.5 ? 'collapsed' : 'superposition',
        opacity: asset.probability > 0.5 ? asset.opacity * 1.5 : asset.opacity * 0.5
      }))
    })));
  }, []);

  // Animation effects
  useEffect(() => {
    let animationFrame;
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      // Update quantum layer animations
      setQuantumLayers(prev => prev.map(layer => ({
        ...layer,
        assets: layer.assets.map(asset => ({
          ...asset,
          rotation: asset.rotation + elapsed * 10,
          phase: asset.phase + elapsed * asset.frequency,
          opacity: asset.quantumState === 'superposition' 
            ? asset.opacity + Math.sin(elapsed * 3 + asset.phase) * 0.2
            : asset.opacity
        }))
      })));

      // Update dimensional tears
      setDimensionTears(prev => prev.map(tear => ({
        ...tear,
        intensity: tear.pulsing 
          ? tear.intensity + Math.sin(elapsed * 4) * 0.3
          : tear.intensity
      })));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Phase-based quantum behavior
  useEffect(() => {
    switch (phase) {
      case 'calm':
        setSuperposition(true);
        break;
      case 'build':
        if (Math.random() < 0.3) performQuantumMeasurement();
        break;
      case 'chaos':
        if (Math.random() < 0.5) triggerQuantumCollapse();
        break;
      case 'fade':
        setSuperposition(false);
        setCurrentDimension(0);
        break;
    }
  }, [phase, performQuantumMeasurement, triggerQuantumCollapse]);

  // Initialize quantum system
  useEffect(() => {
    createQuantumLayers();
    createDimensionTears();
    
    // Periodic quantum events
    const quantumInterval = setInterval(() => {
      if (Math.random() < intensity * 0.3) {
        performQuantumMeasurement();
      }
      if (Math.random() < intensity * 0.1) {
        triggerQuantumCollapse();
      }
    }, 5000);

    return () => clearInterval(quantumInterval);
  }, [createQuantumLayers, createDimensionTears, intensity, performQuantumMeasurement, triggerQuantumCollapse]);

  // Render quantum asset - INCLUDING VIDEOS!
  const renderQuantumAsset = (asset, layerIndex) => {
    const transform = `
      translate(${asset.x}vw, ${asset.y}vh) 
      rotate(${asset.rotation}deg) 
      scale(${asset.quantumState === 'collapsed' ? 1.2 : 0.8})
    `;

    if (asset.type === 'video' || asset.isVideo) {
      // RENDER VIDEOS!
      return (
        <video
          key={asset.id}
          src={asset.url}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${asset.size}px`,
            height: `${asset.size}px`,
            objectFit: 'cover',
            transform,
            opacity: asset.opacity,
            borderRadius: asset.quantumState === 'entangled' ? '50%' : '0%',
            border: asset.quantumState === 'collapsed' ? '2px solid #00ffff' : 'none',
            filter: asset.quantumState === 'superposition' ? 'blur(2px)' : 'none',
            mixBlendMode: 'screen',
            transition: 'all 0.3s ease-out'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    } else if (asset.type === 'image') {
      return (
        <img
          key={asset.id}
          src={asset.url}
          alt={`Quantum ${asset.name}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${asset.size}px`,
            height: `${asset.size}px`,
            objectFit: 'cover',
            transform,
            opacity: asset.opacity,
            borderRadius: asset.quantumState === 'entangled' ? '50%' : '0%',
            border: asset.quantumState === 'collapsed' ? '2px solid #00ffff' : 'none',
            transition: 'all 0.3s ease-out'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    } else if (asset.type === 'text') {
      return (
        <div
          key={asset.id}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${asset.size}px`,
            height: `${asset.size * 0.6}px`,
            transform,
            opacity: asset.opacity,
            color: asset.quantumState === 'collapsed' ? '#00ffff' : '#ffffff',
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            overflow: 'hidden',
            border: asset.quantumState === 'entangled' ? '1px dashed #ff00ff' : 'none',
            padding: '5px',
            transition: 'all 0.3s ease-out'
          }}
        >
          {asset.content?.substring(0, 100) || 'QUANTUM DATA'}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="quantum-reality-glitch" ref={containerRef}>
      {/* Quantum background */}
      <div 
        className="quantum-background"
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(Date.now() / 3000) * 20}% ${50 + Math.cos(Date.now() / 2000) * 30}%, 
            rgba(0, 20, 40, 0.9), 
            rgba(0, 0, 0, 1))`
        }}
      />

      {/* Quantum layers */}
      {quantumLayers.map((layer, layerIndex) => (
        <div
          key={layer.dimension}
          className={`quantum-layer quantum-${layer.name.toLowerCase()}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            filter: layer.filter,
            mixBlendMode: layer.blend,
            opacity: layer.visible ? (superposition ? 0.6 : 1) : 0,
            transform: quantumCollapse ? `scale(${1 + layerIndex * 0.1})` : 'scale(1)',
            transition: 'all 0.5s ease-out',
            zIndex: layerIndex
          }}
        >
          {layer.assets.map(asset => renderQuantumAsset(asset, layerIndex))}
        </div>
      ))}

      {/* Dimensional tears */}
      {dimensionTears.map((tear) => (
        <div
          key={tear.id}
          className="dimension-tear"
          style={{
            position: 'absolute',
            left: `${tear.x}vw`,
            top: `${tear.y}vh`,
            width: `${tear.width}px`,
            height: `${tear.height}px`,
            background: `linear-gradient(${tear.rotation}deg, 
              transparent 0%, 
              rgba(0, 255, 255, ${tear.intensity}) 20%,
              rgba(255, 0, 255, ${tear.intensity}) 50%,
              rgba(255, 255, 0, ${tear.intensity}) 80%,
              transparent 100%)`,
            borderRadius: '50%',
            filter: 'blur(2px)',
            mixBlendMode: 'screen',
            animation: tear.pulsing ? 'quantumPulse 2s ease-in-out infinite' : 'none',
            zIndex: 1000
          }}
        />
      ))}

      {/* Quantum collapse overlay */}
      {quantumCollapse && (
        <div className="quantum-collapse">
          <div className="collapse-wave" />
          <div className="collapse-text">QUANTUM COLLAPSE</div>
        </div>
      )}

      {/* Controls */}
      <div className="quantum-controls">
        <button 
          onClick={() => {
            chaosRandomizer.refresh();
            createQuantumLayers();
            triggerQuantumCollapse();
          }}
          className="quantum-button"
        >
          ⚛️ NEW REALITY
        </button>
        
        <button 
          onClick={performQuantumMeasurement}
          className="quantum-button"
        >
          📐 MEASUREMENT
        </button>
        
        <button 
          onClick={() => setSuperposition(!superposition)}
          className="quantum-button"
        >
          🌀 SUPERPOSITION
        </button>
      </div>

      {/* Info display */}
      <div className="mutation-info quantum-info">
        <h3>QUANTUM REALITY GLITCH</h3>
        <p>Multiple dimensions existing simultaneously</p>
        <div className="mutation-stats">
          <span>DIMENSION: {quantumDimensions[currentDimension]?.name || 'ALL'}</span>
          <span>STATE: {superposition ? 'SUPERPOSITION' : 'COLLAPSED'}</span>
          <span>TEARS: {dimensionTears.length}</span>
          <span>COHERENCE: {Math.floor(intensity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default QuantumRealityGlitch;