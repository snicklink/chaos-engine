import { useState, useEffect } from 'react';
import './mutations.css';

const GenreFracture = ({ assets, phase, intensity }) => {
  const [genres, setGenres] = useState([]);
  const [fractureLines, setFractureLines] = useState([]);
  
  useEffect(() => {
    // Create genre fragments
    const genreTypes = [
      { name: 'LIFE COACH', color: '#4fc3f7', icon: '🧘' },
      { name: 'PACKAGE DELIVERY', color: '#ff6b6b', icon: '📦' },
      { name: 'FIGHTING GAME', color: '#ff9800', icon: '👊' },
      { name: 'VOICE CONTROLLED', color: '#9c27b0', icon: '🎤' },
      { name: 'SITCOM GENERATOR', color: '#4caf50', icon: '📺' },
      { name: 'STREAM OVERLAY', color: '#e91e63', icon: '🎮' }
    ];
    
    const activeGenres = genreTypes.slice(0, Math.floor(intensity * genreTypes.length) + 2);
    
    const positioned = activeGenres.map((genre, i) => ({
      ...genre,
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotation: Math.random() * 360,
      scale: 0.5 + (intensity * 1.5)
    }));
    
    setGenres(positioned);
    
    // Create fracture lines between genres
    const lines = [];
    for (let i = 0; i < positioned.length - 1; i++) {
      for (let j = i + 1; j < positioned.length; j++) {
        if (Math.random() < intensity) {
          lines.push({
            id: `${i}-${j}`,
            x1: positioned[i].x,
            y1: positioned[i].y,
            x2: positioned[j].x,
            y2: positioned[j].y
          });
        }
      }
    }
    
    setFractureLines(lines);
  }, [phase, intensity]);
  
  return (
    <div className="mutation-genre-fracture">
      {/* Fracture lines */}
      <svg className="fracture-svg">
        {fractureLines.map(line => (
          <line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke={phase === 'chaos' ? '#ff0000' : '#ffffff'}
            strokeWidth={intensity * 3}
            opacity={0.3 + intensity * 0.4}
            strokeDasharray={phase === 'build' ? '5,5' : '0'}
          />
        ))}
      </svg>
      
      {/* Genre fragments */}
      {genres.map(genre => (
        <div
          key={genre.id}
          className="genre-fragment"
          style={{
            left: `${genre.x}%`,
            top: `${genre.y}%`,
            transform: `rotate(${genre.rotation}deg) scale(${genre.scale})`,
            backgroundColor: genre.color,
            boxShadow: `0 0 ${intensity * 30}px ${genre.color}`
          }}
        >
          <div className="genre-icon">{genre.icon}</div>
          <div className="genre-name">{genre.name}</div>
        </div>
      ))}
      
      {/* Chaos overlay text */}
      {phase === 'chaos' && (
        <div className="fracture-message">
          GENRE BOUNDARIES DISSOLVING...
        </div>
      )}
    </div>
  );
};

export default GenreFracture;