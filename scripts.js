// Throttled scroll functions for better performance
let scrollTicking = false;

// Dropdown toggle function
function toggleDropdown(event) {
  event.preventDefault();
  const dropdown = event.target.closest('.dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  const arrow = dropdown.querySelector('.dropdown-arrow');
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // On mobile, just toggle visibility without animations
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
      arrow.style.transform = 'rotate(0deg)';
    } else {
      // Close other dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
        if (otherMenu !== menu) {
          otherMenu.style.display = 'none';
        }
      });
      menu.style.display = 'block';
      arrow.style.transform = 'rotate(180deg)';
    }
  } else {
    // Desktop behavior
    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
      if (otherMenu !== menu) {
        otherMenu.style.opacity = '0';
        otherMenu.style.visibility = 'hidden';
        otherMenu.style.transform = 'translateY(-10px)';
      }
    });
    
    // Toggle current dropdown
    if (menu.style.opacity === '1') {
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      menu.style.transform = 'translateY(-10px)';
      arrow.style.transform = 'rotate(0deg)';
    } else {
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(0)';
      arrow.style.transform = 'rotate(180deg)';
    }
  }
}

function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
  }
}

function updateNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

// Throttled scroll handler using requestAnimationFrame
function handleScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbar();
      scrollTicking = false;
    });
    scrollTicking = true;
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

// Fix mobile layout immediately to prevent initial sizing issues
function fixMobileLayout() {
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    
    // Force proper viewport constraints
    document.documentElement.style.width = '100%';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.position = 'relative';
    
    // Fix navigation container immediately
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
      navContainer.style.width = '100%';
      navContainer.style.maxWidth = '100%';
      navContainer.style.padding = '0.75rem 4%';
      navContainer.style.margin = '0';
      navContainer.style.boxSizing = 'border-box';
      navContainer.style.position = 'relative';
      navContainer.style.overflow = 'visible';
    }
    
    // Fix navigation element
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.width = '100%';
      nav.style.maxWidth = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.position = 'fixed';
      nav.style.overflow = 'visible';
    }
  }
}

// Optimized video autoplay functionality with lazy loading
function initVideoAutoplay() {
  const video = document.getElementById('teaser-video');
  if (!video) return;

  const isLowPerformance = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          window.innerWidth <= 768 ||
                          (navigator.deviceMemory && navigator.deviceMemory < 4);

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }
        
        if (!isLowPerformance) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Video autoplay started successfully
            }).catch(error => {
              // Video autoplay failed (likely due to browser policy)
            });
          }
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '50px'
  });

  videoObserver.observe(video);
  video.preload = 'metadata';
}

// Performance optimization utilities
const PerformanceOptimizer = {
  isLowPerformance: false,
  
  init() {
    this.detectPerformance();
    this.optimizeForDevice();
  },
  
  detectPerformance() {
    this.isLowPerformance = 
      (navigator.deviceMemory && navigator.deviceMemory < 2) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) ||
      (navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g'));
    
    // Performance mode detected
  },
  
  optimizeForDevice() {
    if (this.isLowPerformance) {
      this.disableExpensiveEffects();
      this.reduceAnimationQuality();
      this.optimizeImages();
    }
  },
  
  disableExpensiveEffects() {
    const style = document.createElement('style');
    style.textContent = `
      .card::before,
      .value-point::before,
      .security-feature::before,
      .timeline-content::before,
      .philosophy-card::before,
      .benefit-item::before {
        display: none !important;
      }
      
      .btn, .card, .value-point, .security-feature {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      }
      
      .glass, .modal-content, .nav-links, nav {
        backdrop-filter: none !important;
      }
      
      .card:hover, .value-point:hover, .security-feature:hover {
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  },
  
  reduceAnimationQuality() {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in, .slide-in-left, .slide-in-right, .scale-in {
        transition-duration: 0.2s !important;
      }
    `;
    document.head.appendChild(style);
  },
  
  optimizeImages() {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.loading = 'lazy';
    });
  }
};

