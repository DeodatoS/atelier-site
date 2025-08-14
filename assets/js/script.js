// Smooth scrolling for navigation links
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

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '02px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Add fade-in animation to elements
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.section-header, .product-item, .piece-item, .journey-text');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Carousel controls for Prive section
  const carousel = document.querySelector('.prive-section .product-carousel');
  const scroller = document.querySelector('.prive-section .product-grid');
  const prevBtn = document.querySelector('.prive-section .carousel-button.prev');
  const nextBtn = document.querySelector('.prive-section .carousel-button.next');

  if (carousel && scroller && prevBtn && nextBtn) {
    const getScrollAmount = () => scroller.clientWidth * 0.8;

    const updateButtons = () => {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth - 1;
      prevBtn.disabled = scroller.scrollLeft <= 0;
      nextBtn.disabled = scroller.scrollLeft >= maxScrollLeft;
      const opacity = (btn) => btn.disabled ? '0.4' : '1';
      prevBtn.style.opacity = opacity(prevBtn);
      nextBtn.style.opacity = opacity(nextBtn);
    };

    prevBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      setTimeout(updateButtons, 350);
    });
    nextBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      setTimeout(updateButtons, 350);
    });

    scroller.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }
});

// Newsletter form handling
document.querySelector('.newsletter button').addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.querySelector('.newsletter input').value;
  
  if (email && email.includes('@')) {
    alert('Thank you for subscribing to our newsletter!');
    document.querySelector('.newsletter input').value = '';
  } else {
    alert('Please enter a valid email address.');
  }
});

// Mobile menu toggle - place in meta-bar
const createMobileMenu = () => {
  const metaBar = document.querySelector('.meta-bar');
  const navLeft = document.querySelector('.nav-left');
  
  if (window.innerWidth <= 480) {
    if (!document.querySelector('.mobile-menu-toggle') && metaBar) {
      const menuToggle = document.createElement('button');
      menuToggle.className = 'mobile-menu-toggle';
      menuToggle.innerHTML = '☰';
      menuToggle.style.cssText = `
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #fff;
        cursor: pointer;
        display: block;
        padding: 0;
        margin-right: 15px;
      `;
      
      // Insert at the beginning of meta-bar
      metaBar.insertBefore(menuToggle, metaBar.firstChild);
      
      menuToggle.addEventListener('click', () => {
        if (navLeft) {
          navLeft.style.display = navLeft.style.display === 'none' ? 'flex' : 'none';
        } else {
          alert('Menu mobile - navigazione tramite homepage');
        }
      });
    }
  } else {
    // Remove mobile menu toggle if screen is larger
    const existingToggle = document.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
      existingToggle.remove();
    }
  }
};

// Product hover effects
document.querySelectorAll('.product-item, .piece-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-6px)';
    item.style.boxShadow = 'none';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0)';
    item.style.boxShadow = 'none';
  });
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      const newImg = new Image();
      newImg.onload = () => {
        img.style.opacity = '1';
      };
      newImg.src = img.src;
      
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img').forEach(img => {
  imageObserver.observe(img);
});

// Resize handler
window.addEventListener('resize', () => {
  createMobileMenu();
});

// Initialize mobile menu on load
createMobileMenu();

// Dropdown menu functionality
function toggleDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const dropdownMenu = event.target.nextElementSibling;
  const isCurrentlyOpen = dropdownMenu.classList.contains('show');
  
  // Close all other dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
  
  // Toggle current dropdown
  if (!isCurrentlyOpen) {
    dropdownMenu.classList.add('show');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});

// Close dropdown on escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});
