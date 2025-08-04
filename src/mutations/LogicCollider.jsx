import { useState, useEffect } from 'react';
import './mutations.css';

const LogicCollider = ({ assets, phase, intensity }) => {
  const [collisionPoints, setCollisionPoints] = useState([]);
  
  useEffect(() => {
    // Generate collision points based on intensity
    const points = [];
    const count = Math.floor(intensity * 20) + 5;
    
    for (let i = 0; i < count; i++) {
      points.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 20,
        type: ['voice', 'combat', 'dialogue', 'quest'][Math.floor(Math.random() * 4)]
      });
    }
    
    setCollisionPoints(points);
  }, [intensity]);
  
  return (
    <div className="mutation-logic-collider">
      <div className="collision-field">
        {collisionPoints.map(point => (
          <div
            key={point.id}
            className={`collision-point type-${point.type}`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${point.size}px`,
              height: `${point.size}px`,
              opacity: 0.3 + (intensity * 0.7)
            }}
          />
        ))}
      </div>
      <div className="logic-overlay">
        LOGIC COLLISION IN PROGRESS...
      </div>
    </div>
  );
};

export default LogicCollider;