fixMobileLayout();
PerformanceOptimizer.init();

// OPTIMIZED particle animation - only runs for current page's canvas
function initParticleAnimation() {
  const isVeryLowPerformance = (navigator.deviceMemory && navigator.deviceMemory < 2) ||
                               (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) ||
                               (navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g'));
  
  if (isVeryLowPerformance) {
    // Very low performance device detected - disabling particle animations
    return;
  }

  // Find the canvas that actually exists on this page
  const canvasSelectors = [
    '#hero-particle-canvas',
    '#agents-particle-canvas', 
    '#security-particle-canvas',
    '#team-particle-canvas',
    '#contact-particle-canvas'
  ];
  
  let canvas = null;
  let canvasId = null;
  
  for (const selector of canvasSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      canvas = element;
      canvasId = selector.substring(1); // Remove the # from selector
      break;
    }
  }
  
  if (!canvas) {
    // No particle canvas found on this page
    return;
  }

  // Initializing particles for current page
  
  const ctx = canvas.getContext('2d');
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  let particles = [];
  let connections = [];
  let animationId;
  let isVisible = true;
  let isInViewport = true; // Start as true since hero sections are typically initially visible
  let lastFrameTime = 0;
  let connectionTimer;
  
  const targetFPS = 25;
  const frameInterval = 1000 / targetFPS;
  
  // Page-specific colors
  const colorMap = {
    'hero-particle-canvas': 'rgba(168, 85, 247, ',      // Purple for home
    'agents-particle-canvas': 'rgba(59, 130, 246, ',    // Blue for agents  
    'security-particle-canvas': 'rgba(6, 182, 212, ',   // Cyan for security
    'team-particle-canvas': 'rgba(37, 99, 235, ',       // Deep blue for team
    'contact-particle-canvas': 'rgba(14, 165, 233, '    // Sky blue for contact
  };
  
  const particleColor = colorMap[canvasId] || 'rgba(92, 159, 255, ';
  const connectionColor = particleColor;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const size = Math.random() * 4 + 3; // Simplified size: 3-7px
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: size,
      opacity: Math.random() * 0.3 + 0.5
    };
  }

  function initParticles() {
    particles = [];
    // Use 50 particles on desktop, 25 on mobile
    const particleCount = isMobile ? 25 : 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    buildConnections();
    startConnectionTimer();
  }

  function buildConnections() {
    connections = [];
    const maxDistance = isMobile ? 250 : 320; // Increased distance for more connections
    const minConnections = 3; // Guarantee minimum connections per particle
    
    // First pass: Connect particles within maxDistance
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = Math.sqrt(
          Math.pow(particles[i].x - particles[j].x, 2) + 
          Math.pow(particles[i].y - particles[j].y, 2)
        );
        
        if (distance < maxDistance) {
          connections.push({
            i: i,
            j: j,
            opacity: (1 - distance / maxDistance) * 0.6, // Increased opacity
            distance: distance
          });
        }
      }
    }
    
    // Second pass: Ensure each particle has minimum connections
    for (let i = 0; i < particles.length; i++) {
      const particleConnections = connections.filter(conn => conn.i === i || conn.j === i);
      
      if (particleConnections.length < minConnections) {
        // Find nearest particles not yet connected
        const distances = [];
        for (let j = 0; j < particles.length; j++) {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(particles[i].x - particles[j].x, 2) + 
              Math.pow(particles[i].y - particles[j].y, 2)
            );
            const alreadyConnected = connections.some(conn => 
              (conn.i === i && conn.j === j) || (conn.i === j && conn.j === i)
            );
            
            if (!alreadyConnected) {
              distances.push({ index: j, distance: distance });
            }
          }
        }
        
        // Sort by distance and add nearest connections
        distances.sort((a, b) => a.distance - b.distance);
        const needed = minConnections - particleConnections.length;
        
        for (let k = 0; k < needed && k < distances.length; k++) {
          const target = distances[k];
          connections.push({
            i: Math.min(i, target.index),
            j: Math.max(i, target.index),
            opacity: Math.max(0.2, (1 - target.distance / (maxDistance * 1.5)) * 0.5),
            distance: target.distance,
            forced: true // Mark as guaranteed connection
          });
        }
      }
    }
    
    // Rebuilt particle connections
  }

  function startConnectionTimer() {
    if (connectionTimer) clearInterval(connectionTimer);
    connectionTimer = setInterval(() => {
      if (isVisible) {
        buildConnections();
      }
    }, 3000); // 3 seconds as requested
  }

  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first
    connections.forEach(conn => {
      const p1 = particles[conn.i];
      const p2 = particles[conn.j];
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = connectionColor + conn.opacity + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    
    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor + particle.opacity + ')';
      ctx.fill();
      
      // Simple glow effect
      ctx.shadowColor = particleColor + (particle.opacity * 0.6) + ')';
      ctx.shadowBlur = particle.size * 1.2;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function animate(currentTime) {
    if (!isVisible || !isInViewport) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    if (currentTime - lastFrameTime >= frameInterval) {
      updateParticles();
      drawParticles();
      lastFrameTime = currentTime;
    }
    
    animationId = requestAnimationFrame(animate);
  }

  function start() {
    resizeCanvas();
    initParticles();
    animate();
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (connectionTimer) {
      clearInterval(connectionTimer);
      connectionTimer = null;
    }
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
  }

  // Visibility optimization
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Viewport visibility optimization
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isInViewport = entry.isIntersecting;
      // Particles viewport visibility changed
    });
  }, {
    rootMargin: '100px', // Start animating 100px before entering viewport
    threshold: 0.1 // Trigger when at least 10% of canvas is visible
  });

  intersectionObserver.observe(canvas);

  // Resize handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 250);
  });

  // Cleanup
  window.addEventListener('beforeunload', stop);

  // Start animation
  start();
}

