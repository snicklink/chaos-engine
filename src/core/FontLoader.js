// FONT LOADER - Dynamic font management system
// Loads custom fonts and provides varied typography options

class FontLoader {
  constructor() {
    this.loadedFonts = new Set();
    this.fontFamilies = {
      // Available fonts from vibetales
      dejavu: {
        regular: '/assets/vibetales/fonts/DejaVuSans.ttf',
        bold: '/assets/vibetales/fonts/DejaVuSans-Bold.ttf',
        italic: '/assets/vibetales/fonts/DejaVuSans-Oblique.ttf',
        boldItalic: '/assets/vibetales/fonts/DejaVuSans-BoldOblique.ttf',
        family: 'DejaVu Sans'
      },
      dejavuSerif: {
        regular: '/assets/vibetales/fonts/DejaVuSerif.ttf',
        bold: '/assets/vibetales/fonts/DejaVuSerif-Bold.ttf',
        italic: '/assets/vibetales/fonts/DejaVuSerif-Italic.ttf',
        boldItalic: '/assets/vibetales/fonts/DejaVuSerif-BoldItalic.ttf',
        family: 'DejaVu Serif'
      },
      dejavuMono: {
        regular: '/assets/vibetales/fonts/DejaVuSansMono.ttf',
        bold: '/assets/vibetales/fonts/DejaVuSansMono-Bold.ttf',
        oblique: '/assets/vibetales/fonts/DejaVuSansMono-Oblique.ttf',
        boldOblique: '/assets/vibetales/fonts/DejaVuSansMono-BoldOblique.ttf',
        family: 'DejaVu Sans Mono'
      },
      stix: {
        regular: '/assets/vibetales/fonts/STIXGeneral.ttf',
        bold: '/assets/vibetales/fonts/STIXGeneralBol.ttf',
        italic: '/assets/vibetales/fonts/STIXGeneralItalic.ttf',
        boldItalic: '/assets/vibetales/fonts/STIXGeneralBolIta.ttf',
        family: 'STIX General'
      },
      computer: {
        regular: '/assets/vibetales/fonts/cmr10.ttf',
        bold: '/assets/vibetales/fonts/cmb10.ttf',
        italic: '/assets/vibetales/fonts/cmmi10.ttf',
        typewriter: '/assets/vibetales/fonts/cmtt10.ttf',
        family: 'Computer Modern'
      }
    };
    
    // Font style presets for different phases
    this.stylePresets = {
      calm: [
        { family: 'DejaVu Serif', size: '2rem', weight: 300, spacing: '0.05em' },
        { family: 'STIX General', size: '1.8rem', weight: 400, spacing: '0.02em' },
        { family: 'Georgia', size: '2.2rem', weight: 400, spacing: '0' }
      ],
      build: [
        { family: 'DejaVu Sans', size: '3rem', weight: 700, spacing: '0.02em' },
        { family: 'Computer Modern', size: '2.5rem', weight: 600, spacing: '0.04em' },
        { family: 'Arial Black', size: '4rem', weight: 900, spacing: '-0.02em' }
      ],
      chaos: [
        { family: 'DejaVu Sans Mono', size: '5rem', weight: 900, spacing: '-0.05em' },
        { family: 'Impact', size: '8rem', weight: 900, spacing: '-0.08em' },
        { family: 'monospace', size: '12rem', weight: 100, spacing: '0.2em' }
      ],
      fade: [
        { family: 'DejaVu Serif', size: '1.5rem', weight: 100, spacing: '0.1em' },
        { family: 'STIX General', size: '1.2rem', weight: 300, spacing: '0.15em' },
        { family: 'Times New Roman', size: '1rem', weight: 300, spacing: '0.2em' }
      ]
    };
  }
  
  // Load a specific font
  async loadFont(fontKey, variant = 'regular') {
    const fontData = this.fontFamilies[fontKey];
    if (!fontData || !fontData[variant]) {
      console.warn(`Font not found: ${fontKey} ${variant}`);
      return false;
    }
    
    const fontId = `${fontKey}-${variant}`;
    if (this.loadedFonts.has(fontId)) {
      return true; // Already loaded
    }
    
    try {
      const fontFace = new FontFace(
        fontData.family,
        `url(${fontData[variant]})`,
        {
          weight: this.getWeight(variant),
          style: this.getStyle(variant)
        }
      );
      
      await fontFace.load();
      document.fonts.add(fontFace);
      this.loadedFonts.add(fontId);
      
      console.log(`✅ Loaded font: ${fontData.family} ${variant}`);
      return true;
    } catch (error) {
      console.error(`Failed to load font: ${fontKey} ${variant}`, error);
      return false;
    }
  }
  
  // Load all variants of a font family
  async loadFontFamily(fontKey) {
    const fontData = this.fontFamilies[fontKey];
    if (!fontData) return false;
    
    const variants = Object.keys(fontData).filter(key => key !== 'family');
    const promises = variants.map(variant => this.loadFont(fontKey, variant));
    
    const results = await Promise.all(promises);
    return results.every(result => result);
  }
  
  // Get font weight from variant name
  getWeight(variant) {
    if (variant.includes('bold')) return 700;
    if (variant.includes('Bold')) return 700;
    return 400;
  }
  
  // Get font style from variant name
  getStyle(variant) {
    if (variant.includes('italic') || variant.includes('Italic') || variant.includes('oblique') || variant.includes('Oblique')) {
      return 'italic';
    }
    return 'normal';
  }
  
