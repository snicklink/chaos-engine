import { useState, useEffect, useRef, useCallback } from 'react';
import chaosRandomizer from '../core/ChaosRandomizer';
import './mutations.css';

const ParticleSwarmIntelligence = ({ assetLibrary, phase, intensity, assets }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const attractorsRef = useRef([]);
  const [particleCount, setParticleCount] = useState(0);
  const [swarmBehavior, setSwarmBehavior] = useState('flock');
  const [emergentPattern, setEmergentPattern] = useState('none');

  // Particle system parameters - MORE PARTICLES!
  const MAX_PARTICLES = 1000 + Math.floor(intensity * 2000); // Min 1000 particles
  const PARTICLE_SPEED = 1 + intensity * 3;
  const PERCEPTION_RADIUS = 30 + intensity * 50;
  const SEPARATION_FORCE = 0.5 + intensity * 1.5;
  const ALIGNMENT_FORCE = 0.3 + intensity * 0.7;
  const COHESION_FORCE = 0.2 + intensity * 0.8;
  
  // Store loaded assets
  const [particleAssets, setParticleAssets] = useState([]);
  const [videoElements, setVideoElements] = useState([]);

  // Swarm behaviors
  const swarmBehaviors = {
    flock: { separation: 1.5, alignment: 1.0, cohesion: 1.0 },
    school: { separation: 2.0, alignment: 1.5, cohesion: 0.5 },
    swarm: { separation: 0.5, alignment: 0.3, cohesion: 2.0 },
    tornado: { separation: 0.8, alignment: 0.2, cohesion: 3.0 },
    explosion: { separation: 3.0, alignment: 0.1, cohesion: 0.1 },
    collapse: { separation: 0.1, alignment: 0.1, cohesion: 5.0 },
    orbit: { separation: 1.0, alignment: 2.0, cohesion: 1.5 },
    chaos: { separation: Math.random() * 3, alignment: Math.random() * 3, cohesion: Math.random() * 3 }
  };

  // Load REAL assets for particles
  const loadParticleAssets = useCallback(async () => {
    // Get random mix of images and videos
    const mix = chaosRandomizer.getDiverseMix({
      images: 30,  // 30 random images
      videos: 10,  // 10 random videos
      audio: 0
    });
    
    setParticleAssets([...mix.images, ...mix.videos]);
    
    // Preload video elements
    const videoEls = [];
    for (const video of mix.videos) {
      const videoEl = document.createElement('video');
      videoEl.src = video.url;
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.style.display = 'none';
      document.body.appendChild(videoEl);
      videoEls.push({ element: videoEl, asset: video });
    }
    setVideoElements(videoEls);
    
    console.log('🎨 Loaded particle assets:', mix.images.length, 'images,', mix.videos.length, 'videos');
    return [...mix.images, ...mix.videos];
  }, []);

  // Particle class with REAL ASSETS
  class Particle {
    constructor(x, y, particleAssets) {
      this.position = { x, y };
      this.velocity = { 
        x: (Math.random() - 0.5) * 4, 
        y: (Math.random() - 0.5) * 4 
      };
      this.acceleration = { x: 0, y: 0 };
      this.maxSpeed = PARTICLE_SPEED;
      this.maxForce = 0.3;
      this.size = 20 + Math.random() * 40; // Bigger for images
      
      // Assign a real asset to this particle
      if (particleAssets && particleAssets.length > 0) {
        this.asset = particleAssets[Math.floor(Math.random() * particleAssets.length)];
        this.isVideo = this.asset?.type === 'video';
      } else {
        this.asset = null;
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
      }
      
      this.alpha = 0.6 + Math.random() * 0.4;
      this.trail = [];
      this.energy = Math.random();
      this.age = 0;
      this.mass = 0.5 + Math.random() * 1.5;
      this.type = Math.random() < 0.1 ? 'leader' : 'follower';
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 5;
    }

    // Apply force to particle
    applyForce(force) {
      this.acceleration.x += force.x / this.mass;
      this.acceleration.y += force.y / this.mass;
    }

    // Separation - steer to avoid crowding local flockmates
    separate(neighbors) {
      const desiredSeparation = 25;
      const steer = { x: 0, y: 0 };
      let count = 0;

      neighbors.forEach(other => {
        const d = this.distance(other);
        if (d > 0 && d < desiredSeparation) {
          const diff = {
            x: this.position.x - other.position.x,
            y: this.position.y - other.position.y
          };
          const length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
          if (length > 0) {
            diff.x /= length;
            diff.y /= length;
            diff.x /= d; // Weight by distance
            diff.y /= d;
            steer.x += diff.x;
            steer.y += diff.y;
            count++;
          }
        }
      });

      if (count > 0) {
        steer.x /= count;
        steer.y /= count;
        const length = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (length > 0) {
          steer.x = (steer.x / length) * this.maxSpeed;
          steer.y = (steer.y / length) * this.maxSpeed;
          steer.x -= this.velocity.x;
          steer.y -= this.velocity.y;
          this.limitForce(steer);
        }
      }

      return steer;
    }

    // Alignment - steer towards the average heading of neighbors
    align(neighbors) {
      const neighborDist = 50;
      const sum = { x: 0, y: 0 };
      let count = 0;

      neighbors.forEach(other => {
        const d = this.distance(other);
        if (d > 0 && d < neighborDist) {
          sum.x += other.velocity.x;
          sum.y += other.velocity.y;
          count++;
        }
      });

      if (count > 0) {
        sum.x /= count;
        sum.y /= count;
        const length = Math.sqrt(sum.x * sum.x + sum.y * sum.y);
        if (length > 0) {
          sum.x = (sum.x / length) * this.maxSpeed;
          sum.y = (sum.y / length) * this.maxSpeed;
          const steer = {
            x: sum.x - this.velocity.x,
            y: sum.y - this.velocity.y
          };
          this.limitForce(steer);
          return steer;
        }
      }

      return { x: 0, y: 0 };
    }

    // Cohesion - steer to move toward the average position of local flockmates
    cohesion(neighbors) {
      const neighborDist = 50;
      const sum = { x: 0, y: 0 };
      let count = 0;

      neighbors.forEach(other => {
        const d = this.distance(other);
        if (d > 0 && d < neighborDist) {
          sum.x += other.position.x;
          sum.y += other.position.y;
          count++;
        }
      });

      if (count > 0) {
        sum.x /= count;
        sum.y /= count;
        return this.seek(sum);
      }

      return { x: 0, y: 0 };
    }

    // Seek a target
    seek(target) {
      const desired = {
        x: target.x - this.position.x,
        y: target.y - this.position.y
      };
      const length = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
      
      if (length > 0) {
        desired.x = (desired.x / length) * this.maxSpeed;
        desired.y = (desired.y / length) * this.maxSpeed;
        const steer = {
          x: desired.x - this.velocity.x,
          y: desired.y - this.velocity.y
        };
        this.limitForce(steer);
        return steer;
      }

      return { x: 0, y: 0 };
    }

    // Calculate distance to another particle
    distance(other) {
      const dx = this.position.x - other.position.x;
      const dy = this.position.y - other.position.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Limit force magnitude
    limitForce(force) {
      const length = Math.sqrt(force.x * force.x + force.y * force.y);
      if (length > this.maxForce) {
        force.x = (force.x / length) * this.maxForce;
        force.y = (force.y / length) * this.maxForce;
      }
    }

    // Flock behavior - main intelligence
    flock(particles, behavior) {
      const sep = this.separate(particles);
      const ali = this.align(particles);
      const coh = this.cohesion(particles);

      // Weight the forces based on behavior
      sep.x *= SEPARATION_FORCE * behavior.separation;
      sep.y *= SEPARATION_FORCE * behavior.separation;
      ali.x *= ALIGNMENT_FORCE * behavior.alignment;
      ali.y *= ALIGNMENT_FORCE * behavior.alignment;
      coh.x *= COHESION_FORCE * behavior.cohesion;
      coh.y *= COHESION_FORCE * behavior.cohesion;

      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
    }

    // Update particle position and physics
    update(canvas) {
      // Update velocity
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;

      // Limit speed
      const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
      if (speed > this.maxSpeed) {
        this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
        this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
      }

      // Update position
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Update trail
      this.trail.push({ x: this.position.x, y: this.position.y });
      if (this.trail.length > 10) {
        this.trail.shift();
      }

      // Wrap around edges
      if (this.position.x < 0) this.position.x = canvas.width;
      if (this.position.x > canvas.width) this.position.x = 0;
      if (this.position.y < 0) this.position.y = canvas.height;
      if (this.position.y > canvas.height) this.position.y = 0;

      // Reset acceleration
      this.acceleration.x = 0;
      this.acceleration.y = 0;

      // Update age and energy
      this.age++;
      this.energy = Math.max(0, this.energy - 0.001);
    }

    // Render particle with REAL ASSETS
    render(ctx, imageCache) {
      // Update rotation
      this.rotation += this.rotationSpeed;
      
      // Draw trail
      if (this.trail.length > 1) {
        const trailColor = this.asset ? '#ffffff40' : (this.color + '40');
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.alpha;
      
      if (this.asset && imageCache[this.asset.url]) {
        // Draw the actual image/video
        const img = imageCache[this.asset.url];
        const drawSize = this.type === 'leader' ? this.size * 1.5 : this.size;
        
        // Add glow for leaders
        if (this.type === 'leader') {
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 20;
        }
        
        try {
          ctx.drawImage(img, -drawSize/2, -drawSize/2, drawSize, drawSize);
        } catch (e) {
          // Fallback to colored circle if image fails
          ctx.fillStyle = '#ff00ff';
          ctx.beginPath();
          ctx.arc(0, 0, drawSize/2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.shadowBlur = 0;
      } else {
        // Fallback colored particle
        ctx.fillStyle = this.color || '#ffffff';
        const drawSize = this.type === 'leader' ? this.size * 1.5 : this.size;
        ctx.beginPath();
        ctx.arc(0, 0, drawSize/2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }

  // Initialize particle system with REAL ASSETS
  const initializeParticles = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load real assets first
    const assets = await loadParticleAssets();
    const particles = [];

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        assets
      ));
    }

    particlesRef.current = particles;
    setParticleCount(particles.length);
  }, [MAX_PARTICLES, loadParticleAssets]);

  // Create image cache for performance
  const imageCache = useRef({});
  
  // Preload images
  useEffect(() => {
    particleAssets.forEach(asset => {
      if (asset.type === 'images' && !imageCache.current[asset.url]) {
        const img = new Image();
        img.src = asset.url;
        img.onload = () => {
          imageCache.current[asset.url] = img;
        };
      }
    });
    
    // Add video elements to cache
    videoElements.forEach(({ element, asset }) => {
      imageCache.current[asset.url] = element;
    });
  }, [particleAssets, videoElements]);
  
  // Animation loop with image rendering
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;
    const behavior = swarmBehaviors[swarmBehavior];

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and render particles with images
    particles.forEach(particle => {
      particle.flock(particles, behavior);
      particle.update(canvas);
      particle.render(ctx, imageCache.current);
    });

    // Detect emergent patterns
    detectEmergentPatterns(particles);

    animationRef.current = requestAnimationFrame(animate);
  }, [swarmBehavior]);

  // Detect emergent patterns in swarm behavior
  const detectEmergentPatterns = (particles) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    let spiralCount = 0;
    let clusterCount = 0;
    let avgDistance = 0;

    particles.forEach(particle => {
      const dx = particle.position.x - centerX;
      const dy = particle.position.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      avgDistance += distance;

      // Check for spiral motion
      const angle = Math.atan2(dy, dx);
      const expectedAngle = (Date.now() / 1000) % (Math.PI * 2);
      if (Math.abs(angle - expectedAngle) < 0.5) {
        spiralCount++;
      }

      // Check for clustering
      if (distance < 100) {
        clusterCount++;
      }
    });

    avgDistance /= particles.length;

    // Determine pattern
    if (spiralCount > particles.length * 0.3) {
      setEmergentPattern('spiral');
    } else if (clusterCount > particles.length * 0.6) {
      setEmergentPattern('cluster');
    } else if (avgDistance < 50) {
      setEmergentPattern('collapse');
    } else {
      setEmergentPattern('dispersed');
    }
  };

  // Change behavior based on phase
  useEffect(() => {
    switch (phase) {
      case 'calm':
        setSwarmBehavior('flock');
        break;
      case 'build':
        setSwarmBehavior('school');
        break;
      case 'chaos':
        setSwarmBehavior(['tornado', 'explosion', 'chaos'][Math.floor(Math.random() * 3)]);
        break;
      case 'fade':
        setSwarmBehavior('collapse');
        break;
      default:
        setSwarmBehavior('flock');
    }
  }, [phase]);

  // Initialize and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
    }
  }, [initializeParticles]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="particle-swarm-intelligence">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, #000510, #000000)'
        }}
      />

      {/* Controls */}
      <div className="swarm-controls">
        <button 
          onClick={() => {
            chaosRandomizer.refresh();
            initializeParticles();
          }}
          className="swarm-button"
        >
          🔄 NEW ASSETS
        </button>
        
        <button 
          onClick={() => {
            const behaviors = Object.keys(swarmBehaviors);
            const newBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
            setSwarmBehavior(newBehavior);
          }}
          className="swarm-button"
        >
          🧠 MUTATE BEHAVIOR
        </button>
      </div>

      {/* Info display */}
      <div className="mutation-info swarm-info">
        <h3>PARTICLE SWARM INTELLIGENCE</h3>
        <p>Emergent collective behavior from asset fragments</p>
        <div className="mutation-stats">
          <span>PARTICLES: {particleCount}</span>
          <span>BEHAVIOR: {swarmBehavior.toUpperCase()}</span>
          <span>PATTERN: {emergentPattern.toUpperCase()}</span>
          <span>INTENSITY: {Math.floor(intensity * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ParticleSwarmIntelligence;