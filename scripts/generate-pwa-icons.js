import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple SVG icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#4A90E2"/>
  <text x="256" y="256" font-family="Arial" font-size="200" fill="white" text-anchor="middle" dominant-baseline="middle">V</text>
</svg>
`;

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Write the SVG icon
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.svg'), svgIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.svg'), svgIcon);
fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), svgIcon);

console.log('PWA icons generated successfully!'); 