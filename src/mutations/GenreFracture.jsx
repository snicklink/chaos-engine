import { useState, useEffect, useRef } from 'react';
import './mutations.css';

const GenreFracture = ({ assets, assetLibrary, phase, intensity }) => {
  const [deliveryTrucks, setDeliveryTrucks] = useState([]);
  const [packages, setPackages] = useState([]);
  const [scanningBeams, setScanningBeams] = useState([]);
  const [ikigaiQuestions, setIkigaiQuestions] = useState([]);
  const [deliveryRoute, setDeliveryRoute] = useState([]);
  const [scanningProgress, setScanningProgress] = useState(0);
  const containerRef = useRef(null);
  
  // Package and logistics assets
  const packageAssets = [
    '/assets/derpaket/images/DerPaket_logo.png',
    '/assets/derpaket/images/snicklink-logo.png',
    '/assets/ikigaii/images/logo.png',
    '/assets/blobtv/images/blobtv_logo.png',
    '/assets/miami-voice/images/logo.png',
    '/assets/neo-neukoelln/images/gamelogo.png'
  ];
  
  const philosophicalTexts = [
    "What do you love?",
    "What are you good at?", 
    "What does the world need?",
    "What can you be paid for?",
    "Find your REASON FOR BEING",
    "Package your PURPOSE",
    "Deliver your DREAMS",
    "Scan your SOUL"
  ];
  
  useEffect(() => {
    // Create delivery trucks
    const trucks = [];
    const truckCount = Math.floor(intensity * 4) + 2;
    
    for (let i = 0; i < truckCount; i++) {
      trucks.push({
        id: i,
        x: -10 - (Math.random() * 20),
        y: 20 + (Math.random() * 60),
        speed: 0.5 + (Math.random() * 1.5),
        route: Math.floor(Math.random() * 3),
        carrying: packageAssets[Math.floor(Math.random() * packageAssets.length)],
        deliveryProgress: 0,
        size: 40 + (Math.random() * 30)
      });
    }
    setDeliveryTrucks(trucks);
    
    // Create packages being delivered
    const packageItems = [];
    const packageCount = Math.floor(intensity * 8) + 6;
    
    for (let i = 0; i < packageCount; i++) {
      packageItems.push({
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        asset: packageAssets[Math.floor(Math.random() * packageAssets.length)],
        scanned: false,
        delivered: false,
        purpose: philosophicalTexts[Math.floor(Math.random() * philosophicalTexts.length)],
        size: 30 + (Math.random() * 40),
        rotation: Math.random() * 360,
        pulsating: Math.random() > 0.5
      });
    }
    setPackages(packageItems);
    
    // Create scanning beams
    const beams = [];
    const beamCount = Math.floor(intensity * 6) + 3;
    
    for (let i = 0; i < beamCount; i++) {
      beams.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: 2 + (Math.random() * 4),
        height: 60 + (Math.random() * 40),
        angle: Math.random() * 360,
        scanning: true,
        speed: 1 + (Math.random() * 2),
        color: ['#00ff00', '#ff6b6b', '#4fc3f7', '#ff9800'][Math.floor(Math.random() * 4)]
      });
    }
    setScanningBeams(beams);
    
    // Set ikigai questions
    const selectedQuestions = philosophicalTexts.slice(0, Math.floor(intensity * 4) + 3);
    setIkigaiQuestions(selectedQuestions);
  }, [intensity, phase]);
  
  // Animation loop for trucks, beams, and packages
  useEffect(() => {
    const animationInterval = setInterval(() => {
      // Move delivery trucks
      setDeliveryTrucks(prev => prev.map(truck => {
        let newX = truck.x + truck.speed * intensity;
        
        // Reset truck when it goes off screen
        if (newX > 110) {
          newX = -10 - (Math.random() * 20);
        }
        
        return {
          ...truck,
          x: newX,
          deliveryProgress: Math.min(100, truck.deliveryProgress + (intensity * 2))
        };
      }));
      
      // Move and rotate scanning beams
      setScanningBeams(prev => prev.map(beam => ({
        ...beam,
        x: (beam.x + beam.speed * intensity) % 100,
        angle: (beam.angle + 2) % 360
      })));
      
      // Update scanning progress
      setScanningProgress(prev => (prev + intensity * 3) % 100);
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [intensity, phase]);
  
  return (
    <div 
      className="mutation-genre-fracture"
      ref={containerRef}
      style={{
        background: `linear-gradient(135deg, 
          rgba(20, 30, 60, 0.9), 
          rgba(40, 20, 80, 0.8), 
          rgba(60, 40, 20, 0.7))`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Scanning grid background */}
      <div className="scanning-grid" style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px),
          linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: phase === 'chaos' ? 'grid-scroll 2s linear infinite' : 'none'
      }} />
      
      {/* Delivery trucks */}
      {deliveryTrucks.map(truck => (
        <div key={truck.id} style={{
          position: 'absolute',
          left: `${truck.x}%`,
          top: `${truck.y}%`,
          zIndex: 3
        }}>
          {/* Truck body */}
          <div style={{
            width: `${truck.size}px`,
            height: `${truck.size * 0.6}px`,
            background: '#ff6b6b',
            borderRadius: '4px',
            position: 'relative',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {/* Truck cargo showing package */}
            <img 
              src={truck.carrying}
              alt="cargo"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60%',
                height: '60%',
                objectFit: 'contain',
                opacity: 0.8
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
            
            {/* Progress bar */}
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: '100%',
              height: '3px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '2px'
            }}>
              <div style={{
                width: `${truck.deliveryProgress}%`,
                height: '100%',
                background: '#4CAF50',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      ))}
      
      {/* Packages being scanned */}
      {packages.map(pkg => (
        <div
          key={pkg.id}
          className="package-item"
          style={{
            position: 'absolute',
            left: `${pkg.x}%`,
            top: `${pkg.y}%`,
            width: `${pkg.size}px`,
            height: `${pkg.size}px`,
            transform: `rotate(${pkg.rotation}deg)`,
            zIndex: 2
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            border: pkg.scanned ? '2px solid #00ff00' : '2px solid #ffffff',
            borderRadius: '8px',
            position: 'relative',
            boxShadow: pkg.pulsating ? 
              `0 0 ${intensity * 20}px rgba(255,255,255,0.6)` : 
              '0 2px 4px rgba(0,0,0,0.3)',
            animation: pkg.pulsating ? 'pulse 2s infinite' : 'none'
          }}>
            <img 
              src={pkg.asset}
              alt="package"
              style={{
                width: '80%',
                height: '80%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                objectFit: 'contain',
                filter: pkg.scanned ? 'brightness(1.5) saturate(1.5)' : 'none'
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
            
            {/* Purpose text */}
            <div style={{
              position: 'absolute',
              bottom: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fff',
              fontSize: '10px',
              fontFamily: 'monospace',
              textAlign: 'center',
              width: '120px',
              opacity: pkg.scanned ? 1 : 0.5,
              textShadow: '0 0 4px rgba(0,0,0,0.8)'
            }}>
              {pkg.purpose}
            </div>
          </div>
        </div>
      ))}
      
      {/* Scanning beams */}
      {scanningBeams.map(beam => (
        <div
          key={beam.id}
          className="scanning-beam"
          style={{
            position: 'absolute',
            left: `${beam.x}%`,
            top: `${beam.y}%`,
            width: `${beam.width}px`,
            height: `${beam.height}px`,
            background: `linear-gradient(180deg, ${beam.color}, transparent)`,
            transform: `rotate(${beam.angle}deg)`,
            opacity: 0.7,
            pointerEvents: 'none',
            boxShadow: `0 0 10px ${beam.color}`,
            animation: phase === 'chaos' ? 'beam-flicker 0.3s infinite' : 'none'
          }}
        />
      ))}
      
      {/* Existential scanning UI */}
      <div className="existential-ui" style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        border: '2px solid #4fc3f7',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 4
      }}>
        <div style={{ fontSize: '16px', marginBottom: '10px', color: '#4fc3f7' }}>
          📦 EXISTENTIAL PACKAGE SCANNER
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          SCANNING: {scanningProgress.toFixed(0)}%
        </div>
        
        <div style={{
          width: '150px',
          height: '8px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: `${scanningProgress}%`,
            height: '100%',
            background: `linear-gradient(90deg, #4fc3f7, #00ff00)`,
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        <div style={{ marginBottom: '10px', color: '#FFD700' }}>
          IKIGAI QUESTIONS:
        </div>
        {ikigaiQuestions.slice(0, 3).map((question, i) => (
          <div key={i} style={{
            fontSize: '11px',
            marginBottom: '4px',
            opacity: 0.8
          }}>
            • {question}
          </div>
        ))}
      </div>
      
      {/* Delivery status */}
      <div className="delivery-status" style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        border: '2px solid #ff6b6b',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 4
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '10px' }}>
          🚚 DELIVERY STATUS
        </div>
        <div>TRUCKS: {deliveryTrucks.length}</div>
        <div>PACKAGES: {packages.length}</div>
        <div>SCANNED: {packages.filter(p => p.scanned).length}</div>
      </div>
      
      {/* Phase-specific effects */}
      {phase === 'chaos' && (
        <div className="chaos-overlay" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#FF0000',
          fontSize: '28px',
          fontWeight: 'bold',
          textShadow: '0 0 15px rgba(255,0,0,0.8)',
          animation: 'pulse 0.5s infinite',
          zIndex: 5
        }}>
          PURPOSE OVERLOAD! MEANING CHAOS!
        </div>
      )}
      
      {scanningProgress > 90 && (
        <div className="enlightenment-message" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          transform: 'translate(-50%, 50%)',
          color: '#00ff00',
          fontSize: '20px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0,255,0,0.8)',
          animation: 'glow 1s infinite',
          zIndex: 5
        }}>
          ✨ IKIGAI ACHIEVED ✨
        </div>
      )}
    </div>
  );
};

export default GenreFracture;