// Toggle mobile navigation menu
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const menuIcon = document.querySelector('.menu-icon');
  
  if (navLinks) {
    navLinks.classList.toggle('active');
    if (menuIcon) {
      menuIcon.classList.toggle('active');
    }
  }
}

// Form message helper
function showMessage(message) {
  const messageDiv = document.getElementById("form-message");
  if (messageDiv) {
    messageDiv.innerText = message;
    setTimeout(() => { messageDiv.innerText = ""; }, 3000);
  }
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
  if (messageDiv) {
    messageDiv.innerText = message;
    messageDiv.style.color = isError ? '#ef4444' : '#10b981';
    setTimeout(() => { messageDiv.innerText = ""; }, 5000);
  }
}

// Timeline scroll activation
function initTimelineScrollActivation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineItems.forEach(item => item.classList.remove('active'));
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.6,
    rootMargin: '-20% 0px -20% 0px'
  });
  
  timelineItems.forEach(item => timelineObserver.observe(item));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // DOM loaded, initializing components
  
  fixMobileLayout();
  initParticleAnimation(); // Only runs for current page's canvas
  initTimelineScrollActivation();
  
  // Initialize animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(el => observer.observe(el));
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
      const isMobile = window.innerWidth <= 768;
      
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (isMobile) {
          menu.style.display = 'none';
        } else {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateY(-10px)';
        }
      });
      document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
        arrow.style.transform = 'rotate(0deg)';
      });
    }
  });
  
  initVideoAutoplay();
  
  // Contact form submission
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(form);
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
        button.textContent = originalText;
        button.disabled = false;
      });
    });
  }
  
  // Demo form submission
  const demoForm = document.getElementById("demoForm");
  if (demoForm) {
    demoForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(demoForm);
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
          // Check form type to show appropriate message
          const formType = formData.get('form_type');
          if (formType === 'workshop_booking') {
            showDemoMessage("Workshop request sent successfully! We'll contact you within 24 hours to schedule your customized workshop session.");
          } else {
            showDemoMessage("Demo request sent successfully! We'll contact you within 24 hours to schedule your personalized demo.");
          }
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
        button.textContent = originalText;
        button.disabled = false;
      });
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && href.length > 1) { // Check if href exists and is not just '#'
        try {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } catch (error) {
          // Silently handle invalid selectors
        }
      }
    });
  });
  
  // Cookie banner
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (cookiesAccepted === null) {
    setTimeout(showCookieBanner, 1000);
  }

  // Initialize slide button
  initializeSlideButton();
});

