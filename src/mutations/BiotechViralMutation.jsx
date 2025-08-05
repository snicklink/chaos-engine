import { useState, useEffect, useRef, useCallback } from 'react';
import './mutations.css';

const BiotechViralMutation = ({ assetLibrary, phase, intensity, assets }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const organismsRef = useRef([]);
  const [viralLoad, setViralLoad] = useState(0);
  const [mutationRate, setMutationRate] = useState(0);
  const [evolutionStage, setEvolutionStage] = useState('infection');
  const [organicComplexity, setOrganicComplexity] = useState(1);

  // Biological parameters
  const MAX_ORGANISMS = 200 + Math.floor(intensity * 500);
  const GROWTH_RATE = 0.01 + intensity * 0.05;
  const MUTATION_PROBABILITY = 0.1 + intensity * 0.4;
  const DIVISION_THRESHOLD = 50 + intensity * 100;

  // Evolution stages
  const evolutionStages = {
    infection: { color: '#00ff00', growth: 1.0, aggression: 0.2 },
    replication: { color: '#88ff00', growth: 1.5, aggression: 0.5 },
    mutation: { color: '#ffff00', growth: 2.0, aggression: 0.8 },
    adaptation: { color: '#ff8800', growth: 1.8, aggression: 1.0 },
    transcendence: { color: '#ff0088', growth: 2.5, aggression: 1.5 }
  };

  // Get organic asset data
  const getOrganicAssets = useCallback(() => {
    if (!assets || !assetLibrary) return [];
    
    const organicAssets = [];
    
    Object.keys(assets).forEach(project => {
      // Use images as genetic material
      if (assets[project].images) {
        assets[project].images.slice(0, 10).forEach(img => {
          organicAssets.push({
            type: 'image',
            url: img.url || img,
            project,
            name: img.name || 'unknown'
          });
        });
      }
      
      // Text as DNA sequences
      if (assets[project].text) {
        assets[project].text.slice(0, 5).forEach(txt => {
          organicAssets.push({
            type: 'text',
            content: txt.content || txt,
            project,
            name: txt.name || 'unknown'
          });
        });
      }
    });
    
    return organicAssets;
  }, [assets, assetLibrary]);

  // Organic Organism class
  class OrganicOrganism {
    constructor(x, y, geneticMaterial, generation = 0) {
      this.position = { x, y };
      this.velocity = { x: 0, y: 0 };
      this.size = 5 + Math.random() * 15;
      this.maxSize = 20 + Math.random() * 80;
      this.age = 0;
      this.energy = 50 + Math.random() * 50;
      this.generation = generation;
      this.geneticMaterial = geneticMaterial;
      this.dna = this.generateDNA();
      this.color = this.getDNAColor();
      this.organType = this.determineOrganType();
      this.isAlive = true;
      this.reproduced = false;
      this.mutationStrain = Math.floor(Math.random() * 5);
      this.pulsation = Math.random() * Math.PI * 2;
      this.tendrils = [];
      this.sporeCount = 0;
      
      // Create organic tendrils
      this.createTendrils();
    }

    generateDNA() {
      const bases = ['A', 'T', 'G', 'C'];
      let dna = '';
      for (let i = 0; i < 20; i++) {
        dna += bases[Math.floor(Math.random() * bases.length)];
      }
      return dna;
    }

    getDNAColor() {
      const stage = evolutionStages[evolutionStage];
      const r = parseInt(stage.color.substr(1, 2), 16);
      const g = parseInt(stage.color.substr(3, 2), 16);
      const b = parseInt(stage.color.substr(5, 2), 16);
      
      // Mutate color based on DNA
      const mutation = this.dna.split('').reduce((sum, base) => {
        return sum + base.charCodeAt(0);
      }, 0) % 100;
      
      return `rgb(${Math.min(255, r + mutation)}, ${Math.min(255, g + mutation/2)}, ${Math.min(255, b + mutation/3)})`;
    }

    determineOrganType() {
      const dnaScore = this.dna.split('').reduce((sum, base) => {
        return sum + base.charCodeAt(0);
      }, 0);
      
      if (dnaScore % 5 === 0) return 'spore';
      if (dnaScore % 3 === 0) return 'tendril';
      if (dnaScore % 2 === 0) return 'membrane';
      return 'nucleus';
    }

    createTendrils() {
      const tendrilCount = 3 + Math.floor(this.size / 10);
      for (let i = 0; i < tendrilCount; i++) {
        this.tendrils.push({
          angle: (Math.PI * 2 * i) / tendrilCount,
          length: this.size * 0.5 + Math.random() * this.size,
          thickness: 1 + Math.random() * 3,
          growth: Math.random() * 0.1
        });
      }
    }

    grow() {
      if (this.size < this.maxSize && this.energy > 20) {
        const growthAmount = GROWTH_RATE * evolutionStages[evolutionStage].growth;
        this.size += growthAmount;
        this.energy -= growthAmount * 0.5;
        
        // Grow tendrils
        this.tendrils.forEach(tendril => {
          tendril.length += tendril.growth;
          tendril.thickness += tendril.growth * 0.1;
        });
      }
    }

    metabolize() {
      // Basic energy consumption
      this.energy -= 0.1;
      this.age++;
      
      // Pulsation for organic feel
      this.pulsation += 0.1;
      
      // Death conditions
      if (this.energy <= 0 || this.age > 1000) {
        this.isAlive = false;
      }
    }

    move() {
      // Organic movement patterns
      const noise = {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      };
      
      this.velocity.x += noise.x;
      this.velocity.y += noise.y;
      
      // Damping
      this.velocity.x *= 0.9;
      this.velocity.y *= 0.9;
      
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      
      // Wrap around
      const canvas = canvasRef.current;
      if (canvas) {
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
        if (this.position.y > canvas.height) this.position.y = 0;
      }
    }

    reproduce() {
      if (this.size > DIVISION_THRESHOLD && this.energy > 70 && !this.reproduced) {
        this.reproduced = true;
        this.energy /= 2;
        this.size *= 0.8;
        
        // Create offspring with potential mutations
        const offspring = new OrganicOrganism(
          this.position.x + (Math.random() - 0.5) * 50,
          this.position.y + (Math.random() - 0.5) * 50,
          this.geneticMaterial,
          this.generation + 1
        );
        
        // Mutation chance
        if (Math.random() < MUTATION_PROBABILITY) {
          offspring.mutate();
        }
        
        return offspring;
      }
      return null;
    }

    mutate() {
      // DNA mutation
      const mutationPoint = Math.floor(Math.random() * this.dna.length);
      const newBase = ['A', 'T', 'G', 'C'][Math.floor(Math.random() * 4)];
      this.dna = this.dna.substring(0, mutationPoint) + newBase + this.dna.substring(mutationPoint + 1);
      
      // Physical mutations
      this.maxSize *= 0.8 + Math.random() * 0.4;
      this.color = this.getDNAColor();
      this.mutationStrain = (this.mutationStrain + 1) % 10;
      
      // Tendril mutations
      this.tendrils.forEach(tendril => {
        tendril.length *= 0.5 + Math.random();
        tendril.thickness *= 0.5 + Math.random();
      });
    }

    infectNearby(organisms) {
      const infectionRadius = this.size * 2;
      
      organisms.forEach(other => {
        if (other !== this && other.isAlive) {
          const distance = Math.sqrt(
            (this.position.x - other.position.x) ** 2 + 
            (this.position.y - other.position.y) ** 2
          );
          
          if (distance < infectionRadius && Math.random() < 0.05) {
            // Energy transfer
            const energyTransfer = 5;
            this.energy += energyTransfer;
            other.energy -= energyTransfer;
            
            // Genetic material exchange
            if (Math.random() < 0.1) {
              const midpoint = Math.floor(this.dna.length / 2);
              const newDNA = this.dna.substring(0, midpoint) + other.dna.substring(midpoint);
              other.dna = newDNA;
              other.color = other.getDNAColor();
            }
          }
        }
      });
    }

    render(ctx) {
      if (!this.isAlive) return;
      
      const pulseSize = this.size + Math.sin(this.pulsation) * 3;
      const alpha = Math.min(1, this.energy / 100);
      
      // Draw organism body based on type
      ctx.globalAlpha = alpha;
      
      switch (this.organType) {
        case 'nucleus':
          this.renderNucleus(ctx, pulseSize);
          break;
        case 'membrane':
          this.renderMembrane(ctx, pulseSize);
          break;
        case 'spore':
          this.renderSpore(ctx, pulseSize);
          break;
        case 'tendril':
          this.renderTendrilOrganism(ctx, pulseSize);
          break;
      }
      
      // Draw tendrils
      this.renderTendrils(ctx);
      
      ctx.globalAlpha = 1;
    }

    renderNucleus(ctx, size) {
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
    }

    renderMembrane(ctx, size) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, size, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = this.color + '20';
      ctx.fill();
      
      ctx.shadowBlur = 0;
    }

    renderSpore(ctx, size) {
      ctx.fillStyle = this.color;
      
      // Multiple small circles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const x = this.position.x + Math.cos(angle) * size * 0.3;
        const y = this.position.y + Math.sin(angle) * size * 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    renderTendrilOrganism(ctx, size) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = size * 0.1;
      
      ctx.beginPath();
      ctx.moveTo(this.position.x - size, this.position.y);
      ctx.quadraticCurveTo(
        this.position.x, 
        this.position.y - size,
        this.position.x + size, 
        this.position.y
      );
      ctx.quadraticCurveTo(
        this.position.x, 
        this.position.y + size,
        this.position.x - size, 
        this.position.y
      );
      ctx.stroke();
    }

    renderTendrils(ctx) {
      ctx.strokeStyle = this.color + '80';
      
      this.tendrils.forEach((tendril, index) => {
        ctx.lineWidth = tendril.thickness;
        
        const endX = this.position.x + Math.cos(tendril.angle + this.pulsation * 0.1) * tendril.length;
        const endY = this.position.y + Math.sin(tendril.angle + this.pulsation * 0.1) * tendril.length;
        
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Tendril tips
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(endX, endY, tendril.thickness, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Initialize organism colony
  const initializeOrganisms = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const organicAssets = getOrganicAssets();
    const organisms = [];

    for (let i = 0; i < Math.min(50, MAX_ORGANISMS / 4); i++) {
      const asset = organicAssets[Math.floor(Math.random() * organicAssets.length)];
      organisms.push(new OrganicOrganism(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        asset
      ));
    }

    organismsRef.current = organisms;
    setViralLoad(organisms.length);
  }, [MAX_ORGANISMS, getOrganicAssets]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const organisms = organismsRef.current;

    // Clear with organic fade
    ctx.fillStyle = 'rgba(0, 10, 5, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const newOrganisms = [];
    let totalMutations = 0;

    organisms.forEach(organism => {
      if (organism.isAlive) {
        organism.grow();
        organism.move();
        organism.metabolize();
        organism.infectNearby(organisms);
        organism.render(ctx);

        // Reproduction
        const offspring = organism.reproduce();
        if (offspring) {
          newOrganisms.push(offspring);
        }

        if (organism.mutationStrain > 0) {
          totalMutations++;
        }
      }
    });

    // Add new organisms
    organisms.push(...newOrganisms);

    // Remove dead organisms
    organismsRef.current = organisms.filter(org => org.isAlive);

    // Update stats
    setViralLoad(organismsRef.current.length);
    setMutationRate(totalMutations / Math.max(1, organismsRef.current.length));

    // Evolution stage progression
    if (organismsRef.current.length < 50) setEvolutionStage('infection');
    else if (organismsRef.current.length < 150) setEvolutionStage('replication');
    else if (mutationRate > 0.3) setEvolutionStage('mutation');
    else if (organismsRef.current.length > 300) setEvolutionStage('adaptation');
    else if (organismsRef.current.length > 500) setEvolutionStage('transcendence');

    setOrganicComplexity(Math.min(5, Math.floor(organismsRef.current.length / 100) + 1));

    animationRef.current = requestAnimationFrame(animate);
  }, [mutationRate]);

  // Initialize and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeOrganisms();
    }
  }, [initializeOrganisms]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="biotech-viral-mutation">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, #000a05, #000000)'
        }}
      />

      {/* Biotech controls */}
      <div className="biotech-controls">
        <button 
          onClick={initializeOrganisms}
          className="biotech-button"
        >
          🧬 SEED COLONY
        </button>
        
        <button 
          onClick={() => {
            organismsRef.current.forEach(org => {
              if (Math.random() < 0.5) org.mutate();
            });
          }}
          className="biotech-button"
        >
          ☢️ IRRADIATE
        </button>
        
        <button 
          onClick={() => {
            organismsRef.current = organismsRef.current.filter(() => Math.random() > 0.5);
          }}
          className="biotech-button"
        >
          🔥 STERILIZE
        </button>
      </div>

      {/* Info display */}
      <div className="mutation-info biotech-info">
        <h3>BIOTECH VIRAL MUTATION</h3>
        <p>Organic digital life forms evolving in real-time</p>
        <div className="mutation-stats">
          <span>VIRAL LOAD: {viralLoad}</span>
          <span>STAGE: {evolutionStage.toUpperCase()}</span>
          <span>MUTATIONS: {Math.floor(mutationRate * 100)}%</span>
          <span>COMPLEXITY: {organicComplexity}</span>
        </div>
      </div>
    </div>
  );
};

export default BiotechViralMutation;