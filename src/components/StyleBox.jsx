import { useState, useEffect } from 'react';
import '../mutations/mutations.css';

const StyleBox = ({ currentMutation, intensity, phase, assetLibrary }) => {
  const [stats, setStats] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);
  
  useEffect(() => {
    if (assetLibrary) {
      const assetStats = assetLibrary.getStats();
      setStats(assetStats);
    }
  }, [assetLibrary]);
  
  const getMutationDescription = () => {
    if (!currentMutation) return "Initializing chaos...";
    
    const descriptions = {
      'minimalElegance': 'Clean, Apple-style aesthetics with subtle asset placement',
      'dataVisualization': 'Connected nodes and flowing data streams',
      'brutalismDigital': 'Harsh, bold, architectural concrete brutalism',
      'vaporwaveNostalgia': '80s neon, 3D floating assets, pastel gradients',
      'gameCinematic': 'Letterboxed game reconstructions with characters',
      'assetTsunami': 'Maximum chaos - overwhelming asset density',
      'glitchReality': 'Corrupted but artistic reality distortions',
      'dreamSequence': 'Ethereal, blurred, poetic floating elements',
      'museumGallery': 'Curated, sophisticated gallery display',
      'codePoetry': 'Terminal aesthetics with philosophical code',
      'sophisticated-chaos': 'AI-directed aesthetic experiences',
      'quantum-evolution': 'Self-modifying DNA with swarm intelligence',
      'real-asset-chaos': 'Actual project assets in pure motion',
      'berlin-fever-dream': 'Pixel döner dealer invades 3D reality',
      'voice-battle-tales': 'Pitch-controlled combat dialogue',
      'existential-package': 'Life purpose through package delivery',
      'techno-zen-fusion': 'Berlin underground meets enlightenment',
      'glitched-sitcom-fighter': 'TV characters break into fighting game',
      'willy-multiverse': 'All Willy variants across dimensions',
      'chat-graffiti-generator': 'Twitch chat becomes Berlin street art',
      'doener-quest-3d': 'Kebab-powered life simulation',
      'ultimate-chaos-synthesis': 'Pure algorithmic madness - no limits'
    };
    
    return descriptions[currentMutation.id] || currentMutation.description || "Unknown artistic experiment";
  };
  
  const getStyleMetrics = () => {
    return {
      sophistication: Math.min(1, (intensity + 0.3) * (phase === 'chaos' ? 0.7 : 1.2)),
      unpredictability: Math.random() * 0.3 + intensity * 0.7,
      aestheticComplexity: currentMutation?.config?.assetCount ? 
        Math.min(1, currentMutation.config.assetCount / 100) : 
        intensity,
      emergentBehavior: phase === 'chaos' ? 0.8 + Math.random() * 0.2 : Math.random() * 0.5,
      consciousnessLevel: currentMutation?.id === 'quantum-evolution' ? 
        0.9 + Math.random() * 0.1 : 
        Math.random() * 0.6
    };
  };
  
  const metrics = getStyleMetrics();
  
  const getPhaseColor = () => {
    switch (phase) {
      case 'calm': return '#4ecdc4';
      case 'build': return '#f7b731';
      case 'chaos': return '#ff6b35';
      case 'fade': return '#5f27cd';
      default: return '#0ff';
    }
  };
  
  if (isMinimized) {
    return (
      <div 
        className="style-box" 
        style={{ 
          minWidth: '100px',
          maxWidth: '120px',
          cursor: 'pointer'
        }}
        onClick={() => setIsMinimized(false)}
      >
        <div className="style-box-title">STYLEBOX</div>
        <div style={{ fontSize: '10px', opacity: 0.6 }}>
          Click to expand
        </div>
      </div>
    );
  }
  
  return (
    <div className="style-box">
      <div className="style-box-title">
        STYLEBOX
        <span 
          style={{ 
            float: 'right', 
            cursor: 'pointer',
            fontSize: '10px',
            opacity: 0.6
          }}
          onClick={() => setIsMinimized(true)}
        >
          [−]
        </span>
      </div>
      
      <div className="style-box-content">
        <div className="style-stat">
          <span className="style-stat-label">Program:</span>
          <span className="style-stat-value" style={{ fontSize: '10px' }}>
            {currentMutation?.name || 'INITIALIZING'}
          </span>
        </div>
        
        <div className="style-stat">
          <span className="style-stat-label">Phase:</span>
          <span className="style-stat-value" style={{ color: getPhaseColor() }}>
            {phase?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
        
        <div className="style-stat">
          <span className="style-stat-label">Intensity:</span>
          <div className="style-stat-bar">
            <div 
              className="style-stat-fill" 
              style={{ width: `${(intensity || 0) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="style-stat">
          <span className="style-stat-label">Sophistication:</span>
          <div className="style-stat-bar">
            <div 
              className="style-stat-fill" 
              style={{ width: `${metrics.sophistication * 100}%` }}
            />
          </div>
        </div>
        
        <div className="style-stat">
          <span className="style-stat-label">Unpredictability:</span>
          <div className="style-stat-bar">
            <div 
              className="style-stat-fill" 
              style={{ 
                width: `${metrics.unpredictability * 100}%`,
                background: 'linear-gradient(90deg, #ff6b35, #f7b731)'
              }}
            />
          </div>
        </div>
        
        <div className="style-stat">
          <span className="style-stat-label">Aesthetic Complexity:</span>
          <div className="style-stat-bar">
            <div 
              className="style-stat-fill" 
              style={{ 
                width: `${metrics.aestheticComplexity * 100}%`,
                background: 'linear-gradient(90deg, #5f27cd, #a855f7)'
              }}
            />
          </div>
        </div>
        
        <div className="style-stat">
          <span className="style-stat-label">Emergent Behavior:</span>
          <div className="style-stat-bar">
            <div 
              className="style-stat-fill" 
              style={{ 
                width: `${metrics.emergentBehavior * 100}%`,
                background: 'linear-gradient(90deg, #4ecdc4, #00d2d3)'
              }}
            />
          </div>
        </div>
        
        {currentMutation?.id === 'quantum-evolution' && (
          <div className="style-stat">
            <span className="style-stat-label">Consciousness:</span>
            <div className="style-stat-bar">
              <div 
                className="style-stat-fill" 
                style={{ 
                  width: `${metrics.consciousnessLevel * 100}%`,
                  background: 'linear-gradient(90deg, #ff1493, #8b00ff)',
                  animation: 'consciousness-pulse 2s infinite'
                }}
              />
            </div>
          </div>
        )}
        
        {stats.total && (
          <div className="style-stat">
            <span className="style-stat-label">Assets Loaded:</span>
            <span className="style-stat-value">{stats.total}</span>
          </div>
        )}
        
        <div className="style-description">
          {getMutationDescription()}
        </div>
        
        {currentMutation?.sources && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '10px', 
            opacity: 0.5 
          }}>
            Sources: {currentMutation.sources.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleBox;