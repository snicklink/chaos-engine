import { useEffect, useRef } from 'react';
import ChaosSynthesizer from '../core/ChaosSynthesizer';
import './mutations.css';

const DynamicChaos = ({ phase, intensity }) => {
  const containerRef = useRef(null);
  const synthesizerRef = useRef(null);
  
  useEffect(() => {
    if (!synthesizerRef.current) {
      synthesizerRef.current = new ChaosSynthesizer();
    }
    
    const container = containerRef.current;
    if (!container) return;
    
    // Clear previous chaos (or don't, for accumulation effect)
    if (phase === 'calm') {
      container.innerHTML = '';
    }
    
    // Run synthesis at intervals
    const synthesisInterval = setInterval(() => {
      synthesizerRef.current.synthesize(container, phase, intensity);
    }, 2000 - (intensity * 1500)); // Faster synthesis at higher intensity
    
    return () => {
      clearInterval(synthesisInterval);
    };
  }, [phase, intensity]);
  
  return (
    <div className="mutation-dynamic-chaos">
      <div 
        ref={containerRef} 
        className="chaos-container"
        style={{
          filter: `contrast(${1 + intensity * 0.5}) brightness(${1 - intensity * 0.2})`
        }}
      />
      
      <div className="chaos-overlay">
        <div className="chaos-metrics">
          <div className="metric">
            CHAOS LEVEL: {Math.floor(intensity * 100)}%
          </div>
          <div className="metric">
            SYNTHESIS ACTIVE: {phase.toUpperCase()}
          </div>
          <div className="metric">
            REALITY STABILITY: {Math.floor((1 - intensity) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicChaos;