/**
 * Icon Generator
 *
 * Generates PNG icons from the SVG logo at various sizes for PWA manifest.
 *
 * Usage: npm run generate-icons
 */

import sharp from 'sharp';
import { readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Configuration
const INPUT_SVG = join(PROJECT_ROOT, 'public', 'logo.svg');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public');
const ICON_CONFIGS = [
  { size: 512, filename: 'icon-512.png' },
  { size: 192, filename: 'icon-192.png' }
];

/**
 * Generate a single PNG icon from SVG buffer
 */
async function generateIcon(svgBuffer, size, outputPath) {
  await sharp(svgBuffer)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({
      compressionLevel: 9,
      quality: 90
    })
    .toFile(outputPath);
}

/**
 * Main execution
 */
async function main() {
  try {
    // Verify input exists
    if (!existsSync(INPUT_SVG)) {
      throw new Error(`Input SVG not found: ${INPUT_SVG}`);
    }

    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Read SVG
    console.log(`Reading ${INPUT_SVG}...`);
    const svgBuffer = await readFile(INPUT_SVG);

    // Generate icons
    for (const config of ICON_CONFIGS) {
      const outputPath = join(OUTPUT_DIR, config.filename);
      await generateIcon(svgBuffer, config.size, outputPath);
      console.log(`✓ Generated ${outputPath} (${config.size}x${config.size})`);
    }

    console.log('\n✓ Icon generation completed successfully!');
  } catch (error) {
    console.error('✗ Error generating icons:');
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

main();
