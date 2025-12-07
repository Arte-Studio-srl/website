#!/usr/bin/env node

/**
 * Placeholder Image Generator
 * This script creates placeholder SVG images for the project
 * Run: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');

const projects = [
  'summit', 'music-fest', 'biennale', 'fashion-week', 'opera', 'auto-show',
  'tech-conf', 'jazz-fest', 'design-week', 'haute-couture', 'contemporary-play',
  'tech-expo', 'medical-congress', 'electronic-fest', 'photo-exhibit', 'resort-show',
  'ballet', 'luxury-booth', 'startup-summit', 'concert-series'
];

const colors = {
  conventions: '#4A5568',
  events: '#805AD5',
  exhibitions: '#2C7A7B',
  'fashion-shows': '#C05621',
  theater: '#9F7AEA',
  stands: '#2F855A'
};

function createSVG(text, color, width = 1200, height = 800) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <g opacity="0.1">
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="white" stroke-width="2"/>
    <line x1="0" y1="0" x2="0" y2="${height}" stroke="white" stroke-width="2"/>
    ${Array.from({ length: Math.floor(width / 40) }, (_, i) => 
      `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${height}" stroke="white" stroke-width="0.5"/>`
    ).join('\n    ')}
    ${Array.from({ length: Math.floor(height / 40) }, (_, i) => 
      `<line x1="0" y1="${i * 40}" x2="${width}" y2="${i * 40}" stroke="white" stroke-width="0.5"/>`
    ).join('\n    ')}
  </g>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dy=".3em">${text}</text>
</svg>`;
}

projects.forEach(project => {
  const projectDir = path.join(__dirname, '..', 'public', 'images', 'projects', project);
  
  // Create project directory
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Generate thumbnail
  const thumbSVG = createSVG(project.split('-').join(' ').toUpperCase(), '#a67856');
  fs.writeFileSync(path.join(projectDir, 'thumb.jpg'), thumbSVG);

  // Generate drawing images
  for (let i = 1; i <= 2; i++) {
    const drawingSVG = createSVG(`${project} - DRAWING ${i}`, '#8b6347');
    fs.writeFileSync(path.join(projectDir, `drawing-${i}.jpg`), drawingSVG);
  }

  // Generate final images
  for (let i = 1; i <= 3; i++) {
    const finalSVG = createSVG(`${project} - FINAL ${i}`, '#73513b');
    fs.writeFileSync(path.join(projectDir, `final-${i}.jpg`), finalSVG);
  }

  console.log(`✓ Generated images for ${project}`);
});

console.log('\n✅ All placeholder images generated successfully!');
console.log('\n📝 Note: Replace these SVG placeholders with actual project images.');

