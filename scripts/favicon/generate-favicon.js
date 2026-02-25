#!/usr/bin/env node
/**
 * Signature-grade, two-letter monogram favicon generator (SVG).
 * New design philosophy: sculpted diagonals, interwoven letters, soft light.
 * No external deps.
 *
 * Example:
 *   node scripts/favicon/generate-favicon.js --initials AS --out public/favicons
 */

const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  initials: 'AS',
  size: 512,
  bg1: '#2a2a2a',
  bg2: '#2a2a2a',
  ink1: '#a67856', // primary letter (original palette)
  ink2: '#d2b08a', // secondary letter (original palette)
  accent: '#d2b08a',
  overlap: 0.28,
  tilt: 0, // keep letters upright by default
  fontFamily: "'Playfair Display', 'Times New Roman', serif",
  fontWeight: 700,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const hasValue = argv[i + 1] && !argv[i + 1].startsWith('--');
    parsed[key.slice(2)] = hasValue ? argv[++i] : true;
  }
  return parsed;
}

function sanitizeInitials(raw) {
  return (raw || DEFAULTS.initials)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 2)
    .padEnd(2, '·'); // visible placeholder if only one letter is provided
}

function createPalette(args) {
  return {
    bg1: args.bg1 || args.bg || DEFAULTS.bg1,
    bg2: args.bg2 || args.bg || DEFAULTS.bg2,
    ink1: args.ink1 || args.fg1 || args.fg || DEFAULTS.ink1,
    ink2: args.ink2 || args.fg2 || DEFAULTS.ink2,
    accent: args.accent || DEFAULTS.accent,
  };
}

function approximateWidth(letter) {
  const widths = {
    M: 1.08, W: 1.08, A: 1.06, B: 1.02, D: 1.02, O: 1.02, Q: 1.02,
    C: 1, G: 1, S: 0.98, U: 0.98, V: 0.98, X: 0.98, Z: 0.96,
    H: 0.96, K: 0.96, N: 0.96, R: 0.96, E: 0.92, F: 0.9, P: 0.9,
    L: 0.86, T: 0.86, Y: 0.86, I: 0.75, J: 0.82,
  };
  return widths[letter] || 1;
}

function createLayout(size, overlap, tiltDegrees) {
  const phi = 1.618;
  const baseSpacing = size * 0.4;
  const separation = baseSpacing * (1 - overlap);
  const center = size / 2;

  return {
    fontSize: size * 0.78,
    baseline: size * 0.7,
    letterSpacing: size * -0.01,
    separation,
    center,
    radius: size * 0.14,
    ringStroke: size * 0.014,
    tilt: tiltDegrees,
    glowRadius: size * 0.34,
    frameOffset: size * 0.055,
  };
}

