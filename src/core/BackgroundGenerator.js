// BACKGROUND GENERATOR - Dynamic background creation system
// Creates diverse, animated backgrounds based on phase and intensity

class BackgroundGenerator {
  constructor() {
    this.patterns = {
      // Organic patterns
      organic: [
        this.generateNoise,
        this.generateWaves,
        this.generateBlobs,
        this.generateClouds,
        this.generatePlasma
      ],
      // Geometric patterns
      geometric: [
        this.generateGrid,
        this.generateHexagons,
        this.generateTriangles,
        this.generateCircles,
        this.generateSquares,
        this.generateDiamonds
      ],
      // Artistic patterns
      artistic: [
        this.generateGradientMesh,
        this.generatePaint,
        this.generateGlitch,
        this.generateMatrix,
        this.generateAscii
      ],
      // Dynamic patterns
      dynamic: [
        this.generateParticles,
        this.generateFlowField,
        this.generateWarp,
        this.generateKaleidoscope,
        this.generateFractal
      ]
    };
    
    this.colorPalettes = {
      calm: [
        ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A'],
        ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5'],
        ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726'],
        ['#FCE4EC', '#F8BBD0', '#F48FB1', '#F06292', '#EC407A']
      ],
      build: [
        ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
        ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'],
        ['#7209B7', '#560BAD', '#480CA8', '#3A0CA3', '#3F37C9'],
        ['#F72585', '#B5179E', '#7209B7', '#560BAD', '#480CA8']
      ],
      chaos: [
        ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
        ['#FF10F0', '#39FF14', '#FF073A', '#04E762', '#FE019A'],
        ['#DAFF0D', '#FF0490', '#0DFFAE', '#FF7A00', '#00F5FF'],
        ['#FF124F', '#FF00A0', '#FE75FE', '#7A04EB', '#120458']
      ],
      fade: [
        ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a'],
        ['#0f0f0f', '#1f1f1f', '#2f2f2f', '#3f3f3f', '#4f4f4f'],
        ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
        ['#2B2D42', '#3A3D5C', '#494D76', '#585D90', '#676DAA']
      ]
    };
  }
  
  generateBackground(phase = 'calm', intensity = 0.5, assetLibrary = null) {
    // Select pattern category based on phase
    const categories = this.getCategories(phase, intensity);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const patterns = this.patterns[category];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Get color palette
    const palettes = this.colorPalettes[phase];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    
    // Generate background
    return pattern.call(this, palette, intensity, phase, assetLibrary);
  }
  
  getCategories(phase, intensity) {
    switch(phase) {
      case 'calm':
        return ['organic', 'geometric'];
      case 'build':
        return ['geometric', 'artistic'];
      case 'chaos':
        return ['dynamic', 'artistic'];
      case 'fade':
        return ['organic', 'artistic'];
      default:
        return ['organic'];
    }
  }
  
  // ORGANIC PATTERNS
  
  generateNoise(palette, intensity) {
    const layers = Math.floor(intensity * 3) + 2;
    const gradients = [];
    
    for (let i = 0; i < layers; i++) {
      const angle = Math.random() * 360;
      const color1 = palette[i % palette.length];
      const color2 = palette[(i + 1) % palette.length];
      const offset = Math.random() * 100;
      
      gradients.push(`linear-gradient(${angle}deg, ${color1}88 ${offset}%, ${color2}88 ${offset + 20}%)`);
    }
    
    return {
      background: gradients.join(', '),
      backgroundSize: `${100 + intensity * 200}% ${100 + intensity * 200}%`,
      animation: `backgroundMove ${20 - intensity * 10}s ease-in-out infinite`,
      filter: `blur(${intensity * 2}px)`
    };
  }
  
