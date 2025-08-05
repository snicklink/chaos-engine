import { useState, useEffect, useRef, useCallback } from 'react';
import './mutations.css';

const NeuralCellularAutomata = ({ assetLibrary, phase, intensity, assets }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const cellGridRef = useRef(null);
  const assetTexturesRef = useRef([]);
  const [generation, setGeneration] = useState(0);
  const [aliveCount, setAliveCount] = useState(0);
  const [currentRule, setCurrentRule] = useState('Conway');

  // Grid dimensions (smaller for performance)
  const GRID_WIDTH = 80;
  const GRID_HEIGHT = 50;
  const CELL_SIZE = Math.min(window.innerWidth / GRID_WIDTH, window.innerHeight / GRID_HEIGHT);

  // Neural-enhanced rules
  const cellularRules = {
    Conway: { birth: [3], survival: [2, 3] },
    HighLife: { birth: [3, 6], survival: [2, 3] },
    DayNight: { birth: [3, 6, 7, 8], survival: [3, 4, 6, 7, 8] },
    Maze: { birth: [3], survival: [1, 2, 3, 4, 5] },
    Coral: { birth: [3], survival: [4, 5, 6, 7, 8] },
    AssetEater: { birth: [2, 4], survival: [1, 3, 5] },
    Explosive: { birth: [1, 3, 5, 7], survival: [1, 3, 5, 7] },
    Crystalline: { birth: [2, 3], survival: [1, 2, 3, 4] }
  };

  // Extract asset colors for cellular DNA
  const extractAssetColors = useCallback(() => {
    if (!assets) return [];
    
    const colors = [];
    
    // Use the curated color palette
    if (assetLibrary?.getCuratedManifest) {
      const manifest = assetLibrary.getCuratedManifest();
      if (manifest.colors) {
        // Sample random colors from the manifest
        for (let i = 0; i < 20; i++) {
          colors.push(manifest.colors[Math.floor(Math.random() * manifest.colors.length)]);
        }
      }
    }
    
    // Fallback colors if no manifest
    if (colors.length === 0) {
      colors.push('#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3');
    }
    
    return colors;
  }, [assets, assetLibrary]);

  // Initialize cellular automata grid
  const initializeGrid = useCallback(() => {
    const grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill().map(() => ({
      alive: Math.random() < 0.3, // 30% initial population
      age: 0,
      energy: Math.random(),
      color: extractAssetColors()[Math.floor(Math.random() * extractAssetColors().length)] || '#ffffff',
      dna: Math.random().toString(36).substring(7), // Random DNA string
      generation: 0
    })));
    
    cellGridRef.current = grid;
  }, [extractAssetColors]);

  // Count living neighbors with neural weighting
  const countNeighbors = (grid, x, y) => {
    let count = 0;
    let avgEnergy = 0;
    let energyCount = 0;
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = (x + dx + GRID_WIDTH) % GRID_WIDTH;
        const ny = (y + dy + GRID_HEIGHT) % GRID_HEIGHT;
        
        if (grid[ny][nx].alive) {
          count++;
          avgEnergy += grid[ny][nx].energy;
          energyCount++;
        }
      }
    }
    
    return {
      count,
      avgEnergy: energyCount > 0 ? avgEnergy / energyCount : 0
    };
  };

  // Evolve the cellular automata with neural enhancement
  const evolveGeneration = useCallback(() => {
    if (!cellGridRef.current) return;
    
    const oldGrid = cellGridRef.current;
    const newGrid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill().map(() => ({
      alive: false,
      age: 0,
      energy: 0,
      color: '#000000',
      dna: '',
      generation: 0
    })));
    
    const currentRuleSet = cellularRules[currentRule];
    let livingCells = 0;
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = oldGrid[y][x];
        const { count, avgEnergy } = countNeighbors(oldGrid, x, y);
        
        // Neural-enhanced survival logic
        const energyBonus = avgEnergy > 0.7 ? 1 : 0;
        const ageBonus = cell.age > 5 ? -1 : 0;
        const intensityBonus = intensity > 0.7 ? 1 : 0;
        const phaseBonus = phase === 'chaos' ? 2 : phase === 'build' ? 1 : 0;
        
        const effectiveCount = count + energyBonus + ageBonus + intensityBonus + phaseBonus;
        
        if (cell.alive) {
          // Survival rules
          if (currentRuleSet.survival.includes(effectiveCount)) {
            newGrid[y][x] = {
              alive: true,
              age: cell.age + 1,
              energy: Math.min(1, cell.energy + 0.1 * avgEnergy),
              color: cell.color,
              dna: cell.dna,
              generation: cell.generation + 1
            };
            livingCells++;
          }
        } else {
          // Birth rules
          if (currentRuleSet.birth.includes(effectiveCount)) {
            const colors = extractAssetColors();
            newGrid[y][x] = {
              alive: true,
              age: 0,
              energy: avgEnergy * 0.8 + Math.random() * 0.2,
              color: colors[Math.floor(Math.random() * colors.length)] || '#ffffff',
              dna: Math.random().toString(36).substring(7),
              generation: 0
            };
            livingCells++;
          }
        }
      }
    }
    
    cellGridRef.current = newGrid;
    setAliveCount(livingCells);
  }, [currentRule, intensity, phase, extractAssetColors]);

  // Render cellular automata to canvas
  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cellGridRef.current) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    );
    gradient.addColorStop(0, 'rgba(10, 10, 20, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render cells
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = cellGridRef.current[y][x];
        
        if (cell.alive) {
          const cellX = x * CELL_SIZE;
          const cellY = y * CELL_SIZE;
          
          // Cell color based on age and energy
          const alpha = Math.min(1, cell.energy + 0.3);
          const size = CELL_SIZE * (0.8 + cell.energy * 0.4);
          
          // Glow effect based on age
          if (cell.age > 3) {
            ctx.shadowColor = cell.color;
            ctx.shadowBlur = 10 + cell.age;
          } else {
            ctx.shadowBlur = 0;
          }
          
          // Draw cell
          ctx.fillStyle = cell.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          
          // Different shapes based on generation
          if (cell.generation > 10) {
            // Old cells become hexagonal
            const centerX = cellX + CELL_SIZE / 2;
            const centerY = cellY + CELL_SIZE / 2;
            const radius = size / 2;
            
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI) / 3;
              const px = centerX + radius * Math.cos(angle);
              const py = centerY + radius * Math.sin(angle);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
          } else if (cell.generation > 5) {
            // Medium cells become diamonds
            const centerX = cellX + CELL_SIZE / 2;
            const centerY = cellY + CELL_SIZE / 2;
            const halfSize = size / 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - halfSize);
            ctx.lineTo(centerX + halfSize, centerY);
            ctx.lineTo(centerX, centerY + halfSize);
            ctx.lineTo(centerX - halfSize, centerY);
            ctx.closePath();
          } else {
            // Young cells are circles
            ctx.arc(
              cellX + CELL_SIZE / 2,
              cellY + CELL_SIZE / 2,
              size / 2,
              0,
              Math.PI * 2
            );
          }
          
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [CELL_SIZE]);

  // Animation loop
  useEffect(() => {
    let frameCount = 0;
    const evolutionSpeed = Math.max(1, 10 - Math.floor(intensity * 8));
    
    const animate = () => {
      frameCount++;
      
      if (frameCount % evolutionSpeed === 0) {
        evolveGeneration();
        setGeneration(prev => prev + 1);
      }
      
      renderGrid();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [evolveGeneration, renderGrid, intensity]);

  // Change rules based on phase
  useEffect(() => {
    const ruleNames = Object.keys(cellularRules);
    let newRule;
    
    switch (phase) {
      case 'calm':
        newRule = ['Conway', 'Crystalline'][Math.floor(Math.random() * 2)];
        break;
      case 'build':
        newRule = ['HighLife', 'Maze'][Math.floor(Math.random() * 2)];
        break;
      case 'chaos':
        newRule = ['Explosive', 'AssetEater', 'DayNight'][Math.floor(Math.random() * 3)];
        break;
      case 'fade':
        newRule = ['Coral', 'Conway'][Math.floor(Math.random() * 2)];
        break;
      default:
        newRule = ruleNames[Math.floor(Math.random() * ruleNames.length)];
    }
    
    if (newRule !== currentRule) {
      setCurrentRule(newRule);
    }
  }, [phase, currentRule]);

  // Initialize
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  return (
    <div className="neural-cellular-automata">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, #0a0a14, #000000)'
        }}
      />
      
      {/* Controls overlay */}
      <div className="cellular-controls">
        <button 
          onClick={initializeGrid}
          className="cellular-button"
        >
          🧬 RESET EVOLUTION
        </button>
        
        <button 
          onClick={() => {
            const rules = Object.keys(cellularRules);
            const newRule = rules[Math.floor(Math.random() * rules.length)];
            setCurrentRule(newRule);
          }}
          className="cellular-button"
        >
          🔄 MUTATE RULES
        </button>
      </div>
      
      {/* Info display */}
      <div className="mutation-info cellular-info">
        <h3>NEURAL CELLULAR AUTOMATA</h3>
        <p>Self-evolving digital organisms with asset DNA</p>
        <div className="mutation-stats">
          <span>GEN: {generation}</span>
          <span>ALIVE: {aliveCount}</span>
          <span>RULE: {currentRule}</span>
          <span>INTENSITY: {Math.floor(intensity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default NeuralCellularAutomata;