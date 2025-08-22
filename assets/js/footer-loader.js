/**
 * Universal Footer Loader for Elisa Sanna Website
 * Loads consistent footer across all pages
 */

(function() {
  'use strict';

  /**
   * Load footer content from external file
   */
  function loadFooter() {
    // Create footer placeholder if it doesn't exist
    let footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (!footerPlaceholder) {
      // Look for existing footer and replace it
      const existingFooter = document.querySelector('footer.footer');
      if (existingFooter) {
        footerPlaceholder = document.createElement('div');
        footerPlaceholder.id = 'footer-placeholder';
        existingFooter.parentNode.replaceChild(footerPlaceholder, existingFooter);
      } else {
        // Create footer placeholder before closing body tag
        footerPlaceholder = document.createElement('div');
        footerPlaceholder.id = 'footer-placeholder';
        document.body.appendChild(footerPlaceholder);
      }
    }

    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    let footerPath = '/components/footer-unified.html';
    
    // Adjust path for pages in subdirectories
    if (currentPath.includes('/pages/')) {
      footerPath = '../components/footer-unified.html';
    }

    // Load footer content
    fetch(footerPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load footer: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
        console.log('✅ Unified footer loaded successfully');
        
        // Fix relative links for pages in subdirectories
        if (currentPath.includes('/pages/')) {
          fixFooterLinks(footerPlaceholder);
        }
        
        // Initialize newsletter form after footer is loaded
        initializeNewsletterForm();
      })
      .catch(error => {
        console.error('❌ Error loading footer:', error);
        // Fallback: keep existing footer if load fails
      });
  }

  /**
   * Initialize newsletter form functionality
   */
  function initializeNewsletterForm() {
    const newsletterButton = document.querySelector('.newsletter button');
    if (newsletterButton) {
      newsletterButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.querySelector('.newsletter input').value;
        
        if (email && email.includes('@')) {
          alert('Thank you for subscribing to our newsletter!');
          document.querySelector('.newsletter input').value = '';
        } else {
          alert('Please enter a valid email address.');
        }
      });
      console.log('✅ Newsletter form initialized');
    } else {
      console.log('⚠️ Newsletter form not found in loaded footer');
    }
  }

  /**
   * Fix relative links in footer for pages in subdirectories
   */
  function fixFooterLinks(footerElement) {
    const links = footerElement.querySelectorAll('a[href^="/pages/"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      // Convert /pages/xyz.html to xyz.html for subdirectory pages (remove /pages/ prefix)
      if (href.startsWith('/pages/')) {
        const fileName = href.replace('/pages/', '');
        link.setAttribute('href', fileName);
      }
    });
  }

  /**
   * Initialize footer loader when DOM is ready
   */
  function initFooterLoader() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
      loadFooter();
    }
  }

  // Start the footer loader
  initFooterLoader();

  // Global debug function
  window.reloadFooter = loadFooter;

})();

console.log('🚀 Footer Loader initialized - Universal footer system active');
