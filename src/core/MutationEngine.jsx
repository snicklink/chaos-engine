import { useState, useEffect, useRef } from 'react';
import AssetLibrary from './AssetLibraryWrapper'; // Use wrapper for curated/full switching
import PhaseController from './PhaseController';
import RemixAlgorithms from './RemixAlgorithms';
import StyleBox from '../components/StyleBox';
import GlobalPreloader from './GlobalPreloader';
import AudioManager from './AudioManager';
import chaosRandomizer from './ChaosRandomizer';
import memoryGhostEngine from './MemoryGhostEngine';
import ghostRenderer from './GhostRenderer';

const MutationEngine = () => {
  const [currentMutation, setCurrentMutation] = useState(null);
  const [phase, setPhase] = useState('calm');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [assets, setAssets] = useState({});
  const [assetLibrary, setAssetLibrary] = useState(null);
  const [preloadComplete, setPreloadComplete] = useState(false);
  const [showSoundPrompt, setShowSoundPrompt] = useState(false);
  
  const engineRef = useRef(null);
  const phaseController = useRef(null);
  const audioInitialized = useRef(false);
  const ghostCanvasRef = useRef(null);
  const ghostIntervalRef = useRef(null);
  
  useEffect(() => {
    // Initialize the engine
    const initEngine = async () => {
      setIsLoading(true);
      
      // Initialize asset library
      const assetLib = new AssetLibrary();
      const loadedAssets = await assetLib.loadAllAssets();
      setAssets(loadedAssets);
      setAssetLibrary(assetLib);
      
      // Initialize chaos randomizer
      await chaosRandomizer.initialize(assetLib);
      console.log('🎲 Chaos Randomizer Stats:', chaosRandomizer.getStats());
      
      // Initialize memory ghost engine with BlobTV dimensions
      memoryGhostEngine.initialize(1280, 720);
      ghostRenderer.initialize(1280, 720);
      console.log('👻 Memory Ghost Engine initialized for BlobTV (1280x720)');
      
      // Initialize phase controller with MUCH shorter phases
      phaseController.current = new PhaseController({
        onPhaseChange: handlePhaseChange,
        minDuration: 5000,  // 5 seconds minimum
        maxDuration: 20000  // 20 seconds maximum
      });
      
      // Don't start yet - wait for preload
      setIsLoading(false);
    };
    
    initEngine();
    
    return () => {
      if (phaseController.current) {
        phaseController.current.stop();
      }
      AudioManager.destroy();
    };
  }, []);
  
  const handlePhaseChange = (newPhase) => {
    setPhase(newPhase);
    
    // Update audio manager with new phase
    const intensity = phaseController.current?.getIntensity() || 0;
    AudioManager.updatePhase(newPhase, intensity);
    
    // Update ghost renderer effects based on phase
    ghostRenderer.setPhaseEffects(newPhase);
    
    // Capture ghost on phase transition
    if (ghostCanvasRef.current) {
      const metadata = {
        mutation: currentMutation?.name || 'unknown',
        phase: newPhase,
        intensity: intensity,
        emotionalTone: getEmotionalTone(newPhase),
        entropy: Math.random()
      };
      memoryGhostEngine.captureGhost(ghostCanvasRef.current, metadata);
    }
    
    // Trigger different behaviors based on phase
    switch(newPhase) {
      case 'calm':
        // Minimal mutations, slow pace
        break;
      case 'build':
        // Increasing complexity
        break;
      case 'chaos':
        // Maximum mutation intensity
        break;
      case 'fade':
        // Collapse back to fragments
        break;
      default:
        break;
    }
  };
  
  // Determine emotional tone from phase
  const getEmotionalTone = (phase) => {
    const tones = {
      calm: 'peaceful',
      build: 'anticipation',
      chaos: 'frantic',
      fade: 'melancholic'
    };
    return tones[phase] || 'neutral';
  };
  
  const triggerNewMutation = async () => {
    setIsTransitioning(true);
    
    // Capture current state as ghost before transitioning
    if (currentMutation && ghostCanvasRef.current) {
      const metadata = {
        mutation: currentMutation.name,
        phase: phase,
        intensity: phaseController.current?.getIntensity() || 0,
        emotionalTone: getEmotionalTone(phase),
        entropy: Math.random()
      };
      
      // Capture from mutation container
      const mutationContainer = document.querySelector('.mutation-container');
      if (mutationContainer) {
        const canvas = mutationContainer.querySelector('canvas');
        if (canvas) {
          memoryGhostEngine.captureGhost(canvas, metadata);
          console.log('👻 Captured ghost before mutation transition');
        }
      }
    }
    
    // Brief transition period
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mutations = RemixAlgorithms.getAvailableMutations();
    const randomMutation = mutations[Math.floor(Math.random() * mutations.length)];
    setCurrentMutation(randomMutation);
    
    // Update ghost engine context
    memoryGhostEngine.setContext(randomMutation.name, phase);
    
    // Allow new mutation to load
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsTransitioning(false);
  };
  
  const handleRecombineNow = () => {
    // Manual trigger for instant mutation
    phaseController.current?.reset();
    triggerNewMutation();
  };
  
  // Initialize audio on first user interaction
  const handleUserInteraction = async () => {
    console.log('👆 User interaction detected!');
    if (!audioInitialized.current) {
      console.log('🎵 Initializing AudioManager on user interaction...');
      try {
        await AudioManager.init();
        audioInitialized.current = true;
        setShowSoundPrompt(false); // Hide the prompt after audio init
        // Update with current phase
        const currentIntensity = phaseController.current?.getIntensity() || 0;
        console.log('🎶 Setting initial phase:', phase, 'intensity:', currentIntensity);
        AudioManager.updatePhase(phase, currentIntensity);
      } catch (error) {
        console.error('❌ AudioManager initialization failed:', error);
      }
    } else {
      console.log('🔊 Audio already initialized');
      setShowSoundPrompt(false);
    }
  };

  // Setup ghost capture interval - MUST be before any returns!
  useEffect(() => {
    if (!preloadComplete) return;
    
    // Start ghost update loop
    const updateGhosts = () => {
      memoryGhostEngine.updateGhosts(16);
      
      // Render ghosts if we have a canvas
      if (ghostCanvasRef.current) {
        const ctx = ghostCanvasRef.current.getContext('2d');
        ghostRenderer.renderGhostLayers(
          memoryGhostEngine.ghosts,
          ctx,
          ghostCanvasRef.current.width,
          ghostCanvasRef.current.height
        );
      }
    };
    
    ghostIntervalRef.current = setInterval(updateGhosts, 50); // 20fps for ghosts
    
    return () => {
      if (ghostIntervalRef.current) {
        clearInterval(ghostIntervalRef.current);
      }
    };
  }, [preloadComplete]);

  const handlePreloadComplete = () => {
    setPreloadComplete(true);
    setShowSoundPrompt(true); // Show sound prompt after preload
    
    // Auto-hide sound prompt after 10 seconds
    setTimeout(() => {
      setShowSoundPrompt(false);
    }, 10000);
    
    // Start the first mutation
    triggerNewMutation();
    // Start phase controller
    if (phaseController.current) {
      phaseController.current.start();
    }
    
    // AUTO-MUTATION: Trigger new mutations every 10-30 seconds
    const autoMutate = () => {
      const delay = 10000 + Math.random() * 20000; // 10-30 seconds
      setTimeout(() => {
        console.log('🎲 Auto-mutating...');
        chaosRandomizer.refresh(); // Clear recently used
        triggerNewMutation();
        autoMutate(); // Schedule next mutation
      }, delay);
    };
    autoMutate();
  };

  // CONDITIONAL RETURNS MUST BE AFTER ALL HOOKS!
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">
          INITIALIZING CHAOS ENGINE...
        </div>
      </div>
    );
  }
  
  if (!preloadComplete && assetLibrary) {
    return <GlobalPreloader assetLibrary={assetLibrary} onComplete={handlePreloadComplete} />;
  }

  return (
    <div className="mutation-engine" ref={engineRef} onClick={handleUserInteraction}>
      {/* Sound prompt overlay */}
      {showSoundPrompt && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <button
            style={{
              background: 'linear-gradient(180deg, #2D1B69 0%, #8B5CF6 100%)',
              border: 'none',
              borderRadius: '50px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              pointerEvents: 'auto',
              animation: 'fadeIn 0.5s ease-in-out'
            }}
            onClick={handleUserInteraction}
          >
            <span>Klicken für Sound</span>
            <span style={{ fontSize: '16px' }}>🔊</span>
          </button>
        </div>
      )}
      
      {/* Ghost layer canvas - behind everything */}
      <canvas
        ref={ghostCanvasRef}
        className="ghost-canvas"
        width={1280}
        height={720}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1280px',
          height: '720px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.3,
          mixBlendMode: 'screen'
        }}
      />
      
      <div className={`mutation-container phase-${phase} ${isTransitioning ? 'transitioning' : ''}`}
        style={{ position: 'relative', zIndex: 2 }}>
        {isTransitioning ? (
          <div className="transition-overlay">
            <div className="transition-text">
              RECOMBINING DNA...
            </div>
            <div className="transition-spinner"></div>
          </div>
        ) : (
          currentMutation && currentMutation.component ? (
            <currentMutation.component 
              assets={assets}
              assetLibrary={assetLibrary}
              phase={phase}
              intensity={phaseController.current?.getIntensity() || 0}
              config={currentMutation.config || {}}
            />
          ) : (
            <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
              <h2>INITIALIZING MUTATION...</h2>
            </div>
          )
        )}
      </div>
      
      <button 
        className="recombine-button"
        onClick={handleRecombineNow}
      >
        MUTATE
      </button>
      
      
      <StyleBox 
        currentMutation={currentMutation}
        intensity={phaseController.current?.getIntensity() || 0}
        phase={phase}
        assetLibrary={assetLibrary}
      />
    </div>
  );
};

export default MutationEngine;