  // Get random font style for phase
  getRandomStyle(phase = 'calm', intensity = 0.5) {
    const presets = this.stylePresets[phase] || this.stylePresets.calm;
    const preset = presets[Math.floor(Math.random() * presets.length)];
    
    // Adjust size based on intensity
    const baseSize = parseFloat(preset.size);
    const unit = preset.size.replace(/[0-9.]/g, '');
    const adjustedSize = baseSize * (1 + intensity * 0.5);
    
    return {
      fontFamily: preset.family,
      fontSize: `${adjustedSize}${unit}`,
      fontWeight: preset.weight,
      letterSpacing: preset.spacing,
      lineHeight: 1.2 + (1 - intensity) * 0.4
    };
  }
  
  // Get super large font style
  getSuperLargeStyle(text, containerWidth = window.innerWidth) {
    const sizes = ['8rem', '10rem', '12rem', '15rem', '20rem', '25rem'];
    const families = ['Impact', 'Arial Black', 'DejaVu Sans', 'monospace'];
    
    return {
      fontFamily: families[Math.floor(Math.random() * families.length)],
      fontSize: sizes[Math.floor(Math.random() * sizes.length)],
      fontWeight: 900,
      letterSpacing: '-0.05em',
      lineHeight: 0.8,
      textTransform: 'uppercase'
    };
  }
  
  // Get micro font style
  getMicroStyle() {
    const sizes = ['8px', '10px', '12px'];
    const families = ['DejaVu Sans Mono', 'monospace', 'Courier New'];
    
    return {
      fontFamily: families[Math.floor(Math.random() * families.length)],
      fontSize: sizes[Math.floor(Math.random() * sizes.length)],
      fontWeight: 400,
      letterSpacing: '0.1em',
      lineHeight: 1.5
    };
  }
  
  // Apply animated text effects
  applyTextAnimation(element, animation = 'wave', options = {}) {
    const {
      duration = 2000,
      stagger = 50,
      intensity = 0.5
    } = options;
    
    // Split text into spans
    const text = element.textContent;
    const chars = text.split('');
    element.innerHTML = '';
    
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.animationDelay = `${index * stagger}ms`;
      
      switch(animation) {
        case 'wave':
          span.style.animation = `fontWave ${duration}ms ease-in-out infinite`;
          break;
        case 'bounce':
          span.style.animation = `fontBounce ${duration}ms ease-in-out infinite`;
          break;
        case 'rotate':
          span.style.animation = `fontRotate ${duration}ms linear infinite`;
          break;
        case 'scale':
          span.style.animation = `fontScale ${duration}ms ease-in-out infinite`;
          break;
        case 'color':
          span.style.animation = `fontColor ${duration}ms linear infinite`;
          break;
      }
      
      element.appendChild(span);
    });
  }
  
  // Create gradient text
  createGradientText(element, colors = ['#FF006E', '#8338EC', '#3A86FF']) {
    const gradient = `linear-gradient(45deg, ${colors.join(', ')})`;
    
    element.style.background = gradient;
    element.style.webkitBackgroundClip = 'text';
    element.style.webkitTextFillColor = 'transparent';
    element.style.backgroundClip = 'text';
    element.style.textFillColor = 'transparent';
  }
  
  // Create outlined text
  createOutlinedText(element, color = '#fff', width = 2) {
    element.style.webkitTextStroke = `${width}px ${color}`;
    element.style.textStroke = `${width}px ${color}`;
    element.style.webkitTextFillColor = 'transparent';
    element.style.textFillColor = 'transparent';
  }
  
  // Create 3D text effect
  create3DText(element, depth = 5, color = '#000') {
    const shadows = [];
    
    for (let i = 1; i <= depth; i++) {
      shadows.push(`${i}px ${i}px 0 ${color}`);
    }
    
    element.style.textShadow = shadows.join(', ');
  }
  
  // Get suggested fonts for content type
  getSuggestedFonts(contentType) {
    const suggestions = {
      title: ['Impact', 'Arial Black', 'DejaVu Sans'],
      body: ['DejaVu Serif', 'Georgia', 'STIX General'],
      code: ['DejaVu Sans Mono', 'Computer Modern', 'monospace'],
      artistic: ['STIX General', 'DejaVu Serif', 'Times New Roman'],
      glitch: ['monospace', 'DejaVu Sans Mono', 'Courier New']
    };
    
    return suggestions[contentType] || suggestions.body;
  }
  
  // Initialize with common fonts
  async init() {
    // Load essential fonts
    const essentials = ['dejavu', 'dejavuMono'];
    const promises = essentials.map(font => this.loadFontFamily(font));
    
    await Promise.all(promises);
    console.log('📝 Font system initialized');
    
    // Add font animations to CSS
    this.injectFontAnimations();
  }
  
  // Inject font animation keyframes
  injectFontAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fontWave {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes fontBounce {
        0%, 100% { transform: translateY(0) scaleY(1); }
        50% { transform: translateY(-20px) scaleY(0.8); }
      }
      
      @keyframes fontRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes fontScale {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      
      @keyframes fontColor {
        0% { color: #FF006E; }
        25% { color: #8338EC; }
        50% { color: #3A86FF; }
        75% { color: #06FFB4; }
        100% { color: #FF006E; }
      }
    `;
    
    document.head.appendChild(style);
  }
}

export default FontLoader;