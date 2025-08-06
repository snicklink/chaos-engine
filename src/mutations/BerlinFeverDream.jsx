import { useState, useEffect, useRef } from 'react';
import chaosRandomizer from '../core/ChaosRandomizer';
import './mutations.css';

const BerlinFeverDream = ({ phase, intensity }) => {
  const containerRef = useRef(null);
  const [doenerDealers, setDoenerDealers] = useState([]);
  const [berlinChaos, setBerlinChaos] = useState([]);
  const [technoBeats, setTechnoBeats] = useState(0);
  const videoRefs = useRef({});

  useEffect(() => {
    // Create multiple döner dealers invading the space
    const dealers = [];
    const dealerCount = 3 + Math.floor(intensity * 5);
    
    for (let i = 0; i < dealerCount; i++) {
      dealers.push({
        id: `dealer-${i}`,
        x: Math.random() * 80,
        y: Math.random() * 80,
        size: 100 + Math.random() * 200,
        speed: 0.5 + Math.random() * 2,
        rotation: Math.random() * 360,
        opacity: 0.6 + Math.random() * 0.4
      });
    }
    
    setDoenerDealers(dealers);
    
    // Get random Berlin-themed videos and images
    const videos = chaosRandomizer.getRandomAssets('videos', 4);
    const images = chaosRandomizer.getRandomAssets('images', 8);
    
    // Create chaotic Berlin elements
    const chaosElements = [];
    
    // Add videos as background layers
    videos.forEach((video, i) => {
      chaosElements.push({
        type: 'video',
        id: `video-${i}`,
        url: video.url,
        x: Math.random() * 60,
        y: Math.random() * 60,
        width: 400 + Math.random() * 400,
        height: 300 + Math.random() * 300,
        opacity: 0.3 + Math.random() * 0.3,
        blend: ['multiply', 'screen', 'overlay'][Math.floor(Math.random() * 3)],
        zIndex: i
      });
    });
    
    // Add images as floating elements
    images.forEach((img, i) => {
      chaosElements.push({
        type: 'image',
        id: `img-${i}`,
        url: img.url,
        x: Math.random() * 90,
        y: Math.random() * 90,
        size: 50 + Math.random() * 150,
        rotation: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.4,
        animation: ['spin', 'pulse', 'float'][Math.floor(Math.random() * 3)],
        zIndex: 10 + i
      });
    });
    
    setBerlinChaos(chaosElements);
  }, [intensity]);

  // Animate döner dealers
  useEffect(() => {
    const interval = setInterval(() => {
      setDoenerDealers(prev => prev.map(dealer => ({
        ...dealer,
        x: (dealer.x + dealer.speed * Math.sin(Date.now() * 0.001 + dealer.id)) % 100,
        y: (dealer.y + dealer.speed * Math.cos(Date.now() * 0.001 + dealer.id)) % 100,
        rotation: dealer.rotation + dealer.speed * 2
      })));
      
      // Techno beat pulse
      setTechnoBeats(prev => (prev + 1) % 4);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Play videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.play().catch(() => {});
        video.playbackRate = 0.5 + Math.random();
      }
    });
  }, [berlinChaos]);

  const getPhaseEffect = () => {
    switch(phase) {
      case 'chaos':
        return {
          filter: `contrast(1.5) saturate(2) hue-rotate(${technoBeats * 90}deg)`,
          transform: `scale(${1 + Math.sin(technoBeats * 0.5) * 0.05}) rotate(${Math.sin(Date.now() * 0.001) * 2}deg)`
        };
      case 'build':
        return {
          filter: `contrast(1.2) brightness(${1 + technoBeats * 0.1})`
        };
      default:
        return {};
    }
  };

  return (
    <div 
      ref={containerRef}
      className="berlin-fever-dream"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(circle at ${50 + technoBeats * 10}% ${50 + technoBeats * 10}%, #ff006e, #8338ec, #3a86ff)`,
        ...getPhaseEffect()
      }}
    >
      {/* Render background videos */}
      {berlinChaos.filter(el => el.type === 'video').map(video => (
        <video
          key={video.id}
          ref={el => videoRefs.current[video.id] = el}
          src={video.url}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            left: `${video.x}%`,
            top: `${video.y}%`,
            width: `${video.width}px`,
            height: `${video.height}px`,
            opacity: video.opacity,
            mixBlendMode: video.blend,
            transform: 'translate(-50%, -50%)',
            zIndex: video.zIndex,
            objectFit: 'cover'
          }}
        />
      ))}
      
      {/* Render floating images */}
      {berlinChaos.filter(el => el.type === 'image').map(img => (
        <img
          key={img.id}
          src={img.url}
          alt=""
          className={`berlin-element ${img.animation}`}
          style={{
            position: 'absolute',
            left: `${img.x}%`,
            top: `${img.y}%`,
            width: `${img.size}px`,
            height: `${img.size}px`,
            opacity: img.opacity,
            transform: `translate(-50%, -50%) rotate(${img.rotation}deg)`,
            zIndex: img.zIndex,
            objectFit: 'cover',
            mixBlendMode: 'screen'
          }}
        />
      ))}
      
      {/* Döner Dealers invading! */}
      {doenerDealers.map(dealer => (
        <div
          key={dealer.id}
          className="doener-dealer"
          style={{
            position: 'absolute',
            left: `${dealer.x}%`,
            top: `${dealer.y}%`,
            width: `${dealer.size}px`,
            height: `${dealer.size}px`,
            opacity: dealer.opacity,
            transform: `translate(-50%, -50%) rotate(${dealer.rotation}deg)`,
            zIndex: 100,
            fontSize: `${dealer.size / 2}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🥙
        </div>
      ))}
      
      {/* Berlin text overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 0 20px rgba(255, 0, 110, 0.8)',
        zIndex: 200,
        opacity: 0.8 + Math.sin(Date.now() * 0.002) * 0.2,
        letterSpacing: `${technoBeats * 2}px`,
        mixBlendMode: 'difference'
      }}>
        BERLIN FEVER DREAM
      </div>
      
      {/* Techno pulse indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 200
      }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: i === technoBeats ? '#ff006e' : 'rgba(255, 255, 255, 0.3)',
              boxShadow: i === technoBeats ? '0 0 20px #ff006e' : 'none',
              transition: 'all 0.1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BerlinFeverDream;