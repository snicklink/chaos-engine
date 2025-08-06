import { useState, useEffect, useRef } from 'react';
import chaosRandomizer from '../core/ChaosRandomizer';
import './mutations.css';

const VideoRemixChaos = ({ phase, intensity }) => {
  const containerRef = useRef(null);
  const [videoLayers, setVideoLayers] = useState([]);
  const videoRefs = useRef({});

  useEffect(() => {
    // Get random videos from the chaos randomizer
    const videos = chaosRandomizer.getRandomAssets('videos', Math.min(6, 3 + Math.floor(intensity * 3))); // Cap at 6 videos
    
    if (!videos || videos.length === 0) {
      console.warn('⚠️ No videos available for VideoRemixChaos');
      // Fallback to getting all assets and filtering for videos
      const allAssets = chaosRandomizer.getRandomAssets('all', 20);
      const videoAssets = allAssets.filter(a => 
        a.url.endsWith('.mp4') || a.url.endsWith('.webm')
      );
      
      if (videoAssets.length > 0) {
        createVideoLayers(videoAssets);
      }
    } else {
      createVideoLayers(videos);
    }
  }, [intensity]);

  const createVideoLayers = (videos) => {
    const layers = videos.map((video, index) => ({
      id: `video-${index}-${Date.now()}`,
      url: video.url,
      position: {
        x: Math.random() * 60,
        y: Math.random() * 60
      },
      size: {
        width: 400 + Math.random() * 400,
        height: 300 + Math.random() * 300
      },
      opacity: 0.3 + Math.random() * 0.5,
      playbackRate: 0.5 + Math.random() * 1.5,
      blend: ['normal', 'multiply', 'screen', 'overlay', 'difference'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      zIndex: Math.floor(Math.random() * 10)
    }));
    
    setVideoLayers(layers);
    console.log('🎬 VideoRemixChaos: Loaded', layers.length, 'video layers');
  };

  // Start playing videos when they're loaded
  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.play().catch(e => {
          console.log('Video autoplay blocked, will play on user interaction');
        });
      }
    });
  }, [videoLayers]);

  // Phase-based effects
  const getPhaseEffects = () => {
    switch(phase) {
      case 'chaos':
        return {
          filter: `hue-rotate(${Math.sin(Date.now() * 0.001) * 180}deg) saturate(2)`,
          transform: `scale(${1 + Math.sin(Date.now() * 0.002) * 0.1})`
        };
      case 'build':
        return {
          filter: 'contrast(1.2) brightness(1.1)'
        };
      case 'fade':
        return {
          filter: 'grayscale(0.5) brightness(0.8)'
        };
      default:
        return {};
    }
  };

  return (
    <div 
      ref={containerRef}
      className="video-remix-chaos"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
        ...getPhaseEffects()
      }}
    >
      {videoLayers.map(layer => (
        <video
          key={layer.id}
          ref={el => videoRefs.current[layer.id] = el}
          src={layer.url}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            left: `${layer.position.x}%`,
            top: `${layer.position.y}%`,
            width: `${layer.size.width}px`,
            height: `${layer.size.height}px`,
            opacity: layer.opacity,
            mixBlendMode: layer.blend,
            transform: `rotate(${layer.rotation}deg) translate(-50%, -50%)`,
            zIndex: layer.zIndex,
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
          onLoadedMetadata={(e) => {
            e.target.playbackRate = layer.playbackRate;
          }}
        />
      ))}
      
      {/* Overlay text showing current remix state */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: '#0ff',
        fontFamily: 'monospace',
        fontSize: '14px',
        textShadow: '0 0 10px #0ff',
        zIndex: 100
      }}>
        VIDEO REMIX: {videoLayers.length} LAYERS | PHASE: {phase.toUpperCase()}
      </div>
    </div>
  );
};

export default VideoRemixChaos;