  generateWaves(palette, intensity) {
    const svg = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waves" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
            <path d="M0,50 Q50,${30 - intensity * 20} 100,50 T200,50" 
                  stroke="${palette[0]}" 
                  stroke-width="${2 + intensity * 3}" 
                  fill="none" 
                  opacity="0.6"/>
            <path d="M0,70 Q50,${50 + intensity * 20} 100,70 T200,70" 
                  stroke="${palette[1]}" 
                  stroke-width="${2 + intensity * 3}" 
                  fill="none" 
                  opacity="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="${palette[4]}"/>
        <rect width="100%" height="100%" fill="url(#waves)"/>
      </svg>
    `;
    
    return {
      background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: 'cover',
      animation: `waveMove ${15 - intensity * 10}s linear infinite`
    };
  }
  
  generateBlobs(palette, intensity) {
    const blobs = [];
    const count = Math.floor(intensity * 5) + 3;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 20 + Math.random() * 40;
      const color = palette[i % palette.length];
      
      blobs.push(`radial-gradient(circle at ${x}% ${y}%, ${color}66 0%, transparent ${size}%)`);
    }
    
    return {
      background: blobs.join(', '), 
      backgroundSize: '100% 100%',
      animation: `blobMove ${20 - intensity * 10}s ease-in-out infinite`,
      filter: `blur(${intensity * 5}px)`
    };
  }
  
  generateClouds(palette, intensity) {
    const layers = [];
    
    for (let i = 0; i < 3; i++) {
      const opacity = 0.1 + (i * 0.1);
      const blur = 20 + (i * 10);
      layers.push(`radial-gradient(ellipse ${100 + i * 50}% ${50 + i * 25}% at ${50 + i * 10}% ${50 - i * 10}%, 
        ${palette[i]}${Math.floor(opacity * 255).toString(16)} 0%, 
        transparent ${40 + i * 20}%)`);
    }
    
    return {
      background: `${palette[4]}, ${layers.join(', ')}`,
      animation: `cloudDrift ${30 - intensity * 15}s ease-in-out infinite`,
      filter: `contrast(${1 + intensity * 0.5})`
    };
  }
  
  generatePlasma(palette, intensity) {
    const gradients = [];
    
    for (let i = 0; i < 4; i++) {
      const angle = i * 90 + Math.random() * 45;
      const pos = 25 + (i * 25);
      gradients.push(`linear-gradient(${angle}deg, 
        transparent ${pos - 10}%, 
        ${palette[i]} ${pos}%, 
        transparent ${pos + 10}%)`);
    }
    
    return {
      background: `${palette[4]}, ${gradients.join(', ')}`,
      backgroundSize: `${200 + intensity * 100}% ${200 + intensity * 100}%`,
      animation: `plasmaFlow ${15 - intensity * 10}s linear infinite`,
      mixBlendMode: 'screen'
    };
  }
  
  // GEOMETRIC PATTERNS
  
  generateGrid(palette, intensity) {
    const size = Math.max(20, 60 - intensity * 40);
    const strokeWidth = 1 + intensity * 2;
    
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${palette[4]}"/>
        <path d="M ${size} 0 L 0 0 0 ${size}" 
              fill="none" 
              stroke="${palette[0]}" 
              stroke-width="${strokeWidth}"/>
      </svg>
    `;
    
    return {
      background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: `${size}px ${size}px`,
      animation: `gridShift ${20 - intensity * 10}s linear infinite`
    };
  }
  
  generateHexagons(palette, intensity) {
    const size = 60 - intensity * 30;
    const svg = `
      <svg width="${size * 2}" height="${size * 1.73}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" width="${size * 2}" height="${size * 1.73}" patternUnits="userSpaceOnUse">
            <polygon points="${size},0 ${size * 1.5},${size * 0.433} ${size * 1.5},${size * 1.3} ${size},${size * 1.73} ${size * 0.5},${size * 1.3} ${size * 0.5},${size * 0.433}"
                     fill="none" 
                     stroke="${palette[1]}" 
                     stroke-width="2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="${palette[4]}"/>
        <rect width="100%" height="100%" fill="url(#hex)"/>
      </svg>
    `;
    
    return {
      background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: `${size * 2}px ${size * 1.73}px`,
      animation: `hexRotate ${25 - intensity * 15}s linear infinite`
    };
  }
  
  generateTriangles(palette, intensity) {
    const triangles = [];
    const count = Math.floor(intensity * 10) + 5;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 5 + Math.random() * 15;
      const rotation = Math.random() * 360;
      const color = palette[i % palette.length];
      
      triangles.push(`conic-gradient(from ${rotation}deg at ${x}% ${y}%, 
        ${color} 0deg, ${color} 120deg, 
        transparent 120deg, transparent 240deg,
        ${color} 240deg, ${color} 360deg)`);
    }
    
