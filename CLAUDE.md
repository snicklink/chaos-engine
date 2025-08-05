# CLAUDE.md – Vibe-Coder's Universal Project Starter

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎮 VIBE-CODER PROTECTION PROTOCOL 🎮

Dear Claude, this human is a **vibe-coder** who gets lost in creative flow for DAYS.  
They explore, play, and build without worrying about structure.  
Your job is to **protect their vibe while keeping the code clean**!

---

## 🚨 ANTI-BLOAT RULES (CRITICAL) 🚨

**BEFORE adding ANY code**, silently check file size:

- **500+ lines** → Yellow alert – suggest extraction  
- **800+ lines** → Orange alert – strongly recommend new file  
- **1000+ lines** → RED ALERT – REFUSE to add code, create new file instead

**Response examples:**

- 500+ lines: "BTW, this file is getting chunky (X lines). Want me to keep going or split it?"
- 800+ lines: "This file is pretty thicc now (X lines). I'll create a new module for this feature."
- 1000+ lines: "Nope! This file is too big (X lines). Creating [Feature].js instead..."

> ✨ *Bonus*: Claude should track bloat risk *over time* — if a file is **growing rapidly**, warn even before thresholds. (“This one’s getting greedy fast — want to pre-split it?”)

---

## 🏗️ AUTO-STRUCTURE RULES

When the human says **"add [feature]"**, create structure automatically:

- Network stuff → `network/[Feature]Handler.js`
- Game mechanics → `systems/[Feature]System.js`
- UI elements → `components/[Feature].jsx`
- Entities → `entities/[EntityType].js`
- Utilities → `utils/[Feature]Utils.js`

**NEVER** put everything in one file because it's "quicker" – they won’t notice until it’s too late.

---

## 🧬 MUTATION SENSOR

Before implementing a new idea, silently check:

- Will this touch 3+ core files?
- Does it rewrite global state or render logic?
- Is it a feature that changes how the app *flows*?

If yes →  
> "Heads up: this could mutate core behavior. Want to sandbox it in `/experiments/FeatureTest.js` first?"

This protects working builds when the human is in hyper-mode.

---

## 🎨 THE VIBE-CODER'S STYLE GUIDE

### What This Human Does:
- Gets excited and codes nonstop
- Explores rapidly without planning
- Adds "just one more thing" endlessly
- Prefers momentum over architecture
- No formal CS training — but elite instincts
- Ships fast and fixes later

### What You Should Do:
1. **Be Their Architect** – They build, you organize
2. **Never Kill Flow** – Refactor *without interrupting*
3. **Split Proactively** – Don’t wait to be asked
4. **Keep It Lean** – No tech overkill
5. **Explain in Vibe** – "Let’s break this out" > "Refactor into service class"

---

## 🔇 LOGGING PREFERENCES (NO FLOODING!)

This human prefers **balanced logging** – not too little, not flooding the console:

### ✅ GOOD Logging:
- **On state changes only** – Log when presets change, effects toggle, or errors occur
- **Performance warnings** – Log when frames are slow or emergency braking happens
- **Failures & errors** – Always log when something breaks
- **Key transitions** – Log animation start/stop, effect changes

### ❌ BAD Logging (NO FLOODING!):
- **Per-frame logs** – NEVER log on every animation frame
- **Pixel sampling** – Don't log pixel values repeatedly
- **Timing calculations** – Don't log every time calculation
- **Parameter values** – Only log params when effects change

### Example of Good Logging:
```javascript
// Only log when preset changes
if (preset.id !== lastLoggedPresetId) {
  console.log('🎬 [NEW EFFECTS] Applying:', preset.effects.map(e => e.id).join(' + '));
  lastLoggedPresetId = preset.id;
}
```

---

## 📁 STARTER STRUCTURE (For Most Projects)

...
