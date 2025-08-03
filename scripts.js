// Scroll Progress Indicator
function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = scrolled + '%';
}

// Navigation scroll effect
function updateNavbar() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Lightning Animation System
let lightningCanvas, lightningGL, lightningProgram;
let lightningAnimationId;

// Lightning configuration
const lightningOptions = {
  hue: 200, // Blue hue for brand consistency
  xOffset: 0,
  speed: 0.4, // Reduced speed for smoother animation
  intensity: 0.4, // Reduced intensity to be less distracting
  size: 2.0
};

function initLightningSystem() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Check if device is mobile/tablet
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768 || 
                   ('ontouchstart' in window);

  if (isMobile) {
    console.log('Mobile device detected, using simplified background effect');
    createMobileBackground();
    return;
  }

  console.log('Initializing lightning system...');

  // Hide the original canvas and get its container
  canvas.style.display = 'none';
  const container = canvas.parentElement;

  // Create new canvas for lightning effect
  lightningCanvas = document.createElement('canvas');
  lightningCanvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.8;
    mix-blend-mode: screen;
    z-index: 1;
  `;
  
  container.appendChild(lightningCanvas);

  // Resize canvas function
  const resizeCanvas = () => {
    lightningCanvas.width = lightningCanvas.clientWidth;
    lightningCanvas.height = lightningCanvas.clientHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Get WebGL context
  lightningGL = lightningCanvas.getContext('webgl');
  if (!lightningGL) {
    console.error('WebGL not supported, falling back to particles');
    createFallbackParticles();
    return;
  }

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  // Fragment shader - modified for horizontal lightning
  const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uHue;
    uniform float uXOffset;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uSize;
    
    #define OCTAVE_COUNT 8

    vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }

    float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
    }

    float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
    }

    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
            value += amplitude * noise(p);
            p *= rotate2d(0.45);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        
        // Keep original orientation for horizontal lightning (left to right)
        uv.x += uXOffset;
        
        // Apply fbm with vertical movement (bottom to top)
        vec2 noiseOffset = vec2(0.0, -iTime * uSpeed * 0.6);
        uv += 1.5 * fbm(uv * uSize + noiseOffset) - 0.75;
        
        // Use y distance for horizontal lightning bolts (left to right)
        float dist = abs(uv.y);
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.8, 0.9));
        
        // Add smoother randomness with less blinking
        float time1 = iTime * uSpeed * 0.3 + 1.0;
        float time2 = iTime * uSpeed * 0.4 + 10.0;
        float time3 = iTime * uSpeed * 0.2 + 20.0;
        
        float intensity1 = 0.08 + 0.04 * sin(time1) * sin(time1 * 1.3);
        float intensity2 = 0.06 + 0.02 * sin(time2) * sin(time2 * 0.7);
        float intensity3 = 0.04 + 0.02 * sin(time3) * sin(time3 * 1.1);
        
        float lightning1 = pow(intensity1 / (dist + 0.01), 1.2);
        float lightning2 = pow(intensity2 / (dist + 0.02), 1.0);
        float lightning3 = pow(intensity3 / (dist + 0.03), 0.8);
        
        vec3 col = baseColor * (lightning1 + lightning2 * 0.7 + lightning3 * 0.5) * uIntensity;
        
        // Add some glow
        col += baseColor * 0.3 * exp(-dist * 8.0) * uIntensity;
        
        // Subtle color variations for smooth effect
        col.r *= 0.9 + 0.1 * sin(iTime * 0.5 + uv.y * 1.5);
        col.b *= 1.0 + 0.1 * cos(iTime * 0.3 + uv.y * 1.0);
        
        col = pow(col, vec3(0.9));
        fragColor = vec4(col, 1.0);
    }
    
    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  // Compile shader function
  const compileShader = (source, type) => {
    const shader = lightningGL.createShader(type);
    if (!shader) return null;
    lightningGL.shaderSource(shader, source);
    lightningGL.compileShader(shader);
    if (!lightningGL.getShaderParameter(shader, lightningGL.COMPILE_STATUS)) {
      console.error('Shader compile error:', lightningGL.getShaderInfoLog(shader));
      lightningGL.deleteShader(shader);
      return null;
    }
    return shader;
  };

  // Compile shaders
  const vertexShader = compileShader(vertexShaderSource, lightningGL.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, lightningGL.FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) {
    console.error('Failed to compile shaders');
    createFallbackParticles();
    return;
  }

  // Create program
  lightningProgram = lightningGL.createProgram();
  if (!lightningProgram) return;
  lightningGL.attachShader(lightningProgram, vertexShader);
  lightningGL.attachShader(lightningProgram, fragmentShader);
  lightningGL.linkProgram(lightningProgram);
  if (!lightningGL.getProgramParameter(lightningProgram, lightningGL.LINK_STATUS)) {
    console.error('Program linking error:', lightningGL.getProgramInfoLog(lightningProgram));
    return;
  }
  lightningGL.useProgram(lightningProgram);

  // Set up vertices
  const vertices = new Float32Array([
    -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
  ]);
  const vertexBuffer = lightningGL.createBuffer();
  lightningGL.bindBuffer(lightningGL.ARRAY_BUFFER, vertexBuffer);
  lightningGL.bufferData(lightningGL.ARRAY_BUFFER, vertices, lightningGL.STATIC_DRAW);

  const aPosition = lightningGL.getAttribLocation(lightningProgram, 'aPosition');
  lightningGL.enableVertexAttribArray(aPosition);
  lightningGL.vertexAttribPointer(aPosition, 2, lightningGL.FLOAT, false, 0, 0);

  // Get uniform locations
  const iResolutionLocation = lightningGL.getUniformLocation(lightningProgram, 'iResolution');
  const iTimeLocation = lightningGL.getUniformLocation(lightningProgram, 'iTime');
  const uHueLocation = lightningGL.getUniformLocation(lightningProgram, 'uHue');
  const uXOffsetLocation = lightningGL.getUniformLocation(lightningProgram, 'uXOffset');
  const uSpeedLocation = lightningGL.getUniformLocation(lightningProgram, 'uSpeed');
  const uIntensityLocation = lightningGL.getUniformLocation(lightningProgram, 'uIntensity');
  const uSizeLocation = lightningGL.getUniformLocation(lightningProgram, 'uSize');

  const startTime = performance.now();
  
  // Render function
  const render = () => {
    resizeCanvas();
    lightningGL.viewport(0, 0, lightningCanvas.width, lightningCanvas.height);
    lightningGL.uniform2f(iResolutionLocation, lightningCanvas.width, lightningCanvas.height);
    const currentTime = performance.now();
    lightningGL.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
    lightningGL.uniform1f(uHueLocation, lightningOptions.hue);
    lightningGL.uniform1f(uXOffsetLocation, lightningOptions.xOffset);
    lightningGL.uniform1f(uSpeedLocation, lightningOptions.speed);
    lightningGL.uniform1f(uIntensityLocation, lightningOptions.intensity);
    lightningGL.uniform1f(uSizeLocation, lightningOptions.size);
    lightningGL.drawArrays(lightningGL.TRIANGLES, 0, 6);
    lightningAnimationId = requestAnimationFrame(render);
  };
  
  lightningAnimationId = requestAnimationFrame(render);
  
  console.log('Lightning system initialized successfully!');
}

// Mobile-optimized simple background
function createMobileBackground() {
  const canvas = document.getElementById('particle-canvas');
  canvas.style.display = 'none';
  
  const heroBackground = document.querySelector('.hero-background');
  if (!heroBackground) return;
  
  // Create simple CSS gradient animation for mobile
  const mobileBackground = document.createElement('div');
  mobileBackground.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(37, 99, 235, 0.1) 0%, 
      rgba(14, 165, 233, 0.05) 25%, 
      rgba(6, 182, 212, 0.08) 50%, 
      rgba(59, 130, 246, 0.06) 75%, 
      rgba(37, 99, 235, 0.1) 100%
    );
    background-size: 400% 400%;
    animation: mobileGradient 15s ease infinite;
    pointer-events: none;
    opacity: 0.6;
    z-index: 1;
  `;
  
  heroBackground.appendChild(mobileBackground);
  
  // Add CSS animation if not already present
  if (!document.getElementById('mobile-background-styles')) {
    const style = document.createElement('style');
    style.id = 'mobile-background-styles';
    style.textContent = `
      @keyframes mobileGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }
  
  console.log('Mobile background created');
}

// Fallback CSS-only particle effect if WebGL fails to load
function createFallbackParticles() {
  const canvas = document.getElementById('particle-canvas');
  canvas.style.display = 'none';
  
  const heroBackground = document.querySelector('.hero-background');
  if (!heroBackground) return;
  
  // Create CSS-based floating particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'fallback-particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.7), rgba(14, 165, 233, 0.4));
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: 0.8;
      animation: float ${duration}s ${delay}s infinite ease-in-out, pulse ${duration * 0.3}s ${delay}s infinite alternate ease-in-out;
      pointer-events: none;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 0 35px rgba(37, 99, 235, 0.5);
    `;
    
    heroBackground.appendChild(particle);
  }
  
  // Add CSS animation if not already present
  if (!document.getElementById('fallback-particle-styles')) {
    const style = document.createElement('style');
    style.id = 'fallback-particle-styles';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
        25% { transform: translateY(-20px) translateX(15px) scale(1.1); }
        50% { transform: translateY(-10px) translateX(-10px) scale(0.9); }
        75% { transform: translateY(-30px) translateX(5px) scale(1.05); }
      }
      @keyframes pulse {
        0% { opacity: 0.6; }
        100% { opacity: 1.0; }
      }
      .fallback-particle {
        z-index: 0;
      }
    `;
    document.head.appendChild(style);
  }
  
  console.log('Fallback particle effect created');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing components...');
  
  // Initialize lightning system
  try {
    initLightningSystem();
  } catch (error) {
    console.error('Error initializing lightning system:', error);
    createFallbackParticles();
  }
  
  // Initialize animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(el => observer.observe(el));
  
  // Initialize form submission
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    
    // Add loading state
    const button = form.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;
    
    fetch(form.action, {
      method: form.method,
      headers: { 'Accept': 'application/json' },
      body: formData
    }).then(response => {
      if (response.ok) {
        form.reset();
        showMessage("Message sent successfully! We'll get back to you soon.");
      } else {
        response.json().then(data => {
          if (data.errors) {
            showMessage(data.errors.map(error => error.message).join(", "));
          } else {
            showMessage("Oops! There was a problem submitting your form");
          }
        });
      }
    }).catch(error => {
      showMessage("Oops! There was a problem submitting your form");
    }).finally(() => {
      // Reset button state
      button.textContent = originalText;
      button.disabled = false;
    });
    
    return false;
  });
  
  // Initialize demo form submission
  const demoForm = document.getElementById("demoForm");
  demoForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(demoForm);
    
    // Add loading state
    const button = demoForm.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Scheduling...';
    button.disabled = true;
    
    fetch(demoForm.action, {
      method: demoForm.method,
      headers: { 'Accept': 'application/json' },
      body: formData
    }).then(response => {
      if (response.ok) {
        demoForm.reset();
        showDemoMessage("Demo request sent successfully! We'll contact you within 24 hours to schedule your personalized demo.");
        // Hide modal after successful submission
        setTimeout(() => hideDemoModal(), 2000);
      } else {
        response.json().then(data => {
          if (data.errors) {
            showDemoMessage(data.errors.map(error => error.message).join(", "), true);
          } else {
            showDemoMessage("Oops! There was a problem submitting your request", true);
          }
        });
      }
    }).catch(error => {
      showDemoMessage("Oops! There was a problem submitting your request", true);
    }).finally(() => {
      // Reset button state
      button.textContent = originalText;
      button.disabled = false;
    });
    
    return false;
  });
  
  // Initialize smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Check cookie preference and show banner if needed
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (cookiesAccepted === null) {
    // Show cookie banner if no preference set
    setTimeout(showCookieBanner, 1000);
  }
});

// Event listeners
window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateNavbar();
});

window.addEventListener('resize', () => {
  // Lightning canvas resizing is handled internally
});

// Toggle mobile navigation menu
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Helper function to show a message and remove it after 3 seconds
function showMessage(message) {
  const messageDiv = document.getElementById("form-message");
  messageDiv.innerText = message;
  setTimeout(() => { messageDiv.innerText = ""; }, 3000);
}

// Cookie banner functionality
function showCookieBanner() {
  document.getElementById('cookie-banner').classList.add('show');
}

function hideCookieBanner() {
  document.getElementById('cookie-banner').classList.remove('show');
}

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  hideCookieBanner();
}

function declineCookies() {
  localStorage.setItem('cookiesAccepted', 'false');
  hideCookieBanner();
}

function showCookieSettings() {
  showCookieBanner();
}

// Privacy Modal functionality
function showPrivacyModal() {
  document.getElementById('privacy-modal').classList.add('show');
  document.body.classList.add('modal-open');
}

function hidePrivacyModal() {
  document.getElementById('privacy-modal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

// Impressum Modal functionality
function showImpressumModal() {
  document.getElementById('impressum-modal').classList.add('show');
  document.body.classList.add('modal-open');
}

function hideImpressumModal() {
  document.getElementById('impressum-modal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

// Demo Modal functionality
function showDemoModal() {
  document.getElementById('demo-modal').classList.add('show');
  document.body.classList.add('modal-open');
}

function hideDemoModal() {
  document.getElementById('demo-modal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

function showDemoMessage(message, isError = false) {
  const messageDiv = document.getElementById("demo-message");
  messageDiv.innerText = message;
  messageDiv.style.color = isError ? '#ef4444' : '#10b981';
  setTimeout(() => { messageDiv.innerText = ""; }, 5000);
}
