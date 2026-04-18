# HopCode Visual Branding Review & Strategy

**Document Version:** 1.0  
**Created:** 2026-04-18  
**Repository:** D:\HopCode  
**Status:** Review & Planning

---

## Executive Summary

This document provides a comprehensive review of all visual branding assets in the HopCode repository (formerly Qwen Code) and presents a complete rebranding strategy with logo concepts, color palettes, and design guidelines.

---

## Part 1: Current State Analysis

### 1.1 Existing Visual Assets

#### Logo Files (4 files - ALL NEED REPLACEMENT)

| File              | Path                                                     | Type             | Current Design                 |
| ----------------- | -------------------------------------------------------- | ---------------- | ------------------------------ |
| **VS Code Icon**  | `packages/vscode-ide-companion/assets/icon.png`          | PNG (256x256)    | Purple hexagonal geometric "Q" |
| **Sidebar Icon**  | `packages/vscode-ide-companion/assets/sidebar-icon.svg`  | SVG (141.38x140) | Geometric "Q" letterform       |
| **Zed Extension** | `packages/zed-extension/qwen-code.svg`                   | SVG (141.38x140) | Same geometric "Q"             |
| **Favicon**       | `packages/web-templates/src/export-html/src/favicon.svg` | SVG              | Black "Q" letterform           |

#### Current Logo Analysis

**The existing logo is a geometric "Q" letterform** - fundamentally tied to the "Qwen" name and **CANNOT be reused** for HopCode.

**SVG Path Data (current Q logo):**

```svg
<svg viewBox="0 0 141.38 140">
  <!-- Complex geometric "Q" with angular cuts -->
  <!-- Features: hexagonal outer shape, tail element -->
</svg>
```

**Design Characteristics:**

- Geometric/angular style
- Hexagonal outer boundary
- Single letter monogram ("Q")
- Flat design (no gradients)
- Tech/minimal aesthetic

---

### 1.2 Current Color System

#### Primary Brand Colors (Dark Theme)

```css
/* Primary Action Color */
--app-primary: #3b82f6; /* Blue - neutral tech color */
--app-primary-hover: #2563eb; /* Darker Blue */
--app-primary-foreground: #e4e4e7; /* Light Gray text on blue */

/* Brand Accent Color */
--app-qwen-ivory: #f5f5dc; /* Ivory - UNIQUE brand color */

/* Status Colors */
--app-success: #10b981; /* Green */
--app-warning: #f59e0b; /* Amber */
--app-error: #ef4444; /* Red */
--app-info: #3b82f6; /* Blue */
```

#### Background Colors (Dark Theme)

```css
--app-background: #1e1e1e; /* Very dark gray */
--app-background-secondary: #252526;
--app-background-tertiary: #2d2d2d;
```

#### CLI Theme Colors (Qwen Dark)

```typescript
Background: '#0b0e14'; // Dark blue-black
Foreground: '#bfbdb6'; // Warm gray
AccentBlue: '#39BAE6'; // Sky blue
AccentPurple: '#D2A6FF'; // Light purple
AccentCyan: '#95E6CB'; // Mint cyan
AccentGreen: '#AAD94C'; /* Lime green */
AccentYellow: '#FFD700'; /* Gold */
AccentRed: '#F26D78'; /* Coral red */
GradientColors: ['#FFD700', '#da7959']; // Gold → Coral
```

**Available Themes:** 14 total (7 dark, 7 light)

- Qwen Dark / Qwen Light (custom themes)
- Standard themes: Dracula, GitHub, Ayu, Atom One, etc.

---

### 1.3 Current Typography

```css
/* Sans-Serif (UI) */
--app-font-sans: system-ui, -apple-system, sans-serif;

/* Monospace (Code) */
--app-font-mono: ui-monospace, 'SF Mono', monospace;
--app-monospace-font-size: 13px;

/* Display Font (Logo in exports) */
.logo-text {
  font-family: 'Press Start 2P', cursive; /* Pixel/retro style */
  font-size: 24px;
}
```

---

### 1.4 CSS Classes & Naming

**Current branded CSS classes:**

