/**
 * EverLux Automobiles - Enhanced JavaScript Functionality
 * Includes slider, mobile menu, animations, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
  // ====== NAVIGATION FUNCTIONALITY ======
  const mobileMenu = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');
  
  // Mobile menu toggle
  if (mobileMenu) {
      mobileMenu.addEventListener('click', function() {
          navMenu.classList.toggle('active');
          this.classList.toggle('open');
      });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
      if (!event.target.closest('.navbar') && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenu.classList.remove('open');
      }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              // Close mobile menu if it's open
              if (navMenu.classList.contains('active')) {
                  navMenu.classList.remove('active');
                  mobileMenu.classList.remove('open');
              }
              
              window.scrollTo({
                  top: targetElement.offsetTop - 80,
                  behavior: 'smooth'
              });
          }
      });
  });

  // ====== HERO BANNER SLIDER ======
  let currentIndex = 0;
  const sliderImages = [
      'auto.png',  // Use your actual image paths
      'tl.png',
      'pt.png'
  ];
  const slider = document.querySelector('.front');
  const totalImages = sliderImages.length;
  let autoSlideInterval;
  
  // Create slider navigation if it doesn't exist
  if (!document.querySelector('.slider-nav')) {
      const sliderNav = document.createElement('div');
      sliderNav.className = 'slider-nav';
      
      // Add prev/next buttons
      sliderNav.innerHTML = `
          <button class="slider-arrow prev-arrow" aria-label="Previous slide">
              <i class="fas fa-chevron-left"></i>
          </button>
          <div class="slider-dots"></div>
          <button class="slider-arrow next-arrow" aria-label="Next slide">
              <i class="fas fa-chevron-right"></i>
          </button>
      `;
      
      slider.appendChild(sliderNav);
      
      // Create dots for each slide
      const dotsContainer = sliderNav.querySelector('.slider-dots');
      for (let i = 0; i < totalImages; i++) {
          const dot = document.createElement('span');
          dot.className = 'slider-dot';
          dot.setAttribute('data-index', i);
          if (i === 0) dot.classList.add('active');
          dotsContainer.appendChild(dot);
          
          // Add click event to dots
          dot.addEventListener('click', function() {
              goToSlide(parseInt(this.getAttribute('data-index')));
          });
      }
  }
  
  // Set up event listeners for slider controls
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (prevArrow) {
      prevArrow.addEventListener('click', function() {
          slide(-1);
      });
  }
  
  if (nextArrow) {
      nextArrow.addEventListener('click', function() {
          slide(1);
      });
  }
  
  // Initialize the slider
  updateSlider();
  startAutoSlide();
  
  function slide(direction) {
      currentIndex += direction;
      
      if (currentIndex < 0) {
          currentIndex = totalImages - 1;
      } else if (currentIndex >= totalImages) {
          currentIndex = 0;
      }
      
      updateSlider();
      resetAutoSlide();
  }
  
  function goToSlide(index) {
      currentIndex = index;
      updateSlider();
      resetAutoSlide();
  }
  
  function updateSlider() {
      // Update the background image
      slider.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${sliderImages[currentIndex]}")`;
      
      // Update active dot indicator
      dots.forEach((dot, index) => {
          if (index === currentIndex) {
              dot.classList.add('active');
          } else {
              dot.classList.remove('active');
          }
      });
      
      // Add a subtle animation effect
      slider.classList.remove('fade-in');
      void slider.offsetWidth; // Trigger reflow
      slider.classList.add('fade-in');
  }
  
  function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
          slide(1);
      }, 5000); // Change slide every 5 seconds
  }
  
  function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
  }
  
  // Pause auto-slide when hovering over the slider
  slider.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
  });
  
  slider.addEventListener('mouseleave', () => {
      startAutoSlide();
  });

  // ====== ANIMATION ON SCROLL ======
  const animateElements = document.querySelectorAll('.box, .section-title, .footer-section');
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.2 });
  
  animateElements.forEach(element => {
      observer.observe(element);
  });

  // ====== VEHICLE MODEL INTERACTION ======
  const vehicleBoxes = document.querySelectorAll('.box');
  
  vehicleBoxes.forEach(box => {
      // Quick view functionality
      const quickViewBtn = document.createElement('button');
      quickViewBtn.className = 'quick-view-btn';
      quickViewBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
      quickViewBtn.setAttribute('aria-label', 'Quick view');
      box.appendChild(quickViewBtn);
      
      quickViewBtn.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent box click event
          const modelName = box.querySelector('h3').textContent;
          openQuickView(modelName, box.className);
      });
      
      // Box click opens model page
      box.addEventListener('click', function() {
          const modelName = this.querySelector('h3').textContent;
          // You can replace this with actual navigation
          alert(`Viewing details for ${modelName}`);
      });
  });
  
  function openQuickView(modelName, modelClass) {
      // Create modal if it doesn't exist
      if (!document.getElementById('quick-view-modal')) {
          const modal = document.createElement('div');
          modal.id = 'quick-view-modal';
          modal.className = 'modal';
          modal.innerHTML = `
              <div class="modal-content">
                  <span class="close-modal">&times;</span>
                  <div class="modal-body">
                      <div class="modal-image"></div>
                      <div class="modal-info">
                          <h3></h3>
                          <div class="specs">
                              <div class="spec"><i class="fas fa-tachometer-alt"></i> <span class="power">400 HP</span></div>
                              <div class="spec"><i class="fas fa-bolt"></i> <span class="speed">0-60 in 4.2s</span></div>
                              <div class="spec"><i class="fas fa-gas-pump"></i> <span class="efficiency">32 MPG</span></div>
                              <div class="spec"><i class="fas fa-dollar-sign"></i> <span class="price">Starting at $65,000</span></div>
                          </div>
                          <p class="description"></p>
                          <button class="banner-btn">Schedule Test Drive</button>
                      </div>
                  </div>
              </div>
          `;
          document.body.appendChild(modal);
          
          // Close modal functionality
          const closeBtn = modal.querySelector('.close-modal');
          closeBtn.addEventListener('click', function() {
              modal.style.display = 'none';
          });
          
          // Close when clicking outside modal content
          window.addEventListener('click', function(event) {
              if (event.target === modal) {
                  modal.style.display = 'none';
              }
          });
      }
      
      // Update modal content based on selected model
      const modal = document.getElementById('quick-view-modal');
      const modelImage = modal.querySelector('.modal-image');
      const modelTitle = modal.querySelector('.modal-info h3');
      const modelDesc = modal.querySelector('.description');
      
      // Set model-specific content
      modelTitle.textContent = modelName;
      
      // Extract model class to set appropriate background image
      let imageClass = '';
      if (modelClass.includes('box1')) imageClass = 'box1';
      else if (modelClass.includes('box2')) imageClass = 'box2';
      else if (modelClass.includes('box3')) imageClass = 'box3';
      else if (modelClass.includes('box4')) imageClass = 'box4';
      else if (modelClass.includes('box5')) imageClass = 'box5';
      else if (modelClass.includes('box6')) imageClass = 'box6';
      
      modelImage.className = 'modal-image ' + imageClass;
      
      // Set model description based on model name
      const descriptions = {
          'Executive Sedan': 'Experience unparalleled luxury with our flagship sedan. Features include premium leather interior, panoramic sunroof, and advanced driver assistance technology.',
          'Luxury SUV': 'Dominate any terrain with our versatile luxury SUV. Spacious interior with three-row seating, intelligent all-wheel drive, and premium entertainment system.',
          'Sport Coupe': 'Feel the thrill of precision engineering with our high-performance coupe. Features a twin-turbo V8 engine, carbon fiber accents, and sport-tuned suspension.',
          'Electric Flagship': 'The future of luxury with zero emissions. 400-mile range, ultrafast charging, and our most advanced autopilot system yet.',
          'Performance Edition': 'Track-ready performance meets everyday comfort. Features include ceramic brakes, aerodynamic styling, and customizable driving modes.',
          'Crossover Model': 'The perfect balance of elegance and utility. Features include adaptive suspension, premium sound system, and class-leading cargo space.'
      };
      
      modelDesc.textContent = descriptions[modelName] || 'Discover the perfect blend of luxury, performance, and innovation.';
      
      // Display the modal
      modal.style.display = 'block';
  }

  // ====== STICKY HEADER ======
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
          header.classList.add('sticky');
          
          if (scrollTop > lastScrollTop) {
              // Scrolling down
              header.classList.add('hide');
          } else {
              // Scrolling up
              header.classList.remove('hide');
          }
      } else {
          header.classList.remove('sticky');
          header.classList.remove('hide');
      }
      
      lastScrollTop = scrollTop;
  });

  // ====== DARK MODE TOGGLE ======
  // Create dark mode toggle if it doesn't exist
  if (!document.getElementById('dark-mode-toggle')) {
      const toggle = document.createElement('button');
      toggle.id = 'dark-mode-toggle';
      toggle.className = 'dark-mode-toggle';
      toggle.innerHTML = '<i class="fas fa-moon"></i>';
      toggle.setAttribute('aria-label', 'Toggle dark mode');
      document.body.appendChild(toggle);
      
      // Check for saved user preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('darkMode');
      
      if (savedMode === 'dark' || (savedMode === null && prefersDarkMode)) {
          document.body.classList.add('dark-mode');
          toggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
      
      // Toggle dark mode
      toggle.addEventListener('click', function() {
          document.body.classList.toggle('dark-mode');
          
          if (document.body.classList.contains('dark-mode')) {
              localStorage.setItem('darkMode', 'dark');
              this.innerHTML = '<i class="fas fa-sun"></i>';
          } else {
              localStorage.setItem('darkMode', 'light');
              this.innerHTML = '<i class="fas fa-moon"></i>';
          }
      });
  }

  // ====== PERFORMANCE OPTIMIZATION ======
  // Lazy load images
  const lazyImages = document.querySelectorAll('img[data-src]');
  const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              lazyImageObserver.unobserve(img);
          }
      });
  });
  
  lazyImages.forEach(image => {
      lazyImageObserver.observe(image);
  });
});