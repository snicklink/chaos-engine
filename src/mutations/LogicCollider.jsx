import { useState, useEffect, useRef } from 'react';
import chaosRandomizer from '../core/ChaosRandomizer';
import './mutations.css';

const LogicCollider = ({ assets, assetLibrary, phase, intensity }) => {
  const [questElements, setQuestElements] = useState([]);
  const [hungerMeter, setHungerMeter] = useState(100);
  const [questObjectives, setQuestObjectives] = useState([]);
  const [berlinEnvironment, setBerlinEnvironment] = useState(null);
  const [backgroundVideos, setBackgroundVideos] = useState([]);
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  
  // Döner-related assets from Neo-Neukölln
  const doenerAssets = [
    '/assets/neo-neukoelln/images/doener_kebap.webp',
    '/assets/neo-neukoelln/images/doener_dealer.png',
    '/assets/neo-neukoelln/images/doenerbude.webp',
    '/assets/neo-neukoelln/images/currywurst.webp',
    '/assets/neo-neukoelln/images/mutumbo.png',
    '/assets/neo-neukoelln/images/spaeti.webp',
    '/assets/neo-neukoelln/images/street_artist.png'
  ];
  
  const berlinBackgrounds = [
    '/assets/neo-neukoelln/images/sidewalk.webp',
    '/assets/neo-neukoelln/images/ubahn1.webp',
    '/assets/neo-neukoelln/images/brandenburg_gate.webp',
    '/assets/neo-neukoelln/images/shisha_lounge.webp'
  ];
  
  useEffect(() => {
    // Get random videos for dynamic backgrounds
    const videos = chaosRandomizer.getRandomAssets('videos', 3);
    setBackgroundVideos(videos);
    
    // Randomly select Berlin background OR use video
    if (Math.random() > 0.3) {
      // Use random video as background
      setBerlinEnvironment(null);
    } else {
      // Use Berlin static background
      const bgIndex = Math.floor(Math.random() * berlinBackgrounds.length);
      setBerlinEnvironment(berlinBackgrounds[bgIndex]);
    }
    
    // Generate quest elements with MIXED assets
    const elements = [];
    const count = Math.floor(intensity * 12) + 8;
    
    // Get random images from chaos randomizer for variety
    const randomAssets = chaosRandomizer.getRandomAssets('images', count);
    
    for (let i = 0; i < count; i++) {
      // Mix döner assets with random chaos
      const useRandom = Math.random() > 0.4;
      const asset = useRandom && randomAssets[i] ? 
        randomAssets[i].url : 
        doenerAssets[Math.floor(Math.random() * doenerAssets.length)];
      
      elements.push({
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 60 + 40,
        asset: asset,
        type: getQuestType(Math.floor(Math.random() * 5)),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        hunger: Math.random() * 50 + 25,
        collected: false
      });
    }
    
    setQuestElements(elements);
    
    // Generate quest objectives
    const objectives = [
      'FIND THE LEGENDARY DÖNER 🥙',
      'AVOID THE GENTRIFICATION MONSTER 👹',
      'COLLECT STREET ART FRAGMENTS 🎨',
      'NAVIGATE THE U-BAHN MAZE 🚇',
      'SATISFY THE HUNGER 🍖'
    ];
    
    setQuestObjectives(objectives.slice(0, Math.floor(intensity * 3) + 2));
  }, [intensity, phase]);
  
  // Animation loop for quest elements
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setQuestElements(prev => prev.map(element => {
        let newX = element.x + element.vx * intensity;
        let newY = element.y + element.vy * intensity;
        let newVx = element.vx;
        let newVy = element.vy;
        
        // Bounce off edges
        if (newX < 5 || newX > 95) {
          newVx = -element.vx;
          newX = Math.max(5, Math.min(95, newX));
        }
        if (newY < 5 || newY > 95) {
          newVy = -element.vy;
          newY = Math.max(5, Math.min(95, newY));
        }
        
        return {
          ...element,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: element.rotation + element.rotationSpeed,
          hunger: Math.max(0, element.hunger - (phase === 'chaos' ? 2 : 0.5))
        };
      }));
      
      // Update global hunger meter
      setHungerMeter(prev => {
        const newHunger = prev - (phase === 'chaos' ? 3 : 1);
        return Math.max(0, Math.min(100, newHunger));
      });
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [phase, intensity]);
  
  const getQuestType = (assetIndex) => {
    const types = ['food', 'character', 'environment', 'item', 'quest', 'danger', 'art'];
    return types[assetIndex % types.length];
  };
  
  // Play background videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.play().catch(() => {});
      }
    });
  }, [backgroundVideos]);

  return (
    <div 
      className="mutation-logic-collider"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic video backgrounds */}
      {!berlinEnvironment && backgroundVideos.length > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          {backgroundVideos.map((video, i) => (
            <video
              key={`bg-video-${i}`}
              ref={el => videoRefs.current[`bg-${i}`] = el}
              src={video.url}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                left: `${(i % 2) * 50}%`,
                top: `${Math.floor(i / 2) * 50}%`,
                width: '60%',
                height: '60%',
                objectFit: 'cover',
                opacity: 0.3,
                filter: `brightness(${0.5 + intensity * 0.3}) hue-rotate(${i * 90}deg)`,
                mixBlendMode: 'screen'
              }}
              onLoadedMetadata={(e) => {
                e.target.playbackRate = 0.5 + Math.random();
              }}
            />
          ))}
        </div>
      )}
      
      {/* Static background as fallback */}
      {berlinEnvironment && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${berlinEnvironment})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${0.5 + intensity * 0.3})`,
          zIndex: 0
        }} />
      )}
      
      {/* Berlin street overlay */}
      <div className="berlin-overlay" style={{
        background: `linear-gradient(45deg, 
          rgba(0,0,0,${0.7 - intensity * 0.3}), 
          rgba(139, 69, 19, ${0.3 + intensity * 0.2}), 
          rgba(255, 165, 0, ${0.2 + intensity * 0.3}))`,
        position: 'absolute',
        inset: 0,
        zIndex: 1
      }} />
      
      {/* Quest elements with real döner assets */}
      <div className="quest-field" style={{ position: 'relative', zIndex: 2 }}>
        {questElements.map(element => (
          <div
            key={element.id}
            className={`quest-element type-${element.type}`}
            style={{
              position: 'absolute',
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              transform: `rotate(${element.rotation}deg)`,
              opacity: element.collected ? 0.3 : (0.8 + intensity * 0.2),
              filter: phase === 'chaos' ? 
                `sepia(${intensity * 100}%) saturate(200%) hue-rotate(${element.rotation}deg)` : 
                'none',
              transition: 'all 0.3s ease'
            }}
          >
            <img 
              src={element.asset} 
              alt="quest item"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: `brightness(${1 + intensity * 0.5}) contrast(${1 + intensity * 0.3})`,
                boxShadow: element.type === 'food' ? 
                  `0 0 ${intensity * 20}px rgba(255, 165, 0, 0.6)` : 
                  `0 0 ${intensity * 15}px rgba(255, 255, 255, 0.4)`
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
            
            {/* Hunger indicator for food items */}
            {element.type === 'food' && (
              <div className="hunger-indicator" style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '4px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '2px'
              }}>
                <div style={{
                  width: `${element.hunger}%`,
                  height: '100%',
                  background: element.hunger > 50 ? '#4CAF50' : element.hunger > 25 ? '#FF9800' : '#F44336',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Quest UI */}
      <div className="quest-ui" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 3,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        border: '2px solid #FF6B35',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px', color: '#FF6B35' }}>
          🥙 DÖNER QUEST 3D
        </div>
        
        {/* Hunger meter */}
        <div style={{ marginBottom: '15px' }}>
          <div>HUNGER: {hungerMeter.toFixed(0)}%</div>
          <div style={{
            width: '150px',
            height: '8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
            marginTop: '5px'
          }}>
            <div style={{
              width: `${hungerMeter}%`,
              height: '100%',
              background: hungerMeter > 60 ? '#4CAF50' : hungerMeter > 30 ? '#FF9800' : '#F44336',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>
        
        {/* Quest objectives */}
        <div>
          <div style={{ marginBottom: '8px', color: '#FFD700' }}>OBJECTIVES:</div>
          {questObjectives.map((objective, i) => (
            <div key={i} style={{
              fontSize: '12px',
              marginBottom: '4px',
              opacity: 0.7 + (intensity * 0.3)
            }}>
              • {objective}
            </div>
          ))}
        </div>
      </div>
      
      {/* Phase-specific effects */}
      {phase === 'chaos' && (
        <>
          <div className="chaos-text" style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            color: '#FF0000',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,0,0,0.8)',
            animation: 'pulse 0.5s infinite'
          }}>
            HUNGER OVERLOAD! DÖNER MADNESS!
          </div>
          
          {/* Chaos particles */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '4px',
              height: '4px',
              background: '#FF6B35',
              borderRadius: '50%',
              animation: `float ${1 + Math.random()}s infinite`,
              zIndex: 2
            }} />
          ))}
        </>
      )}
      
      {hungerMeter < 20 && (
        <div className="low-hunger-warning" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 4,
          color: '#FF0000',
          fontSize: '36px',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(255,0,0,1)',
          animation: 'pulse 0.3s infinite'
        }}>
          ⚠️ CRITICAL HUNGER ⚠️
        </div>
      )}
    </div>
  );
};

export default LogicCollider;