```css
.qwen-message              /* 37+ occurrences */
.qwen-webui-container
--app-qwen-ivory           /* Brand color variable */
--qwen-corner-radius-small
--qwen-corner-radius-medium
```

**All need migration to `hopcode-*` prefix.**

---

## Part 2: HopCode Brand Strategy

### 2.1 Brand Positioning

**HopCode** represents:

- **Movement/Progress** - "Hop" suggests agility, speed, forward motion
- **Transformation** - Butterfly effect (small changes, big impact)
- **Developer Empowerment** - Code with ease, leap forward
- **Intelligence** - AI-powered coding assistant

**Target Audience:**

- Professional developers
- DevOps engineers
- Tech teams
- Open-source contributors

**Brand Personality:**

- Modern & Dynamic
- Intelligent & Capable
- Approachable & Developer-friendly
- Innovative & Forward-thinking

---

### 2.2 Logo Concepts for HopCode

#### Concept 1: Butterfly Abstraction ⭐ (RECOMMENDED)

**Inspiration:** Butterfly effect - small changes create massive impact

**Design Elements:**

- Abstract butterfly wings formed from code brackets `{ }`
- Symmetrical wing pattern suggesting transformation
- Negative space creating subtle "H" letterform
- Gradient wings: Purple → Gold → Cyan

**Color Palette:**

```
Primary: #7C3AED (Violet/Purple - transformation)
Secondary: #F59E0B (Amber/Gold - energy)
Accent: #06B6D4 (Cyan - technology)
```

**File Formats Needed:**

- SVG (vector, primary)
- PNG: 16x16, 32x32, 64x64, 128x128, 256x256
- ICO (favicon)

**Use Cases:**

- Main logo: Full butterfly-H abstraction
- Icon: Simplified wing motif
- Favicon: Minimal "H" with wing suggestion

---

#### Concept 2: Leaping "H"

**Inspiration:** "Hop" - forward leap, progress

**Design Elements:**

- Bold uppercase "H" with motion blur effect
- Ascending diagonal lines suggesting upward movement
- Integrated code cursor or bracket element
- Dynamic angle (15° forward tilt)

**Color Palette:**

```
Primary: #2563EB (Blue - trust, technology)
Secondary: #10B981 (Green - growth, success)
Accent: #F97316 (Orange - energy, creativity)
```

---

#### Concept 3: Code Circuit

**Inspiration:** Technology, circuits, AI neural networks

**Design Elements:**

- Hexagonal node network forming "H" shape
- Connected dots and lines (circuit board aesthetic)
- Glowing node points
- Tech/futuristic aesthetic

**Color Palette:**

```
Primary: #0EA5E9 (Sky Blue - cloud, AI)
Secondary: #8B5CF6 (Purple - intelligence)
Background: #0F172A (Dark Navy - depth)
Accent: #14B8A6 (Teal - innovation)
```

---

#### Concept 4: Minimalist Wordmark

**Inspiration:** GitHub, Vercel, Stripe - clean typography

**Design Elements:**

- Custom "HopCode" wordmark
- Sans-serif, geometric letterforms
- Subtle code bracket integration in "H" or "C"
- Single color (versatile for dark/light themes)

**Typography:** Modified Inter or SF Pro Display
**Weight:** SemiBold (600)
**Letter-spacing:** -0.02em (tight, modern)

---

### 2.3 Recommended Color System for HopCode

#### Primary Brand Palette

```css
/* ===========================
   HopCode Primary Colors
   =========================== */
--hopcode-primary: #7c3aed; /* Violet - transformation */
--hopcode-primary-hover: #6d28d9; /* Darker violet */
--hopcode-primary-light: #8b5cf6; /* Light violet */
--hopcode-primary-foreground: #ffffff; /* White text on violet */

/* ===========================
   Secondary Colors
   =========================== */
--hopcode-secondary: #06b6d4; /* Cyan - technology */
--hopcode-secondary-hover: #0891b2;
--hopcode-secondary-foreground: #ffffff;

/* ===========================
   Accent Colors
   =========================== */
--hopcode-accent-gold: #f59e0b; /* Gold - energy */
--hopcode-accent-coral: #f97316; /* Coral - creativity */
--hopcode-accent-mint: #10b981; /* Mint - success */

/* ===========================
   Brand Signature Color
   =========================== */
--hopcode-ivory: #fef3c7; /* Warm ivory (evolved from qwen-ivory) */
```

