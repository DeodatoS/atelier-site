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
    // Add cache busting to force fresh data
    const timestamp = new Date().getTime();
    const response = await fetch(`../assets/data/pages-content.json?v=${timestamp}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    PAGES_CONTENT_DATA = JSON.parse(text);
    console.log('🔄 Pages content loaded with cache bust:', timestamp);
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
 * Get section headers content
 */
function getSectionHeaders(pageId) {
  return getContentByType(pageId, 'section_header').filter(item => item.is_active !== false);
}

/**
 * Get process steps content
 */
function getProcessSteps(pageId) {
  return getContentByType(pageId, 'process_step').filter(item => item.is_active !== false);
}

/**
 * Get booking options content
 */
function getBookingOptions(pageId) {
  return getContentByType(pageId, 'booking_option').filter(item => item.is_active !== false);
}

/**
 * Get section content by section_id
 */
function getSectionContent(pageId, sectionId) {
  const sectionContent = getContentByType(pageId, 'section_content');
  return sectionContent.find(section => section.section_id === sectionId) || null;
}

/**
 * Get latest pieces content
 */
function getLatestPieces(pageId) {
  return getContentByType(pageId, 'latest_piece').filter(item => item.is_active !== false);
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
 * Get section content by section_id
 */
function getSectionContent(pageId, sectionId) {
  const sectionContent = getContentByType(pageId, 'section_content');
  return sectionContent.find(item => item.section_id === sectionId) || null;
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
    // Set background image directly
    heroImage.style.backgroundImage = `url('${heroContent.image_url}')`;
  }
  
  // Update hero img tag if exists (for homepage)
  const heroImgTag = document.querySelector('#hero-image, .hero-image img');
  if (heroImgTag && heroContent.image_url) {
    heroImgTag.src = heroContent.image_url;
    if (heroContent.image_alt) {
      heroImgTag.alt = heroContent.image_alt;
    }
    // Handle image loading errors - log but don't hide
    heroImgTag.onerror = function() {
      console.error('❌ Hero image failed to load:', heroContent.image_url);
    };
    console.log('🖼️ Updated hero image to:', heroContent.image_url);
  }
}

/**
 * Populate main content section
 */
function populateMainContent(pageId) {
  const mainContent = getMainContent(pageId);
  console.log('🔍 populateMainContent for', pageId, ':', mainContent);
  if (!mainContent) return;

  // Update main section title
  const mainTitle = document.querySelector('.pfy-main-title, .mtm-main-title, .pfy-personalised-text h2, .mtm-service-content h3, .text-content h2');
  console.log('🔍 mainTitle element found:', mainTitle);
  if (mainTitle) {
    mainTitle.textContent = mainContent.title;
    console.log('✅ mainTitle updated with:', mainContent.title);
  }

  // Update main section description
  const mainDescription = document.querySelector('.pfy-main-description, .mtm-main-description, .pfy-personalised-text > p, .mtm-service-content > p, .text-content > p');
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
    // Handle image loading errors - log but don't hide
    mainImage.onerror = function() {
      console.error('❌ Image failed to load:', mainContent.image_url);
    };
  }
}

/**
 * Populate second section for MTM pages
 */
function populateMtmSecondSection(pageId) {
  const secondSection = getSectionContent(pageId, 'second_section');
  if (!secondSection) return;

  // Update second section title
  const secondTitle = document.querySelector('.mtm-second-title');
  if (secondTitle && secondSection.title) {
    secondTitle.textContent = secondSection.title;
  }

  // Update second section description
  const secondDescription = document.querySelector('.mtm-second-description');
  if (secondDescription && secondSection.description) {
    secondDescription.textContent = secondSection.description;
  }

  // Update second section image
  const secondImage = document.querySelector('.mtm-second-image img');
  if (secondImage && secondSection.image_url) {
    secondImage.src = secondSection.image_url;
    if (secondSection.image_alt) {
      secondImage.alt = secondSection.image_alt;
    }
    // Handle image loading errors - log but don't hide
    secondImage.onerror = function() {
      console.error('❌ Image failed to load:', secondSection.image_url);
    };
  }
}

/**
 * Populate third section for MTM pages
 */
function populateMtmThirdSection(pageId) {
  const thirdSection = getSectionContent(pageId, 'third_section');
  if (!thirdSection) return;

  // Update third section title
  const thirdTitle = document.querySelector('.mtm-third-title');
  if (thirdTitle && thirdSection.title) {
    thirdTitle.textContent = thirdSection.title;
  }

  // Update third section description
  const thirdDescription = document.querySelector('.mtm-third-description');
  if (thirdDescription && thirdSection.description) {
    thirdDescription.textContent = thirdSection.description;
  }

  // Update third section image
  const thirdImage = document.querySelector('.mtm-third-image img');
  if (thirdImage && thirdSection.image_url) {
    thirdImage.src = thirdSection.image_url;
    if (thirdSection.image_alt) {
      thirdImage.alt = thirdSection.image_alt;
    }
    // Handle image loading errors - log but don't hide
    thirdImage.onerror = function() {
      console.error('❌ Image failed to load:', thirdSection.image_url);
    };
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
 * Populate all homepage sections (two-column, sections, latest pieces)
 */
function populateHomepageAllSections(pageId) {
  // Populate two-column section
  const twoColumnContent = getTwoColumnContent(pageId);
  twoColumnContent.forEach((column, index) => {
    // Update column title
    const columnElement = document.querySelector(`.two-column .column:nth-child(${index + 1}) .column-title`);
    if (columnElement && column.title) {
      columnElement.textContent = column.title;
      console.log(`🏛️ Updated two-column ${index + 1} title to:`, column.title);
    }
    
    // Update column image
    const imageElement = document.querySelector(`.two-column .column:nth-child(${index + 1}) .column-image img`);
    if (imageElement && column.image_url) {
      imageElement.src = column.image_url;
      if (column.image_alt) {
        imageElement.alt = column.image_alt;
      }
      // Handle image loading errors - log but don't hide
      imageElement.onerror = function() {
        console.error('❌ Image failed to load:', column.image_url);
      };
      console.log(`🖼️ Updated two-column ${index + 1} image to:`, column.image_url);
    }
  });

  // Populate section headers (Couture, Craftsmanship, Latest Pieces)
  const sectionHeaders = getSectionHeaders(pageId);
  sectionHeaders.forEach((section, index) => {
    let selector = '';
    switch(section.section_id) {
      case 'couture_section':
        selector = '.prive-section .section-title';
        break;
      case 'craftsmanship_section':
        selector = '.craftsmanship-section .section-title';
        break;
      case 'journey_section':
        selector = '.journey-section .section-title';
        break;
      case 'latest_pieces_section':
        selector = '.latest-pieces .section-title';
        break;
    }
    
    if (selector) {
      const titleElement = document.querySelector(selector);
      const descElement = document.querySelector(selector.replace('.section-title', ' p'));
      
      if (titleElement && section.title) {
        titleElement.textContent = section.title;
        console.log(`📝 Updated ${section.section_id} title to:`, section.title);
      }
      if (descElement && section.description) {
        descElement.textContent = section.description;
        console.log(`📝 Updated ${section.section_id} description`);
      }
    }
  });

  // Populate latest pieces
  const latestPieces = getLatestPieces(pageId);
  
  // Map titles and links
  const titleMapping = {
    'Prêt-à-porter': 'COLLEZIONE',
    'Bambina': 'ACCESSORI'
  };
  
  const linkMapping = [
    '/pages/products.html?category=collections',
    '/pages/products.html?category=kids'
  ];
  
  latestPieces.forEach((piece, index) => {
    const pieceElement = document.querySelector(`.pieces-grid .piece-item:nth-child(${index + 1})`);
    if (pieceElement) {
      const titleElement = pieceElement.querySelector('.piece-info h4');
      const descElement = pieceElement.querySelector('.piece-info p');
      const imageElement = pieceElement.querySelector('img');
      
      // Update title with mapping
      if (titleElement) {
        const originalTitle = piece.title || '';
        titleElement.textContent = titleMapping[originalTitle] || originalTitle;
      }
      
      if (descElement && piece.description) {
        descElement.textContent = piece.description;
      }
      
      if (imageElement && piece.image_url) {
        imageElement.src = piece.image_url;
        if (piece.image_alt) {
          imageElement.alt = piece.image_alt;
        }
        
        // Add click handler or wrap in link
        if (linkMapping[index]) {
          imageElement.style.cursor = 'pointer';
          imageElement.onclick = function() {
            window.location.href = linkMapping[index];
          };
          
          // Also make the entire piece-item clickable
          pieceElement.style.cursor = 'pointer';
          pieceElement.onclick = function() {
            window.location.href = linkMapping[index];
          };
        }
        
        // Handle image loading errors - log but don't hide
        imageElement.onerror = function() {
          console.error('❌ Image failed to load:', piece.image_url);
        };
      }
      console.log(`🖼️ Updated latest piece ${index + 1}:`, titleElement ? titleElement.textContent : piece.title);
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
        // Handle image loading errors - log but don't hide
        stepImage.onerror = function() {
          console.error('❌ Image failed to load:', step.image_url);
        };
        console.log(`🖼️ Updated journey step ${index + 1} image to:`, step.image_url);
      }
    }
  });
}

/**
 * Populate process steps (for MTM, PFY pages)
 */
function populateProcessSteps(pageId) {
  const processSteps = getProcessSteps(pageId);
  if (processSteps.length === 0) return;

  // Special case for hand_embroidery: use single text instead of multiple steps
  if (pageId === 'hand_embroidery') {
    const singleProcessText = document.querySelector('.single-process-text p');
    if (singleProcessText && processSteps.length > 0) {
      // Use the first process step's description as the single text
      singleProcessText.textContent = processSteps[0].description;
      console.log('✅ Updated hand embroidery single process text');
    }
    return;
  }

  // For other pages: normal process steps handling
  processSteps.forEach((step, index) => {
    // Try different selectors for different page layouts
    // For MTM: account for .section-title as first child, so steps start at nth-child(2)
    let stepElement = document.querySelector(`.mtm-process-step:nth-child(${index + 2})`);
    if (!stepElement) {
      stepElement = document.querySelector(`.pfy-process-step:nth-child(${index + 1})`);
    }
    
    if (stepElement) {
      const titleElement = stepElement.querySelector('h3, h4');
      const descElement = stepElement.querySelector('p');
      
      if (titleElement && step.title) {
        titleElement.textContent = step.title;
      }
      if (descElement && step.description) {
        descElement.textContent = step.description;
      }
      console.log(`⚙️ Updated process step ${index + 1}:`, step.title);
    }
  });
}

/**
 * Populate second section (for PFY pages)
 */
function populateSecondSection(pageId) {
  const secondSection = getSectionContent(pageId, 'second_section');
  console.log('🔍 populateSecondSection for', pageId, ':', secondSection);
  if (!secondSection) {
    console.log('❌ No second section content found for:', pageId);
    return;
  }

  // Update second section title
  const secondTitle = document.querySelector('.pfy-second-title');
  if (secondTitle && secondSection.title) {
    secondTitle.textContent = secondSection.title;
    console.log('✅ Updated second section title:', secondSection.title);
  }

  // Update second section description
  const secondDescription = document.querySelector('.pfy-second-description');
  if (secondDescription && secondSection.description) {
    secondDescription.textContent = secondSection.description;
    console.log('✅ Updated second section description');
  }

  // Update second section image - EXACTLY like third section
  const secondImage = document.querySelector('.pfy-second-image img');
  console.log('🔍 populateSecondSection for', pageId, '- Second image element found:', !!secondImage);
  if (secondImage) {
    console.log('🔍 Second section image_url:', secondSection.image_url);
    if (secondSection.image_url) {
      // Ensure image is visible
      secondImage.style.display = 'block';
      secondImage.style.visibility = 'visible';
      secondImage.src = secondSection.image_url;
      if (secondSection.image_alt) {
        secondImage.alt = secondSection.image_alt;
      }
      console.log('✅ Updated second section image to:', secondSection.image_url);
      // Handle image loading errors - log but don't hide
      secondImage.onerror = function() {
        console.error('❌ Image failed to load:', secondSection.image_url);
        // Keep image visible even on error
        secondImage.style.display = 'block';
        secondImage.style.visibility = 'visible';
      };
      secondImage.onload = function() {
        console.log('✅ Second section image loaded successfully');
      };
    } else {
      console.warn('⚠️ No image_url in second section for:', pageId);
    }
  } else {
    console.error('❌ Second image element not found (.pfy-second-image img)');
    // Try to find it with a delay (in case DOM is not ready)
    setTimeout(() => {
      const retryImage = document.querySelector('.pfy-second-image img');
      if (retryImage && secondSection.image_url) {
        retryImage.style.display = 'block';
        retryImage.style.visibility = 'visible';
        retryImage.src = secondSection.image_url;
        console.log('✅ Retry: Updated second section image to:', secondSection.image_url);
      }
    }, 100);
  }
}

/**
 * Populate third section (for PFY pages)
 */
function populateThirdSection(pageId) {
  const thirdSection = getSectionContent(pageId, 'third_section');
  if (!thirdSection) return;

  // Update third section title
  const thirdTitle = document.querySelector('.pfy-third-title');
  if (thirdTitle && thirdSection.title) {
    thirdTitle.textContent = thirdSection.title;
  }

  // Update third section description
  const thirdDescription = document.querySelector('.pfy-third-description');
  if (thirdDescription && thirdSection.description) {
    thirdDescription.textContent = thirdSection.description;
  }

  // Update third section image
  const thirdImage = document.querySelector('.pfy-third-image img');
  if (thirdImage && thirdSection.image_url) {
    thirdImage.src = thirdSection.image_url;
    if (thirdSection.image_alt) {
      thirdImage.alt = thirdSection.image_alt;
    }
    // Handle image loading errors - log but don't hide
    thirdImage.onerror = function() {
      console.error('❌ Image failed to load:', thirdSection.image_url);
    };
  }
}

/**
 * Populate second section for MTM pages
 */
function populateMtmSecondSection(pageId) {
  const secondSection = getSectionContent(pageId, 'second_section');
  if (!secondSection) return;

  // Update second section title
  const secondTitle = document.querySelector('.mtm-second-title');
  if (secondTitle && secondSection.title) {
    secondTitle.textContent = secondSection.title;
  }

  // Update second section description
  const secondDescription = document.querySelector('.mtm-second-description');
  if (secondDescription && secondSection.description) {
    secondDescription.textContent = secondSection.description;
  }

  // Update second section image
  const secondImage = document.querySelector('.mtm-second-image img');
  if (secondImage && secondSection.image_url) {
    secondImage.src = secondSection.image_url;
    if (secondSection.image_alt) {
      secondImage.alt = secondSection.image_alt;
    }
    // Handle image loading errors - log but don't hide
    secondImage.onerror = function() {
      console.error('❌ Image failed to load:', secondSection.image_url);
    };
  }
}

/**
 * Populate third section for MTM pages
 */
function populateMtmThirdSection(pageId) {
  const thirdSection = getSectionContent(pageId, 'third_section');
  if (!thirdSection) return;

  // Update third section title
  const thirdTitle = document.querySelector('.mtm-third-title');
  if (thirdTitle && thirdSection.title) {
    thirdTitle.textContent = thirdSection.title;
  }

  // Update third section description
  const thirdDescription = document.querySelector('.mtm-third-description');
  if (thirdDescription && thirdSection.description) {
    thirdDescription.textContent = thirdSection.description;
  }

  // Update third section image
  const thirdImage = document.querySelector('.mtm-third-image img');
  if (thirdImage && thirdSection.image_url) {
    thirdImage.src = thirdSection.image_url;
    if (thirdSection.image_alt) {
      thirdImage.alt = thirdSection.image_alt;
    }
    // Handle image loading errors - log but don't hide
    thirdImage.onerror = function() {
      console.error('❌ Image failed to load:', thirdSection.image_url);
    };
  }
}

/**
 * Populate booking options (for MTM, PFY pages)
 */
function populateBookingOptions(pageId) {
  const bookingOptions = getBookingOptions(pageId);
  if (bookingOptions.length === 0) return;

  bookingOptions.forEach((option, index) => {
    // Try different selectors for different page layouts
    let optionElement = document.querySelector(`.mtm-booking-card:nth-child(${index + 1})`);
    if (!optionElement) {
      optionElement = document.querySelector(`.pfy-booking-option:nth-child(${index + 1})`);
    }
    
    if (optionElement) {
      const titleElement = optionElement.querySelector('h3');
      const descElement = optionElement.querySelector('p');
      
      if (titleElement && option.title) {
        titleElement.textContent = option.title;
      }
      if (descElement && option.description) {
        descElement.textContent = option.description;
      }
      console.log(`📞 Updated booking option ${index + 1}:`, option.title);
    }
  });
}

/**
 * Load products data for homepage carousel
 */
async function loadProductsForHomepage() {
  try {
    const response = await fetch('../assets/data/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading products for homepage:', error);
    return null;
  }
}

/**
 * Populate Prive carousel with dynamic products
 */
async function populatePriveCarousel() {
  try {
    console.log('🔄 Loading products for Prive carousel...');
    const productsData = await loadProductsForHomepage();
    
    if (!productsData || !productsData.categories || !productsData.categories.prive_ceremonial) {
      console.log('❌ No prive_ceremonial products found');
      return;
    }
    
    const priveProducts = productsData.categories.prive_ceremonial.products;
    console.log(`📦 Found ${priveProducts.length} prive products`);
    
    const productGrid = document.querySelector('.prive-section .product-grid');
    if (!productGrid) {
      console.log('❌ Product grid not found');
      return;
    }
    
    // Clear existing static content
    productGrid.innerHTML = '';
    
    // Add ALL dynamic products
    priveProducts.forEach(product => {
      const productItem = document.createElement('div');
      productItem.className = 'product-item';
      productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy" onclick="viewProductDetails('${product.id}')" style="cursor: pointer;" />
        <div class="product-info">
          <p>${product.name.toUpperCase()}</p>
        </div>
      `;
      productGrid.appendChild(productItem);
    });
    
    // Initialize simple scroll carousel
    initializeSimpleCarousel();
    
    console.log('✅ Prive carousel populated with dynamic products');
    
  } catch (error) {
    console.error('Error populating Prive carousel:', error);
  }
}