function generateFaviconSvg(options = {}) {
  const {
    initials = DEFAULTS.initials,
    size = DEFAULTS.size,
    overlap = DEFAULTS.overlap,
    tilt = DEFAULTS.tilt,
    fontFamily = DEFAULTS.fontFamily,
    fontWeight = DEFAULTS.fontWeight,
  } = options;

  const safeInitials = sanitizeInitials(initials);
  const [first, second] = safeInitials;
  const palette = createPalette(options);
  const layout = createLayout(size, clamp(Number(overlap) || 0, 0, 1), Number(tilt) || 0);
  const viewBox = `0 0 ${size} ${size}`;
  const frameRotation = layout.tilt ? ` rotate(${layout.tilt} ${size / 2 - layout.frameOffset} ${size / 2 - layout.frameOffset})` : '';

  // Center letters by weighted widths so wide glyphs (e.g., "A") don't drift left
  const w1 = approximateWidth(first);
  const w2 = approximateWidth(second);
  const baseLeftX = layout.center - layout.separation / 2;
  const baseRightX = layout.center + layout.separation / 2;
  const totalW = w1 + w2;
  const currentCentroid = (baseLeftX * w1 + baseRightX * w2) / totalW;
  const shift = layout.center - currentCentroid;
  const leftX = baseLeftX + shift;
  const rightX = baseRightX + shift;

  const topCut = `${size * -0.08},${size * 0.08} ${size * 1.08},${size *
    0.36} ${size * 1.08},${size * 0.66} ${size * -0.08},${size * 0.38}`;
  const bottomCut = `${size * -0.08},${size * 0.82} ${size * 1.08},${size *
    0.54} ${size * 1.08},${size * 0.24} ${size * -0.08},${size * 0.52}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" role="img" aria-label="${safeInitials.trim()} monogram">
  <title>${safeInitials.trim()} monogram</title>
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}" />
      <stop offset="100%" stop-color="${palette.bg2}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.18" />
      <stop offset="70%" stop-color="${palette.accent}" stop-opacity="0.04" />
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ink-primary" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.ink1}" />
      <stop offset="100%" stop-color="${palette.ink1}" />
    </linearGradient>
    <linearGradient id="ink-secondary" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.ink2}" />
      <stop offset="100%" stop-color="${palette.ink2}" />
    </linearGradient>
    <linearGradient id="stroke-accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="mask-top" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="white" />
      <stop offset="55%" stop-color="white" />
      <stop offset="75%" stop-color="black" />
      <stop offset="100%" stop-color="black" />
    </linearGradient>
    <linearGradient id="mask-bottom" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="black" />
      <stop offset="25%" stop-color="black" />
      <stop offset="45%" stop-color="white" />
      <stop offset="100%" stop-color="white" />
    </linearGradient>
    <mask id="diagonal-top">
      <rect width="${size}" height="${size}" fill="url(#mask-top)" />
    </mask>
    <mask id="diagonal-bottom">
      <rect width="${size}" height="${size}" fill="url(#mask-bottom)" />
    </mask>
  </defs>

  <rect width="${size}" height="${size}" rx="${layout.radius}" fill="url(#bg-gradient)" />
  <rect width="${size}" height="${size}" rx="${layout.radius}" fill="url(#glow)" opacity="0.35" />

  <g transform="translate(${layout.frameOffset} ${layout.frameOffset})${frameRotation}">
    <rect x="0" y="0" width="${size - layout.frameOffset * 2}" height="${size - layout.frameOffset * 2}" rx="${layout.radius * 0.7}"
      fill="none" stroke="url(#stroke-accent)" stroke-width="${layout.ringStroke}" />
  </g>

  <g style="paint-order: stroke fill">
    <!-- Base letter (secondary) -->
    <text x="${rightX}" y="${layout.baseline}" text-anchor="middle"
      font-family=${JSON.stringify(fontFamily)} font-size="${layout.fontSize}"
      font-weight="${fontWeight}" letter-spacing="${layout.letterSpacing}"
      fill="url(#ink-secondary)" stroke="rgba(0,0,0,0.16)" stroke-width="${layout.fontSize * 0.022}" stroke-linejoin="round">
      ${second}
    </text>

    <!-- Interleaved top slice of first letter -->
    <g mask="url(#diagonal-top)">
      <text x="${leftX}" y="${layout.baseline}" text-anchor="middle"
        font-family=${JSON.stringify(fontFamily)} font-size="${layout.fontSize}"
        font-weight="${fontWeight}" letter-spacing="${layout.letterSpacing}"
        fill="url(#ink-primary)" stroke="rgba(0,0,0,0.18)" stroke-width="${layout.fontSize * 0.026}" stroke-linejoin="round">
        ${first}
      </text>
    </g>

    <!-- Re-assert lower slice of secondary to weave over primary -->
    <g mask="url(#diagonal-bottom)">
      <text x="${rightX}" y="${layout.baseline}" text-anchor="middle"
        font-family=${JSON.stringify(fontFamily)} font-size="${layout.fontSize}"
        font-weight="${fontWeight}" letter-spacing="${layout.letterSpacing}"
        fill="url(#ink-secondary)" stroke="rgba(0,0,0,0.12)" stroke-width="${layout.fontSize * 0.02}" stroke-linejoin="round">
        ${second}
      </text>
    </g>
  </g>
</svg>
`;
}

function main() {
  const args = parseArgs();
  if (args.help || args.h) {
    console.info(`Usage: node scripts/favicon/generate-favicon.js [--initials AS] [--out public/favicons] [--size 512] [--bg1 #2a2a2a] [--bg2 #1f1c18] [--ink1 #a67856] [--ink2 #d2b08a] [--accent #f2d8b8] [--overlap 0.28] [--tilt 0]`);
    process.exit(0);
  }

  const initials = args.initials || DEFAULTS.initials;
  const size = Number(args.size || DEFAULTS.size);
  const overlap = clamp(Number(args.overlap ?? DEFAULTS.overlap) || DEFAULTS.overlap, 0, 1);
  const tilt = Number(args.tilt ?? DEFAULTS.tilt) || DEFAULTS.tilt;
  const outDir = args.out || path.join('public', 'favicons');
  const outfile = path.join(outDir, `${initials.toLowerCase()}-favicon.svg`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svg = generateFaviconSvg({ ...args, initials, size, overlap, tilt });
  fs.writeFileSync(outfile, svg, 'utf8');
  console.info(`[favicon] sculpted ${outfile}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateFaviconSvg };

