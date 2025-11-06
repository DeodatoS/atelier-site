// Products functionality
let allProducts = [];
let currentCategory = '';

// Get category from URL parameter
function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category') || 'prive_ceremonial';
}

// Products data will be loaded from JSON file

// Determine the correct path for JSON files based on current location
function getJsonPath(filename) {
  // Check if we're in a subdirectory (like pages/)
  if (window.location.pathname.includes('/pages/')) {
    return `../assets/data/${filename}`;
  }
  // Otherwise assume we're in root
  return `assets/data/${filename}`;
}

// Load products data
async function loadProducts() {
  try {
    console.log('🔄 Attempting to fetch products.json...');
    const productsPath = getJsonPath('products.json');
    console.log('📍 Fetch path:', productsPath);
    
    const response = await fetch(productsPath);
    console.log('📡 Fetch response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Loaded products from JSON file');
    console.log('📊 Products data:', data);
    
    // Try to load and merge category hero images
    const heroImages = await loadCategoryHeroImages();
    if (heroImages) {
      // Merge hero images into categories
      Object.keys(data.categories).forEach(categoryId => {
        if (heroImages[categoryId]) {
          data.categories[categoryId].heroImage = heroImages[categoryId].hero_image_url;
          data.categories[categoryId].heroImageAlt = heroImages[categoryId].hero_image_alt;
        }
      });
      console.log('Merged category hero images with products data');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error loading products:', error);
    throw error; // Re-throw to handle in calling function
  }
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(price);
}

// Get color for dot
function getColorForDot(colorName) {
  return colorName.toLowerCase().replace(/\s+/g, '');
}

// Create product card HTML
function createProductCard(product) {
  const standardPrice = formatPrice(product.prices.standard);
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image" onclick="viewDetails('${product.id}')" style="cursor: pointer;">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="price-standard">${standardPrice}</span>
        </div>
        <div class="product-actions">
          <button class="btn-secondary" onclick="viewDetails('${product.id}')">View Details</button>
        </div>
      </div>
    </div>
  `;
}

// Display products
function displayProducts(products) {
  const productsGrid = document.getElementById('products-grid');
  const loadingEl = document.getElementById('products-loading');
  const noProductsEl = document.getElementById('no-products');
  
  loadingEl.style.display = 'none';
  
  if (products.length === 0) {
    productsGrid.style.display = 'none';
    noProductsEl.style.display = 'block';
    return;
  }
  
  noProductsEl.style.display = 'none';
  productsGrid.style.display = 'grid';
  productsGrid.innerHTML = products.map(createProductCard).join('');
}


// View details functionality
function viewDetails(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// Load category hero images from pages-content system
async function loadCategoryHeroImages() {
  try {
    const pagesPath = getJsonPath('pages-content.json');
    const response = await fetch(pagesPath);
    if (response.ok) {
      const data = await response.json();
      console.log('Loaded pages content data');
      
      // Extract hero images for categories
      const heroImages = {};
      ['prive_ceremonial', 'collections', 'kids'].forEach(categoryId => {
        if (data[categoryId] && data[categoryId].category_hero && data[categoryId].category_hero.length > 0) {
          const heroData = data[categoryId].category_hero[0];
          if (heroData.is_active) {
            heroImages[categoryId] = {
              hero_image_url: heroData.image_url,
              hero_image_alt: heroData.image_alt
            };
          }
        }
      });
      
      console.log('Extracted category hero images:', heroImages);
      return heroImages;
    }
  } catch (fetchError) {
    console.log('Pages content fetch failed:', fetchError);
  }
  return null;
}

// Setup hero section with image or fallback
function setupHeroSection(categoryData) {
  console.log('🔍 Setting up hero section for:', categoryData.name);
  console.log('🔍 Category data:', categoryData);
  
  const heroImageSection = document.getElementById('category-hero-image');
  const heroFallbackSection = document.getElementById('category-hero-fallback');
  const heroImage = document.getElementById('hero-image');
  const heroTitle = document.getElementById('hero-title');
  const heroDescription = document.getElementById('hero-description');
  const categoryTitle = document.getElementById('category-title');
  const categoryDescription = document.getElementById('category-description');
  
  console.log('🔍 DOM elements found:', {
    heroImageSection: !!heroImageSection,
    heroFallbackSection: !!heroFallbackSection,
    heroImage: !!heroImage,
    heroTitle: !!heroTitle,
    heroDescription: !!heroDescription
  });
  
  // Determine display name (use "ACCESSORI" for kids category)
  const displayName = currentCategory === 'kids' ? 'ACCESSORI' : categoryData.name;
  
  if (categoryData.heroImage) {
    console.log(`✅ Hero image found: ${categoryData.heroImage}`);
    
    // Show hero image section
    heroImageSection.style.display = 'flex';
    heroFallbackSection.style.display = 'none';
    
    // Set image and content
    heroImage.src = categoryData.heroImage;
    heroImage.alt = categoryData.heroImageAlt || `${displayName} collection`;
    heroTitle.textContent = displayName;
    heroDescription.textContent = categoryData.description;
    
    console.log(`✅ Hero image section displayed for ${displayName}`);
  } else {
    console.log(`⚠️ No hero image found for ${displayName}, using fallback`);
    
    // Show fallback section
    heroImageSection.style.display = 'none';
    heroFallbackSection.style.display = 'block';
    
    // Set fallback content
    categoryTitle.textContent = displayName;
    categoryDescription.textContent = categoryData.description;
  }
}

// Initialize page
async function initializePage() {
  // Only run on products pages (not product-detail pages)
  if (!document.getElementById('products-grid')) {
    console.log('Not a products listing page, skipping initialization');
    return;
  }
  
  currentCategory = getCategoryFromURL();
  console.log('Initializing page for category:', currentCategory);
  
  try {
    const data = await loadProducts();
    console.log('Loaded data:', data);
    
    if (!data || !data.categories[currentCategory]) {
      console.error('Category not found:', currentCategory, 'Available categories:', Object.keys(data?.categories || {}));
      throw new Error(`Category '${currentCategory}' not found`);
    }
    
    const categoryData = data.categories[currentCategory];
    allProducts = categoryData.products;
    
    // Setup hero image or fallback
    setupHeroSection(categoryData);
    
    // Update page title and content (use "ACCESSORI" for kids category)
    const displayName = currentCategory === 'kids' ? 'ACCESSORI' : categoryData.name;
    document.getElementById('page-title').textContent = `${displayName} - ELISA SANNA`;
    
    // Display products
    displayProducts(allProducts);
    
    // Update navigation active state
    updateNavigationActiveState();
    
  } catch (error) {
    console.error('Error initializing page:', error);
    const loadingElement = document.getElementById('products-loading');
    if (loadingElement) {
      loadingElement.innerHTML = 'Error loading products. Please try again later.';
    }
  }
}

// Update navigation active state
function updateNavigationActiveState() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkText = link.textContent.toUpperCase();
    
    if (
      (currentCategory === 'prive_ceremonial' && linkText.includes('COUTURE')) ||
      (currentCategory === 'collections' && linkText.includes('COLLECTIONS')) ||
      (currentCategory === 'kids' && linkText.includes('KIDS'))
    ) {
      link.classList.add('active');
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
