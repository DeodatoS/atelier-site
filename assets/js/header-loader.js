/**
 * Universal Header Loader for Elisa Sanna Website
 * Loads consistent header across all pages
 */

(function() {
  'use strict';

  /**
   * Load header content from external file
   */
  function loadHeader() {
    // Create header placeholder if it doesn't exist
    let headerPlaceholder = document.getElementById('header-placeholder');
    
    if (!headerPlaceholder) {
      // Look for existing header and replace it
      const existingHeader = document.querySelector('header.header');
      if (existingHeader) {
        headerPlaceholder = document.createElement('div');
        headerPlaceholder.id = 'header-placeholder';
        existingHeader.parentNode.replaceChild(headerPlaceholder, existingHeader);
      } else {
        // Create header placeholder at the beginning of body
        headerPlaceholder = document.createElement('div');
        headerPlaceholder.id = 'header-placeholder';
        document.body.insertBefore(headerPlaceholder, document.body.firstChild);
      }
    }

    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    let headerPath = '/components/header.html';
    
    // Adjust path for pages in subdirectories
    if (currentPath.includes('/pages/')) {
      headerPath = '../components/header.html';
    }
    

    // Load header content
    fetch(headerPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load header: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        console.log('✅ Unified header loaded successfully');
        
        // Fix relative links for pages in subdirectories
        if (currentPath.includes('/pages/')) {
          fixHeaderLinks(headerPlaceholder, currentPath);
        }
        
        // Initialize dropdown functionality after header is loaded
        initializeDropdowns();
      })
      .catch(error => {
        console.error('❌ Error loading header:', error);
        // Fallback: keep existing header if load fails
      });
  }

  /**
   * Initialize dropdown functionality
   */
  function initializeDropdowns() {
    // Add dropdown toggle functionality if not already present
    if (typeof window.toggleDropdown === 'undefined') {
      window.toggleDropdown = function(event) {
        event.preventDefault();
        const dropdown = event.target.closest('.nav-dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
          if (otherMenu !== menu) {
            otherMenu.style.display = 'none';
          }
        });
        
        // Toggle current dropdown
        if (menu.style.display === 'block') {
          menu.style.display = 'none';
        } else {
          menu.style.display = 'block';
        }
      };
    }
    
    console.log('✅ Dropdown functionality initialized');
  }

  /**
   * Fix relative links in header for pages in subdirectories
   */
  function fixHeaderLinks(headerElement, currentPath) {
    const links = headerElement.querySelectorAll('a[href^="pages/"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      // Convert pages/xyz.html to ../pages/xyz.html for subdirectory pages
      if (href.startsWith('pages/')) {
        link.setAttribute('href', '../' + href);
      }
    });
    
    // Fix logo link and image for pages in subdirectories
    const logoLink = headerElement.querySelector('.logo');
    if (logoLink) {
      // Only fix paths for pages in subdirectories
      if (currentPath.includes('/pages/')) {
        logoLink.setAttribute('href', '../index.html');
        
        // Fix logo image path for subdirectories
        const logoImg = logoLink.querySelector('img');
        if (logoImg && logoImg.getAttribute('src') === 'assets/images/logo.png') {
          logoImg.setAttribute('src', '../assets/images/logo.png');
        }
      }
    }
  }

  /**
   * Initialize header loader when DOM is ready
   */
  function initHeaderLoader() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
      loadHeader();
    }
  }

  // Start the header loader
  initHeaderLoader();

  // Global debug function
  window.reloadHeader = loadHeader;

})();

console.log('🚀 Header Loader initialized - Universal header system active');
