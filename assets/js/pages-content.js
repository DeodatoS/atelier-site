/**
 * Pages Content Management System
 * Dynamically loads page content from JSON data
 */

let PAGES_CONTENT_DATA = null;

/**
 * Load pages content from JSON file
 */
async function loadPagesContent() {
  if (PAGES_CONTENT_DATA) {
    return PAGES_CONTENT_DATA;
  }

  try {
    const response = await fetch('../assets/data/pages-content.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    PAGES_CONTENT_DATA = await response.json();
    return PAGES_CONTENT_DATA;
  } catch (error) {
    console.error('Error loading pages content:', error);
    return null;
  }
}

/**
 * Get content for a specific page
 */
function getPageContent(pageId) {
  if (!PAGES_CONTENT_DATA) {
    console.error('Pages content not loaded. Call loadPagesContent() first.');
    return null;
  }
  return PAGES_CONTENT_DATA[pageId] || null;
}

/**
 * Get specific content type for a page
 */
function getContentByType(pageId, contentType) {
  const pageContent = getPageContent(pageId);
  if (!pageContent) return [];
  
  return pageContent[contentType] || [];
}

/**
 * Get hero section content
 */
function getHeroContent(pageId) {
  const heroContent = getContentByType(pageId, 'hero_section');
  return heroContent.length > 0 ? heroContent[0] : null;
}

/**
 * Get main content section
 */
function getMainContent(pageId) {
  const mainContent = getContentByType(pageId, 'main_content');
  return mainContent.length > 0 ? mainContent[0] : null;
}

/**
 * Get all features for a page
 */
function getFeatures(pageId) {
  return getContentByType(pageId, 'feature').filter(item => item.is_active !== false);
}

/**
 * Get journey steps (for homepage)
 */
function getJourneySteps(pageId) {
  return getContentByType(pageId, 'journey_step').filter(item => item.is_active !== false);
}

/**
 * Get two column content
 */
function getTwoColumnContent(pageId) {
  return getContentByType(pageId, 'two_column').filter(item => item.is_active !== false);
}

/**
 * Get techniques content (for hand embroidery)
 */
function getTechniques(pageId) {
  return getContentByType(pageId, 'technique').filter(item => item.is_active !== false);
}

/**
 * Get heritage content
 */
function getHeritageContent(pageId) {
  const heritageContent = getContentByType(pageId, 'heritage_content');
  return heritageContent.length > 0 ? heritageContent[0] : null;
}

/**
 * Get about content
 */
function getAboutContent(pageId) {
  const aboutContent = getContentByType(pageId, 'about_content');
  return aboutContent.length > 0 ? aboutContent[0] : null;
}

/**
 * Get process content
 */
function getProcessContent(pageId) {
  const processContent = getContentByType(pageId, 'process_content');
  return processContent.length > 0 ? processContent[0] : null;
}

/**
 * Populate hero section
 */
function populateHero(pageId, heroSelector = '#hero-title, .hero-content h1, .hero-logo h2, .pfy-hero-logo, .mtm-hero-title') {
  console.log('🦸 populateHero called for:', pageId);
  const heroContent = getHeroContent(pageId);
  console.log('🎯 Hero content found:', heroContent);
  if (!heroContent) {
    console.log('❌ No hero content found for:', pageId);
    return;
  }

  // Update hero title
  const heroTitle = document.querySelector(heroSelector);
  if (heroTitle) {
    heroTitle.textContent = heroContent.title;
  }

  // Update hero subtitle if exists
  const heroSubtitle = document.querySelector('#hero-subtitle, .hero-subtitle, .hero-tagline, .pfy-hero-subtitle, .mtm-hero-subtitle');
  if (heroSubtitle && heroContent.subtitle) {
    heroSubtitle.textContent = heroContent.subtitle;
  }

  // Update hero description if exists
  const heroDescription = document.querySelector('#hero-description, .hero-description, .hero-text, .pfy-hero-description, .mtm-hero-description');
  if (heroDescription && heroContent.description) {
    heroDescription.textContent = heroContent.description;
  }

  // Update hero background image if exists
  const heroImage = document.querySelector('.hero-image, .pfy-hero-image, .mtm-hero-image');
  if (heroImage && heroContent.image_url) {
    heroImage.style.backgroundImage = `url('${heroContent.image_url}')`;
  }
}

/**
 * Populate main content section
 */
function populateMainContent(pageId) {
  const mainContent = getMainContent(pageId);
  if (!mainContent) return;

  // Update main section title
  const mainTitle = document.querySelector('.pfy-personalised-text h2, .mtm-service-content h3, .text-content h2');
  if (mainTitle) {
    mainTitle.textContent = mainContent.title;
  }

  // Update main section description
  const mainDescription = document.querySelector('.pfy-personalised-text > p, .mtm-service-content > p, .text-content > p');
  if (mainDescription) {
    mainDescription.textContent = mainContent.description;
  }

  // Update main section image
  const mainImage = document.querySelector('.pfy-image, .mtm-image, .content-image img');
  if (mainImage && mainContent.image_url) {
    mainImage.src = mainContent.image_url;
    if (mainContent.image_alt) {
      mainImage.alt = mainContent.image_alt;
    }
  }
}

/**
 * Populate features section
 */
function populateFeatures(pageId) {
  const features = getFeatures(pageId);
  if (features.length === 0) return;

  features.forEach((feature, index) => {
    const featureSelector = `.pfy-feature:nth-child(${index + 1}), .mtm-feature:nth-child(${index + 1})`;
    const featureElement = document.querySelector(featureSelector);
    
    if (featureElement) {
      const featureTitle = featureElement.querySelector('h3, h4');
      const featureDescription = featureElement.querySelector('p');
      
      if (featureTitle) featureTitle.textContent = feature.title;
      if (featureDescription) featureDescription.textContent = feature.description;
    }
  });
}

/**
 * Populate journey steps (homepage)
 */
function populateJourneySteps(pageId) {
  const journeySteps = getJourneySteps(pageId);
  if (journeySteps.length === 0) return;

  journeySteps.forEach((step, index) => {
    const stepElement = document.querySelector(`.journey-step:nth-child(${index + 1})`);
    
    if (stepElement) {
      const stepTitle = stepElement.querySelector('.journey-step-content h3');
      const stepDescription = stepElement.querySelector('.journey-step-content p');
      const stepImage = stepElement.querySelector('.journey-step-image img');
      
      if (stepTitle) stepTitle.textContent = step.title;
      if (stepDescription) stepDescription.textContent = step.description;
      if (stepImage && step.image_url) {
        stepImage.src = step.image_url;
        if (step.image_alt) stepImage.alt = step.image_alt;
      }
    }
  });
}

/**
 * Initialize page content based on current page
 */
async function initializePageContent() {
  try {
    console.log('🔄 Starting page content initialization...');
    await loadPagesContent();
    console.log('✅ Pages content loaded:', PAGES_CONTENT_DATA);
    
    // Determine current page ID from URL or body class
    let pageId = 'homepage'; // default
    console.log('📄 Detected page ID:', pageId);
    
    if (window.location.pathname.includes('made-to-measure')) {
      pageId = 'made_to_measure';
    } else if (window.location.pathname.includes('personalized-for-you')) {
      pageId = 'personalized_for_you';
    } else if (window.location.pathname.includes('hand-embroidery')) {
      pageId = 'hand_embroidery';
    } else if (window.location.pathname.includes('the-designer')) {
      pageId = 'the_designer';
    } else if (window.location.pathname.includes('our-atelier')) {
      pageId = 'our_atelier';
    } else if (window.location.pathname.includes('craftsmanship-values')) {
      pageId = 'craftsmanship_values';
    }

    // Populate content based on page
    console.log('🎯 Populating content for:', pageId);
    populateHero(pageId);
    populateMainContent(pageId);
    populateFeatures(pageId);
    console.log('✅ Content population completed');
    
    if (pageId === 'homepage') {
      populateJourneySteps(pageId);
    }

    console.log(`✅ Page content initialized for: ${pageId}`);
    
  } catch (error) {
    console.error('Error initializing page content:', error);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePageContent);
} else {
  initializePageContent();
}
