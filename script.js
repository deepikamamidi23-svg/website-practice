/* ============================================
   WanderWorld Travels - Main JavaScript
   Handles all interactive features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 600);
    });
    /* Fallback: hide loader after 3s regardless */
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 3000);
  }

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.classList.contains('scrolled')) {
    const handleNavScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ---------- Mobile Hamburger Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    /* Close mobile menu when a link is clicked */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Dark / Light Mode Toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ww-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
      themeToggle.innerHTML = savedTheme === 'dark' ? '&#9728;' : '&#9790;';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ww-theme', next);
      themeToggle.innerHTML = next === 'dark' ? '&#9728;' : '&#9790;';
    });
  }

  /* ---------- Hero Slider ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');

  if (heroSlides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroDots.forEach(d => d.classList.remove('active'));
      heroSlides[index].classList.add('active');
      heroDots[index].classList.add('active');
      currentSlide = index;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }

    function startSlider() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
      clearInterval(slideInterval);
      startSlider();
    }

    heroDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        goToSlide(slideIndex);
        resetSlider();
      });
    });

    startSlider();
  }

  /* ---------- Scroll Animations (Intersection Observer) ---------- */
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    /* Fallback: show everything immediately */
    animateElements.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Counter Animation ---------- */
  const counterNumbers = document.querySelectorAll('.counter-number[data-target]');

  if (counterNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterNumbers.forEach(num => counterObserver.observe(num));
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (target >= 1000) {
        element.textContent = Math.floor(current).toLocaleString() + '+';
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  /* ---------- Back to Top Button ---------- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Newsletter Popup ---------- */
  const newsletterPopup = document.getElementById('newsletterPopup');
  const popupClose = document.getElementById('popupClose');

  if (newsletterPopup && popupClose) {
    /* Show popup after 30 seconds, only once per session */
    if (!sessionStorage.getItem('ww-popup-shown')) {
      setTimeout(() => {
        newsletterPopup.classList.add('active');
        sessionStorage.setItem('ww-popup-shown', 'true');
      }, 30000);
    }

    popupClose.addEventListener('click', () => {
      newsletterPopup.classList.remove('active');
    });

    newsletterPopup.addEventListener('click', (e) => {
      if (e.target === newsletterPopup) {
        newsletterPopup.classList.remove('active');
      }
    });
  }

  /* ---------- Hero Search ---------- */
  const heroSearch = document.querySelector('.hero-search button');
  if (heroSearch) {
    heroSearch.addEventListener('click', () => {
      const input = heroSearch.previousElementSibling;
      if (input && input.value.trim()) {
        window.location.href = 'destinations.html?search=' + encodeURIComponent(input.value.trim());
      } else if (input) {
        input.focus();
        input.placeholder = 'Please enter a destination...';
      }
    });

    /* Also handle Enter key in search */
    const searchInput = document.querySelector('.hero-search input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          heroSearch.click();
        }
      });
    }
  }

  /* ---------- Destination Page Filters ---------- */
  const filterCategory = document.getElementById('filterCategory');
  const filterBudget = document.getElementById('filterBudget');
  const searchDestinations = document.getElementById('searchDestinations');
  const destinationsGrid = document.getElementById('destinationsGrid');
  const noResults = document.getElementById('noResults');

  if (filterCategory && filterBudget && searchDestinations && destinationsGrid) {
    function filterDestinations() {
      const category = filterCategory.value;
      const budget = filterBudget.value;
      const search = searchDestinations.value.toLowerCase().trim();
      const cards = destinationsGrid.querySelectorAll('.destination-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardBudget = card.getAttribute('data-budget');
        const cardName = card.getAttribute('data-name').toLowerCase();

        const matchCategory = category === 'all' || cardCategory === category;
        const matchBudget = budget === 'all' || cardBudget === budget;
        const matchSearch = !search || cardName.includes(search);

        if (matchCategory && matchBudget && matchSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    filterCategory.addEventListener('change', filterDestinations);
    filterBudget.addEventListener('change', filterDestinations);
    searchDestinations.addEventListener('input', filterDestinations);

    /* Check URL params for search query */
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchDestinations) {
      searchDestinations.value = searchQuery;
      filterDestinations();
    }
  }

  /* ---------- Contact Form Handling ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');

      /* Simple validation */
      if (!name || !email) {
        alert('Please fill in all required fields.');
        return;
      }

      /* Simulate form submission */
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '&#128337; Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '&#10004; Message Sent!';
        submitBtn.style.background = '#0d9488';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  /* ---------- Newsletter Form Handling ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');

      if (input && input.value && input.value.includes('@')) {
        const originalText = button.textContent;
        button.textContent = 'Subscribed!';
        button.style.background = '#0d9488';
        input.value = '';

        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 3000);
      }
    });
  });

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Blog Sidebar Category Filter ---------- */
  const sidebarCategories = document.querySelectorAll('.sidebar-categories a[data-filter]');
  const blogPosts = document.querySelectorAll('.blog-post-full[data-category]');

  if (sidebarCategories.length > 0 && blogPosts.length > 0) {
    sidebarCategories.forEach(cat => {
      cat.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = cat.getAttribute('data-filter');

        blogPosts.forEach(post => {
          if (filter === 'all' || post.getAttribute('data-category') === filter) {
            post.style.display = '';
          } else {
            post.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Image Lazy Loading Fallback ---------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.src;
    });
  }

});
