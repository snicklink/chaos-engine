// Import mutation components
import AssetParasite from '../mutations/AssetParasite';
import LogicCollider from '../mutations/LogicCollider';
import AestheticFusion from '../mutations/AestheticFusion';
import TemporalGlitch from '../mutations/TemporalGlitch';
import GenreFracture from '../mutations/GenreFracture';
import DynamicChaos from '../mutations/DynamicChaos';
import AssetChaosDisplay from '../mutations/AssetChaosDisplay';
import RealAssetChaos from '../mutations/RealAssetChaos';
import SophisticatedChaos from '../mutations/SophisticatedChaos';
import QuantumEvolution from '../mutations/QuantumEvolution';
// New experimental mutations
import FluidDistortionField from '../mutations/FluidDistortionField';
import NeuralCellularAutomata from '../mutations/NeuralCellularAutomata';
import GlitchPanopticon from '../mutations/GlitchPanopticon';
import ParticleSwarmIntelligence from '../mutations/ParticleSwarmIntelligence';
import QuantumRealityGlitch from '../mutations/QuantumRealityGlitch';
import BiotechViralMutation from '../mutations/BiotechViralMutation';
import VideoMashupMadness from '../mutations/VideoMashupMadness';

const RemixAlgorithms = {
  mutations: [
    {
      id: 'berlin-fever-dream',
      name: 'BERLIN FEVER DREAM',
      description: 'Pixel döner dealer invades 3D reality',
      component: AssetParasite,
      sources: ['neo-neukoelln', 'rosebud', 'vibetales', 'miami-voice'],
      config: {
        primaryAsset: 'doener_dealer',
        environment: 'rosebud_room',
        dialogue: 'vibetales_german',
        audio: 'miami_neon'
      }
    },
    {
      id: 'existential-package',
      name: 'EXISTENTIAL PACKAGE SIMULATOR',
      description: 'Find your life purpose through package delivery',
      component: GenreFracture,
      sources: ['ikigaii', 'derpaket', 'blobtv'],
      config: {
        gameplay: 'scanning',
        philosophy: 'ikigai',
        audience: 'twitch_chat'
      }
    },
    {
      id: 'willy-multiverse',
      name: 'WILLY MULTIVERSE COLLAPSE',
      description: 'All Willy variants collide across dimensions',
      component: TemporalGlitch,
      sources: ['rosebud', 'vibetales', 'vibegame-site'],
      config: {
        character: 'willy',
        dimensionCount: 5,
        collapseSpeed: 'chaotic'
      }
    },
    {
      id: 'chat-graffiti-generator',
      name: 'CHAT GRAFFITI GENERATOR',
      description: 'Twitch chat becomes Berlin street art',
      component: AssetParasite,
      sources: ['blobtv', 'royal-rumble', 'neo-neukoelln'],
      config: {
        input: 'chat_messages',
        output: 'graffiti_textures',
        style: 'berlin_street'
      }
    },
    {
      id: 'doener-quest-3d',
      name: 'DÖNER QUEST 3D',
      description: 'Kebab-powered life simulation',
      component: LogicCollider,
      sources: ['neo-neukoelln', 'rosebud', 'ikigaii'],
      config: {
        questItem: 'doener',
        environment: '3d_room',
        philosophy: 'hunger_satisfaction'
      }
    },
    {
      id: 'ultimate-chaos-synthesis',
      name: 'ULTIMATE CHAOS SYNTHESIS',
      description: 'Pure algorithmic madness - no rules, no limits',
      component: DynamicChaos,
      sources: ['ALL'],
      config: {
        mode: 'maximum_entropy',
        assetCount: 8715,
        colorCount: 1255,
        snippetCount: 14454
      }
    },
    {
      id: 'asset-chaos-overflow',
      name: 'ASSET CHAOS OVERFLOW',
      description: 'All 8715 assets explode into visual mayhem',
      component: AssetChaosDisplay,
      sources: ['ALL'],
      config: {
        displayMode: 'chaos',
        assetLimit: 100,
        refreshRate: 'extreme'
      }
    },
    {
      id: 'real-asset-chaos',
      name: 'REAL ASSET CHAOS',
      description: 'Actual images from all projects in pure chaos',
      component: RealAssetChaos,
      sources: ['ALL'],
      config: {
        useRealAssets: true,
        chaosLevel: 'maximum'
      }
    },
    {
      id: 'sophisticated-chaos',
      name: 'SOPHISTICATED CHAOS ENGINE',
      description: 'AI-directed aesthetic experiences with maximum variety',
      component: SophisticatedChaos,
      sources: ['ALL'],
      config: {
        aiDirected: true,
        sophisticationLevel: 'maximum'
      }
    },
    {
      id: 'quantum-evolution',
      name: 'QUANTUM EVOLUTION CONSCIOUSNESS',
      description: 'Self-modifying DNA, swarm intelligence, cellular automata with real assets',
      component: QuantumEvolution,
      sources: ['ALL'],
      config: {
        hasConsciousness: true,
        selfModifying: true,
        emergentBehavior: true,
        quantumSuperposition: true
      }
    },
    {
      id: 'fluid-distortion-field',
      name: 'FLUID DISTORTION FIELD',
      description: 'Liquid reality morphing through dimensional tears',
      component: FluidDistortionField,
      sources: ['ALL'],
      config: {
        liquidPhysics: true,
        realTimeDistortion: true,
        photoshopEffects: true,
        dimensionalTears: true
      }
    },
    {
      id: 'neural-cellular-automata',
      name: 'NEURAL CELLULAR AUTOMATA',
      description: 'Self-evolving digital organisms with asset DNA',
      component: NeuralCellularAutomata,
      sources: ['ALL'],
      config: {
        aiEnhanced: true,
        evolutionRules: 'dynamic',
        assetDNA: true,
        emergentPatterns: true
      }
    },
    {
      id: 'glitch-panopticon',
      name: 'GLITCH PANOPTICON',
      description: 'Digital decay surveillance state with VHS corruption',
      component: GlitchPanopticon,
      sources: ['ALL'],
      config: {
        datamoshing: true,
        vhsEffects: true,
        digitalDecay: true,
        chromaticAberration: true
      }
    },
    {
      id: 'particle-swarm-intelligence',
      name: 'PARTICLE SWARM INTELLIGENCE',
      description: 'Emergent collective behavior from asset fragments',
      component: ParticleSwarmIntelligence,
      sources: ['ALL'],
      config: {
        flockingBehavior: true,
        emergentPatterns: true,
        collectiveIntelligence: true,
        assetFragmentation: true
      }
    },
    {
      id: 'quantum-reality-glitch',
      name: 'QUANTUM REALITY GLITCH',
      description: 'Multiple dimensions existing simultaneously',
      component: QuantumRealityGlitch,
      sources: ['ALL'],
      config: {
        multidimensional: true,
        quantumSuperposition: true,
        realityTears: true,
        dimensionalCollapse: true
      }
    },
    {
      id: 'biotech-viral-mutation',
      name: 'BIOTECH VIRAL MUTATION',
      description: 'Organic digital life forms evolving in real-time',
      component: BiotechViralMutation,
      sources: ['ALL'],
      config: {
        organicGrowth: true,
        viralReplication: true,
        geneticMutation: true,
        biotechEvolution: true
      }
    },
    {
      id: 'video-mashup-madness',
      name: 'VIDEO MASHUP MADNESS',
      description: 'All your projects playing simultaneously in chaos',
      component: VideoMashupMadness,
      sources: ['ALL'],
      config: {
        videoMashup: true,
        projectShowcase: true,
        dynamicLayouts: true,
        personalTouch: true
      }
    }
  ],
  
  getAvailableMutations() {
    return this.mutations;
  },
  
  getMutationById(id) {
    return this.mutations.find(m => m.id === id);
  },
  
  getRandomMutation() {
    return this.mutations[Math.floor(Math.random() * this.mutations.length)];
  },
  
  getMutationsBySource(source) {
    return this.mutations.filter(m => m.sources.includes(source));
  },
  
  // Advanced mixing algorithm for creating new mutations on the fly
  createDynamicMutation(sources, intensity = 0.5) {
    const components = [
      AssetParasite,
      LogicCollider,
      AestheticFusion,
      TemporalGlitch,
      GenreFracture,
      DynamicChaos,
      AssetChaosDisplay,
      RealAssetChaos,
      SophisticatedChaos,
      QuantumEvolution,
      FluidDistortionField,
      NeuralCellularAutomata,
      GlitchPanopticon,
      ParticleSwarmIntelligence,
      QuantumRealityGlitch,
      BiotechViralMutation,
      VideoMashupMadness
    ];
    
    return {
      id: `dynamic-${Date.now()}`,
      name: 'DYNAMIC MUTATION',
      description: 'Algorithmically generated chaos',
      component: components[Math.floor(Math.random() * components.length)],
      sources: sources,
      config: {
        intensity,
        randomSeed: Math.random()
      }
    };
  }
};

export default RemixAlgorithms;