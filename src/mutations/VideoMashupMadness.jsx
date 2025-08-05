import { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedAssetLoader from '../core/EnhancedAssetLoader';
import './mutations.css';

const VideoMashupMadness = ({ assetLibrary, phase, intensity, assets }) => {
  const containerRef = useRef(null);
  const [videoLayers, setVideoLayers] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [mashupStyle, setMashupStyle] = useState('grid');

  // Mashup styles
  const mashupStyles = ['grid', 'cascade', 'spiral', 'kaleidoscope', 'splitscreen', 'chaos'];

  // Get all available videos
  const getVideoAssets = useCallback(() => {
    const videos = EnhancedAssetLoader.getDiverseAssets('videos', 15 + Math.floor(intensity * 20));
    const images = EnhancedAssetLoader.getDiverseAssets('images', 10 + Math.floor(intensity * 15));
    
    // Track which projects we're showing
    const projects = [...new Set([...videos, ...images].map(a => a.project))];
    setCurrentProjects(projects);
    
    return { videos, images };
  }, [intensity]);

  // Create video layers with different effects
  const createVideoLayers = useCallback(() => {
    const { videos, images } = getVideoAssets();
    
    const layers = videos.map((video, index) => ({
      id: `video-${index}`,
      asset: video,
      position: generatePosition(index, videos.length),
      size: generateSize(index),
      effects: generateEffects(index),
      zIndex: Math.floor(Math.random() * 100),
      playbackRate: 0.5 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.6,
      blend: ['normal', 'multiply', 'screen', 'overlay', 'difference'][Math.floor(Math.random() * 5)]
    }));
    
    // Add some images as static layers
    const imageLayers = images.slice(0, 8).map((img, index) => ({
      id: `img-${index}`,
      asset: img,
      position: generatePosition(index + videos.length, images.length),
      size: generateSize(index + videos.length),
      effects: generateEffects(index + videos.length),
      zIndex: Math.floor(Math.random() * 50),
      opacity: 0.3 + Math.random() * 0.4,
      blend: ['multiply', 'screen', 'overlay'][Math.floor(Math.random() * 3)]
    }));
    
    setVideoLayers([...layers, ...imageLayers]);
  }, [getVideoAssets]);

  // Generate position based on mashup style
  const generatePosition = (index, total) => {
    switch (mashupStyle) {
      case 'grid':
        const cols = Math.ceil(Math.sqrt(total));
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          x: (col / cols) * 100,
          y: (row / Math.ceil(total / cols)) * 100
        };
      case 'cascade':
        return {
          x: (index * 5) % 80,
          y: (index * 8) % 80
        };
      case 'spiral':
        const angle = (index / total) * Math.PI * 4;
        const radius = 20 + (index / total) * 30;
        return {
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius
        };
      case 'kaleidoscope':
        const kAngle = (index / total) * Math.PI * 2;
        return {
          x: 50 + Math.cos(kAngle) * 30,
          y: 50 + Math.sin(kAngle) * 30
        };
      case 'splitscreen':
        return {
          x: index < total / 2 ? 0 : 50,
          y: (index % (total / 2)) * (100 / (total / 2))
        };
      case 'chaos':
      default:
        return {
          x: Math.random() * 80,
          y: Math.random() * 80
        };
    }
  };

  // Generate size variations
  const generateSize = (index) => {
    const baseSize = mashupStyle === 'grid' ? 25 : 30;
    return {
      width: baseSize + Math.random() * 20,
      height: baseSize + Math.random() * 20
    };
  };

  // Generate visual effects
  const generateEffects = (index) => {
    const effects = [];
    
    if (Math.random() > 0.5) effects.push(`hue-rotate(${Math.random() * 360}deg)`);
    if (Math.random() > 0.6) effects.push(`contrast(${80 + Math.random() * 40}%)`);
    if (Math.random() > 0.7) effects.push(`saturate(${50 + Math.random() * 150}%)`);
    if (phase === 'chaos' && Math.random() > 0.5) effects.push('invert(100%)');
    if (intensity > 0.7) effects.push(`blur(${Math.random() * 3}px)`);
    
    return effects.join(' ');
  };

  // Change mashup style based on phase
  useEffect(() => {
    switch (phase) {
      case 'calm':
        setMashupStyle('grid');
        break;
      case 'build':
        setMashupStyle(['cascade', 'spiral'][Math.floor(Math.random() * 2)]);
        break;
      case 'chaos':
        setMashupStyle(['kaleidoscope', 'chaos'][Math.floor(Math.random() * 2)]);
        break;
      case 'fade':
        setMashupStyle('splitscreen');
        break;
    }
  }, [phase]);

  // Initialize and update layers
  useEffect(() => {
    createVideoLayers();
    
    const interval = setInterval(() => {
      createVideoLayers();
    }, 10000 - intensity * 5000);
    
    return () => clearInterval(interval);
  }, [createVideoLayers, intensity]);

  return (
    <div className="video-mashup-madness" ref={containerRef}>
      <div className="mashup-container">
        {videoLayers.map((layer) => (
          <div
            key={layer.id}
            className="mashup-layer"
            style={{
              position: 'absolute',
              left: `${layer.position.x}%`,
              top: `${layer.position.y}%`,
              width: `${layer.size.width}%`,
              height: `${layer.size.height}%`,
              opacity: layer.opacity,
              mixBlendMode: layer.blend,
              filter: layer.effects,
              zIndex: layer.zIndex,
              transition: 'all 1s ease-in-out',
              overflow: 'hidden',
              borderRadius: mashupStyle === 'kaleidoscope' ? '50%' : '0'
            }}
          >
            {layer.asset.type === 'videos' ? (
              <video
                src={layer.asset.url}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onLoadedMetadata={(e) => {
                  e.target.playbackRate = layer.playbackRate || 1;
                }}
              />
            ) : (
              <img
                src={layer.asset.url}
                alt={layer.asset.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Project overlay */}
      <div className="project-overlay">
        {currentProjects.map((project, index) => (
          <div
            key={project}
            className="project-name"
            style={{
              position: 'absolute',
              left: `${10 + index * 15}%`,
              top: `${10 + index * 10}%`,
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              transform: `rotate(${-15 + index * 10}deg)`,
              fontFamily: 'Courier New, monospace',
              opacity: 0.7 + Math.sin(Date.now() / 1000 + index) * 0.3
            }}
          >
            {project.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mashup-controls">
        <button 
          onClick={() => {
            chaosRandomizer.refresh();
            createVideoLayers();
          }}
          className="mashup-button"
        >
          🎥 NEW MASHUP
        </button>
        
        <button 
          onClick={() => {
            const styles = ['grid', 'cascade', 'spiral', 'kaleidoscope', 'splitscreen', 'chaos'];
            const newStyle = styles[Math.floor(Math.random() * styles.length)];
            setMashupStyle(newStyle);
          }}
          className="mashup-button"
        >
          🎨 CHANGE STYLE
        </button>
      </div>

      {/* Info display */}
      <div className="mutation-info mashup-info">
        <h3>VIDEO MASHUP MADNESS</h3>
        <p>All your projects playing simultaneously</p>
        <div className="mutation-stats">
          <span>VIDEOS: {videoLayers.filter(l => l.asset && (l.asset.type === 'video' || l.asset.type === 'videos' || l.asset.isVideo)).length}</span>
          <span>STYLE: {mashupStyle.toUpperCase()}</span>
          <span>PROJECTS: {currentProjects.slice(0, 3).join(', ')}{currentProjects.length > 3 ? '...' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoMashupMadness;