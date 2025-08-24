// Products functionality
let allProducts = [];
let currentCategory = '';
let filteredProducts = [];

// Get category from URL parameter
function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category') || 'prive_ceremonial';
}

// Products data - embedded for local testing, can be loaded via fetch when on server
const PRODUCTS_DATA = {
  "categories": {
    "prive_ceremonial": {
      "name": "Couture e Cerimonia",
      "description": "Exquisite pieces for special occasions and refined experiences",
      "products": [
        {
          "id": "pc001",
          "name": "Silk Evening Gown",
          "category": "prive_ceremonial",
          "description": "Elegant silk evening gown with intricate hand-embroidered details",
          "image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1988&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1988&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          ],
          "prices": {
            "standard": 2800,
            "minimum": 2400,
            "maximum": 3500
          },
          "colors": ["Midnight Black", "Burgundy", "Navy Blue", "Emerald Green"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "100% Silk",
          "madeTo": "measure"
        },
        {
          "id": "pc002",
          "name": "Ceremonial Blazer",
          "category": "prive_ceremonial",
          "description": "Tailored ceremonial blazer with gold thread detailing",
          "image": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          ],
          "prices": {
            "standard": 1800,
            "minimum": 1500,
            "maximum": 2200
          },
          "colors": ["Charcoal Gray", "Deep Navy", "Classic Black"],
          "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
          "fabric": "Wool & Cashmere Blend",
          "madeTo": "measure"
        },
        {
          "id": "pc003",
          "name": "Cocktail Dress",
          "category": "prive_ceremonial",
          "description": "Sophisticated cocktail dress with asymmetrical hem",
          "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 1600,
            "minimum": 1300,
            "maximum": 2000
          },
          "colors": ["Ivory", "Dusty Rose", "Sage Green", "Champagne"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "Silk Crepe",
          "madeTo": "measure"
        },
        {
          "id": "pc004",
          "name": "Tuxedo Jacket",
          "category": "prive_ceremonial",
          "description": "Classic tuxedo jacket with satin lapels",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 2200,
            "minimum": 1900,
            "maximum": 2800
          },
          "colors": ["Classic Black", "Midnight Navy"],
          "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
          "fabric": "Premium Wool",
          "madeTo": "measure"
        },
        {
          "id": "pc005",
          "name": "Formal Gown",
          "category": "prive_ceremonial",
          "description": "Floor-length formal gown with beaded bodice",
          "image": "https://images.unsplash.com/photo-1566479179817-c63f37e91285?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1566479179817-c63f37e91285?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 3200,
            "minimum": 2800,
            "maximum": 4000
          },
          "colors": ["Royal Blue", "Deep Purple", "Crimson Red", "Black"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "Silk Taffeta",
          "madeTo": "measure"
        }
      ]
    },
    "collections": {
      "name": "Collections",
      "description": "Curated seasonal collections showcasing contemporary Italian elegance",
      "products": [
        {
          "id": "col001",
          "name": "Spring Linen Suit",
          "category": "collections",
          "description": "Lightweight linen suit perfect for spring occasions",
          "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 980,
            "minimum": 850,
            "maximum": 1200
          },
          "colors": ["Natural Beige", "Soft White", "Light Gray", "Pale Blue"],
          "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
          "fabric": "100% Linen",
          "madeTo": "order"
        },
        {
          "id": "col002",
          "name": "Wool Coat",
          "category": "collections",
          "description": "Classic wool coat with minimalist design",
          "image": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          ],
          "prices": {
            "standard": 1400,
            "minimum": 1200,
            "maximum": 1700
          },
          "colors": ["Camel", "Black", "Charcoal", "Navy"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "Virgin Wool",
          "madeTo": "order"
        },
        {
          "id": "col003",
          "name": "Silk Blouse",
          "category": "collections",
          "description": "Elegant silk blouse with French seams",
          "image": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          ],
          "prices": {
            "standard": 650,
            "minimum": 550,
            "maximum": 800
          },
          "colors": ["Ivory", "Powder Pink", "Sage", "Midnight Blue"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "Silk Crepe de Chine",
          "madeTo": "order"
        },
        {
          "id": "col004",
          "name": "Cashmere Sweater",
          "category": "collections",
          "description": "Luxurious cashmere sweater with ribbed details",
          "image": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1988&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1988&q=80"
          ],
          "prices": {
            "standard": 890,
            "minimum": 750,
            "maximum": 1100
          },
          "colors": ["Cream", "Soft Gray", "Dusty Rose", "Navy"],
          "sizes": ["XS", "S", "M", "L", "XL"],
          "fabric": "100% Cashmere",
          "madeTo": "order"
        },
        {
          "id": "col005",
          "name": "Tailored Trousers",
          "category": "collections",
          "description": "Perfectly tailored trousers with elegant fit",
          "image": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 420,
            "minimum": 350,
            "maximum": 550
          },
          "colors": ["Black", "Navy", "Charcoal", "Olive"],
          "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
          "fabric": "Wool Blend",
          "madeTo": "order"
        }
      ]
    },
    "kids": {
      "name": "Kids",
      "description": "Charming and comfortable pieces designed especially for children",
      "products": [
        {
          "id": "kid001",
          "name": "Little Prince Suit",
          "category": "kids",
          "description": "Adorable mini suit perfect for special occasions",
          "image": "https://images.unsplash.com/photo-1503944168184-93f8d2e12c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1503944168184-93f8d2e12c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 380,
            "minimum": 320,
            "maximum": 450
          },
          "colors": ["Navy Blue", "Charcoal Gray", "Black"],
          "sizes": ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "10Y", "12Y"],
          "fabric": "Cotton Blend",
          "madeTo": "order"
        },
        {
          "id": "kid002",
          "name": "Princess Dress",
          "category": "kids",
          "description": "Elegant dress for little princesses",
          "image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 280,
            "minimum": 240,
            "maximum": 350
          },
          "colors": ["Pink", "Ivory", "Light Blue", "Lavender"],
          "sizes": ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "10Y", "12Y"],
          "fabric": "Soft Cotton",
          "madeTo": "order"
        },
        {
          "id": "kid003",
          "name": "Casual Shirt",
          "category": "kids",
          "description": "Comfortable cotton shirt for everyday wear",
          "image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 120,
            "minimum": 100,
            "maximum": 150
          },
          "colors": ["White", "Light Blue", "Mint Green", "Soft Yellow"],
          "sizes": ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "10Y", "12Y", "14Y"],
          "fabric": "100% Cotton",
          "madeTo": "order"
        },
        {
          "id": "kid004",
          "name": "Formal Shorts",
          "category": "kids",
          "description": "Smart formal shorts for young gentlemen",
          "image": "https://images.unsplash.com/photo-1503944168184-93f8d2e12c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1503944168184-93f8d2e12c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 150,
            "minimum": 130,
            "maximum": 180
          },
          "colors": ["Navy", "Khaki", "Gray", "Black"],
          "sizes": ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "10Y", "12Y", "14Y"],
          "fabric": "Cotton Twill",
          "madeTo": "order"
        },
        {
          "id": "kid005",
          "name": "Party Dress",
          "category": "kids",
          "description": "Special occasion dress with delicate embroidery",
          "image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
          "gallery": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          ],
          "prices": {
            "standard": 320,
            "minimum": 280,
            "maximum": 400
          },
          "colors": ["Rose Gold", "Ivory", "Dusty Blue", "Soft Pink"],
          "sizes": ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "10Y", "12Y"],
          "fabric": "Silk Blend",
          "madeTo": "order"
        }
      ]
    }
  }
};

// Load products data
async function loadProducts() {
  try {
    // Try to fetch from JSON file first (for production)
    try {
      const response = await fetch('../assets/data/products.json');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded products from JSON file');
        
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
      }
    } catch (fetchError) {
      console.log('Fetch failed, using embedded data for local testing');
    }
    
    // Fallback to embedded data (for local testing) - but still try to load hero images
    console.log('Using embedded products data');
    const data = JSON.parse(JSON.stringify(PRODUCTS_DATA)); // Deep copy
    
    // Try to load and merge category hero images even with embedded data
    const heroImages = await loadCategoryHeroImages();
    if (heroImages) {
      // Merge hero images into categories
      Object.keys(data.categories).forEach(categoryId => {
        if (heroImages[categoryId]) {
          data.categories[categoryId].heroImage = heroImages[categoryId].hero_image_url;
          data.categories[categoryId].heroImageAlt = heroImages[categoryId].hero_image_alt;
        }
      });
      console.log('Merged category hero images with embedded products data');
    }
    
    return data;
  } catch (error) {
    console.error('Error loading products:', error);
    return null;
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
    const response = await fetch('../assets/data/pages-content.json');
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
    console.log('Pages content fetch failed, using embedded data');
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