#### Status Colors (Keep consistent)

```css
--hopcode-success: #10b981; /* Green */
--hopcode-warning: #f59e0b; /* Amber */
--hopcode-error: #ef4444; /* Red */
--hopcode-info: #3b82f6; /* Blue */
```

#### Theme Colors (Updated)

**HopCode Dark Theme:**

```typescript
Background: '#0F0F14'; // Deep navy-black
Foreground: '#E4E4E7'; // Light gray
Primary: '#7C3AED'; /* Violet */
AccentBlue: '#06B6D4'; /* Cyan */
AccentPurple: '#8B5CF6'; /* Light purple */
AccentCyan: '#22D3EE'; /* Bright cyan */
AccentGreen: '#34D399'; /* Emerald */
AccentGold: '#FBBF24'; /* Amber gold */
AccentCoral: '#F97316'; /* Coral */
GradientColors: ['#7C3AED', '#06B6D4']; // Violet → Cyan
```

**HopCode Light Theme:**

```typescript
Background: '#FFFFFF'; // Pure white
Foreground: '#1F2937'; // Charcoal
Primary: '#7C3AED'; /* Violet */
AccentBlue: '#0284C7'; /* Sky blue */
AccentPurple: '#9333EA'; /* Purple */
AccentCyan: '#0891B2'; /* Teal */
AccentGreen: '#059669'; /* Green */
AccentGold: '#D97706'; /* Amber */
GradientColors: ['#7C3AED', '#0891B2']; // Violet → Teal
```

---

### 2.4 Typography System

#### Primary Font Stack

```css
/* Sans-Serif (UI Text) */
--hopcode-font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* Monospace (Code) */
--hopcode-font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
--hopcode-font-mono-size: 14px;

/* Display (Headings, Logo) */
--hopcode-font-display: 'Inter', sans-serif;
--hopcode-font-display-weight: 600; /* SemiBold */
```

#### Font Size Scale

```css
--hopcode-font-xs: 11px; /* Captions, labels */
--hopcode-font-sm: 13px; /* Body text, code */
--hopcode-font-md: 16px; /* UI elements */
--hopcode-font-lg: 18px; /* Subheadings */
--hopcode-font-xl: 24px; /* Section titles */
--hopcode-font-2xl: 32px; /* Page titles */
--hopcode-font-3xl: 48px; /* Marketing */
```

---

### 2.5 CSS Class Migration

**All `.qwen-*` classes → `.hopcode-*`**

```css
/* Old → New */
.qwen-message              → .hopcode-message
.qwen-webui-container      → .hopcode-webui-container
.qwen-timeline             → .hopcode-timeline
.qwen-tool-call            → .hopcode-tool-call

/* Variables */
--app-qwen-ivory           → --app-hopcode-ivory
--qwen-corner-radius-small → --hopcode-corner-radius-small
--qwen-corner-radius-medium → --hopcode-corner-radius-medium
```

---

## Part 3: Asset Creation Checklist

### 3.1 Logo Files (Priority: CRITICAL)

| Asset             | Format    | Sizes            | Location                                                 | Status        |
| ----------------- | --------- | ---------------- | -------------------------------------------------------- | ------------- |
| **Primary Logo**  | SVG       | Vector           | `packages/vscode-ide-companion/assets/hopcode-logo.svg`  | ⏳ To Create  |
| **VS Code Icon**  | PNG       | 256x256, 512x512 | `packages/vscode-ide-companion/assets/icon.png`          | ⏳ To Create  |
| **Sidebar Icon**  | SVG       | 140x140          | `packages/vscode-ide-companion/assets/sidebar-icon.svg`  | ⏳ To Replace |
| **Zed Extension** | SVG       | 140x140          | `packages/zed-extension/hopcode.svg`                     | ⏳ To Replace |
| **Favicon**       | SVG + ICO | 16x16, 32x32     | `packages/web-templates/src/export-html/src/favicon.svg` | ⏳ To Replace |
| **README Hero**   | PNG/SVG   | 1200x630         | `assets/hopcode-hero.png`                                | ⏳ To Create  |
| **Social Card**   | PNG       | 1200x630         | `assets/hopcode-social.png`                              | ⏳ To Create  |

