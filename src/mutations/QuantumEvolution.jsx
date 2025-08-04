import { useState, useEffect, useRef } from 'react';
import QuantumChaosEngine from '../core/QuantumChaosEngine';
import AssetPreloader from '../core/AssetPreloader';
import './mutations.css';

const QuantumEvolution = ({ assetLibrary, phase, intensity }) => {
  const [quantumState, setQuantumState] = useState(null);
  const [evolutionHistory, setEvolutionHistory] = useState([]);
  const [consciousness, setConsciousness] = useState(null);
  const [emergentBehaviors, setEmergentBehaviors] = useState([]);
  
  const quantumEngine = useRef(null);
  const canvasRef = useRef(null);
  const animationFrame = useRef(null);
  const preloader = useRef(new AssetPreloader());
  
  useEffect(() => {
    if (!assetLibrary) return;
    
    // Preload assets for quantum evolution
    preloader.current.preloadMutationAssets('quantum-evolution', assetLibrary);
    
    quantumEngine.current = new QuantumChaosEngine(assetLibrary);
    
    const evolve = () => {
      const state = quantumEngine.current.generateQuantumState();
      
      setQuantumState(state);
      setConsciousness(state.consciousness);
      setEmergentBehaviors(state.emergentBehaviors);
      
      // Add to evolution history
      setEvolutionHistory(prev => [...prev.slice(-10), {
        timestamp: Date.now(),
        generation: state.metadata.generation,
        consciousnessState: state.metadata.consciousness_state,
        chaosLevel: state.metadata.chaos_level,
        emergenceFactor: state.metadata.emergence_factor
      }]);
      
      animationFrame.current = requestAnimationFrame(evolve);
    };
    
    evolve();
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [assetLibrary]);
  
  const renderSwarmAgent = (agent, index) => {
    const x = agent.position.x * 100;
    const y = agent.position.y * 100;
    
    const roleColors = {
      explorer: '#ff6b35',
      guardian: '#4ecdc4',
      creator: '#45b7d1',
      disruptor: '#f7b731',
      connector: '#5f27cd',
      observer: '#00d2d3'
    };
    
    return (
      <div
        key={agent.id}
        className="swarm-agent"
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: agent.role === 'creator' ? '0' : '50%',
          background: roleColors[agent.role] || '#fff',
          boxShadow: `0 0 ${10 + agent.intelligence * 20}px ${roleColors[agent.role]}`,
          opacity: 0.7 + agent.intelligence * 0.3,
          transition: 'all 0.1s ease-out',
          cursor: 'pointer'
        }}
        title={`${agent.role} - Intelligence: ${(agent.intelligence * 100).toFixed(0)}%`}
      >
        {agent.asset && (
          <img
            src={agent.asset.path}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit',
              filter: `hue-rotate(${agent.intelligence * 360}deg)`
            }}
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>
    );
  };
  
  const renderCellularGrid = () => {
    if (!quantumState?.cellGrid) return null;
    
    return (
      <div className="cellular-grid" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${quantumState.cellGrid.length}, 1fr)`,
        gridTemplateRows: `repeat(${quantumState.cellGrid.length}, 1fr)`,
        opacity: 0.3,
        mixBlendMode: 'multiply'
      }}>
        {quantumState.cellGrid.flat().map((cell, index) => (
          <div
            key={index}
            className="cell"
            style={{
              background: cell.alive ? 
                (cell.mutation ? '#ff0066' : '#00ff66') : 
                'transparent',
              border: cell.alive ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {cell.alive && cell.asset && (
              <img
                src={cell.asset.path}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: cell.mutation ? 
                    'hue-rotate(180deg) contrast(2) saturate(2)' : 
                    `brightness(${0.5 + cell.energy * 0.5})`,
                  opacity: cell.age > 10 ? 0.3 : 0.8
                }}
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const renderQuantumField = () => {
    if (!quantumState?.quantumField) return null;
    
    return quantumState.quantumField.map((quantum, index) => {
      const isVisible = quantum.currentState !== 'invisible';
      const isMultiplied = quantum.currentState === 'multiplied';
      const isMorphing = quantum.currentState === 'morphing';
      const isTimeshifted = quantum.currentState === 'timeshifted';
      
      if (!isVisible) return null;
      
      const elements = isMultiplied ? Array(3 + Math.floor(Math.random() * 5)).fill(quantum) : [quantum];
      
      return elements.map((q, i) => (
        <div
          key={`${quantum.id}-${i}`}
          className="quantum-particle"
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translate(-50%, -50%) ${isMorphing ? 'scale(0.5)' : 'scale(1)'}`,
            width: '60px',
            height: '60px',
            opacity: isTimeshifted ? 0.3 : 0.8,
            filter: `
              blur(${isMorphing ? '5px' : '0px'}) 
              hue-rotate(${isTimeshifted ? Date.now() * 0.1 : 0}deg)
              contrast(${isMultiplied ? '2' : '1'})
            `,
            animationName: isMorphing ? 'morph-shape' : 
                      isTimeshifted ? 'time-shift' : 
                      'quantum-float',
            animationDuration: isMorphing ? '2s' : isTimeshifted ? '3s' : '4s',
            animationIterationCount: 'infinite',
            animationDelay: `${i * 0.5}s`,
            mixBlendMode: isMultiplied ? 'screen' : 'normal'
          }}
        >
          {quantum.asset && (
            <img
              src={quantum.asset.path}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
      ));
    }).flat();
  };
  
  const renderConsciousnessVisualization = () => {
    if (!consciousness) return null;
    
    const dominantEmotion = Object.entries(consciousness.emotions)
      .sort(([,a], [,b]) => b - a)[0];
    
    const emotionColors = {
      excitement: '#ff6b35',
      boredom: '#666666',
      curiosity: '#4ecdc4',
      chaos: '#f7b731'
    };
    
    return (
      <div className="consciousness-field" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at 50% 50%, 
          ${emotionColors[dominantEmotion[0]]}10 0%, 
          transparent 70%)`,
        animation: `consciousness-pulse ${2 + dominantEmotion[1] * 3}s infinite`,
        pointerEvents: 'none'
      }}>
        {/* Consciousness dreams become reality */}
        {consciousness.dreams.slice(-3).map((dream, index) => (
          <div
            key={`dream-${index}`}
            className="dream-manifestation"
            style={{
              position: 'absolute',
              left: `${20 + index * 30}%`,
              top: `${20 + index * 20}%`,
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `rgba(255, 255, 255, ${dream.coherence * 0.3})`,
              filter: `blur(${(1 - dream.coherence) * 10}px)`,
              animationName: 'dream-float',
              animationDuration: '8s',
              animationIterationCount: 'infinite',
              animationDelay: `${index * 2}s`
            }}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '12px',
              color: '#fff',
              textAlign: 'center',
              opacity: dream.coherence
            }}>
              {dream.type.replace('_', ' ')}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  if (!quantumState) {
    return (
      <div className="quantum-loading">
        <div className="loading-text">
          INITIALIZING QUANTUM CONSCIOUSNESS...
        </div>
      </div>
    );
  }
  
  return (
    <div className="quantum-evolution-container" style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#000',
      overflow: 'hidden'
    }}>
      {/* Consciousness field visualization */}
      {renderConsciousnessVisualization()}
      
      {/* Cellular automata grid */}
      {renderCellularGrid()}
      
      {/* Swarm intelligence agents */}
      {quantumState.swarm.map(renderSwarmAgent)}
      
      {/* Quantum superposition particles */}
      {renderQuantumField()}
      
  {/* Evolution statistics */}
      <div className="evolution-stats" style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#0ff',
        padding: '10px',
        fontFamily: 'monospace',
        fontSize: '11px',
        borderRadius: '5px',
        minWidth: '200px'
      }}>
        <div>Generation: {quantumState.metadata.generation}</div>
        <div>Consciousness: {quantumState.metadata.consciousness_state}</div>
        <div>Chaos Level: {(quantumState.metadata.chaos_level * 100).toFixed(1)}%</div>
        <div>Emergence: {(quantumState.metadata.emergence_factor * 100).toFixed(1)}%</div>
        <div>Dreams: {consciousness?.dreams.length || 0}</div>
        <div>DNA Mutations: {quantumState.dnaSequence.reduce((sum, gene) => sum + gene.mutations, 0)}</div>
        <div style={{ marginTop: '5px', fontSize: '10px' }}>
          Emotions:
          {Object.entries(consciousness?.emotions || {}).map(([emotion, value]) => (
            <div key={emotion} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              color: value > 0.5 ? '#ff6b35' : '#666'
            }}>
              <span>{emotion}:</span>
              <span>{(value * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Emergent behaviors display */}
      {emergentBehaviors.length > 0 && (
        <div className="emergent-behaviors" style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ff6b35',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          borderRadius: '5px'
        }}>
          <div>EMERGENT BEHAVIORS DETECTED:</div>
          {emergentBehaviors.slice(-5).map((behavior, index) => (
            <div key={index} style={{ opacity: 1 - index * 0.2 }}>
              → {behavior.type || 'Unknown Pattern'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuantumEvolution;