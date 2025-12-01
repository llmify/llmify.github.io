#!/usr/bin/env node
/**
 * Generate SVG topographic contours from real swisstopo elevation data
 * Downloads XYZ tile files directly for efficiency (vs individual API calls)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cache directory for downloaded tiles
const CACHE_DIR = path.join(__dirname, '.cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Mountain definitions with Swiss LV95 coordinates (EPSG:2056)
const MOUNTAINS = {
  matterhorn: {
    name: 'Matterhorn',
    // Shifted further north to avoid Swiss-Italian border
    easting: 2619000,
    northing: 1094800,  // Moved north ~1300m
    summit: 4478,
    baseElevation: 2200,
    extent: 2500,
    contourInterval: 100
  },
  eiger: {
    name: 'Eiger',
    easting: 2642500,
    northing: 1158900,
    summit: 3967,
    baseElevation: 1000,
    extent: 5000,      // 10km x 10km area
    contourInterval: 100,
    svgWidth: 1000,    // Portrait orientation
    svgHeight: 1800
  },
  jungfrau: {
    name: 'Jungfrau',
    easting: 2640600,    // Fixed: actual summit area
    northing: 1154600,   // Fixed: actual summit area
    summit: 4158,
    baseElevation: 2500,
    contourInterval: 100
  },
  pilatus: {
    name: 'Pilatus',
    easting: 2661900,
    northing: 1203700,
    summit: 2128,
    baseElevation: 900,
    contourInterval: 50
  }
};

// Find which tiles cover the area
function getTilesForArea(centerE, centerN, extent) {
  const tiles = [];
  const tileSize = 1000; // Each tile is 1km x 1km

  const minE = centerE - extent;
  const maxE = centerE + extent;
  const minN = centerN - extent;
  const maxN = centerN + extent;

  // Tile naming: swissalti3d_YEAR_XXXX-YYYY where XXXX and YYYY are km coordinates
  for (let e = Math.floor(minE / tileSize); e <= Math.floor(maxE / tileSize); e++) {
    for (let n = Math.floor(minN / tileSize); n <= Math.floor(maxN / tileSize); n++) {
      tiles.push({
        id: `${e}-${n}`,
        minE: e * tileSize,
        maxE: (e + 1) * tileSize,
        minN: n * tileSize,
        maxN: (n + 1) * tileSize
      });
    }
  }

  return tiles;
}

// Download and parse XYZ file (with caching)
async function downloadTile(tileId) {
  const cacheFile = path.join(CACHE_DIR, `${tileId}.json`);

  // Check cache first
  if (fs.existsSync(cacheFile)) {
    console.log(`  Loading tile ${tileId} from cache...`);
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      const points = new Map(cached);
      console.log(`    Loaded ${points.size} elevation points (cached)`);
      return points;
    } catch (err) {
      console.log(`    Cache read error, re-downloading...`);
    }
  }

  return new Promise((resolve, reject) => {
    const url = `https://data.geo.admin.ch/ch.swisstopo.swissalti3d/swissalti3d_2019_${tileId}/swissalti3d_2019_${tileId}_2_2056_5728.xyz.zip`;

    console.log(`  Downloading tile ${tileId}...`);

    const tmpFile = `/tmp/tile_${tileId}.xyz.zip`;

    const file = fs.createWriteStream(tmpFile);
    https.get(url, (response) => {
      if (response.statusCode === 404) {
        console.log(`    Tile ${tileId} not found (outside coverage)`);
        // Cache empty result to avoid re-trying
        fs.writeFileSync(cacheFile, '[]');
        resolve(new Map());
        return;
      }
      if (response.statusCode !== 200) {
        console.log(`    Tile ${tileId} error: ${response.statusCode}`);
        resolve(new Map());
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();

        try {
          // Unzip and parse
          const data = execSync(`unzip -p ${tmpFile} 2>/dev/null`, { maxBuffer: 50 * 1024 * 1024 }).toString();
          const points = new Map();

          const lines = data.split('\n');
          for (let i = 1; i < lines.length; i++) { // Skip header
            const parts = lines[i].trim().split(/\s+/);
            if (parts.length >= 3) {
              const x = parseInt(parts[0]);
              const y = parseInt(parts[1]);
              const z = parseFloat(parts[2]);
              if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                points.set(`${x},${y}`, z);
              }
            }
          }

          fs.unlinkSync(tmpFile);

          // Save to cache
          fs.writeFileSync(cacheFile, JSON.stringify([...points]));
          console.log(`    Loaded ${points.size} elevation points (saved to cache)`);
          resolve(points);
        } catch (err) {
          console.log(`    Error parsing tile: ${err.message}`);
          resolve(new Map());
        }
      });
    }).on('error', (err) => {
      console.log(`    Download error: ${err.message}`);
      resolve(new Map());
    });
  });
}

// Build elevation grid from downloaded tiles
// Uses tile-by-tile lookup to avoid Map size limits
async function buildElevationGrid(mountain) {
  const { easting, northing, extent = 3000 } = mountain;
  const gridResolution = 20; // meters per grid cell (for reasonable SVG size)

  console.log(`Building elevation grid for ${mountain.name}...`);
  console.log(`  Center: E ${easting} / N ${northing}`);
  console.log(`  Extent: ±${extent}m`);

  // Get required tiles
  const tiles = getTilesForArea(easting, northing, extent);
  console.log(`  Need ${tiles.length} tile(s): ${tiles.map(t => t.id).join(', ')}`);

  // Download all tiles into separate Maps (avoids size limit)
  const tileData = new Map(); // tileId -> Map of points
  let totalPoints = 0;
  for (const tile of tiles) {
    const points = await downloadTile(tile.id);
    tileData.set(tile.id, points);
    totalPoints += points.size;
  }

  console.log(`  Total elevation points loaded: ${totalPoints}`);

  // Helper to get elevation from the right tile
  const getElevation = (e, n) => {
    const tileE = Math.floor(e / 1000);
    const tileN = Math.floor(n / 1000);
    const tileId = `${tileE}-${tileN}`;
    const points = tileData.get(tileId);
    if (!points) return 0;
    const key = `${e},${n}`;
    return points.get(key) || 0;
  };

  // Build grid
  const minE = easting - extent;
  const minN = northing - extent;
  const gridSize = Math.ceil((extent * 2) / gridResolution);

  const grid = [];
  let minElev = Infinity, maxElev = -Infinity;

  for (let y = 0; y < gridSize; y++) {
    const row = [];
    for (let x = 0; x < gridSize; x++) {
      // Sample from the XYZ data (find nearest point)
      const ptE = minE + x * gridResolution;
      const ptN = minN + y * gridResolution;

      // Round to nearest 2m (XYZ resolution)
      const sampleE = Math.round(ptE / 2) * 2 + 1; // XYZ uses odd coordinates
      const sampleN = Math.round(ptN / 2) * 2 + 1;

      const elev = getElevation(sampleE, sampleN);

      row.push(elev);
      if (elev > 0) {
        minElev = Math.min(minElev, elev);
        maxElev = Math.max(maxElev, elev);
      }
    }
    grid.push(row);
  }

  console.log(`  Grid size: ${gridSize}x${gridSize}`);
  console.log(`  Elevation range: ${minElev.toFixed(0)} - ${maxElev.toFixed(0)}m`);

  return { grid, minElev, maxElev };
}

// Marching squares to extract contour lines
function marchingSquares(grid, level) {
  const contours = [];
  const rows = grid.length;
  const cols = grid[0].length;

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const tl = grid[y][x];
      const tr = grid[y][x + 1];
      const bl = grid[y + 1][x];
      const br = grid[y + 1][x + 1];

      // Skip cells with no data
      if (tl === 0 || tr === 0 || bl === 0 || br === 0) continue;

      let idx = 0;
      if (tl >= level) idx |= 8;
      if (tr >= level) idx |= 4;
      if (br >= level) idx |= 2;
      if (bl >= level) idx |= 1;

      if (idx === 0 || idx === 15) continue;

      const lerp = (v1, v2, pos1, pos2) => {
        if (Math.abs(v2 - v1) < 0.001) return (pos1 + pos2) / 2;
        const t = (level - v1) / (v2 - v1);
        return pos1 + t * (pos2 - pos1);
      };

      const top = { x: lerp(tl, tr, x, x + 1), y: y };
      const right = { x: x + 1, y: lerp(tr, br, y, y + 1) };
      const bottom = { x: lerp(bl, br, x, x + 1), y: y + 1 };
      const left = { x: x, y: lerp(tl, bl, y, y + 1) };

      const addSegment = (p1, p2) => contours.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });

      switch (idx) {
        case 1: case 14: addSegment(left, bottom); break;
        case 2: case 13: addSegment(bottom, right); break;
        case 3: case 12: addSegment(left, right); break;
        case 4: case 11: addSegment(top, right); break;
        case 5: addSegment(left, top); addSegment(bottom, right); break;
        case 6: case 9: addSegment(top, bottom); break;
        case 7: case 8: addSegment(left, top); break;
        case 10: addSegment(top, right); addSegment(left, bottom); break;
      }
    }
  }

  return contours;
}

// Connect segments into paths
function connectSegments(segments, tolerance = 0.1) {
  if (segments.length === 0) return [];

  const paths = [];
  const used = new Set();
  const dist = (x1, y1, x2, y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);

  for (let i = 0; i < segments.length; i++) {
    if (used.has(i)) continue;

    const path = [{ x: segments[i].x1, y: segments[i].y1 }, { x: segments[i].x2, y: segments[i].y2 }];
    used.add(i);

    let extended = true;
    while (extended) {
      extended = false;
      const start = path[0];
      const end = path[path.length - 1];

      for (let j = 0; j < segments.length; j++) {
        if (used.has(j)) continue;
        const seg = segments[j];

        if (dist(end.x, end.y, seg.x1, seg.y1) < tolerance) {
          path.push({ x: seg.x2, y: seg.y2 });
          used.add(j);
          extended = true;
        } else if (dist(end.x, end.y, seg.x2, seg.y2) < tolerance) {
          path.push({ x: seg.x1, y: seg.y1 });
          used.add(j);
          extended = true;
        } else if (dist(start.x, start.y, seg.x1, seg.y1) < tolerance) {
          path.unshift({ x: seg.x2, y: seg.y2 });
          used.add(j);
          extended = true;
        } else if (dist(start.x, start.y, seg.x2, seg.y2) < tolerance) {
          path.unshift({ x: seg.x1, y: seg.y1 });
          used.add(j);
          extended = true;
        }
      }
    }

    if (path.length >= 3) {
      paths.push(path);
    }
  }

  return paths;
}

// Simplify path using Douglas-Peucker
function simplifyPath(path, tolerance = 0.5) {
  if (path.length <= 2) return path;

  const perpendicularDistance = (p, p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return Math.sqrt((p.x - p1.x) ** 2 + (p.y - p1.y) ** 2);
    return Math.abs(dy * p.x - dx * p.y + p2.x * p1.y - p2.y * p1.x) / len;
  };

  let maxDist = 0, maxIdx = 0;
  for (let i = 1; i < path.length - 1; i++) {
    const dist = perpendicularDistance(path[i], path[0], path[path.length - 1]);
    if (dist > maxDist) { maxDist = dist; maxIdx = i; }
  }

  if (maxDist > tolerance) {
    const left = simplifyPath(path.slice(0, maxIdx + 1), tolerance);
    const right = simplifyPath(path.slice(maxIdx), tolerance);
    return left.slice(0, -1).concat(right);
  }

  return [path[0], path[path.length - 1]];
}

// Convert path to SVG path data
function pathToSvg(path, gridSize, svgWidth, svgHeight) {
  if (path.length < 2) return '';

  const scaleX = svgWidth / gridSize;
  const scaleY = svgHeight / gridSize;

  const points = path.map(p => ({
    x: p.x * scaleX,
    y: (gridSize - p.y) * scaleY  // Flip Y for SVG coordinates
  }));

  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
  }

  return d;
}

// Generate SVG from elevation grid
function generateSvg(gridData, mountain) {
  const { grid, minElev, maxElev } = gridData;
  // Allow custom aspect ratio per mountain (default landscape 1920x1080)
  const svgWidth = mountain.svgWidth || 1920;
  const svgHeight = mountain.svgHeight || 1080;
  const gridSize = grid.length;
  const contourInterval = mountain.contourInterval || 100;

  const effectiveMin = Math.max(mountain.baseElevation, minElev);

  console.log(`\nGenerating contours from ${effectiveMin}m to ${maxElev.toFixed(0)}m at ${contourInterval}m intervals...`);

  const levels = [];
  for (let elev = Math.ceil(effectiveMin / contourInterval) * contourInterval; elev <= maxElev; elev += contourInterval) {
    levels.push(elev);
  }

  console.log(`  ${levels.length} contour levels`);

  let paths = [];

  for (const level of levels) {
    const segments = marchingSquares(grid, level);
    const connected = connectSegments(segments);

    for (const path of connected) {
      const simplified = simplifyPath(path, 0.3);
      const svgPath = pathToSvg(simplified, gridSize, svgWidth, svgHeight);

      if (svgPath) {
        const normalizedElev = (level - effectiveMin) / (maxElev - effectiveMin);
        const opacity = 0.08 + normalizedElev * 0.25;  // 0.08 to 0.33
        const strokeWidth = 0.6 + (1 - normalizedElev) * 0.6;  // 0.6 to 1.2

        paths.push({
          d: svgPath,
          elevation: level,
          opacity: opacity.toFixed(2),
          strokeWidth: strokeWidth.toFixed(1)
        });
      }
    }
  }

  paths.sort((a, b) => a.elevation - b.elevation);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid slice">
  <!-- ${mountain.name} (${mountain.summit}m) - Real topographic contours from swisstopo -->
  <!-- Generated from swissALTI3D elevation data -->
`;

  for (const p of paths) {
    svg += `  <path d="${p.d}" fill="none" stroke="#94a3b8" stroke-width="${p.strokeWidth}" opacity="${p.opacity}"/>\n`;
  }

  svg += `</svg>\n`;

  return svg;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const mountainName = args[0] || 'matterhorn';

  if (!MOUNTAINS[mountainName]) {
    console.log(`Unknown mountain: ${mountainName}`);
    console.log(`Available: ${Object.keys(MOUNTAINS).join(', ')}`);
    process.exit(1);
  }

  const mountain = MOUNTAINS[mountainName];
  console.log(`\n=== Generating topographic SVG for ${mountain.name} ===\n`);

  try {
    const gridData = await buildElevationGrid(mountain);
    const svg = generateSvg(gridData, mountain);

    const outputPath = path.join(__dirname, '..', 'assets', 'topo', `${mountainName}.svg`);
    fs.writeFileSync(outputPath, svg);

    console.log(`\nSVG saved to: ${outputPath}`);
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