### 3.2 Documentation Assets

| Asset                 | Format | Location                            | Status       |
| --------------------- | ------ | ----------------------------------- | ------------ |
| **Docs Header Logo**  | SVG    | `docs-site/src/components/logo.svg` | ⏳ To Create |
| **Theme Screenshots** | PNG    | `docs/users/assets/themes/`         | ⏳ To Create |
| **Feature Diagrams**  | SVG    | `docs/users/assets/features/`       | ⏳ To Create |

### 3.3 Marketing Materials

| Asset                     | Format       | Use Case                    | Status       |
| ------------------------- | ------------ | --------------------------- | ------------ |
| **Banner (GitHub)**       | PNG 1200x300 | GitHub profile, repo header | ⏳ To Create |
| **Twitter Card**          | PNG 1200x600 | Social media sharing        | ⏳ To Create |
| **Presentation Template** | PPTX/Keynote | Talks, demos                | ⏳ To Create |
| **Sticker Design**        | SVG/PNG      | Swag, events                | ⏳ To Create |

---

## Part 4: Implementation Plan

### Phase 1: Logo Design (Week 1)

**Day 1-2: Concept Development**

- [ ] Sketch 3-5 logo concepts
- [ ] Review with stakeholders
- [ ] Select primary direction

**Day 3-4: Refinement**

- [ ] Refine chosen concept
- [ ] Create color variations
- [ ] Test at small sizes (16x16)

**Day 5: Finalization**

- [ ] Export all file formats
- [ ] Create usage guidelines
- [ ] Document color values

### Phase 2: Asset Production (Week 2)

**Day 1-2: Core Assets**

- [ ] Create VS Code icon PNGs
- [ ] Create sidebar SVG
- [ ] Create Zed extension icon
- [ ] Create favicon

**Day 3-4: Documentation**

- [ ] Update docs site logo
- [ ] Create theme screenshots
- [ ] Update README badges/images

**Day 5: Marketing**

- [ ] Create social media assets
- [ ] Create GitHub banner
- [ ] Prepare launch assets

### Phase 3: Code Integration (Week 3)

**Day 1-2: CSS Updates**

```bash
# Update variables.css
sed -i 's/--app-qwen-ivory/--app-hopcode-ivory/g' packages/webui/src/styles/variables.css
sed -i 's/--qwen-corner-radius/--hopcode-corner-radius/g' packages/webui/src/styles/variables.css

# Update all CSS files
find packages/webui/src -name "*.css" -exec sed -i 's/\.qwen-/\.hopcode-/g' {} \;
```

**Day 3-4: Component Updates**

- [ ] Update logo components in React/Vue files
- [ ] Update image references
- [ ] Test in all themes

**Day 5: Testing**

- [ ] Visual regression testing
- [ ] Cross-browser testing
- [ ] Extension marketplace validation

### Phase 4: Launch (Week 4)

**Day 1-2: Final Review**

- [ ] Stakeholder approval
- [ ] Legal/trademark check
- [ ] Accessibility review

**Day 3-4: Deployment**

- [ ] Publish npm packages with new branding
- [ ] Update extension marketplaces
- [ ] Deploy documentation site

**Day 5: Announcement**

- [ ] Social media posts
- [ ] Blog post
- [ ] Community announcement

---

## Part 5: Brand Guidelines

### 5.1 Logo Usage

#### Clear Space

```
Minimum clear space = height of "H" in HopCode logo

    [H]
     ↓
  ┌─────┐
  │     │
  │  H  │  ← Logo
  │     │
  └─────┘
     ↓
    [H]
```

**Rule:** Always maintain clear space equal to the height of the "H" on all sides.

#### Minimum Size

| Medium  | Minimum Size                 |
| ------- | ---------------------------- |
| Print   | 0.5 inches (12.7mm)          |
| Digital | 24px height                  |
| Favicon | 16x16px (simplified version) |

