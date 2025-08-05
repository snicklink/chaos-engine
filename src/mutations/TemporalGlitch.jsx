import { useState, useEffect, useRef } from 'react';
import BackgroundGenerator from '../core/BackgroundGenerator';
import MotionSystem from '../core/MotionSystem';
import FontLoader from '../core/FontLoader';
import './mutations.css';

const TemporalGlitch = ({ assets, assetLibrary, phase, intensity }) => {
  const [willyVariants, setWillyVariants] = useState([]);
  const [dimensionalPortals, setDimensionalPortals] = useState([]);
  const [collisionEffects, setCollisionEffects] = useState([]);
  const [timeDistortions, setTimeDistortions] = useState([]);
  const [multiverseStability, setMultiverseStability] = useState(100);
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [realityFragments, setRealityFragments] = useState([]);
  const [dimensionalRifts, setDimensionalRifts] = useState([]);
  const containerRef = useRef(null);
  const backgroundGenerator = useRef(new BackgroundGenerator());
  const motionSystem = useRef(new MotionSystem());
  const fontLoader = useRef(new FontLoader());
  
  // Enhanced Willy variants with more sources
  const willyAssets = [
    { 
      asset: '/assets/vibegame-site/images/simwilly.jpg', 
      project: 'VIBEGAME', 
      dimension: 'Gaming Reality',
      personality: 'Pixel Pioneer',
      behavior: 'explorer'
    },
    { 
      asset: '/assets/rosebud/audio/Die Willy Theme.mp3',
      project: 'ROSEBUD', 
      dimension: 'Music Dimension',
      personality: 'Sonic Wanderer',
      behavior: 'oscillator'
    },
    { 
      asset: '/assets/rosebud/audio/Willy im Hyperflow.mp3',
      project: 'ROSEBUD-FLOW', 
      dimension: 'Hyperflow State',
      personality: 'Flow Master',
      behavior: 'floater'
    },
    { 
      asset: '/assets/blobtv/images/SimWilly_sm.png',
      project: 'BLOBTV', 
      dimension: 'Stream Reality',
      personality: 'Digital Host',
      behavior: 'broadcaster'
    },
    {
      asset: '/assets/miami-voice/images/mc_willy.png',
      project: 'MIAMI VOICE',
      dimension: 'Miami Underground',
      personality: 'Voice Commander',
      behavior: 'jumper'
    },
    {
      asset: '/assets/neo-neukoelln/images/mutumbo.png',
      project: 'NEO NEUKOELLN',
      dimension: 'Berlin Streets',
      personality: 'Street Sage',
      behavior: 'walker'
    }
  ];
  
  // Enhanced dimension environments
  const dimensionEnvironments = [
    { path: '/assets/vibegame-site/images/simwilly.jpg', type: 'gaming' },
    { path: '/assets/neo-neukoelln/images/sidewalk.webp', type: 'street' },
    { path: '/assets/miami-voice/images/skyline.png', type: 'miami' },
    { path: '/assets/blobtv/images/offline.jpg', type: 'stream' },
    { path: '/assets/rosebud/images/background.jpg', type: 'music' },
    { path: '/assets/vibetales/images/space.png', type: 'cosmic' }
  ];
  
  // Movement behaviors for different Willy types
  const movementBehaviors = {
    explorer: (willy, time) => ({
      vx: Math.sin(time * 0.5 + willy.phase) * 2,
      vy: Math.cos(time * 0.5 + willy.phase) * 2
    }),
    oscillator: (willy, time) => ({
      vx: Math.sin(time * 2) * 3,
      vy: Math.sin(time * 3) * 2
    }),
    floater: (willy, time) => ({
      vx: willy.vx * 0.99 + (Math.random() - 0.5) * 0.5,
      vy: willy.vy * 0.99 + (Math.random() - 0.5) * 0.5
    }),
    broadcaster: (willy, time) => ({
      vx: Math.cos(time) * 1.5,
      vy: Math.sin(time * 2) * 1.5
    }),
    jumper: (willy, time) => ({
      vx: willy.vx,
      vy: willy.grounded ? -5 : willy.vy + 0.3
    }),
    walker: (willy, time) => ({
      vx: Math.sign(Math.sin(time * 0.5)) * 2,
      vy: willy.vy
    })
  };
  
  // Initialize dynamic background
  useEffect(() => {
    const bgStyle = backgroundGenerator.current.generateBackground(phase, intensity * 0.7, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: `${bgStyle.filter || ''} hue-rotate(${phase === 'chaos' ? '180deg' : '270deg'})`
    });
  }, [phase, intensity, assetLibrary]);
  
  useEffect(() => {
    // Create enhanced Willy variants
    const variants = [];
    const variantCount = Math.floor(intensity * 12) + 6;
    
    for (let i = 0; i < variantCount; i++) {
      const willyData = willyAssets[i % willyAssets.length];
      variants.push({
        id: `willy-${i}-${Date.now()}`,
        ...willyData,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: 50 + (Math.random() * 60),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        timeline: Math.random() * 10,
        stability: Math.random() * 100,
        colliding: false,
        glitchIntensity: 0,
        phase: Math.random() * Math.PI * 2,
        grounded: false,
        colorShift: Math.random() * 360,
        scale: 1,
        mergeCount: 0
      });
    }
    setWillyVariants(variants);
    
    // Create enhanced dimensional portals
    const portals = [];
    const portalCount = Math.floor(intensity * 6) + 4;
    
    for (let i = 0; i < portalCount; i++) {
      const env = dimensionEnvironments[i % dimensionEnvironments.length];
      portals.push({
        id: `portal-${i}-${Date.now()}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: 60 + (Math.random() * 80),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        dimension: env.path,
        dimensionType: env.type,
        energy: Math.random() * 100,
        pulsing: Math.random() > 0.5,
        stability: 100,
        warpStrength: Math.random() * 0.5 + 0.5
      });
    }
    setDimensionalPortals(portals);
    
    // Create reality fragments
    const fragments = [];
    for (let i = 0; i < intensity * 20; i++) {
      fragments.push({
        id: `fragment-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 5 + Math.random() * 15,
        speed: 0.5 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
    setRealityFragments(fragments);
  }, [intensity, phase]);
  
  // Safe animation loop - simplified to prevent crashes
  useEffect(() => {
    let animationId;
    let lastUpdate = Date.now();
    
    const animate = () => {
      const now = Date.now();
      if (now - lastUpdate < 100) { // Update max 10fps to prevent overload
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastUpdate = now;
      
      // Only update positions using CSS transforms instead of state
      const willyElements = document.querySelectorAll('.willy-variant');
      willyElements.forEach((element, index) => {
        const time = now / 1000;
        const x = 50 + Math.sin(time + index) * 20;
        const y = 50 + Math.cos(time + index * 0.7) * 15;
        element.style.transform = `translate(${x}%, ${y}%) scale(${0.8 + Math.sin(time * 2 + index) * 0.2})`;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Original animation - COMMENTED OUT
  /*useEffect(() => {
    let animationId;
    
    const animate = () => {
      const time = Date.now() / 1000;
      
      // Update Willy variants with behaviors
      setWillyVariants(prev => prev.map(willy => {
        // Apply movement behavior
        const behavior = movementBehaviors[willy.behavior];
        const behaviorVelocity = behavior ? behavior(willy, time) : { vx: willy.vx, vy: willy.vy };
        
        let newX = willy.x + behaviorVelocity.vx * intensity;
        let newY = willy.y + behaviorVelocity.vy * intensity;
        let newVx = behaviorVelocity.vx;
        let newVy = behaviorVelocity.vy;
        
        // Portal influence
        let portalPull = { x: 0, y: 0 };
        dimensionalPortals.forEach(portal => {
          const dx = portal.x - willy.x;
          const dy = portal.y - willy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 30) {
            const force = portal.warpStrength * (1 - distance / 30);
            portalPull.x += (dx / distance) * force;
            portalPull.y += (dy / distance) * force;
            
            // Dimensional shift effect
            if (distance < 10 && Math.random() < 0.01) {
              const newWillyData = willyAssets[Math.floor(Math.random() * willyAssets.length)];
              Object.assign(willy, newWillyData);
              willy.glitchIntensity = 100;
            }
          }
        });
        
        newVx += portalPull.x;
        newVy += portalPull.y;
        
        // Ground detection for jumpers
        if (willy.behavior === 'jumper') {
          willy.grounded = newY >= 85;
          if (willy.grounded) newY = 85;
        }
        
        // Bounce off edges with elasticity
        if (newX < 5 || newX > 95) {
          newVx = -newVx * 0.8;
          newX = Math.max(5, Math.min(95, newX));
        }
        if (newY < 5 || newY > 95) {
          newVy = -newVy * 0.8;
          newY = Math.max(5, Math.min(95, newY));
        }
        
        // Enhanced collision detection
        let colliding = false;
        let glitchIntensity = willy.glitchIntensity;
        
        prev.forEach(other => {
          if (other.id !== willy.id) {
            const dx = newX - other.x;
            const dy = newY - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (willy.size + other.size) / 8;
            
            if (distance < minDistance) {
              colliding = true;
              glitchIntensity = Math.min(100, glitchIntensity + 20);
              
              // Elastic collision
              const angle = Math.atan2(dy, dx);
              const force = (minDistance - distance) * 0.5;
              newVx += Math.cos(angle) * force;
              newVy += Math.sin(angle) * force;
              
              // Reality merge chance
              if (Math.random() < 0.05 && willy.mergeCount < 3) {
                willy.mergeCount++;
                willy.scale *= 1.1;
                willy.stability = Math.max(0, willy.stability - 20);
              }
              
              // Create enhanced collision effect
              if (Math.random() < 0.4) {
                setCollisionEffects(prevEffects => [...prevEffects, {
                  id: Date.now() + Math.random(),
                  x: (newX + other.x) / 2,
                  y: (newY + other.y) / 2,
                  intensity: Math.random() * 50 + 50,
                  lifetime: 30,
                  type: 'merge',
                  color1: willy.colorShift,
                  color2: other.colorShift
                }]);
              }
              
              // Create dimensional rift on major collision
              if (glitchIntensity > 80 && Math.random() < 0.1) {
                setDimensionalRifts(prevRifts => [...prevRifts, {
                  id: Date.now() + Math.random(),
                  x: (newX + other.x) / 2,
                  y: (newY + other.y) / 2,
                  size: 50 + Math.random() * 50,
                  lifetime: 60,
                  rotation: Math.random() * 360
                }]);
              }
            }
          }
        });
        
        return {
          ...willy,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: willy.rotation + willy.rotationSpeed * (1 + glitchIntensity / 50),
          stability: colliding ? Math.max(0, willy.stability - 2) : Math.min(100, willy.stability + 0.5),
          colliding,
          glitchIntensity: Math.max(0, glitchIntensity - 1),
          colorShift: (willy.colorShift + intensity * 3) % 360,
          scale: willy.scale + Math.sin(time * 2 + willy.phase) * 0.02
        };
      }));
      
      // Enhanced portal animation
      setDimensionalPortals(prev => prev.map(portal => ({
        ...portal,
        rotation: portal.rotation + portal.rotationSpeed * (1 + intensity),
        energy: portal.pulsing ? 
          50 + Math.sin(time * 2) * 40 + Math.random() * 10 : 
          portal.energy,
        warpStrength: 0.5 + Math.sin(time + portal.rotation) * 0.3,
        stability: Math.max(0, portal.stability - (phase === 'chaos' ? 1 : 0.1))
      })));
      
      // Update collision effects
      setCollisionEffects(prev => prev
        .map(effect => ({
          ...effect,
          lifetime: effect.lifetime - 1,
          intensity: effect.intensity * 0.93,
          rotation: (effect.rotation || 0) + 10
        }))
        .filter(effect => effect.lifetime > 0)
      );
      
      // Update dimensional rifts
      setDimensionalRifts(prev => prev
        .map(rift => ({
          ...rift,
          lifetime: rift.lifetime - 1,
          size: rift.size * 1.02,
          rotation: rift.rotation + 5
        }))
        .filter(rift => rift.lifetime > 0)
      );
      
      // Update reality fragments
      setRealityFragments(prev => prev.map(fragment => ({
        ...fragment,
        x: (fragment.x + Math.cos(fragment.angle) * fragment.speed) % 100,
        y: (fragment.y + Math.sin(fragment.angle) * fragment.speed) % 100,
        angle: fragment.angle + (Math.random() - 0.5) * 0.1,
        opacity: fragment.opacity + (Math.random() - 0.5) * 0.05
      })));
      
      // Calculate multiverse stability
      setMultiverseStability(prev => {
        const willyInstability = willyVariants.reduce((sum, willy) => 
          sum + (100 - willy.stability) + willy.glitchIntensity / 10, 0);
        const portalInstability = dimensionalPortals.reduce((sum, portal) => 
          sum + (100 - portal.stability), 0);
        const riftCount = dimensionalRifts.length * 5;
        const totalInstability = (willyInstability / 10) + (portalInstability / 20) + riftCount;
        return Math.max(0, Math.min(100, 100 - totalInstability));
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [intensity, phase]);*/
  
  // Apply motion system to elements
  useEffect(() => {
    if (willyVariants.length === 0) return;
    
    const applyMotionTimeout = setTimeout(() => {
      willyVariants.forEach((willy, index) => {
        const element = document.getElementById(willy.id);
        if (element) {
          const motions = motionSystem.current.getSuggestedMotions(phase, intensity);
          const motion = motions[index % motions.length];
          
          motionSystem.current.applyMotion(element, {
            motion: willy.behavior === 'floater' ? 'float' : motion.type,
            intensity: motion.intensity * 0.3,
            phase: phase,
            delay: index * 50
          });
        }
      });
      
      dimensionalPortals.forEach((portal, index) => {
        const element = document.getElementById(portal.id);
        if (element) {
          motionSystem.current.applyMotion(element, {
            motion: 'warp',
            intensity: portal.warpStrength,
            phase: phase,
            delay: index * 100
          });
        }
      });
    }, 100);
    
    return () => {
      clearTimeout(applyMotionTimeout);
      motionSystem.current.clear();
    };
  }, [phase, intensity]);
  
  // Get dynamic fonts
  const titleFont = fontLoader.current.getSuperLargeStyle('WILLY MULTIVERSE');
  const uiFont = fontLoader.current.getRandomStyle(phase, intensity * 0.5);
  
  return (
    <div 
      className="mutation-temporal-glitch"
      ref={containerRef}
      style={{
        ...backgroundStyle,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Reality fragments background layer */}
      {realityFragments.map(fragment => (
        <div
          key={fragment.id}
          style={{
            position: 'absolute',
            left: `${fragment.x}%`,
            top: `${fragment.y}%`,
            width: `${fragment.size}px`,
            height: `${fragment.size}px`,
            background: `radial-gradient(circle, 
              rgba(255, 255, 255, ${fragment.opacity}), 
              transparent)`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      ))}
      
      {/* Enhanced dimensional portals */}
      {dimensionalPortals.map(portal => (
        <div
          key={portal.id}
          id={portal.id}
          className="dimensional-portal"
          style={{
            position: 'absolute',
            left: `${portal.x}%`,
            top: `${portal.y}%`,
            width: `${portal.size}px`,
            height: `${portal.size}px`,
            transform: `translate(-50%, -50%) rotate(${portal.rotation}deg)`,
            zIndex: 1
          }}
        >
          {/* Multi-layered portal effect */}
          {[1, 0.7, 0.4].map((scale, i) => (
            <div key={i} style={{
              position: 'absolute',
              inset: `${(1 - scale) * 50}%`,
              border: `${3 - i}px solid rgba(138, 43, 226, ${portal.energy / 100 * scale})`,
              borderRadius: '50%',
              boxShadow: `
                inset 0 0 ${portal.energy * scale}px rgba(138, 43, 226, 0.6),
                0 0 ${portal.energy * scale * 0.5}px rgba(138, 43, 226, 0.4)
              `,
              animation: `portal-pulse ${2 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }} />
          ))}
          
          {/* Portal interior */}
          <div style={{
            position: 'absolute',
            inset: '20%',
            borderRadius: '50%',
            backgroundImage: `url(${portal.dimension})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
            filter: `blur(${2 - portal.stability / 50}px) hue-rotate(${portal.rotation}deg)`,
            transform: `scale(${1 + Math.sin(Date.now() * 0.001) * 0.1})`
          }} />
          
          {/* Portal energy field */}
          <div style={{
            position: 'absolute',
            inset: '-20%',
            background: `conic-gradient(from ${portal.rotation * 2}deg,
              transparent, 
              rgba(138, 43, 226, ${portal.energy / 200}),
              transparent,
              rgba(255, 0, 255, ${portal.energy / 200}),
              transparent)`,
            borderRadius: '50%',
            animation: 'spin 10s linear infinite',
            mixBlendMode: 'screen'
          }} />
        </div>
      ))}
      
      {/* Enhanced Willy variants */}
      {willyVariants.map(willy => (
        <div
          key={willy.id}
          id={willy.id}
          className="willy-variant"
          style={{
            position: 'absolute',
            left: `${willy.x}%`,
            top: `${willy.y}%`,
            width: `${willy.size * willy.scale}px`,
            height: `${willy.size * willy.scale}px`,
            transform: `translate(-50%, -50%) rotate(${willy.rotation}deg)`,
            zIndex: 3
          }}
        >
          {/* Multi-layered Willy effect */}
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            filter: `hue-rotate(${willy.colorShift}deg) 
                    saturate(${1 + willy.glitchIntensity / 50})
                    brightness(${1 + willy.stability / 200})`
          }}>
            {/* Outer glow ring */}
            <div style={{
              position: 'absolute',
              inset: '-10%',
              border: `3px solid rgba(255, 255, 255, ${willy.stability / 100 * 0.5})`,
              borderRadius: '50%',
              boxShadow: willy.colliding ? 
                `0 0 ${willy.glitchIntensity}px #ff0000,
                 inset 0 0 ${willy.glitchIntensity / 2}px #ff00ff` : 
                `0 0 20px rgba(255, 255, 255, 0.4),
                 inset 0 0 10px rgba(138, 43, 226, 0.3)`,
              animation: willy.colliding ? 'collision-pulse 0.3s ease-out' : 'none'
            }} />
            
            {/* Willy content */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              background: willy.asset.includes('.mp3') ? 
                `linear-gradient(${willy.rotation}deg, 
                  rgba(255, 105, 180, 0.8), 
                  rgba(138, 43, 226, 0.8))` : 
                'none'
            }}>
              {willy.asset.includes('.mp3') ? (
                // Enhanced audio visualization
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${willy.size / 3}px`,
                  position: 'relative'
                }}>
                  🎵
                  {/* Waveform rings */}
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      position: 'absolute',
                      inset: `${i * 20}%`,
                      border: `2px solid rgba(255, 255, 255, ${0.6 - i * 0.15})`,
                      borderRadius: '50%',
                      animation: `pulse ${1 + i * 0.5}s infinite`,
                      animationDelay: `${i * 0.2}s`
                    }} />
                  ))}
                </div>
              ) : (
                <img 
                  src={willy.asset}
                  alt={willy.personality}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: `brightness(${1 + intensity * 0.3}) 
                            contrast(${1 + intensity * 0.2})
                            ${willy.glitchIntensity > 50 ? 'invert(1)' : ''}`
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div style="
                        width: 100%; 
                        height: 100%; 
                        background: conic-gradient(from ${willy.rotation}deg, #ff6b6b, #4ecdc4, #ff6b6b);
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: ${willy.size / 2}px; 
                        color: white;
                        font-weight: bold;
                      ">W</div>`;
                  }}
                />
              )}
            </div>
            
            {/* Stability meter */}
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '6px',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{
                width: `${willy.stability}%`,
                height: '100%',
                background: `linear-gradient(90deg, 
                  ${willy.stability > 70 ? '#4CAF50' : 
                    willy.stability > 30 ? '#FF9800' : '#F44336'},
                  ${willy.stability > 70 ? '#8BC34A' : 
                    willy.stability > 30 ? '#FFC107' : '#FF5722'})`,
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 5px ${willy.stability > 70 ? '#4CAF50' : 
                           willy.stability > 30 ? '#FF9800' : '#F44336'}`
              }} />
            </div>
          </div>
          
          {/* Enhanced character info */}
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(135deg, 
              rgba(0,0,0,0.9), 
              rgba(138,43,226,0.3))`,
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(138,43,226,0.5)',
            color: '#fff',
            fontSize: '11px',
            fontFamily: 'monospace',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: willy.colliding ? 1 : 0.8,
            boxShadow: '0 2px 10px rgba(138,43,226,0.5)'
          }}>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>{willy.dimension}</div>
            <div style={{ fontWeight: 'bold' }}>{willy.personality}</div>
          </div>
        </div>
      ))}
      
      {/* Enhanced collision effects */}
      {collisionEffects.map(effect => (
        <div
          key={effect.id}
          className="collision-effect"
          style={{
            position: 'absolute',
            left: `${effect.x}%`,
            top: `${effect.y}%`,
            width: `${effect.intensity}px`,
            height: `${effect.intensity}px`,
            transform: `translate(-50%, -50%) rotate(${effect.rotation || 0}deg)`,
            zIndex: 4,
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: `conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.9), 
              rgba(${effect.color1 || 255}, 0, ${effect.color2 || 0}, 0.7),
              rgba(138, 43, 226, 0.5),
              rgba(255, 255, 255, 0.9)
            )`,
            borderRadius: '50%',
            animation: 'collision-burst 0.5s ease-out'
          }} />
        </div>
      ))}
      
      {/* Dimensional rifts */}
      {dimensionalRifts.map(rift => (
        <div
          key={rift.id}
          style={{
            position: 'absolute',
            left: `${rift.x}%`,
            top: `${rift.y}%`,
            width: `${rift.size}px`,
            height: `${rift.size}px`,
            transform: `translate(-50%, -50%) rotate(${rift.rotation}deg)`,
            zIndex: 5
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'conic-gradient(from 0deg, transparent, #ff00ff, transparent, #00ffff, transparent)',
            opacity: rift.lifetime / 60,
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }} />
          <div style={{
            position: 'absolute',
            inset: '20%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
            borderRadius: '50%'
          }} />
        </div>
      ))}
      
      {/* Enhanced multiverse UI */}
      <div className="multiverse-ui" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(138,43,226,0.2))',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid #9966ff',
        color: '#fff',
        ...uiFont,
        fontSize: '14px',
        zIndex: 5,
        boxShadow: '0 5px 20px rgba(138,43,226,0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ ...titleFont, fontSize: '20px', marginBottom: '15px', color: '#9966ff' }}>
          🌌 WILLY MULTIVERSE
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <div style={{ opacity: 0.7, fontSize: '12px' }}>VARIANTS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{willyVariants.length}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '12px' }}>PORTALS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{dimensionalPortals.length}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '12px' }}>COLLISIONS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {willyVariants.filter(w => w.colliding).length}
            </div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '12px' }}>RIFTS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff00ff' }}>
              {dimensionalRifts.length}
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>
            MULTIVERSE STABILITY
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '5px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{
              width: `${multiverseStability}%`,
              height: '100%',
              background: `linear-gradient(90deg, 
                ${multiverseStability > 60 ? '#4CAF50' : 
                  multiverseStability > 30 ? '#FF9800' : '#F44336'},
                ${multiverseStability > 60 ? '#8BC34A' : 
                  multiverseStability > 30 ? '#FFC107' : '#FF5722'})`,
              transition: 'all 0.3s ease',
              boxShadow: `inset 0 0 10px rgba(255,255,255,0.3)`
            }} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>
            {multiverseStability.toFixed(0)}%
          </div>
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.8, fontStyle: 'italic' }}>
          {multiverseStability < 30 ? '⚠️ REALITY COLLAPSE IMMINENT!' :
           multiverseStability < 60 ? '⚡ Dimensional instability detected' :
           '✨ Multiverse stable'}
        </div>
      </div>
      
      {/* Phase-specific effects */}
      {phase === 'chaos' && (
        <>
          <div className="chaos-message" style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#FF0000',
            ...titleFont,
            fontSize: '36px',
            textShadow: `0 0 20px rgba(255,0,0,0.8),
                        0 0 40px rgba(255,0,0,0.5),
                        0 0 60px rgba(255,0,0,0.3)`,
            animation: 'emergency-flash 0.5s infinite',
            zIndex: 5
          }}>
            MULTIVERSE COLLAPSE!
          </div>
          
          {/* Enhanced chaos static */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100}px`,
              height: '2px',
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255,255,255,${Math.random()}), 
                transparent)`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `glitch-line ${0.1 + Math.random() * 0.3}s infinite`,
              zIndex: 2
            }} />
          ))}
        </>
      )}
      
      {multiverseStability < 10 && (
        <div className="reality-breach" style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, 
            transparent 30%, 
            rgba(255,0,0,0.2) 50%, 
            rgba(255,0,0,0.8) 100%)`,
          animation: 'breach-pulse 0.3s infinite',
          zIndex: 6,
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            ...titleFont,
            fontSize: '48px',
            color: '#FF0000',
            textShadow: '0 0 30px rgba(255,0,0,1)',
            animation: 'emergency-flash 0.2s infinite'
          }}>
            ⚠️ REALITY BREACH ⚠️
          </div>
        </div>
      )}
      
      {/* Add missing animations */}
      <style>{`
        @keyframes portal-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes collision-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes collision-burst {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2) rotate(180deg); opacity: 0; }
        }
        
        @keyframes emergency-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes breach-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes glitch-line {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes multiverse-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TemporalGlitch;