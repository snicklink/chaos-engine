import { useState, useEffect } from 'react';
import './mutations.css';

const TemporalGlitch = ({ assets, phase, intensity }) => {
  const [timeLayers, setTimeLayers] = useState([]);
  const [glitchFrame, setGlitchFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchFrame(prev => (prev + 1) % 100);
      
      // Create temporal layers
      const layers = [];
      const layerCount = Math.floor(intensity * 5) + 2;
      
      for (let i = 0; i < layerCount; i++) {
        layers.push({
          id: i,
          offset: Math.random() * 20 - 10,
          opacity: 1 - (i * 0.2),
          scale: 1 + (i * 0.1),
          rotation: Math.random() * 10 - 5,
          content: getTemporalContent(i, phase)
        });
      }
      
      setTimeLayers(layers);
    }, 100 - (intensity * 90));
    
    return () => clearInterval(interval);
  }, [phase, intensity]);
  
  const getTemporalContent = (index, currentPhase) => {
    const contents = [
      'PAST: Loading sitcom data...',
      'PRESENT: Combat mode active',
      'FUTURE: System collapse imminent',
      'TIMELINE: Corrupted',
      'WILLY: Everywhere and nowhere'
    ];
    
    return contents[index % contents.length];
  };
  
  return (
    <div className="mutation-temporal-glitch">
      <div className="temporal-container">
        {timeLayers.map((layer, index) => (
          <div
            key={layer.id}
            className="temporal-layer"
            style={{
              transform: `
                translateX(${layer.offset}px) 
                translateY(${layer.offset}px)
                scale(${layer.scale})
                rotate(${layer.rotation}deg)
              `,
              opacity: layer.opacity * (0.5 + intensity * 0.5),
              zIndex: timeLayers.length - index,
              filter: `hue-rotate(${glitchFrame * 3}deg)`
            }}
          >
            <div className="temporal-content">
              {layer.content}
            </div>
          </div>
        ))}
      </div>
      
      {phase === 'chaos' && (
        <div className="temporal-static">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="static-line"
              style={{
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemporalGlitch;