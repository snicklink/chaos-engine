import { useState, useEffect, useRef } from 'react';
import AssetPreloader from './AssetPreloader';
import BackgroundGenerator from './BackgroundGenerator';
import MotionSystem from './MotionSystem';
import FontLoader from './FontLoader';
import './preloader.css';

const GlobalPreloader = ({ assetLibrary, onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('initializing');
  const [loadedAssets, setLoadedAssets] = useState({ images: 0, audio: 0, fonts: 0 });
  const [errors, setErrors] = useState([]);
  const preloader = useRef(new AssetPreloader());
  const backgroundGenerator = useRef(new BackgroundGenerator());
  const motionSystem = useRef(new MotionSystem());
  const fontLoader = useRef(new FontLoader());
  
  useEffect(() => {
    if (!assetLibrary) return;
    
    const preloadEverything = async () => {
      try {
        // Stage 1: Initialize systems
        setLoadingStage('initializing systems');
        await fontLoader.current.init();
        setLoadingProgress(10);
        
        // Stage 2: Preload critical assets for all mutations
        setLoadingStage('loading mutation assets');
        const mutations = [
          'asset-parasite',
          'logic-collider',
          'aesthetic-fusion',
          'temporal-glitch',
          'genre-fracture',
          'dynamic-chaos',
          'asset-chaos-overflow',
          'real-asset-chaos',
          'quantum-evolution',
          'sophisticated-chaos'
        ];
        
        let mutationProgress = 10;
        const mutationIncrement = 40 / mutations.length;
        
        for (const mutation of mutations) {
          await preloader.current.preloadMutationAssets(mutation, assetLibrary);
          mutationProgress += mutationIncrement;
          setLoadingProgress(Math.floor(mutationProgress));
        }
        
        // Stage 3: Preload all images
        setLoadingStage('caching image assets');
        const imageAssets = assetLibrary.assetsByType?.images || [];
        const audioAssets = assetLibrary.assetsByType?.audio || [];
        let loadedImages = 0;
        let loadedAudio = 0;
        
        // Create image loading promises
        const imagePromises = imageAssets.slice(0, 100).map(asset => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              loadedImages++;
              setLoadedAssets(prev => ({ ...prev, images: loadedImages }));
              setLoadingProgress(50 + Math.floor((loadedImages / 100) * 30));
              resolve();
            };
            img.onerror = () => {
              setErrors(prev => [...prev, `Failed to load: ${asset.name}`]);
              resolve(); // Continue loading even if one fails
            };
            img.src = asset.path;
          });
        });
        
        await Promise.all(imagePromises);
        
        // Stage 4: Preload audio (lighter touch)
        setLoadingStage('preparing audio assets');
        const audioPromises = audioAssets.slice(0, 20).map(asset => {
          return new Promise((resolve) => {
            const audio = new Audio();
            audio.preload = 'metadata'; // Just load metadata, not full audio
            audio.onloadedmetadata = () => {
              loadedAudio++;
              setLoadedAssets(prev => ({ ...prev, audio: loadedAudio }));
              setLoadingProgress(80 + Math.floor((loadedAudio / 20) * 10));
              resolve();
            };
            audio.onerror = () => {
              setErrors(prev => [...prev, `Failed to load audio: ${asset.name}`]);
              resolve();
            };
            audio.src = asset.path;
          });
        });
        
        await Promise.all(audioPromises);
        
        // Stage 5: Generate background cache
        setLoadingStage('generating backgrounds');
        const phases = ['calm', 'build', 'chaos', 'fade'];
        for (const phase of phases) {
          for (let i = 0; i < 3; i++) {
            backgroundGenerator.current.generateBackground(phase, Math.random(), assetLibrary);
          }
        }
        setLoadingProgress(95);
        
        // Stage 6: Final preparations
        setLoadingStage('finalizing');
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingProgress(100);
        
        // Complete after a brief moment
        setTimeout(() => {
          onComplete();
        }, 800);
        
      } catch (error) {
        console.error('Preloading error:', error);
        setErrors(prev => [...prev, `Critical error: ${error.message}`]);
        // Still complete even with errors
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    };
    
    preloadEverything();
  }, [assetLibrary, onComplete]);
  
  // Generate dynamic background for preloader
  const [bgStyle] = useState(() => {
    const colors = ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'];
    const gradients = [];
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * 360;
      const color = colors[i % colors.length];
      gradients.push(`linear-gradient(${angle}deg, ${color}22 0%, transparent 50%)`);
    }
    return {
      background: `#0a0a0a, ${gradients.join(', ')}`,
      backgroundSize: '200% 200%',
      animation: 'backgroundMove 20s ease-in-out infinite'
    };
  });
  
  return (
    <div className="global-preloader" style={bgStyle}>
      <div className="preloader-content">
        <div className="preloader-logo">
          <div className="logo-text">CHAOS ENGINE</div>
          <div className="logo-subtitle">THE ORPHANARIUM</div>
        </div>
        
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div 
              className="loading-progress"
              style={{ 
                width: `${loadingProgress}%`,
                background: `linear-gradient(90deg, 
                  #FF006E ${loadingProgress < 20 ? '100%' : '0%'},
                  #FB5607 ${loadingProgress < 40 ? '100%' : '0%'},
                  #FFBE0B ${loadingProgress < 60 ? '100%' : '0%'},
                  #8338EC ${loadingProgress < 80 ? '100%' : '0%'},
                  #3A86FF 100%)`
              }}
            />
          </div>
          <div className="loading-percentage">{loadingProgress}%</div>
        </div>
        
        <div className="loading-stage">{loadingStage.toUpperCase()}</div>
        
        <div className="asset-stats">
          <div className="stat-item">
            <span className="stat-label">IMAGES</span>
            <span className="stat-value">{loadedAssets.images}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">AUDIO</span>
            <span className="stat-value">{loadedAssets.audio}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">FONTS</span>
            <span className="stat-value">{loadedAssets.fonts}</span>
          </div>
        </div>
        
        {errors.length > 0 && (
          <div className="loading-errors">
            <div className="error-title">⚠️ Some assets failed to load</div>
            <div className="error-count">{errors.length} errors (continuing anyway)</div>
          </div>
        )}
        
        <div className="loading-tips">
          <div className="tip">
            {loadingProgress < 25 && "Gathering orphan fragments from abandoned projects..."}
            {loadingProgress >= 25 && loadingProgress < 50 && "Reconstructing digital memories..."}
            {loadingProgress >= 50 && loadingProgress < 75 && "Weaving chaos patterns..."}
            {loadingProgress >= 75 && loadingProgress < 90 && "Stabilizing multiverse connections..."}
            {loadingProgress >= 90 && "Preparing for maximum chaos..."}
          </div>
        </div>
        
        {/* Animated elements */}
        <div className="floating-assets">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="floating-asset"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            >
              {['🎮', '🎵', '📺', '🌆', '🎨', '💾'][i % 6]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalPreloader;