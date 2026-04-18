# HopCode Asset Inventory

**Created:** 2026-04-18  
**Location:** `D:\HopCode\assets\`  
**Status:** Complete

---

## 📊 Asset Summary

| Category | Count | Formats |
|----------|-------|---------|
| **Logo Concepts** | 4 | SVG |
| **Logo Variations** | 5 | SVG |
| **Marketing Assets** | 5 | SVG |
| **Total Assets** | 14 | SVG |

---

## 🎨 Logo Concepts (Primary)

### Location: `D:\HopCode\assets\`

| File | Concept | Description | Status |
|------|---------|-------------|--------|
| `hopcode-logo-concept1.svg` | 🦋 Butterfly Abstraction | **Recommended** - Purple + Cyan wings, Gold H | ✅ Ready |
| `hopcode-logo-concept2.svg` | ⚡ Leaping H | Forward motion, blue gradient, orange accents | ✅ Ready |
| `hopcode-logo-concept3.svg` | 🔗 Code Circuit | Neural network, tech aesthetic, glowing nodes | ✅ Ready |
| `hopcode-wordmark.svg` | 📝 Minimalist Wordmark | Typography-based, violet→cyan gradient | ✅ Ready |

**Recommended Usage:**
- **Primary:** Concept 1 (Butterfly)
- **Secondary:** Wordmark (for formal documents)
- **Alternative:** Concept 2 or 3 for specific use cases

---

## 🎭 Logo Variations

### Location: `D:\HopCode\assets\`

| File | Variant | Use Case | Background |
|------|---------|----------|------------|
| `hopcode-logo-mono-white.svg` | Monochrome White | Dark backgrounds | #0F0F14 |
| `hopcode-logo-mono-black.svg` | Monochrome Black | Light backgrounds | #FFFFFF |
| `hopcode-logo-simplified.svg` | Simplified Icon | Small sizes (16-32px) | Any |
| `hopcode-logo-light.svg` | Light Theme | Light mode UI | #FFFFFF |
| `hopcode-icon-grid.svg` | Icon Grid | Size reference sheet | Presentation |

### Color Specifications

#### Full Color (Primary)
```css
Left Wing:  #8B5CF6 → #7C3AED (Purple gradient)
Right Wing: #22D3EE → #06B6D4 (Cyan gradient)
H Letter:   #F59E0B (Gold)
Center Dot: #FEF3C7 (Ivory)
```

#### Monochrome
```css
White version:  #FFFFFF (on dark backgrounds)
Black version:  #1F2937 (on light backgrounds)
```

---

## 📣 Marketing Assets

### Location: `D:\HopCode\assets\marketing\`

| File | Size | Format | Use Case |
|------|------|--------|----------|
| `hopcode-social-card.svg` | 1200×630 | SVG | Open Graph, LinkedIn, Facebook sharing |
| `hopcode-github-banner.svg` | 1200×300 | SVG | GitHub repo header, Twitter banner |
| `hopcode-presentation-slide.svg` | 1920×1080 | SVG | Presentation title slide, keynote |
| `hopcode-sticker-sheet.svg` | 800×800 | SVG | Sticker printing (6 designs) |
| `hopcode-twitter-card.svg` | 1200×600 | SVG | Twitter summary card |

---

## 📱 Recommended Export Sizes

### Favicon
Export from `hopcode-logo-simplified.svg`:
- 16×16 px (browser tabs)
- 32×32 px (taskbar)
- 48×48 px (mobile)
- .ICO format (Windows compatibility)

### App Icons
Export from `hopcode-logo-simplified.svg`:
- 64×64 px (small icons)
- 128×128 px (extension icons)
- 256×256 px (large icons)
- 512×512 px (splash screens)

### Social Media
Use pre-made SVGs, export as PNG:
- `hopcode-social-card.svg` → 1200×630 px (OG/Twitter)
- `hopcode-github-banner.svg` → 1200×300 px (GitHub/Twitter header)
- `hopcode-twitter-card.svg` → 1200×600 px (Twitter card)

### Print Materials
Export from SVG at 300 DPI:
- `hopcode-sticker-sheet.svg` → Print on vinyl
- Presentation slide → Keynote/PowerPoint background

---

## 🎨 Brand Color Palette

### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **HopCode Violet** | #7C3AED | rgb(124, 58, 237) | Primary brand color |
| **HopCode Cyan** | #06B6D4 | rgb(6, 182, 212) | Secondary color |
| **HopCode Gold** | #F59E0B | rgb(245, 158, 11) | Accent, highlights |
| **HopCode Ivory** | #FEF3C7 | rgb(254, 243, 199) | Special accents |

### Gradient Combinations
```css
/* Butterfly Left Wing */
background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);

/* Butterfly Right Wing */
background: linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%);

/* Text Gradient */
background: linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Background Colors
```css
Dark Background:  #0F0F14 (primary)
Dark Secondary:   #1E1E2E
Light Background: #FFFFFF
Light Secondary:  #F3F4F6
```

---

## 📐 Logo Usage Guidelines

### Clear Space
```
Minimum clear space = height of "H" in logo

    [H]
     ↓
  ┌─────┐
  │     │
  │  🦋  │  ← Logo
  │     │
  └─────┘
     ↓
    [H]
```

