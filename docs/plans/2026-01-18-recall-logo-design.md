# Recall Logo Design

## Overview

A bold "R" monogram with cyberpunk glitch effect for the Recall PWA app icons.

## Design Concept

**Core Element:** Single letter "R" in JetBrains Mono Bold (700 weight) to maintain consistency with the app's UI typography.

**Visual Treatment - Glitch Effect:**
Three offset layers creating chromatic aberration:
- Base layer: Cyan (#00d4ff) at 100% opacity, no offset
- Offset layer 1: Purple (#a78bfa) at 70% opacity, shifted +3px right, -3px up
- Offset layer 2: Pink (#ec4899) at 50% opacity, shifted -3px left, +3px down

**Glow Effects:**
- Cyan layer: Strong outer glow (0 0 20px rgba(0, 212, 255, 0.6))
- Purple layer: Subtle glow (0 0 15px rgba(167, 139, 250, 0.4))
- Combined effect creates neon "bleeding" aesthetic

**Background:**
- Dark background (#0a0e14) matching app theme
- Optional: Subtle grid pattern overlay at 5% opacity

## Technical Implementation

**Format:** SVG (Scalable Vector Graphics)

**Structure:**
- `<text>` element with JetBrains Mono font
- Three layered `<use>` elements for glitch layers
- SVG filters for glow effects (`<feGaussianBlur>` + `<feColorMatrix>`)
- Background rectangle

**Size & Positioning:**
- "R" fills ~70% of canvas (breathing room around edges)
- Centered horizontally and vertically
- Font weight: 700 (Bold)

**Output Files:**
1. `public/logo.svg` - Master SVG file
2. `public/icon-192.png` - 192x192 PNG for PWA
3. `public/icon-512.png` - 512x512 PNG for PWA

**Glitch Offset Scaling:**
- 512x512 canvas: ±3px offset
- 192x192 canvas: Scale proportionally (±1-2px)

## Optional Enhancements

**Not included in initial version:**
- Scanline overlay (thin horizontal lines at 10% opacity)
- Corner brackets framing the "R" (matching UI corner accents)
- Animated glitch for splash screens

## Usage Guidelines

**App Icons (PWA):**
- Static version with glitch effect
- Dark background (#0a0e14)
- High contrast for visibility

**Potential Future Usage:**
- Splash screen: Animated glitch variant
- Header logo: Cyan-only version (no glitch) for cleaner look
- Loading states: Pulsing glow animation

## Color Palette

From app theme (src/index.css):
- Background: #0a0e14
- Cyan: #00d4ff
- Purple: #a78bfa
- Pink: #ec4899

## Typography

- Font: JetBrains Mono
- Weight: 700 (Bold)
- Character: "R" (uppercase)
