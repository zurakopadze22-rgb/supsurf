const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/pictures/logo.webp');
const outputPngPath = path.join(__dirname, '../public/favicon.png');
const outputIcoPath = path.join(__dirname, '../public/favicon.ico');

async function createFavicon() {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error('Input logo.webp not found!');
      return;
    }

    const size = 192;
    const padding = 12;
    const innerSize = size - padding * 2;

    // 1. Create a white circular background SVG
    const svgCircle = `
      <svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff" />
      </svg>
    `;

    // 2. Resize the logo webp to fit inside the circle
    const resizedLogo = await sharp(inputPath)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    // 3. Composite the resized logo onto the white circle
    await sharp(Buffer.from(svgCircle))
      .composite([{
        input: resizedLogo,
        top: padding,
        left: padding
      }])
      .png()
      .toFile(outputPngPath);

    // Also write it to favicon.ico as a fallback
    await sharp(outputPngPath)
      .resize(64, 64)
      .toFile(outputIcoPath);

    console.log('✅ Successfully generated favicon.png and favicon.ico with white circular background!');
  } catch (err) {
    console.error('Error generating favicon:', err);
  }
}

createFavicon();
