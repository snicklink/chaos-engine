import { useState, useEffect, useRef } from 'react';
import './mutations.css';

const AssetParasite = ({ assets, assetLibrary, phase, intensity, config }) => {
  const [parasites, setParasites] = useState([]);
  const [hostEnvironment, setHostEnvironment] = useState('default');
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Initialize parasitic assets based on phase
    const updateParasites = () => {
      const parasiteCount = Math.floor(intensity * 10) + 1;
      const newParasites = [];
      
      for (let i = 0; i < parasiteCount; i++) {
        const parasite = createParasite(i);
        newParasites.push(parasite);
      }
      
      setParasites(newParasites);
    };
    
    updateParasites();
    
    // Add animation frame for floating effect
    let animationFrame;
    const animate = () => {
      if (containerRef.current) {
        const time = Date.now() * 0.001;
        const parasiteElements = containerRef.current.querySelectorAll('.parasite');
        
        parasiteElements.forEach((el, index) => {
          const offsetY = Math.sin(time + index) * 20 * intensity;
          const offsetX = Math.cos(time * 0.7 + index) * 15 * intensity;
          el.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${time * 20}deg)`;
        });
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [phase, intensity]);
  
  const createParasite = (index) => {
    // Example: Berlin Fever Dream - döner dealer invading 3D space
    const sources = ['neoNeukoelln', 'rosebud', 'miamiVoice'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    return {
      id: `parasite-${index}-${Date.now()}`,
      source: randomSource,
      type: getRandomType(randomSource),
      position: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      },
      scale: 0.5 + (intensity * 1.5),
      opacity: 0.3 + (intensity * 0.7),
      rotation: Math.random() * 360
    };
  };
  
  const getRandomType = (source) => {
    const types = {
      neoNeukoelln: ['döner', 'hipster', 'techno', 'ubahn', 'pigeon', 'rat', 'mutumbo', 'gentrification'],
      rosebud: ['furniture', 'willy', 'radio', 'goldenlamp', 'vibrate', 'snick'],
      miamiVoice: ['neon', 'palm', 'cocktail', 'sunset', 'tico', 'heli']
    };
    
    const sourceTypes = types[source] || ['default'];
    return sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
  };
  
  const getParasiteContent = (parasite) => {
    // Use REAL assets from orphan projects!
    const assetMap = {
      // NEO_NEUKOELLN chaos
      döner: '/assets/neo-neukoelln/images/doener_kebap.webp',
      hipster: '/assets/neo-neukoelln/images/hipster.png',
      techno: '/assets/neo-neukoelln/images/techno_girl.png',
      ubahn: '/assets/neo-neukoelln/images/bvg_ticket.webp',
      pigeon: '/assets/neo-neukoelln/images/aggressive_pigeon.png',
      rat: '/assets/neo-neukoelln/images/giant_rat.png',
      mutumbo: '/assets/neo-neukoelln/images/mutumbo.png',
      gentrification: '/assets/neo-neukoelln/images/doener_dealer.png',
      
      // ROSEBUD vibes
      furniture: '/assets/rosebud/images/snicklink_logo copy.png',
      willy: '/assets/vibegame-site/images/simwilly.jpg',
      radio: '/assets/derpaket/images/DerPaket_logo.png',
      goldenlamp: '/assets/ikigaii/images/logo.png',
      vibrate: '/assets/vibetales/images/blobtv_logo.png',
      snick: '/assets/vibegame-site/images/snick_vibe_logo.png',
      
      // MIAMI VOICE aesthetics
      neon: '/assets/miami-voice/images/sun.svg',
      palm: '/assets/miami-voice/images/palm.png',
      cocktail: '/assets/miami-voice/images/cocktail.png',
      sunset: '/assets/miami-voice/images/chrome.png',
      tico: '/assets/miami-voice/images/tico.png',
      heli: '/assets/miami-voice/images/heli.png'
    };
    
    const imageSrc = assetMap[parasite.type];
    
    if (imageSrc) {
      return (
        <img 
          src={imageSrc} 
          alt={parasite.type}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: `hue-rotate(${Math.random() * 360}deg) contrast(${1 + intensity})`
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '💀'; // Fallback if image fails
          }}
        />
      );
    }
    
    return <div className="asset-default">❓</div>;
  };
  
  const getBackgroundStyle = () => {
    // Change background based on phase
    switch (phase) {
      case 'calm':
        return { 
          background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
          filter: 'contrast(0.9)'
        };
      case 'build':
        return { 
          background: 'linear-gradient(45deg, #16213e, #e94560)',
          filter: 'contrast(1.1) saturate(1.2)'
        };
      case 'chaos':
        return { 
          background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, #e94560, #0f3460, #ff6b6b)`,
          filter: 'contrast(1.5) saturate(1.5) hue-rotate(10deg)'
        };
      case 'fade':
        return { 
          background: 'linear-gradient(45deg, #0f3460, #000)',
          filter: `contrast(0.7) brightness(${1 - intensity})`
        };
      default:
        return {};
    }
  };
  
  return (
    <div 
      className="mutation-asset-parasite"
      ref={containerRef}
      style={getBackgroundStyle()}
    >
      {/* Host environment (background layer) */}
      <div className="host-environment">
        <div className="host-grid">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="grid-cell"
              style={{ 
                opacity: 0.1 + (Math.random() * 0.2),
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Parasitic assets (foreground layer) */}
      <div className="parasite-layer">
        {parasites.map((parasite) => (
          <div
            key={parasite.id}
            className={`parasite parasite-${parasite.type}`}
            style={{
              left: `${parasite.position.x}%`,
              top: `${parasite.position.y}%`,
              transform: `scale(${parasite.scale}) rotate(${parasite.rotation}deg)`,
              opacity: parasite.opacity
            }}
          >
            {getParasiteContent(parasite)}
          </div>
        ))}
      </div>
      
      {/* Glitch overlay for chaos phase */}
      {phase === 'chaos' && (
        <div className="glitch-overlay">
          <div className="glitch-line" />
          <div className="glitch-line" />
          <div className="glitch-line" />
        </div>
      )}
      
      {/* Text fragments */}
      <div className="text-fragments">
        {phase === 'build' && (
          <div className="fragment" style={{ left: '20%', top: '30%' }}>
            "WILLKOMMEN IN NEUKÖLLN"
          </div>
        )}
        {phase === 'chaos' && (
          <>
            <div className="fragment glitching" style={{ left: '60%', top: '20%' }}>
              "FIND YOUR IKIGAI"
            </div>
            <div className="fragment glitching" style={{ left: '30%', top: '70%' }}>
              "DÖNER MACHT SCHÖNER"
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetParasite;