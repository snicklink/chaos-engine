import { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedAssetLoader from '../core/EnhancedAssetLoader';
import './mutations.css';

const GlitchPanopticon = ({ assetLibrary, phase, intensity, assets }) => {
  const containerRef = useRef(null);
  const glitchIntervalRef = useRef(null);
  const [glitchedElements, setGlitchedElements] = useState([]);
  const [currentAssets, setCurrentAssets] = useState([]);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  const [datamoshLevel, setDatamoshLevel] = useState(0);
  const [vhsDistortion, setVhsDistortion] = useState(0);
  const [staticNoise, setStaticNoise] = useState(0);

  // VHS color palettes for different glitch types
  const glitchPalettes = {
    vhs: ['#ff006e', '#ff4081', '#7c4dff', '#3f51b5', '#2196f3'],
    datamosh: ['#00ff41', '#00e676', '#76ff03', '#c6ff00', '#ffff00'],
    static: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'],
    chromatic: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    corruption: ['#8b0000', '#006400', '#191970', '#8b008b', '#ff8c00']
  };

  // Get assets for glitching - emphasize videos and dynamic content
  const getGlitchableAssets = useCallback(() => {
    const assetCount = Math.min(25, 10 + Math.floor(intensity * 15)); // Cap at 25
    
    // Get lots of images and videos for glitching
    const images = EnhancedAssetLoader.getDiverseAssets('images', Math.floor(assetCount * 0.6));
    const videos = EnhancedAssetLoader.getDiverseAssets('videos', Math.floor(assetCount * 0.4));
    
    // For VHS effect, favor video content
    if (phase === 'chaos') {
      videos.push(...EnhancedAssetLoader.getProjectAssets(['vibetales', 'blobtv'], 'videos', 5));
    }
    
    // Mix in some mascots for corruption
    const mascots = EnhancedAssetLoader.getMascotAssets().slice(0, 5);
    
    // Add some fake text/code for matrix effects
    const fakeCode = [
      { type: 'text', content: 'SYSTEM.CORRUPT(willy.exe)', name: 'corruption' },
      { type: 'text', content: 'ERROR: DOENER_OVERFLOW', name: 'error' },
      { type: 'text', content: 'GLITCH.BERLIN.TECHNO.LOOP', name: 'glitch' },
      { type: 'code', content: 'while(chaos) { mutate(); }', name: 'code' }
    ];
    
    return [...images, ...videos, ...mascots, ...fakeCode];
  }, [intensity, phase]);

  // Create glitched elements
  const createGlitchedElements = useCallback(() => {
    const assetList = getGlitchableAssets();
    setCurrentAssets(assetList);
    
    const elements = assetList.map((asset, index) => {
      const glitchType = ['datamosh', 'vhs', 'static', 'chromatic', 'corruption'][Math.floor(Math.random() * 5)];
      
      return {
        id: `glitch-${index}`,
        asset,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: 100 + Math.random() * 200,
        height: 80 + Math.random() * 120,
        glitchType,
        intensity: 0.3 + Math.random() * 0.7,
        scanlineSpeed: 1 + Math.random() * 4,
        distortionAmount: Math.random() * 100,
        colorShift: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.6,
        zIndex: Math.floor(Math.random() * 100),
        corrupted: Math.random() < 0.3,
        pixelated: Math.random() < 0.4,
        inverted: Math.random() < 0.2
      };
    });
    
    setGlitchedElements(elements);
  }, [getGlitchableAssets]);

  // Generate glitch CSS filter
  const getGlitchFilter = (element, time) => {
    const filters = [];
    const wave = Math.sin(time * element.scanlineSpeed);
    const noise = Math.random();
    
    // Base filters
    if (element.pixelated) {
      filters.push(`contrast(${120 + element.intensity * 80}%)`);
    }
    
    if (element.inverted && noise < 0.1) {
      filters.push('invert(100%)');
    }
    
    // Glitch-type specific filters
    switch (element.glitchType) {
      case 'datamosh':
        filters.push(`blur(${element.intensity * 4}px)`);
        filters.push(`saturate(${200 + wave * 100}%)`);
        filters.push(`hue-rotate(${element.colorShift + wave * 180}deg)`);
        break;
      case 'vhs':
        filters.push(`brightness(${80 + wave * 40}%)`);
        filters.push(`contrast(${150 + wave * 50}%)`);
        filters.push(`sepia(${element.intensity * 60}%)`);
        break;
      case 'static':
        if (noise < 0.3) {
          filters.push(`grayscale(${element.intensity * 100}%)`);
          filters.push(`contrast(${300 + noise * 200}%)`);
        }
        break;
      case 'chromatic':
        filters.push(`saturate(${300 + wave * 200}%)`);
        filters.push(`hue-rotate(${time * 100}deg)`);
        break;
      case 'corruption':
        if (noise < 0.2) {
          filters.push('invert(100%)');
          filters.push(`contrast(${500}%)`);
        }
        filters.push(`blur(${Math.abs(wave) * 8}px)`);
        break;
    }
    
    return filters.join(' ');
  };

  // Generate glitch transform
  const getGlitchTransform = (element, time) => {
    const transforms = [];
    const wave = Math.sin(time * element.scanlineSpeed + element.id.length);
    const glitchNoise = Math.random();
    
    // Base position and scale
    transforms.push(`translate(${element.x}vw, ${element.y}vh)`);
    
    // Glitch-specific transforms
    if (glitchNoise < 0.1 && element.corrupted) {
      // Sudden position jumps
      transforms.push(`translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px)`);
    }
    
    switch (element.glitchType) {
      case 'datamosh':
        transforms.push(`skewX(${wave * element.distortionAmount * 0.3}deg)`);
        transforms.push(`scale(${1 + wave * 0.2})`);
        break;
      case 'vhs':
        transforms.push(`translateX(${wave * element.distortionAmount * 0.1}px)`);
        transforms.push(`scaleY(${1 + Math.abs(wave) * 0.1})`);
        break;
      case 'static':
        if (glitchNoise < 0.2) {
          transforms.push(`translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`);
        }
        break;
      case 'chromatic':
        transforms.push(`rotate(${wave * 5}deg)`);
        break;
      case 'corruption':
        transforms.push(`scaleX(${1 + wave * 0.5})`);
        transforms.push(`skewY(${wave * 30}deg)`);
        break;
    }
    
    return transforms.join(' ');
  };

  // Render glitched content
  const renderGlitchedContent = (element) => {
    const colors = glitchPalettes[element.glitchType] || glitchPalettes.vhs;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    switch (element.asset.type) {
      case 'images':
        return (
          <img
            src={element.asset.url}
            alt={`Glitched ${element.asset.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: element.pixelated ? 'pixelated' : 'auto'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        );
      case 'videos':
        return (
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
              filter: element.corrupted ? 'saturate(200%) contrast(150%)' : 'none'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        );
      case 'text':
        return (
          <div 
            className="glitch-text"
            style={{ 
              color, 
              fontSize: '16px',
              fontFamily: 'Courier New, monospace',
              overflow: 'hidden',
              wordBreak: 'break-all',
              lineHeight: '1.2',
              padding: '10px',
              textAlign: 'center'
            }}
          >
            {element.asset.content?.substring(0, 200) || 'CORRUPTED DATA'}
          </div>
        );
      case 'code':
        return (
          <pre 
            className="glitch-code"
            style={{ 
              color, 
              fontSize: '14px',
              fontFamily: 'Courier New, monospace',
              overflow: 'hidden',
              margin: 0,
              lineHeight: '1.1',
              padding: '10px'
            }}
          >
            {element.asset.content?.substring(0, 300) || 'ERROR 404'}
          </pre>
        );
      default:
        return (
          <div style={{ color, fontFamily: 'Courier New, monospace', fontSize: '20px', textAlign: 'center' }}>
            SIGNAL LOST
          </div>
        );
    }
  };

  // Animation loop for dynamic effects
  useEffect(() => {
    let startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      
      setScanlineOffset(elapsed * 100);
      setDatamoshLevel(Math.sin(elapsed * 0.5) * 0.5 + 0.5);
      setVhsDistortion(Math.sin(elapsed * 0.3) * 30);
      setStaticNoise(Math.random() * intensity);
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [intensity]);

  // Glitch refresh interval
  useEffect(() => {
    createGlitchedElements();
    
    const refreshRate = Math.max(2000, 8000 - intensity * 6000);
    glitchIntervalRef.current = setInterval(createGlitchedElements, refreshRate);
    
    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [createGlitchedElements, intensity]);

  return (
    <div className="glitch-panopticon" ref={containerRef}>
      {/* VHS scanlines */}
      <div 
        className="vhs-scanlines"
        style={{
          transform: `translateY(${scanlineOffset % window.innerHeight}px)`,
          opacity: 0.3 + intensity * 0.4
        }}
      />
      
      {/* Static noise overlay */}
      <div 
        className="static-noise"
        style={{
          opacity: staticNoise * 0.5,
          filter: `contrast(${200 + staticNoise * 300}%)`
        }}
      />
      
      {/* Glitched elements */}
      {glitchedElements.map((element, index) => (
        <div
          key={element.id}
          className={`glitch-element glitch-${element.glitchType}`}
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: `${element.width}px`,
            height: `${element.height}px`,
            transform: getGlitchTransform(element, scanlineOffset / 100),
            filter: getGlitchFilter(element, scanlineOffset / 100),
            opacity: element.opacity * (0.4 + intensity * 0.6),
            zIndex: element.zIndex,
            mixBlendMode: element.corrupted ? 'difference' : 'normal',
            border: element.corrupted ? '1px solid #ff0040' : 'none',
            overflow: 'hidden'
          }}
        >
          {renderGlitchedContent(element)}
          
          {/* Chromatic aberration overlay */}
          {element.glitchType === 'chromatic' && (
            <div 
              className="chromatic-aberration"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, 
                  rgba(255,0,0,0.3) 0%, 
                  transparent 30%, 
                  transparent 70%, 
                  rgba(0,0,255,0.3) 100%)`,
                mixBlendMode: 'screen'
              }}
            />
          )}
        </div>
      ))}
      
      {/* VHS distortion bars */}
      <div 
        className="vhs-distortion"
        style={{
          transform: `translateY(${vhsDistortion}px) scaleY(${1 + datamoshLevel * 0.5})`,
          opacity: intensity * 0.6
        }}
      />
      
      {/* Info display */}
      <div className="mutation-info glitch-info">
        <h3>GLITCH PANOPTICON</h3>
        <p>Your work corrupted through digital decay</p>
        <div className="mutation-stats">
          <span>ASSETS: {currentAssets.filter(a => a.type === 'images' || a.type === 'videos').length}</span>
          <span>CORRUPTED: {glitchedElements.filter(e => e.corrupted).length}</span>
          <span>PROJECTS: {[...new Set(currentAssets.filter(a => a.project).map(a => a.project))].slice(0, 3).join(', ')}</span>
        </div>
      </div>
    </div>
  );
};

export default GlitchPanopticon;