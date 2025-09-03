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

// Hero background animation variables removed - section is now static

function cleanupHeroBackground() {
  console.log('Cleaning up hero background animations...');
  
  try {
    // Remove any wireframe background elements
    const hero = document.querySelector('.hero');
    if (hero) {
      const wireframeBackground = hero.querySelector('.wireframe-background');
      if (wireframeBackground) {
        wireframeBackground.remove();
      }
      
      // Remove any other animation-related background elements
      const mobileBackground = hero.querySelector('.simple-background, .mobile-background');
      if (mobileBackground) {
        mobileBackground.remove();
      }
    }
    
    // Hide canvas if it exists
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
      canvas.style.display = 'none';
    }
    
    console.log('Hero background cleanup completed - section is now static');
  } catch (error) {
    console.error('Error cleaning up background:', error);
  }
}

// Animation functions removed - hero background is now static

// Wireframe creation functions removed - hero background is now static

// Animation update functions removed - hero background is now static

// Background animation functions removed - hero section is now static

// Background fallback functions removed - hero section is now static

// Fix mobile layout immediately to prevent initial sizing issues
function fixMobileLayout() {
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Applying mobile layout fixes...');
    
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

// Video autoplay functionality
function initVideoAutoplay() {
  const video = document.getElementById('teaser-video');
  if (!video) {
    console.log('Video element not found');
    return;
  }

  // Create intersection observer for video autoplay
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video is visible, try to play it
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Video autoplay started successfully');
          }).catch(error => {
            console.log('Video autoplay failed (likely due to browser policy):', error);
            // Show a play button or message to user if needed
          });
        }
      } else {
        // Video is not visible, pause it
        if (!video.paused) {
          video.pause();
          console.log('Video paused (out of view)');
        }
      }
    });
  }, {
    threshold: 0.5, // Video needs to be 50% visible
    rootMargin: '0px'
  });

  // Start observing the video
  videoObserver.observe(video);
  
  // Add event listeners for better user experience
  video.addEventListener('play', () => {
    console.log('Video started playing');
  });
  
  video.addEventListener('pause', () => {
    console.log('Video paused');
  });
  
  // Handle errors
  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
  });
}

// Run layout fix immediately - before DOM ready
fixMobileLayout();

// Initialize particle animation for hero sections
function initHeroParticles() {
  const canvasIds = ['hero-particle-canvas', 'agents-particle-canvas', 'security-particle-canvas', 'team-particle-canvas', 'contact-particle-canvas'];
  
  canvasIds.forEach(canvasId => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Enhanced settings for home page
    const isHomePage = canvasId === 'hero-particle-canvas';
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 2,
        opacity: Math.random() * 0.6 + 0.5
      };
    }
    
    function initParticles() {
      particles = [];
      const baseCount = Math.floor(canvas.width * canvas.height / 12000);
      const particleCount = Math.min(100, baseCount);
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
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
      
      // Page-specific colors
      let particleColor, connectionColor;
      switch(canvasId) {
        case 'hero-particle-canvas':
          particleColor = 'rgba(168, 85, 247, '; // Purple for home
          connectionColor = 'rgba(168, 85, 247, ';
          break;
        case 'agents-particle-canvas':
          particleColor = 'rgba(59, 130, 246, '; // Blue for agents
          connectionColor = 'rgba(59, 130, 246, ';
          break;
        case 'security-particle-canvas':
          particleColor = 'rgba(6, 182, 212, '; // Cyan for security
          connectionColor = 'rgba(6, 182, 212, ';
          break;
        case 'team-particle-canvas':
          particleColor = 'rgba(37, 99, 235, '; // Deep blue for team
          connectionColor = 'rgba(37, 99, 235, ';
          break;
        case 'contact-particle-canvas':
          particleColor = 'rgba(14, 165, 233, '; // Sky blue for contact
          connectionColor = 'rgba(14, 165, 233, ';
          break;
        default:
          particleColor = 'rgba(92, 159, 255, ';
          connectionColor = 'rgba(92, 159, 255, ';
      }
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor + particle.opacity + ')';
        ctx.fill();
        
        // Add glow effect for all pages
        ctx.shadowColor = particleColor + '0.4)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      // Draw connections with enhanced visibility
      const connectionDistance = 150;
      const connectionOpacity = 0.25;
      
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const lineOpacity = connectionOpacity * (1 - distance / connectionDistance);
            ctx.strokeStyle = connectionColor + lineOpacity + ')';
            ctx.lineWidth = 2;
            
            // Add glow effect to connections for all pages
            ctx.shadowColor = connectionColor + (lineOpacity * 0.6) + ')';
            ctx.shadowBlur = 4;
            
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      });
    }
    
    function animate() {
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    }
    
    function startAnimation() {
      resizeCanvas();
      initParticles();
      animate();
    }
    
    function stopAnimation() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
    
    // Initialize
    startAnimation();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', stopAnimation);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing components...');
  
  // Apply mobile layout fixes again after DOM is ready
  fixMobileLayout();
  
  // Clean up any existing hero background animations
  cleanupHeroBackground();
  
  // Initialize hero particle animations for all pages
  initHeroParticles();
  
  // Initialize timeline scroll activation
  initTimelineScrollActivation();
  
  // Initialize animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(el => observer.observe(el));
  
  // Initialize video autoplay
  initVideoAutoplay();
  
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
  // updateScrollBackground is called via requestAnimationFrame, no need to call here
});

window.addEventListener('resize', () => {
  // Scroll background automatically adapts to window size
});

// Toggle mobile navigation menu
function toggleMenu() {
  console.log('toggleMenu called');
  const navLinks = document.querySelector('.nav-links');
  const menuIcon = document.querySelector('.menu-icon');
  
  if (navLinks) {
    const wasActive = navLinks.classList.contains('active');
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    
    console.log('Nav links toggle: was', wasActive, 'now', isActive);
    console.log('Nav links computed display:', window.getComputedStyle(navLinks).display);
    console.log('Nav links computed z-index:', window.getComputedStyle(navLinks).zIndex);
    
    // Also toggle the hamburger icon state
    if (menuIcon) {
      menuIcon.classList.toggle('active');
      console.log('Menu icon active:', menuIcon.classList.contains('active'));
    }
  } else {
    console.error('Nav links element not found');
  }
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

// Fix layout on resize as well
window.addEventListener('resize', function() {
  fixMobileLayout();
});

// Also fix layout when orientation changes on mobile
window.addEventListener('orientationchange', function() {
  setTimeout(fixMobileLayout, 100); // Small delay to allow orientation to complete
});

// Timeline scroll activation
function initTimelineScrollActivation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) return;
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const timelineItem = entry.target;
      
      if (entry.isIntersecting) {
        // Remove active class from all items
        timelineItems.forEach(item => item.classList.remove('active'));
        // Add active class to current item
        timelineItem.classList.add('active');
      }
    });
  }, {
    threshold: 0.6, // Item needs to be 60% visible to be considered active
    rootMargin: '-20% 0px -20% 0px' // Only activate when item is in the center area of viewport
  });
  
  // Observe all timeline items
  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });
}

// Make sure toggleMenu is available globally
window.toggleMenu = toggleMenu;
