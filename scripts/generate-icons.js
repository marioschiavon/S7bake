const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const svgStr = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'), 'utf8');
  
  await sharp(Buffer.from(svgStr))
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/pwa-192x192.png'));

  await sharp(Buffer.from(svgStr))
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/pwa-512x512.png'));

  await sharp(Buffer.from(svgStr))
    .resize(180, 180)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
    
  console.log('Icons generated successfully.');
}

generate().catch(console.error);
