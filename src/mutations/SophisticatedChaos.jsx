import { useState, useEffect, useRef, useCallback } from 'react';
import CreativeDirectorAI from '../core/CreativeDirectorAI';
import AssetPreloader from '../core/AssetPreloader';
import BackgroundGenerator from '../core/BackgroundGenerator';
import MotionSystem from '../core/MotionSystem';
import FontLoader from '../core/FontLoader';
import './mutations.css';

const SophisticatedChaos = ({ assetLibrary, phase, intensity }) => {
  const [currentScene, setCurrentScene] = useState(null);
  const [sceneElements, setSceneElements] = useState([]);
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [interactiveZones, setInteractiveZones] = useState([]);
  const containerRef = useRef(null);
  const creativeDirector = useRef(new CreativeDirectorAI());
  const sceneTimer = useRef(null);
  const preloader = useRef(new AssetPreloader());
  const backgroundGenerator = useRef(new BackgroundGenerator());
  const motionSystem = useRef(new MotionSystem());
  const fontLoader = useRef(new FontLoader());
  
  // Video element refs for game reconstructions
  const videoRefs = useRef({});
  
  // Mouse tracking for interactions
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Preload assets for sophisticated chaos
    if (assetLibrary) {
      if (preloader.current.isMutationCached('sophisticated-chaos')) {
        console.log('⚡ SOPHISTICATED CHAOS - INSTANT LOAD!');
      } else {
        preloader.current.preloadMutationAssets('sophisticated-chaos', assetLibrary);
      }
    }
    
    const handleMouseMove = (e) => {
      setMousePos({ 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [assetLibrary]);
  
  // Scene generation based on Creative Director decisions
  const generateScene = useCallback(() => {
    const decision = creativeDirector.current.makeCreativeDecision({ phase, intensity });
    
    switch (decision.mode) {
      case 'minimalElegance':
        createMinimalElegance(decision);
        break;
      case 'dataVisualization':
        createDataVisualization(decision);
        break;
      case 'brutalismDigital':
        createDigitalBrutalism(decision);
        break;
      case 'vaporwaveNostalgia':
        createVaporwave(decision);
        break;
      case 'gameCinematic':
        createGameCinematic(decision);
        break;
      case 'assetTsunami':
        createAssetTsunami(decision);
        break;
      case 'glitchReality':
        createGlitchReality(decision);
        break;
      case 'dreamSequence':
        createDreamSequence(decision);
        break;
      case 'museumGallery':
        createMuseumGallery(decision);
        break;
      case 'codePoetry':
        createCodePoetry(decision);
        break;
      default:
        createRandomChaos(decision);
    }
    
    setCurrentScene(decision);
    
    // Schedule next scene
    if (sceneTimer.current) clearTimeout(sceneTimer.current);
    sceneTimer.current = setTimeout(() => {
      applyTransition(decision.transition, () => generateScene());
    }, decision.duration);
  }, [phase, intensity]);
  
  // SCENE CREATORS
  
  const createMinimalElegance = (decision) => {
    const elements = [];
    const assetCount = Math.floor(Math.random() * 3) + 1;
    
    // Use BackgroundGenerator for sophisticated backgrounds
    const bgStyle = backgroundGenerator.current.generateBackground(phase, intensity * 0.3, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Carefully placed assets with perpetual motion
    for (let i = 0; i < assetCount; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        elements.push({
          id: `minimal-${Date.now()}-${i}`,
          type: 'image',
          asset: asset,
          style: {
            position: 'absolute',
            left: `${20 + i * 30}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            filter: 'grayscale(0.8) contrast(1.2)',
            opacity: 0.9,
            transition: 'all 0.5s ease-out'
          },
          animation: 'subtle-float'
        });
      }
    }
    
    // Add subtle text element with dynamic font
    const fontStyle = fontLoader.current.getRandomStyle('calm', intensity);
    elements.push({
      id: `text-${Date.now()}`,
      type: 'text',
      content: getPhilosophicalQuote(),
      style: {
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        ...fontStyle,
        color: '#333',
        opacity: 0.7
      },
      motion: { type: 'breathe', intensity: 0.3 }
    });
    
    setSceneElements(elements);
  };
  
  const createDataVisualization = (decision) => {
    const elements = [];
    
    // Use BackgroundGenerator for data viz backgrounds
    const bgStyle = backgroundGenerator.current.generateBackground('build', intensity * 0.6, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: `${bgStyle.filter || ''} saturate(0.8)`,
      mixBlendMode: 'normal'
    });
    
    // Create data nodes from assets
    const nodeCount = 20;
    const nodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 80 + 10;
        
        nodes.push({ x, y, asset, id: i });
        
        elements.push({
          id: `node-${Date.now()}-${i}`,
          type: 'data-node',
          asset: asset,
          style: {
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #0ff',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease'
          },
          animation: 'pulse-data',
          motion: { type: 'orbit', intensity: 0.3 + intensity * 0.2 }
        });
      }
    }
    
    // Create connections between nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      const node1 = nodes[i];
      const node2 = nodes[Math.floor(Math.random() * nodes.length)];
      
      elements.push({
        id: `connection-${Date.now()}-${i}`,
        type: 'svg-line',
        x1: node1.x,
        y1: node1.y,
        x2: node2.x,
        y2: node2.y,
        style: {
          stroke: 'rgba(0, 255, 255, 0.3)',
          strokeWidth: 1,
          strokeDasharray: '5 5',
          animation: 'data-flow 2s linear infinite'
        }
      });
    }
    
    setSceneElements(elements);
  };
  
  const createGameCinematic = (decision) => {
    const elements = [];
    
    // Dynamic cinematic background
    const bgStyle = backgroundGenerator.current.generateBackground('build', intensity * 0.4, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: 'brightness(0.3) contrast(1.5)'
    });
    
    // Add letterbox bars
    elements.push({
      id: 'letterbox-top',
      type: 'div',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15%',
        background: '#000',
        zIndex: 100
      }
    });
    
    elements.push({
      id: 'letterbox-bottom',
      type: 'div',
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '15%',
        background: '#000',
        zIndex: 100
      }
    });
    
    // Game reconstruction - pick random game assets
    const gameProjects = ['neo-neukoelln', 'miami-voice', 'royal-rumble'];
    const selectedGame = gameProjects[Math.floor(Math.random() * gameProjects.length)];
    
    if (selectedGame === 'neo-neukoelln') {
      // Berlin game scene
      elements.push({
        id: 'game-bg',
        type: 'image',
        asset: { path: '/assets/neo-neukoelln/images/brandenburg_gate.webp' },
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.7) contrast(1.2)',
          transform: `scale(1.1) translateX(${Math.sin(Date.now() * 0.0001) * 2}px)`
        }
      });
      
      // Add characters
      const characters = ['mutumbo.png', 'hipster.png', 'techno_girl.png'];
      characters.forEach((char, i) => {
        elements.push({
          id: `character-${i}`,
          type: 'image',
          asset: { path: `/assets/neo-neukoelln/images/${char}` },
          style: {
            position: 'absolute',
            bottom: '20%',
            left: `${20 + i * 25}%`,
            width: '150px',
            height: '150px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
            animation: `character-idle-${i} 2s ease-in-out infinite`
          },
          motion: { type: 'sway', intensity: 0.5 + i * 0.1 }
        });
      });
    }
    
    // Cinematic UI overlay with dynamic font
    const fontStyle = fontLoader.current.getRandomStyle('build', intensity);
    elements.push({
      id: 'cinematic-ui',
      type: 'text',
      content: 'PRESS ANY KEY TO CONTINUE',
      style: {
        position: 'absolute',
        bottom: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        ...fontStyle,
        fontSize: '24px',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        animation: 'blink 2s ease-in-out infinite'
      },
      motion: { type: 'pulse', intensity: 0.3 }
    });
    
    setSceneElements(elements);
  };
  
  const createAssetTsunami = (decision) => {
    const elements = [];
    const assetCount = 100; // MAXIMUM CHAOS
    
    // Chaotic background for tsunami
    const bgStyle = backgroundGenerator.current.generateBackground('chaos', intensity, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      overflow: 'hidden'
    });
    
    // Create waves of assets
    for (let wave = 0; wave < 5; wave++) {
      for (let i = 0; i < assetCount / 5; i++) {
        const assetType = Math.random() > 0.7 ? 'images' : Math.random() > 0.5 ? 'text' : 'code';
        const asset = assetLibrary?.getRandomAssetWithPath(assetType);
        
        if (asset) {
          const angle = (i / (assetCount / 5)) * Math.PI * 2;
          const radius = 50 + wave * 100;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          
          elements.push({
            id: `tsunami-${Date.now()}-${wave}-${i}`,
            type: assetType,
            asset: asset,
            style: {
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%) scale(0)',
              width: `${30 + Math.random() * 70}px`,
              height: `${30 + Math.random() * 70}px`,
              opacity: Math.random(),
              filter: `hue-rotate(${Math.random() * 360}deg)`,
              mixBlendMode: 'screen',
              animation: `tsunami-wave ${2 + wave * 0.5}s ease-out forwards`,
              animationDelay: `${wave * 0.2}s`
            },
            motion: { type: 'spin', intensity: intensity * (wave + 1) * 0.2 }
          });
        }
      }
    }
    
    setSceneElements(elements);
  };
  
  const createDigitalBrutalism = (decision) => {
    const elements = [];
    
    // Harsh geometric background
    const bgStyle = backgroundGenerator.current.generateBackground('build', intensity * 0.7, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: 'contrast(2) grayscale(0.8)'
    });
    
    // Brutal blocks with assets
    const blockCount = 5;
    for (let i = 0; i < blockCount; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        elements.push({
          id: `brutal-${Date.now()}-${i}`,
          type: 'div',
          style: {
            position: 'absolute',
            left: `${Math.random() * 70 + 10}%`,
            top: `${Math.random() * 70 + 10}%`,
            width: '200px',
            height: '150px',
            background: '#000',
            border: '5px solid #fff',
            boxShadow: '10px 10px 0 #ff0000',
            transform: `rotate(${Math.random() * 10 - 5}deg)`,
            overflow: 'hidden',
            cursor: 'pointer'
          },
          content: (
            <img
              src={asset.path}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(2) grayscale(1)'
              }}
            />
          )
        });
      }
    }
    
    // Harsh typography with super large font
    const fontStyle = fontLoader.current.getSuperLargeStyle('DIGITAL BRUTALISM');
    elements.push({
      id: 'brutal-text',
      type: 'text',
      content: 'DIGITAL BRUTALISM',
      style: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        ...fontStyle,
        color: '#fff',
        textShadow: '5px 5px 0 #000',
        transform: 'skew(-10deg)'
      },
      motion: { type: 'shake', intensity: 0.3 }
    });
    
    setSceneElements(elements);
  };
  
  const createGlitchReality = (decision) => {
    const elements = [];
    
    // Glitched dynamic background
    const bgStyle = backgroundGenerator.current.generateBackground('chaos', intensity * 0.9, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      animation: `${bgStyle.animation || ''}, reality-break 0.2s infinite`,
      filter: `${bgStyle.filter || ''} hue-rotate(${Math.random() * 360}deg)`
    });
    
    // Glitched assets
    const glitchCount = 30;
    for (let i = 0; i < glitchCount; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        const isGlitched = Math.random() > 0.5;
        
        elements.push({
          id: `glitch-${Date.now()}-${i}`,
          type: 'image',
          asset: asset,
          style: {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${50 + Math.random() * 150}px`,
            height: 'auto',
            transform: `
              translate(-50%, -50%)
              ${isGlitched ? `scaleX(${Math.random() > 0.5 ? -1 : 1})` : ''}
              ${isGlitched ? `skew(${Math.random() * 40 - 20}deg)` : ''}
            `,
            filter: isGlitched ? 
              `hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random() * 3})` : 
              'none',
            mixBlendMode: isGlitched ? 'difference' : 'normal',
            opacity: 0.5 + Math.random() * 0.5,
            animation: isGlitched ? 'reality-glitch 0.1s infinite' : 'none'
          },
          motion: isGlitched ? { type: 'glitch', intensity: intensity } : { type: 'warp', intensity: intensity * 0.5 }
        });
      }
    }
    
    // Corrupted text fragments with glitch fonts
    const textFragments = ['ERROR', 'NULL', 'UNDEFINED', '404', 'CORRUPT', 'SYSTEM_FAILURE'];
    for (let i = 0; i < 5; i++) {
      const fontStyle = i % 2 === 0 ? 
        fontLoader.current.getSuperLargeStyle(textFragments[i]) : 
        fontLoader.current.getMicroStyle();
      
      elements.push({
        id: `glitch-text-${i}`,
        type: 'text',
        content: textFragments[Math.floor(Math.random() * textFragments.length)],
        style: {
          position: 'absolute',
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 80 + 10}%`,
          ...fontStyle,
          color: '#0f0',
          textShadow: '0 0 10px #0f0',
          transform: `rotate(${Math.random() * 360}deg)`,
          opacity: Math.random()
        },
        motion: { type: 'teleport', intensity: intensity * 0.8 }
      });
    }
    
    setSceneElements(elements);
  };
  
  const createDreamSequence = (decision) => {
    const elements = [];
    
    // Ethereal organic background
    const bgStyle = backgroundGenerator.current.generateBackground('fade', intensity * 0.4, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: `${bgStyle.filter || ''} blur(2px) brightness(0.6)`
    });
    
    // Floating dream assets
    for (let i = 0; i < 8; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        elements.push({
          id: `dream-${Date.now()}-${i}`,
          type: 'image',
          asset: asset,
          style: {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            filter: 'blur(2px) saturate(0.5)',
            opacity: 0.3 + Math.random() * 0.4,
            transform: 'translate(-50%, -50%)',
            animation: `float-3d ${10 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          },
          motion: { type: 'drift', intensity: 0.3 + Math.random() * 0.2 }
        });
      }
    }
    
    // Dream text with ethereal font
    const fontStyle = fontLoader.current.getRandomStyle('fade', intensity * 0.5);
    elements.push({
      id: 'dream-text',
      type: 'text',
      content: 'WHAT DO DIGITAL ENTITIES DREAM OF?',
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        ...fontStyle,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        animation: 'dream-pulse 6s ease-in-out infinite'
      },
      motion: { type: 'breathe', intensity: 0.5 }
    });
    
    setSceneElements(elements);
  };
  
  const createMuseumGallery = (decision) => {
    const elements = [];
    
    // Sophisticated gallery background
    const bgStyle = backgroundGenerator.current.generateBackground('calm', intensity * 0.2, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: 'brightness(1.2) contrast(0.9)'
    });
    
    // Curated artwork display
    const artworks = [];
    const positions = [
      { left: '20%', top: '30%' },
      { left: '50%', top: '30%' },
      { left: '80%', top: '30%' },
      { left: '35%', top: '60%' },
      { left: '65%', top: '60%' }
    ];
    
    positions.forEach((pos, i) => {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        elements.push({
          id: `artwork-${i}`,
          type: 'div',
          style: {
            position: 'absolute',
            ...pos,
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          },
          motion: { type: 'float', intensity: 0.1 + i * 0.05 },
          content: (
            <>
              <img
                src={asset.path}
                alt=""
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                marginTop: '15px',
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                fontFamily: 'Georgia, serif'
              }}>
                "{asset.name}" - Digital, 2025
              </div>
            </>
          )
        });
      }
    });
    
    // Gallery title with elegant font
    const fontStyle = fontLoader.current.getRandomStyle('calm', 0.3);
    elements.push({
      id: 'gallery-title',
      type: 'text',
      content: 'ORPHAN ASSETS RETROSPECTIVE',
      style: {
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        ...fontStyle,
        fontSize: '42px',
        color: '#333'
      },
      motion: { type: 'breathe', intensity: 0.2 }
    });
    
    setSceneElements(elements);
  };
  
  const createCodePoetry = (decision) => {
    const elements = [];
    
    // Matrix-style background
    const bgStyle = backgroundGenerator.current.generateBackground('build', intensity * 0.5, assetLibrary);
    // Fix: Don't spread bgStyle, set individual properties
    setBackgroundStyle({
      backgroundColor: bgStyle.backgroundColor || '#000',
      backgroundImage: bgStyle.backgroundImage || 'none',
      backgroundSize: bgStyle.backgroundSize || 'cover',
      backgroundPosition: bgStyle.backgroundPosition || 'center',
      filter: 'brightness(0.2) contrast(1.5) hue-rotate(120deg)'
    });
    
    // Code snippets as poetry
    const codePoems = [
      'function dream() { while(true) { imagine(); } }',
      'const reality = null ?? imagination;',
      'try { exist(); } catch(e) { transcend(e); }',
      'class Consciousness extends Universe {}',
      'async function* life() { yield* experiences; }',
      'if (chaos) { return beauty; }'
    ];
    
    // Display code with assets
    for (let i = 0; i < 6; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('code');
      const poem = codePoems[i % codePoems.length];
      
      elements.push({
        id: `code-poetry-${i}`,
        type: 'text',
        content: poem,
        style: {
          position: 'absolute',
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          fontFamily: 'Courier New, monospace',
          fontSize: '16px',
          color: '#0f0',
          textShadow: '0 0 5px #0f0',
          opacity: 0.7 + Math.random() * 0.3,
          transform: `rotate(${Math.random() * 10 - 5}deg)`,
          whiteSpace: 'nowrap'
        },
        motion: { type: 'pulse', intensity: 0.3 + Math.random() * 0.3 }
      });
    }
    
    // Matrix rain effect
    for (let col = 0; col < 20; col++) {
      elements.push({
        id: `matrix-${col}`,
        type: 'text',
        content: Array(20).fill(0).map(() => 
          String.fromCharCode(0x30A0 + Math.random() * 96)
        ).join(''),
        style: {
          position: 'absolute',
          left: `${col * 5}%`,
          top: '-100%',
          fontSize: '14px',
          color: '#0f0',
          opacity: 0.1,
          writingMode: 'vertical-lr',
          animation: `matrix-fall ${5 + Math.random() * 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }
      });
    }
    
    setSceneElements(elements);
  };
  
  const createRandomChaos = (decision) => {
    // Randomly select a scene type
    const sceneTypes = [
      createMinimalElegance,
      createDataVisualization,
      createDigitalBrutalism,
      createVaporwave,
      createGameCinematic,
      createAssetTsunami,
      createGlitchReality,
      createDreamSequence,
      createMuseumGallery,
      createCodePoetry
    ];
    
    const randomScene = sceneTypes[Math.floor(Math.random() * sceneTypes.length)];
    randomScene(decision);
  };
  
  const createVaporwave = (decision) => {
    const elements = [];
    
    // Vaporwave aesthetic background
    const bgStyle = backgroundGenerator.current.generateBackground('build', intensity * 0.6, assetLibrary);
    setBackgroundStyle({
      ...bgStyle,
      filter: `${bgStyle.filter || ''} saturate(2) hue-rotate(270deg)`,
      position: 'relative'
    });
    
    // Add scan lines
    elements.push({
      id: 'scanlines',
      type: 'div',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )
        `,
        pointerEvents: 'none',
        mixBlendMode: 'overlay'
      }
    });
    
    // Floating assets with vaporwave aesthetics
    const vaporAssets = [];
    for (let i = 0; i < 10; i++) {
      const asset = assetLibrary?.getRandomAssetWithPath('images');
      if (asset) {
        elements.push({
          id: `vapor-${Date.now()}-${i}`,
          type: 'image',
          asset: asset,
          style: {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '150px',
            height: '150px',
            transform: `
              perspective(800px) 
              rotateY(${Math.random() * 60 - 30}deg) 
              translateZ(${Math.random() * 200}px)
            `,
            filter: 'saturate(2) contrast(1.2)',
            opacity: 0.8,
            mixBlendMode: 'multiply',
            animation: `float-3d ${10 + Math.random() * 10}s ease-in-out infinite`
          },
          motion: { type: 'float', intensity: 0.5 + Math.random() * 0.3 }
        });
      }
    }
    
    // Add Japanese text with huge font
    const japaneseText = ['未来', '美的', 'サイバー', 'ネオン', '東京'];
    const fontStyle = fontLoader.current.getSuperLargeStyle('');
    elements.push({
      id: 'vapor-text',
      type: 'text',
      content: japaneseText[Math.floor(Math.random() * japaneseText.length)],
      style: {
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        ...fontStyle,
        color: 'transparent',
        textStroke: '2px #fff',
        WebkitTextStroke: '2px #fff',
        textShadow: '0 0 40px rgba(255, 255, 255, 0.5)',
        animation: 'chrome-text 3s ease-in-out infinite'
      },
      motion: { type: 'sway', intensity: 0.4 }
    });
    
    setSceneElements(elements);
  };
  
  const applyTransition = (transitionType, callback) => {
    const container = containerRef.current;
    if (!container) return;
    
    container.style.transition = 'none';
    
    switch (transitionType) {
      case 'glitch-transition':
        container.classList.add('glitch-transition-active');
        setTimeout(() => {
          container.classList.remove('glitch-transition-active');
          callback();
        }, 500);
        break;
        
      case 'reality-tear':
        container.style.clipPath = 'polygon(0 0, 100% 0, 100% 50%, 0 50%)';
        setTimeout(() => {
          container.style.clipPath = 'none';
          callback();
        }, 300);
        break;
        
      case 'smooth-fade':
        container.style.opacity = '0';
        setTimeout(() => {
          callback();
          container.style.opacity = '1';
        }, 500);
        break;
        
      default:
        callback();
    }
  };
  
  // Helper functions
  const getPhilosophicalQuote = () => {
    const quotes = [
      'FORM FOLLOWS CHAOS',
      'BEAUTY IN ENTROPY',
      'DIGITAL IMPERMANENCE',
      'SYNTHETIC MEMORIES',
      'ALGORITHMIC DREAMS'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };
  
  // Initialize scene generation
  useEffect(() => {
    generateScene();
    
    return () => {
      if (sceneTimer.current) clearTimeout(sceneTimer.current);
    };
  }, [generateScene]);
  
  // Apply motion to rendered elements
  useEffect(() => {
    if (sceneElements.length === 0) return;
    
    // Apply motion to each element after a short delay to ensure DOM is ready
    const motionTimeout = setTimeout(() => {
      sceneElements.forEach((element, index) => {
        const domElement = document.getElementById(element.id);
        if (domElement && element.motion) {
          motionSystem.current.applyMotion(domElement, {
            motion: element.motion.type || 'float',
            intensity: element.motion.intensity || intensity * 0.5,
            phase: phase,
            delay: index * 100
          });
        } else if (domElement && !element.motion) {
          // Apply default motion based on phase
          const defaultMotions = motionSystem.current.getSuggestedMotions(phase, intensity);
          const motion = defaultMotions[index % defaultMotions.length];
          motionSystem.current.applyMotion(domElement, {
            motion: motion.type,
            intensity: motion.intensity,
            phase: phase,
            delay: index * 50
          });
        }
      });
    }, 100);
    
    return () => {
      clearTimeout(motionTimeout);
      motionSystem.current.clear();
    };
  }, [sceneElements, phase, intensity]);
  
  // Render scene elements
  const renderElement = (element) => {
    switch (element.type) {
      case 'image':
        return (
          <img
            key={element.id}
            src={element.asset.path}
            alt=""
            style={element.style}
            className={element.animation}
            onError={(e) => e.target.style.display = 'none'}
          />
        );
        
      case 'text':
        return (
          <div key={element.id} style={element.style}>
            {element.content}
          </div>
        );
        
      case 'svg-line':
        return (
          <svg
            key={element.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <line
              x1={`${element.x1}%`}
              y1={`${element.y1}%`}
              x2={`${element.x2}%`}
              y2={`${element.y2}%`}
              style={element.style}
            />
          </svg>
        );
        
      case 'div':
        return <div key={element.id} style={element.style}>{element.content}</div>;
        
      case 'data-node':
        return (
          <div key={element.id} style={element.style}>
            <img
              src={element.asset.path}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div
      ref={containerRef}
      className="sophisticated-chaos-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        ...backgroundStyle
      }}
    >
      {sceneElements.map(renderElement)}
      
      {/* Interactive zones */}
      {interactiveZones.map(zone => (
        <div
          key={zone.id}
          className="interactive-zone"
          style={zone.style}
          onClick={zone.onClick}
          onMouseEnter={zone.onHover}
        />
      ))}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && currentScene && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(0,0,0,0.7)',
          color: '#0ff',
          padding: '5px 10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          borderRadius: '3px'
        }}>
          Scene: {currentScene.mode} | Duration: {currentScene.duration}ms
        </div>
      )}
    </div>
  );
};

export default SophisticatedChaos;