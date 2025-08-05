import { useState, useEffect, useRef } from 'react';
import AssetLibrary from './AssetLibraryWrapper'; // Use wrapper for curated/full switching
import PhaseController from './PhaseController';
import RemixAlgorithms from './RemixAlgorithms';
import StyleBox from '../components/StyleBox';
import GlobalPreloader from './GlobalPreloader';
import AudioManager from './AudioManager';

const MutationEngine = () => {
  const [currentMutation, setCurrentMutation] = useState(null);
  const [phase, setPhase] = useState('calm');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [assets, setAssets] = useState({});
  const [assetLibrary, setAssetLibrary] = useState(null);
  const [preloadComplete, setPreloadComplete] = useState(false);
  
  const engineRef = useRef(null);
  const phaseController = useRef(null);
  const audioInitialized = useRef(false);
  
  useEffect(() => {
    // Initialize the engine
    const initEngine = async () => {
      setIsLoading(true);
      
      // Initialize asset library
      const assetLib = new AssetLibrary();
      const loadedAssets = await assetLib.loadAllAssets();
      setAssets(loadedAssets);
      setAssetLibrary(assetLib);
      
      // Initialize phase controller
      phaseController.current = new PhaseController({
        onPhaseChange: handlePhaseChange,
        minDuration: 30000, // 30 seconds
        maxDuration: 120000 // 120 seconds
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
  
  const triggerNewMutation = async () => {
    setIsTransitioning(true);
    
    // Brief transition period
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mutations = RemixAlgorithms.getAvailableMutations();
    const randomMutation = mutations[Math.floor(Math.random() * mutations.length)];
    setCurrentMutation(randomMutation);
    
    // Allow new mutation to load
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsTransitioning(false);
  };
  
  const handleRecombineNow = () => {
    // Manual trigger for instant mutation
    phaseController.current?.reset();
    triggerNewMutation();
  };
  
  const handlePreloadComplete = () => {
    setPreloadComplete(true);
    // Start the first mutation
    triggerNewMutation();
    // Start phase controller
    if (phaseController.current) {
      phaseController.current.start();
    }
  };

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
  
  // Initialize audio on first user interaction
  const handleUserInteraction = async () => {
    console.log('👆 User interaction detected!');
    if (!audioInitialized.current) {
      console.log('🎵 Initializing AudioManager on user interaction...');
      try {
        await AudioManager.init();
        audioInitialized.current = true;
        // Update with current phase
        const currentIntensity = phaseController.current?.getIntensity() || 0;
        console.log('🎶 Setting initial phase:', phase, 'intensity:', currentIntensity);
        AudioManager.updatePhase(phase, currentIntensity);
      } catch (error) {
        console.error('❌ AudioManager initialization failed:', error);
      }
    } else {
      console.log('🔊 Audio already initialized');
    }
  };

  return (
    <div className="mutation-engine" ref={engineRef} onClick={handleUserInteraction}>
      <div className={`mutation-container phase-${phase} ${isTransitioning ? 'transitioning' : ''}`}>
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
        🧬 RECOMBINE NOW
      </button>
      
      <div className="phase-indicator">
        <span className="phase-label">PHASE:</span>
        <span className="phase-value">{phase.toUpperCase()}</span>
      </div>
      
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