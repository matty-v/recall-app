# Recall Logo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create cyberpunk glitch-effect logo icons for the Recall PWA app

**Architecture:** Generate SVG logo with glitch effect using JetBrains Mono font and three layered text elements (cyan, purple, pink) with chromatic aberration. Export to PNG at required PWA icon sizes.

**Tech Stack:** SVG, sharp (for PNG conversion), JetBrains Mono font

---

## Task 1: Create SVG Logo

**Files:**
- Create: `public/logo.svg`

**Step 1: Create SVG with glitch effect**

Create `public/logo.svg` with the following structure:
- 512x512 viewBox
- Dark background (#0a0e14)
- JetBrains Mono Bold "R" character
- Three layers for glitch effect (cyan, purple, pink)
- Glow filters using feGaussianBlur

```xml
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Glow filter for cyan -->
    <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Glow filter for purple -->
    <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Dark background -->
  <rect width="512" height="512" fill="#0a0e14"/>

  <!-- Base text element (hidden, used for reference) -->
  <text id="baseR" x="256" y="356"
        font-family="JetBrains Mono, monospace"
        font-weight="700"
        font-size="280"
        text-anchor="middle"
        fill="none">R</text>

  <!-- Pink layer (bottom, shifted left and down) -->
  <use href="#baseR" x="-3" y="3" fill="#ec4899" opacity="0.5"/>

  <!-- Purple layer (middle, shifted right and up, with glow) -->
  <use href="#baseR" x="3" y="-3" fill="#a78bfa" opacity="0.7" filter="url(#glowPurple)"/>

  <!-- Cyan layer (top, no offset, with glow) -->
  <use href="#baseR" fill="#00d4ff" opacity="1.0" filter="url(#glowCyan)"/>
</svg>
```

**Step 2: Verify SVG renders correctly**

Run: `open public/logo.svg`

Expected: Browser opens showing:
- 512x512 dark background
- Bold "R" with glitch/chromatic aberration effect
- Cyan, purple, pink layers visible with offset
- Glow effect around the letters

**Step 3: Commit SVG logo**

```bash
git add public/logo.svg
git commit -m "feat: add SVG logo with cyberpunk glitch effect"
```

---

## Task 2: Generate PNG Icons

**Files:**
- Create: `scripts/generate-icons.js`
- Create: `public/icon-192.png` (generated)
- Create: `public/icon-512.png` (generated)
- Modify: `public/icon-192.png` (replace placeholder)
- Modify: `public/icon-512.png` (replace placeholder)

**Step 1: Install sharp for image conversion**

Run: `npm install --save-dev sharp`

Expected: sharp added to devDependencies

**Step 2: Create icon generation script**

Create `scripts/generate-icons.js`:

```javascript
import sharp from 'sharp';
import { readFileSync } from 'fs';

const svgBuffer = readFileSync('public/logo.svg');

// Generate 512x512 icon
await sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile('public/icon-512.png');

console.log('✓ Generated public/icon-512.png');

// Generate 192x192 icon
await sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile('public/icon-192.png');

console.log('✓ Generated public/icon-192.png');
```

**Step 3: Add script to package.json**

Modify `package.json` to add the generate-icons script:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "generate-icons": "node scripts/generate-icons.js"
}
```

**Step 4: Run icon generation**

Run: `npm run generate-icons`

Expected output:
```
✓ Generated public/icon-512.png
✓ Generated public/icon-192.png
```

**Step 5: Verify generated PNGs**

Run: `open public/icon-192.png && open public/icon-512.png`

Expected: Both images open showing the glitch logo at correct sizes

**Step 6: Commit icon generation**

```bash
git add scripts/generate-icons.js package.json package-lock.json public/icon-192.png public/icon-512.png
git commit -m "feat: add icon generation script and generate PNG icons"
```

---

## Task 3: Update PWA Manifest

**Files:**
- Modify: `vite.config.ts:13-20` (manifest icons section)

**Step 1: Verify icons are referenced in manifest**

The PWA manifest in `vite.config.ts` should already reference the icons:

```typescript
icons: [
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
]
```

Expected: No changes needed, icons are already configured correctly

**Step 2: Build the app**

Run: `npm run build`

Expected: Build succeeds with no errors

**Step 3: Preview the built app**

Run: `npm run preview`

Expected: App runs on http://localhost:4173

**Step 4: Test PWA manifest**

Open: `http://localhost:4173/manifest.webmanifest`

Expected: JSON response showing:
```json
{
  "name": "Recall",
  "short_name": "Recall",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  ...
}
```

**Step 5: Test icon files are accessible**

Open: `http://localhost:4173/icon-192.png` and `http://localhost:4173/icon-512.png`

Expected: Both icons load and display the glitch logo

Stop the preview server (Ctrl+C)

**Step 6: Commit if any changes were needed**

If no changes were needed:
```bash
# No commit needed, icons are already correctly configured
```

If changes were made:
```bash
git add vite.config.ts
git commit -m "chore: update PWA manifest icon references"
```

---

## Task 4: Update README with Logo

**Files:**
- Modify: `README.md:1-3` (add logo at top)

**Step 1: Add logo to README**

Add logo image reference at the top of `README.md`:

```markdown
<p align="center">
  <img src="public/logo.svg" alt="Recall Logo" width="128" height="128">
</p>

# Recall

A PWA for managing projects and wikis stored in Google Sheets with Claude.ai integration.
```

**Step 2: Preview README**

View the README in GitHub or a markdown preview to verify the logo displays correctly.

**Step 3: Commit README update**

```bash
git add README.md
git commit -m "docs: add logo to README"
```

---

## Testing Checklist

After all tasks complete, verify:

1. **SVG renders correctly**
   - Open `public/logo.svg` in browser
   - Verify glitch effect with cyan/purple/pink layers
   - Verify glow effects are visible

2. **PNG icons exist and are correct size**
   - Run: `file public/icon-192.png public/icon-512.png`
   - Expected: Both show as PNG images with correct dimensions

3. **PWA manifest includes icons**
   - Run: `npm run build && npm run preview`
   - Navigate to http://localhost:4173/manifest.webmanifest
   - Verify icons array includes both sizes

4. **Icons are accessible**
   - Navigate to http://localhost:4173/icon-192.png
   - Navigate to http://localhost:4173/icon-512.png
   - Both should display the logo

5. **PWA installation uses new icons**
   - In Chrome DevTools, Application tab → Manifest
   - Verify icons are listed and preview correctly
   - Test "Install app" - icon should show in OS app list

---

## Deployment Test

This implementation will test the full deployment workflow:

**Step 1: Push to main branch**

```bash
git push origin feature/logo:main
```

**Step 2: Monitor GitHub Actions**

Run: `gh run watch`

Expected: Deployment workflow runs and completes successfully

**Step 3: Verify deployed site**

Open: https://kinetic-object-322814.web.app

Expected: Site loads with new logo icons visible in:
- Browser tab favicon
- PWA install prompt
- Installed app icon

**Step 4: Verify custom domain (if SSL ready)**

Open: https://recall.voget.io

Expected: Site loads with new icons (if SSL certificate is provisioned)

---

## Notes

- The SVG uses web-safe fallback to `monospace` if JetBrains Mono doesn't load
- Icon generation script uses sharp which handles SVG → PNG conversion reliably
- PWA manifest already correctly configured from initial setup
- No need to modify service worker or caching rules
- This implementation doubles as a deployment workflow test