    return {
      background: `${palette[4]}, ${triangles.join(', ')}`,
      backgroundSize: '100% 100%',
      animation: `triangleSpin ${20 - intensity * 10}s linear infinite`
    };
  }
  
  generateCircles(palette, intensity) {
    const circles = [];
    const rows = Math.floor(intensity * 5) + 3;
    const cols = Math.floor(intensity * 5) + 3;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col / (cols - 1)) * 100;
        const y = (row / (rows - 1)) * 100;
        const size = 2 + intensity * 5;
        const color = palette[(row + col) % palette.length];
        
        circles.push(`radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${size}%)`);
      }
    }
    
    return {
      background: `${palette[4]}, ${circles.join(', ')}`,
      animation: `circlePulse ${15 - intensity * 10}s ease-in-out infinite`
    };
  }
  
  generateSquares(palette, intensity) {
    const squares = [];
    const count = Math.floor(intensity * 8) + 4;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 5 + Math.random() * 20;
      const rotation = Math.random() * 45;
      const color = palette[i % palette.length];
      
      squares.push(`linear-gradient(${rotation}deg, 
        transparent ${x - size}%, 
        ${color} ${x - size}%, 
        ${color} ${x + size}%, 
        transparent ${x + size}%)`);
    }
    
    return {
      background: squares.join(', '),
      backgroundSize: '100% 100%',
      animation: `squareShift ${20 - intensity * 10}s ease-in-out infinite`
    };
  }
  
  generateDiamonds(palette, intensity) {
    const size = 40 - intensity * 20;
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${palette[4]}" transform="rotate(45 ${size/2} ${size/2})"/>
        <rect width="${size * 0.7}" height="${size * 0.7}" 
              fill="${palette[0]}" 
              transform="rotate(45 ${size/2} ${size/2})" 
              x="${size * 0.15}" 
              y="${size * 0.15}"/>
      </svg>
    `;
    
    return {
      background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: `${size}px ${size}px`,
      animation: `diamondFloat ${25 - intensity * 15}s ease-in-out infinite`
    };
  }
  
  // ARTISTIC PATTERNS
  
  generateGradientMesh(palette, intensity) {
    const stops = [];
    const positions = [];
    
    for (let i = 0; i < palette.length; i++) {
      const angle = (i / palette.length) * 360;
      const distance = 30 + intensity * 40;
      const x = 50 + Math.cos(angle * Math.PI / 180) * distance;
      const y = 50 + Math.sin(angle * Math.PI / 180) * distance;
      
      positions.push(`radial-gradient(circle at ${x}% ${y}%, ${palette[i]} 0%, transparent 50%)`);
    }
    
    return {
      background: positions.join(', '),
      backgroundSize: '100% 100%',
      animation: `meshRotate ${30 - intensity * 20}s linear infinite`,
      filter: `blur(${intensity * 3}px)`
    };
  }
  
  generatePaint(palette, intensity) {
    const strokes = [];
    const count = Math.floor(intensity * 15) + 5;
    
    for (let i = 0; i < count; i++) {
      const x1 = Math.random() * 100;
      const y1 = Math.random() * 100;
      const x2 = x1 + (Math.random() - 0.5) * 50;
      const y2 = y1 + (Math.random() - 0.5) * 50;
      const width = 1 + Math.random() * 5;
      const color = palette[i % palette.length];
      
      strokes.push(`linear-gradient(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg,
        transparent ${Math.min(x1, x2) - width}%,
        ${color}88 ${Math.min(x1, x2)}%,
        ${color}88 ${Math.max(x1, x2)}%,
        transparent ${Math.max(x1, x2) + width}%)`);
    }
    
    return {
      background: `${palette[4]}22, ${strokes.join(', ')}`,
      backgroundSize: '100% 100%',
      animation: `paintFlow ${20 - intensity * 10}s ease-in-out infinite`
    };
  }
  
  generateGlitch(palette, intensity) {
    const glitches = [];
    const count = Math.floor(intensity * 20) + 5;
    
    for (let i = 0; i < count; i++) {
      const y = Math.random() * 100;
      const height = 0.5 + Math.random() * 2;
      const offset = (Math.random() - 0.5) * 10;
      const color = palette[i % palette.length];
      
      glitches.push(`linear-gradient(90deg,
        transparent ${y - height}%,
        ${color} ${y - height}%,
        ${color} ${y + height}%,
        transparent ${y + height}%) ${offset}% 0`);
    }
    
    return {
      background: `${palette[4]}, ${glitches.join(', ')}`,
      backgroundSize: '100% 100%',
      animation: `glitchShift ${0.5 + intensity}s steps(5) infinite`
    };
  }
  
  generateMatrix(palette, intensity) {
    const chars = '01';
    const svg = `
      <svg width="20" height="30" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="20" 
              font-family="monospace" 
              font-size="16" 
              fill="${palette[1]}" 
              text-anchor="middle">${chars[Math.floor(Math.random() * chars.length)]}</text>
      </svg>
    `;
    
    return {
      background: `${palette[4]}, url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: '20px 30px',
      animation: `matrixRain ${10 - intensity * 5}s linear infinite`
    };
  }
  
  generateAscii(palette, intensity) {
    const chars = ['@', '#', '%', '&', '*', '+', '=', '-'];
    const charGrid = [];
    const size = 20 - intensity * 10;
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const color = palette[(i + j) % palette.length];
        const x = j * 20;
        const y = i * 20;
        
        charGrid.push(`<text x="${x + 10}" y="${y + 15}" 
                            font-family="monospace" 
                            font-size="${size}" 
                            fill="${color}" 
                            text-anchor="middle">${char}</text>`);
      }
    }
    
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${palette[4]}"/>
        ${charGrid.join('')}
      </svg>
    `;
    
    return {
      background: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: '100px 100px',
      animation: `asciiType ${5 - intensity * 3}s steps(8) infinite`
    };
  }
  
  // DYNAMIC PATTERNS
  
  generateParticles(palette, intensity) {
    const particles = [];
    const count = Math.floor(intensity * 30) + 10;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 0.5 + Math.random() * 2;
      const color = palette[i % palette.length];
      const delay = Math.random() * 5;
      
      particles.push(`radial-gradient(circle at ${x}% ${y}%, 
        ${color} 0%, 
        transparent ${size}%) no-repeat`);
    }
    
    return {
      background: `${palette[4]}, ${particles.join(', ')}`,
      backgroundSize: '100% 100%',
      animation: `particleFloat ${20 - intensity * 10}s ease-in-out infinite`
    };
  }
  
  generateFlowField(palette, intensity) {
    const flows = [];
    const streams = Math.floor(intensity * 8) + 3;
    
    for (let i = 0; i < streams; i++) {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const curve = (Math.random() - 0.5) * 100;
      const color = palette[i % palette.length];
      
      flows.push(`linear-gradient(${Math.random() * 360}deg,
        transparent ${startX - 5}%,
        ${color}44 ${startX}%,
        ${color}44 ${startX + curve}%,
        transparent ${startX + curve + 5}%)`);
    }
    
    return {
      background: flows.join(', '),
      backgroundSize: `${100 + intensity * 100}% ${100 + intensity * 100}%`,
      animation: `flowMove ${15 - intensity * 10}s linear infinite`
    };
  }
  
  generateWarp(palette, intensity) {
    const center = { x: 50, y: 50 };
    const rings = [];
    const count = Math.floor(intensity * 10) + 5;
    
    for (let i = 0; i < count; i++) {
      const radius = (i / count) * 70;
      const width = 2 + intensity * 3;
      const color = palette[i % palette.length];
      
      rings.push(`radial-gradient(circle at ${center.x}% ${center.y}%,
        transparent ${radius - width}%,
        ${color} ${radius}%,
        transparent ${radius + width}%)`);
    }
    
    return {
      background: `${palette[4]}, ${rings.join(', ')}`,
      backgroundSize: '100% 100%',
      animation: `warpPulse ${10 - intensity * 5}s ease-in-out infinite`,
      filter: `blur(${intensity}px)`
    };
  }
  
  generateKaleidoscope(palette, intensity) {
    const segments = Math.floor(intensity * 6) + 3;
    const gradients = [];
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * 360;
      const color1 = palette[i % palette.length];
      const color2 = palette[(i + 1) % palette.length];
      
      gradients.push(`conic-gradient(from ${angle}deg at 50% 50%,
        ${color1} 0deg,
        ${color2} ${360 / segments}deg,
        transparent ${360 / segments}deg)`);
    }
    
    return {
      background: gradients.join(', '),
      backgroundSize: '100% 100%',
      animation: `kaleidoRotate ${20 - intensity * 15}s linear infinite`
    };
  }
  
  generateFractal(palette, intensity) {
    const iterations = Math.floor(intensity * 5) + 2;
    const fractals = [];
    
    const createFractal = (x, y, size, depth) => {
      if (depth <= 0) return;
      
      const color = palette[depth % palette.length];
      fractals.push(`radial-gradient(circle at ${x}% ${y}%, 
        ${color}66 0%, 
        transparent ${size}%)`);
      
      const newSize = size * 0.5;
      const offset = size * 0.5;
      
      createFractal(x - offset, y - offset, newSize, depth - 1);
      createFractal(x + offset, y - offset, newSize, depth - 1);
      createFractal(x - offset, y + offset, newSize, depth - 1);
      createFractal(x + offset, y + offset, newSize, depth - 1);
    };
    
    createFractal(50, 50, 30, iterations);
    
    return {
      background: `${palette[4]}, ${fractals.join(', ')}`,
      backgroundSize: '100% 100%',
      animation: `fractalZoom ${25 - intensity * 15}s ease-in-out infinite`
    };
  }
}

export default BackgroundGenerator;