/**
 * Simple scroll-based carousel
 */
function initializeSimpleCarousel() {
  const productGrid = document.querySelector('.prive-section .product-grid');
  const prevButton = document.querySelector('.prive-section .carousel-button.prev');
  const nextButton = document.querySelector('.prive-section .carousel-button.next');
  
  if (!productGrid || !prevButton || !nextButton) {
    console.log('❌ Carousel elements not found');
    return;
  }
  
  const itemWidth = 300; // Approximate width of each item including gap
  const itemsPerView = 4;
  
  console.log('🎠 Simple carousel initialized');
  
  // Previous button
  prevButton.addEventListener('click', () => {
    productGrid.scrollBy({
      left: -itemWidth * itemsPerView,
      behavior: 'smooth'
    });
  });
  
  // Next button
  nextButton.addEventListener('click', () => {
    productGrid.scrollBy({
      left: itemWidth * itemsPerView,
      behavior: 'smooth'
    });
  });
  
  console.log('✅ Simple carousel scroll functionality initialized');
}

/**
 * Navigate to product detail page
 */
function viewProductDetails(productId) {
  console.log('🔍 Navigating to product detail:', productId);
  window.location.href = `pages/product-detail.html?id=${productId}`;
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
        } else if (window.location.pathname.includes('hand-embroidery')) {
          pageId = 'hand_embroidery';
        } else if (window.location.pathname.includes('our-atelier')) {
          pageId = 'our_atelier';
        } else if (window.location.pathname.includes('the-designer')) {
          pageId = 'the_designer';
        }

    // Populate content based on page
    console.log('🎯 Populating content for:', pageId);
    populateHero(pageId);
    populateMainContent(pageId);
    populateFeatures(pageId);
    populateProcessSteps(pageId);
    populateBookingOptions(pageId);
    
    // Populate new sections for PFY page
    if (pageId === 'personalized_for_you') {
      populateSecondSection(pageId);
      populateThirdSection(pageId);
    }
    
    // Populate new sections for MTM page
    if (pageId === 'made_to_measure') {
      populateMtmSecondSection(pageId);
      populateMtmThirdSection(pageId);
    }
    
    // Populate new sections for Craftsmanship Values page
        if (pageId === 'craftsmanship_values') {
          populateSecondSection(pageId);
          populateThirdSection(pageId);
        }
        if (pageId === 'hand_embroidery') {
          populateSecondSection(pageId);
          populateThirdSection(pageId);
        }
        if (pageId === 'our_atelier') {
          populateSecondSection(pageId);
          populateThirdSection(pageId);
        }
        if (pageId === 'the_designer') {
          populateSecondSection(pageId);
          populateThirdSection(pageId);
        }
    
    console.log('✅ Content population completed');
    
    if (pageId === 'homepage') {
      populateHomepageAllSections(pageId);
      populateJourneySteps(pageId);
      populatePriveCarousel();
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
