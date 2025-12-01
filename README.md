# LLMify Website

A modern, responsive website for LLMify - Custom LLM Integration Solutions.

## Project Structure

```
production/
├── index.html           # Clean HTML structure (320 lines)
├── styles.css          # All CSS styles and responsive design (1002 lines)
├── scripts.js          # All JavaScript functionality (228 lines)
├── images/            # Image assets
│   ├── full_logo.png  # Main logo for navigation
│   └── only_logo.png  # Favicon
├── index_original.html # Original monolithic HTML file (backup)
├── CNAME              # GitHub Pages domain configuration
└── README.md          # This file

```

## Features

- **Responsive Design**: Mobile-first approach with clean breakpoints
- **Modern UI**: Glassmorphism effects, smooth animations, and gradient designs
- **Interactive Elements**: Scroll progress indicator, animated particles, smooth scrolling
- **Forms**: Contact form and demo booking modal with form validation
- **Modals**: Privacy policy, impressum, and demo booking modals
- **Cookie Consent**: GDPR-compliant cookie banner
- **Performance**: Optimized with external CSS/JS files for better caching

## Technical Stack

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern features including CSS Grid, Flexbox, CSS Variables, and backdrop-filter
- **Vanilla JavaScript**: No frameworks, clean and efficient code
- **Formspree**: Form handling service for contact and demo forms

## Code Organization

The codebase has been refactored from a single large HTML file into modular components:

- **HTML (320 lines)**: Clean structure without inline styles or scripts
- **CSS (1002 lines)**: Organized with clear sections and responsive breakpoints
- **JavaScript (228 lines)**: Modular functions with clear separation of concerns

## Usage

1. Open `index.html` in a web browser
2. All styles and scripts are automatically loaded from external files
3. The website is fully functional with all original features preserved

## Topographic Backgrounds

The website uses real Swiss elevation data from [swisstopo](https://www.swisstopo.admin.ch/) to generate SVG contour backgrounds for different sections.

### Generating Topo SVGs

```bash
# Generate individual mountains
node scripts/generate-topo.js matterhorn   # Hero section
node scripts/generate-topo.js eiger        # Our Approach section
node scripts/generate-topo.js jungfrau     # Agents section (not currently used)
node scripts/generate-topo.js pilatus      # CTA section

# Or generate all
node scripts/generate-topo.js matterhorn && \
node scripts/generate-topo.js eiger && \
node scripts/generate-topo.js jungfrau && \
node scripts/generate-topo.js pilatus
```

### How It Works

1. Downloads XYZ elevation tiles from swisstopo's swissALTI3D dataset (2m resolution)
2. Caches tiles locally in `scripts/.cache/` for fast regeneration
3. Uses marching squares algorithm to extract contour lines
4. Outputs SVG files to `assets/topo/`

### Mountain Configurations

Each mountain has customizable parameters in `scripts/generate-topo.js`:
- `easting`/`northing`: Swiss LV95 coordinates (EPSG:2056)
- `extent`: Area size in meters from center
- `baseElevation`: Minimum elevation to show contours
- `contourInterval`: Meters between contour lines
- `svgWidth`/`svgHeight`: Output SVG dimensions

## Development Notes

- Follow the user rules: Keep files small, use simple code with minimal fallback
- CSS uses modern features with good browser support
- JavaScript uses ES6+ features with graceful degradation
- All images are optimized and stored in the `images/` directory