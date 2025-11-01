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
    const emailInput = document.querySelector('.newsletter input');
    
    if (newsletterButton && emailInput) {
      newsletterButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
          alert('Inserisci un indirizzo email valido.');
          return;
        }
        
        // Disable button during submission
        newsletterButton.disabled = true;
        newsletterButton.textContent = 'Invio...';
        
        try {
          // Send email using FormSubmit (free service)
          const response = await fetch('https://formsubmit.co/ajax/info@elisasanna.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              subject: 'Nuova iscrizione Newsletter - Elisa Sanna',
              message: `Nuova iscrizione alla newsletter:\n\nEmail: ${email}\n\nData: ${new Date().toLocaleString('it-IT')}`,
              _captcha: false,
              _template: 'basic'
            })
          });
          
          if (response.ok) {
            alert('Grazie per esserti iscritto! Ti invieremo presto il codice sconto del 10%.');
            emailInput.value = '';
          } else {
            throw new Error('Errore nell\'invio');
          }
        } catch (error) {
          console.error('Newsletter submission error:', error);
          alert('Si è verificato un errore. Per favore, riprova più tardi o contattaci direttamente.');
        } finally {
          // Re-enable button
          newsletterButton.disabled = false;
          newsletterButton.textContent = 'Iscriviti';
        }
      });
      
      // Also handle Enter key
      emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          newsletterButton.click();
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