// Optimized event listeners
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', fixMobileLayout);
window.addEventListener('orientationchange', () => {
  setTimeout(fixMobileLayout, 100);
});

// Make toggleMenu available globally
window.toggleMenu = toggleMenu;

// Slide Button Functionality
function initializeSlideButton() {
  const slideButton = document.getElementById('customAgentSlider');
  const slideThumb = document.getElementById('slideThumb');
  
  if (!slideButton || !slideThumb) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let thumbStartX = 0;
  let maxDistance = 0;
  const threshold = 0.8; // 80% of the track needs to be covered

  function calculateMaxDistance() {
    const buttonRect = slideButton.getBoundingClientRect();
    const thumbRect = slideThumb.getBoundingClientRect();
    maxDistance = buttonRect.width - thumbRect.width - 8; // 8px for padding
  }

  function getEventX(e) {
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  }

  function startDrag(e) {
    if (slideButton.classList.contains('completed')) return;
    
    isDragging = true;
    slideButton.classList.add('sliding');
    startX = getEventX(e);
    
    const thumbRect = slideThumb.getBoundingClientRect();
    const buttonRect = slideButton.getBoundingClientRect();
    thumbStartX = thumbRect.left - buttonRect.left;
    
    calculateMaxDistance();
    
    e.preventDefault();
  }

  function drag(e) {
    if (!isDragging) return;
    
    currentX = getEventX(e);
    const deltaX = currentX - startX;
    let newPosition = thumbStartX + deltaX;
    
    // Constrain movement
    newPosition = Math.max(4, Math.min(newPosition, maxDistance));
    
    slideThumb.style.left = newPosition + 'px';
    
    // Update button opacity based on progress
    const progress = (newPosition - 4) / (maxDistance - 4);
    const textOpacity = Math.max(0.2, 1 - progress * 1.2);
    const textContainer = slideButton.querySelector('.slide-text-container');
    textContainer.style.opacity = textOpacity;
    
    // Add cool scale effect during drag
    const scale = 1 + (progress * 0.05);
    textContainer.style.transform = `scale(${scale})`;
    
    e.preventDefault();
  }

  function endDrag(e) {
    if (!isDragging) return;
    
    isDragging = false;
    slideButton.classList.remove('sliding');
    
    const currentPosition = parseFloat(slideThumb.style.left) || 4;
    const progress = (currentPosition - 4) / (maxDistance - 4);
    
    if (progress >= threshold) {
      // Success! Complete the action
      completeSlide();
    } else {
      // Return to start position
      resetSlide();
    }
  }

  function completeSlide() {
    slideButton.classList.add('completed', 'success');
    slideThumb.style.left = maxDistance + 'px';
    
    // Trigger success animation and navigate
    setTimeout(() => {
      window.location.href = 'contact.html';
    }, 500);
  }

  function resetSlide() {
    slideThumb.style.left = '4px';
    const textContainer = slideButton.querySelector('.slide-text-container');
    textContainer.style.opacity = '1';
    textContainer.style.transform = 'scale(1)';
  }

  // Mouse events
  slideThumb.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Touch events
  slideThumb.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);

  // Prevent context menu on long press
  slideThumb.addEventListener('contextmenu', e => e.preventDefault());

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!isDragging) {
      calculateMaxDistance();
      resetSlide();
    }
  });
}