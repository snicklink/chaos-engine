import { useEffect, useRef } from 'react';
import './mutations.css';

const AestheticFusion = ({ assets, phase, intensity }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let animationId;
    let lastTime = 0;
    const targetFPS = 30; // Throttle to 30 FPS
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > frameInterval) {
        // Create aesthetic fusion effect
        ctx.fillStyle = `rgba(0, 0, 0, ${0.1 - intensity * 0.09})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw fusion elements - CAPPED
        const elements = Math.min(30, Math.floor(intensity * 30) + 10); // Cap at 30
        
        for (let i = 0; i < elements; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 50 * intensity;
          const hue = (Date.now() * 0.01 + i * 30) % 360;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${0.2 + intensity * 0.3})`;
          ctx.fill();
          
          if (phase === 'chaos') {
            ctx.strokeStyle = `hsla(${hue + 180}, 100%, 50%, ${intensity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
        
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // CLEANUP to prevent memory leak
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [phase, intensity]);
  
  return (
    <div className="mutation-aesthetic-fusion">
      <canvas ref={canvasRef} className="fusion-canvas" />
      <div className="fusion-text">
        {phase === 'calm' && 'AESTHETIC CALIBRATION...'}
        {phase === 'build' && 'FUSION ACCELERATING...'}
        {phase === 'chaos' && 'MAXIMUM AESTHETIC OVERLOAD'}
        {phase === 'fade' && 'AESTHETIC COLLAPSE...'}
      </div>
    </div>
  );
};

export default AestheticFusion;