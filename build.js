const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const PARTIALS_DIR = path.join(ROOT, '_partials');

// Collect all HTML files (exclude _partials and node_modules)
function findHtmlFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '_partials') continue;
      results = results.concat(findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

// Load partials
const partials = {};
for (const file of fs.readdirSync(PARTIALS_DIR)) {
  const name = path.basename(file, '.html');
  partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf8');
}

// Replace <!-- INCLUDE:name --> ... <!-- /INCLUDE:name --> blocks (idempotent)
// Also handles first-time <!-- INCLUDE:name --> without a closing tag
const htmlFiles = findHtmlFiles(ROOT);
let replaced = 0;

for (const file of htmlFiles) {
  const original = fs.readFileSync(file, 'utf8');
  let result = original;

  // First pass: replace existing paired blocks (re-run safe)
  result = result.replace(
    /<!-- INCLUDE:(\w+) -->[\s\S]*?<!-- \/INCLUDE:\1 -->/g,
    (match, name) => {
      if (!partials[name]) return match;
      return `<!-- INCLUDE:${name} -->\n${partials[name]}\n<!-- /INCLUDE:${name} -->`;
    }
  );

  // Second pass: expand unpaired markers (first build)
  result = result.replace(
    /<!-- INCLUDE:(\w+) -->(?!\n[\s\S]*?<!-- \/INCLUDE:\1 -->)/g,
    (match, name) => {
      if (!partials[name]) {
        console.warn(`Warning: partial "${name}" not found (${path.relative(ROOT, file)})`);
        return match;
      }
      return `<!-- INCLUDE:${name} -->\n${partials[name]}\n<!-- /INCLUDE:${name} -->`;
    }
  );

  if (result !== original) {
    fs.writeFileSync(file, result, 'utf8');
    replaced++;
    console.log('  included partials in', path.relative(ROOT, file));
  }
}

console.log(`Processed ${htmlFiles.length} files, updated ${replaced}`);

// Run Tailwind
console.log('Building Tailwind CSS...');
execSync('npx tailwindcss -i css/src.css -o css/styles.css --minify', {
  cwd: ROOT,
  stdio: 'inherit',
});
