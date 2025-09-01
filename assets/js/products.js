// Products functionality
let allProducts = [];
let currentCategory = '';
let filteredProducts = [];

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
  const priceRange = `${formatPrice(product.prices.minimum)} - ${formatPrice(product.prices.maximum)}`;
  
  const colorDots = product.colors.map(color => 
    `<div class="color-dot" data-color="${getColorForDot(color)}" title="${color}"></div>`
  ).join('');
  
  const sizesList = product.sizes.join(', ');
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-made-to">Made to ${product.madeTo}</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-fabric">${product.fabric}</p>
        <div class="product-price">
          <span class="price-standard">${standardPrice}</span>
          <span class="price-range">(${priceRange})</span>
        </div>
        <div class="product-colors">
          <h4>Available Colors</h4>
          <div class="color-dots">
            ${colorDots}
          </div>
        </div>
        <div class="product-sizes">
          <h4>Available Sizes</h4>
          <div class="sizes-list">${sizesList}</div>
        </div>
        <div class="product-actions">
          <button class="btn-primary" onclick="requestQuote('${product.id}')">Request Quote</button>
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

// Populate filter options
function populateFilters(products) {
  const colorFilter = document.getElementById('color-filter');
  const sizeFilter = document.getElementById('size-filter');
  
  // Get unique colors
  const allColors = [...new Set(products.flatMap(p => p.colors))].sort();
  colorFilter.innerHTML = '<option value="">All Colors</option>';
  allColors.forEach(color => {
    colorFilter.innerHTML += `<option value="${color}">${color}</option>`;
  });
  
  // Get unique sizes
  const allSizes = [...new Set(products.flatMap(p => p.sizes))].sort();
  sizeFilter.innerHTML = '<option value="">All Sizes</option>';
  allSizes.forEach(size => {
    sizeFilter.innerHTML += `<option value="${size}">${size}</option>`;
  });
}

// Filter products
function filterProducts() {
  const priceFilter = document.getElementById('price-filter').value;
  const colorFilter = document.getElementById('color-filter').value;
  const sizeFilter = document.getElementById('size-filter').value;
  
  filteredProducts = allProducts.filter(product => {
    // Price filter
    if (priceFilter) {
      const price = product.prices.standard;
      if (priceFilter === '0-500' && price > 500) return false;
      if (priceFilter === '500-1000' && (price < 500 || price > 1000)) return false;
      if (priceFilter === '1000-2000' && (price < 1000 || price > 2000)) return false;
      if (priceFilter === '2000+' && price < 2000) return false;
    }
    
    // Color filter
    if (colorFilter && !product.colors.includes(colorFilter)) return false;
    
    // Size filter
    if (sizeFilter && !product.sizes.includes(sizeFilter)) return false;
    
    return true;
  });
  
  displayProducts(filteredProducts);
}

// Clear all filters
function clearFilters() {
  document.getElementById('price-filter').value = '';
  document.getElementById('color-filter').value = '';
  document.getElementById('size-filter').value = '';
  filteredProducts = [...allProducts];
  displayProducts(filteredProducts);
}

// Request quote functionality
function requestQuote(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
    // For now, we'll show an alert. In a real application, this would open a contact form
    alert(`Quote request for "${product.name}"\n\nWe'll be in touch soon to discuss your custom piece.\n\nFor immediate assistance, please contact our atelier directly.`);
  }
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
  
  if (categoryData.heroImage) {
    console.log(`✅ Hero image found: ${categoryData.heroImage}`);
    
    // Show hero image section
    heroImageSection.style.display = 'flex';
    heroFallbackSection.style.display = 'none';
    
    // Set image and content
    heroImage.src = categoryData.heroImage;
    heroImage.alt = categoryData.heroImageAlt || `${categoryData.name} collection`;
    heroTitle.textContent = categoryData.name;
    heroDescription.textContent = categoryData.description;
    
    console.log(`✅ Hero image section displayed for ${categoryData.name}`);
  } else {
    console.log(`⚠️ No hero image found for ${categoryData.name}, using fallback`);
    
    // Show fallback section
    heroImageSection.style.display = 'none';
    heroFallbackSection.style.display = 'block';
    
    // Set fallback content
    categoryTitle.textContent = categoryData.name;
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
    filteredProducts = [...allProducts];
    
    // Setup hero image or fallback
    setupHeroSection(categoryData);
    
    // Update page title and content
    document.getElementById('page-title').textContent = `${categoryData.name} - ELISA SANNA`;
    
    // Populate filters and display products
    populateFilters(allProducts);
    displayProducts(filteredProducts);
    
    // Add event listeners
    document.getElementById('price-filter').addEventListener('change', filterProducts);
    document.getElementById('color-filter').addEventListener('change', filterProducts);
    document.getElementById('size-filter').addEventListener('change', filterProducts);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
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