#### Don'ts

❌ Don't stretch or distort  
❌ Don't change colors (use approved variations only)  
❌ Don't add effects (shadows, gradients, outlines)  
❌ Don't rotate at angles  
❌ Don't place on busy backgrounds  
❌ Don't use outdated "Qwen" logo

---

### 5.2 Color Usage

#### Primary Color Accessibility

**Violet (#7C3AED) on White:**

- ✅ Passes WCAG AA for large text (18pt+)
- ✅ Passes WCAG AAA for UI components
- ❌ Fails for small text (<14px)

**Recommended Text on Violet:**

- Use white (#FFFFFF) for all text sizes
- Minimum font size: 14px

#### Color Combinations

**Approved Pairings:**

```
Primary Violet + White background
Primary Violet + Dark Navy (#0F0F14)
Cyan + Violet (accent combination)
Gold + Violet (highlight combination)
```

**Avoid:**

```
Violet on Red (poor contrast)
Cyan on Yellow (vibration)
Multiple bright colors together
```

---

### 5.3 Typography Usage

#### Hierarchy

```markdown
# H1 - Page Titles (32px, SemiBold)

## H2 - Section Headers (24px, SemiBold)

### H3 - Subsections (18px, Medium)

#### H4 - Component Titles (16px, Medium)

Body Text (14px, Regular)
Caption (13px, Regular)
Code (14px, Mono)
```

#### Code Formatting

```css
/* Use JetBrains Mono for all code blocks */
--hopcode-code-background: #1e1e2e;
--hopcode-code-foreground: #e4e4e7;
--hopcode-code-border: #3f3f46;
```

---

### 5.4 Voice & Tone

**Brand Voice:**

- **Confident** - Clear, direct statements
- **Helpful** - Supportive, educational
- **Technical** - Precise, accurate terminology
- **Approachable** - Friendly, not condescending

**Examples:**

❌ "You must configure the settings before proceeding"  
✅ "Configure your settings to get started"

❌ "The Qwen Code agent executes commands"  
✅ "HopCode helps you code faster with AI assistance"

---

## Part 6: File Structure

### Recommended Asset Organization

```
HopCode/
├── assets/
│   ├── logo/
│   │   ├── hopcode-logo.svg
│   │   ├── hopcode-logo.png
│   │   ├── hopcode-logo-white.svg
│   │   ├── hopcode-logo-dark.svg
│   │   └── hopcode-logomark.svg
│   ├── icons/
│   │   ├── hopcode-icon-16.png
│   │   ├── hopcode-icon-32.png
│   │   ├── hopcode-icon-64.png
│   │   ├── hopcode-icon-128.png
│   │   ├── hopcode-icon-256.png
│   │   └── hopcode-icon-512.png
│   ├── favicon/
│   │   ├── favicon.svg
│   │   └── favicon.ico
│   ├── social/
│   │   ├── hopcode-social-card.png
│   │   ├── hopcode-twitter-card.png
│   │   └── hopcode-github-banner.png
│   └── marketing/
│       ├── hopcode-sticker.svg
│       └── hopcode-presentation.key
├── docs/
│   └── brand/
│       ├── guidelines.md
│       ├── colors.md
│       ├── typography.md
│       └── logo-usage.md
└── packages/
    ├── vscode-ide-companion/
    │   └── assets/
    │       ├── hopcode-logo.svg
    │       ├── icon.png
    │       └── sidebar-icon.svg
    ├── zed-extension/
    │   └── hopcode.svg
    └── webui/
        └── src/
            └── assets/
                └── hopcode-logo.svg
```

---

## Part 7: Tools & Resources

### Design Tools

| Tool                     | Purpose                       | Link                     |
| ------------------------ | ----------------------------- | ------------------------ |
| **Figma**                | Logo design, brand guidelines | figma.com                |
| **Inkscape**             | Free SVG editor               | inkscape.org             |
| **GIMP**                 | Free raster editor            | gimp.org                 |
| **RealFaviconGenerator** | Favicon generator             | realfavicongenerator.net |

### Color Tools

| Tool                | Purpose                    | Link                                 |
| ------------------- | -------------------------- | ------------------------------------ |
| **Coolors**         | Color palette generator    | coolors.co                           |
| **Adobe Color**     | Color wheel, accessibility | color.adobe.com                      |
| **WebAIM Contrast** | Accessibility checker      | webaim.org/resources/contrastchecker |

### Asset Optimization

| Tool        | Purpose            | Link                |
| ----------- | ------------------ | ------------------- |
| **SVGO**    | SVG optimizer      | github.com/svg/svgo |
| **TinyPNG** | PNG compression    | tinypng.com         |
| **Squoosh** | Image optimization | squoosh.app         |

---

## Appendix A: SVG Logo Template

### Base SVG Structure for HopCode Logo

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Butterfly Abstraction Concept -->

  <!-- Left Wing -->
  <path d="M 60 100 Q 40 60 60 40 Q 80 20 100 40 L 100 100 Z"
        fill="#7C3AED"/>

  <!-- Right Wing -->
  <path d="M 140 100 Q 160 60 140 40 Q 120 20 100 40 L 100 100 Z"
        fill="#06B6D4"/>

  <!-- H Letterform (negative space or center element) -->
  <path d="M 85 120 L 85 180 L 95 180 L 95 150 L 105 150 L 105 180 L 115 180 L 115 120 L 105 120 L 105 140 L 95 140 L 95 120 Z"
        fill="#F59E0B"/>

  <!-- Optional: Code bracket suggestion -->
  <path d="M 70 80 L 60 100 L 70 120"
        stroke="#FEF3C7"
        stroke-width="3"
        fill="none"/>
</svg>
```

---

## Appendix B: Quick Reference Card

### HopCode Brand Colors

```
Primary Violet:    #7C3AED  rgb(124, 58, 237)
Secondary Cyan:    #06B6D4  rgb(6, 182, 212)
Accent Gold:       #F59E0B  rgb(245, 158, 11)
Accent Coral:      #F97316  rgb(249, 115, 22)
Accent Mint:       #10B981  rgb(16, 185, 129)
HopCode Ivory:     #FEF3C7  rgb(254, 243, 199)

Dark Background:   #0F0F14  rgb(15, 15, 20)
Light Background:  #FFFFFF  rgb(255, 255, 255)
```

### Typography

```
Font Sans:    Inter, system-ui, sans-serif
Font Mono:    JetBrains Mono, monospace
Font Display: Inter, SemiBold (600)
```

### Logo Files

```
Primary:    hopcode-logo.svg
Icon:       hopcode-icon-*.png (multiple sizes)
Favicon:    favicon.svg + favicon.ico
```

---

## Appendix C: Migration Commands

### CSS Variable Updates

```bash
# Update variables.css
cd D:\HopCode

# Backup first
cp packages/webui/src/styles/variables.css packages/webui/src/styles/variables.css.bak

# Replace brand color variable
sed -i 's/--app-qwen-ivory/--app-hopcode-ivory/g' packages/webui/src/styles/variables.css

# Replace corner radius variables
sed -i 's/--qwen-corner-radius/--hopcode-corner-radius/g' packages/webui/src/styles/variables.css

# Replace all CSS classes
find packages/webui/src -name "*.css" -exec sed -i 's/\.qwen-/\.hopcode-/g' {} \;
```

### TypeScript/JavaScript Updates

```bash
# Update component references
find packages/webui/src -name "*.tsx" -exec sed -i 's/QwenCode/HopCode/g' {} \;
find packages/webui/src -name "*.ts" -exec sed -i 's/QwenCode/HopCode/g' {} \;

# Update logo imports
find packages -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/qwen-logo/hopcode-logo/g'
```

---

## Next Steps

1. **Review this document** with stakeholders
2. **Select logo concept** (Butterfly recommended)
3. **Commission logo design** (designer or AI tool)
4. **Create all asset formats** (SVG, PNG, ICO)
5. **Execute code migration** (CSS classes, variables)
6. **Update documentation** (guidelines, usage)
7. **Test across platforms** (VS Code, Zed, Web)
8. **Launch with announcement**

---

**Document End**

_Last Updated: 2026-04-18_  
_Prepared for: HopCode Rebranding Project_