**Rule:** Maintain clear space equal to the height of the "H" on all sides.

### Minimum Sizes
| Medium | Minimum Size | Notes |
|--------|-------------|-------|
| **Digital** | 16×16 px | Use simplified version |
| **Print** | 0.5 inches | Full color or monochrome |
| **Favicon** | 16×16 px | Simplified icon only |
| **Social Media** | 400×400 px | Full logo recommended |

### Don'ts
❌ Don't stretch or distort  
❌ Don't change colors (use approved variations)  
❌ Don't add effects (shadows, outlines, etc.)  
❌ Don't rotate at angles  
❌ Don't place on busy backgrounds  
❌ Don't use old "Qwen" logo  

---

## 🔧 How to Export Assets

### Using Inkscape (Free)
```bash
# Install Inkscape
# Open any SVG file
# File → Export PNG
# Select size and DPI
# Export
```

### Using Command Line (ImageMagick)
```bash
# Convert SVG to PNG
convert -density 300 hopcode-logo-concept1.svg -resize 256x256 hopcode-logo-256.png

# Create favicon ICO
convert -density 300 hopcode-logo-simplified.svg -define icon:auto-resize=256,128,64,48,32,16 favicon.ico
```

### Using Online Tools
- **SVG to PNG:** cloudconvert.com/svg-to-png
- **Favicon Generator:** realfavicongenerator.net
- **Resize Images:** bulkresize.photos.com

---

## 📦 Asset Package Structure

```
D:\HopCode\assets\
├── hopcode-logo-concept1.svg       # Primary logo (Butterfly)
├── hopcode-logo-concept2.svg       # Alternative logo (Leaping H)
├── hopcode-logo-concept3.svg       # Alternative logo (Code Circuit)
├── hopcode-wordmark.svg            # Wordmark only
├── hopcode-logo-mono-white.svg     # Monochrome white
├── hopcode-logo-mono-black.svg     # Monochrome black
├── hopcode-logo-simplified.svg     # Simplified icon
├── hopcode-logo-light.svg          # Light theme version
├── hopcode-icon-grid.svg           # Size reference sheet
└── marketing\
    ├── hopcode-social-card.svg         # Social sharing (1200×630)
    ├── hopcode-github-banner.svg       # GitHub header (1200×300)
    ├── hopcode-presentation-slide.svg  # Presentation (1920×1080)
    ├── hopcode-sticker-sheet.svg       # Stickers (800×800)
    └── hopcode-twitter-card.svg        # Twitter card (1200×600)
```

---

## ✅ Usage Checklist

### For VS Code Extension
- [ ] Export `hopcode-logo-simplified.svg` as 256×256 PNG → `icon.png`
- [ ] Export `hopcode-logo-simplified.svg` as 140×140 SVG → `sidebar-icon.svg`

### For Zed Extension
- [ ] Copy `hopcode-logo-concept1.svg` → `hopcode.svg`

### For WebUI
- [ ] Export `hopcode-logo-simplified.svg` as 32×32 PNG → `favicon.png`
- [ ] Export `hopcode-logo-simplified.svg` as SVG → `favicon.svg`

### For Documentation Site
- [ ] Use `hopcode-lockup-horizontal.svg` for header logo
- [ ] Use `hopcode-social-card.svg` for Open Graph image

### For GitHub Repository
- [ ] Export `hopcode-github-banner.svg` as 1200×300 PNG
- [ ] Update profile picture with `hopcode-logo-simplified.svg`

### For Social Media
- [ ] Export `hopcode-twitter-card.svg` as 1200×600 PNG
- [ ] Export `hopcode-social-card.svg` as 1200×630 PNG
- [ ] Export `hopcode-sticker-sheet.svg` for merchandise

---

## 🎯 Next Steps

### Immediate (This Week)
1. [ ] Select primary logo concept
2. [ ] Export all required sizes (PNG, ICO)
3. [ ] Update VS Code extension icon
4. [ ] Update Zed extension icon
5. [ ] Update GitHub repository banner

### Short-term (This Month)
1. [ ] Print stickers for team/events
2. [ ] Create social media posts with new branding
3. [ ] Update documentation site
4. [ ] Update all marketplace listings

### Long-term (Ongoing)
1. [ ] Monitor brand consistency
2. [ ] Create additional marketing materials
3. [ ] Design merchandise (t-shirts, mugs, etc.)
4. [ ] Develop brand guidelines document

---

## 📞 Asset Requests

Need a specific size or format? Use these templates:

### Request Template
```
Asset: [Logo/Banner/Icon]
Size: [Width × Height]
Format: [SVG/PNG/ICO]
Use Case: [Where will it be used?]
Background: [Dark/Light/Transparent]
Deadline: [When is it needed?]
```

---

## 📈 Asset Performance

Track usage and performance:
- **GitHub Banner:** Impressions, click-through rate
- **Social Cards:** Shares, engagement rate
- **Extension Icons:** Install rate, recognition
- **Stickers:** Distribution, feedback

---

**Document End**

*Last Updated: 2026-04-18*  
*Maintained by: HopCode Design Team*
