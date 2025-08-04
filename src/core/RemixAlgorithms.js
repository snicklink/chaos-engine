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
      QuantumEvolution
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