// Product Detail Page functionality
let currentProduct = null;
let allProductsData = null;

// Get product ID from URL parameter
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Load products data (reuse the same data structure as products.js)
async function loadProductsData() {
  // Always try to fetch from JSON file first
  try {
    // Try to fetch from JSON file
    console.log('🔄 Product detail: Attempting to fetch products.json...');
    const response = await fetch('../assets/data/products.json');
    console.log('📡 Product detail: Fetch response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Product detail: Loaded products from JSON file');
      console.log('📊 Product detail: Products data:', data);
      return data;
    }
  } catch (fetchError) {
    console.log('❌ Product detail: Fetch failed, falling back to embedded data');
    console.log('🔍 Product detail: Fetch error:', fetchError);
  }
  
  // Fallback to embedded data only if fetch fails
  if (typeof PRODUCTS_DATA !== 'undefined') {
    console.log('Using embedded products data (fallback)');
    return PRODUCTS_DATA;
  }
  
  // If products.js hasn't loaded PRODUCTS_DATA yet, wait a bit and try again
  if (typeof PRODUCTS_DATA === 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (typeof PRODUCTS_DATA !== 'undefined') {
      console.log('Using embedded products data (delayed)');
      return PRODUCTS_DATA;
    }
  }
  
  throw new Error('Could not load products data');
}

// Find product by ID across all categories
function findProductById(data, productId) {
  console.log('🔍 Product detail: Looking for product ID:', productId);
  console.log('🔍 Product detail: Available categories:', Object.keys(data.categories));
  
  for (const categoryKey in data.categories) {
    const category = data.categories[categoryKey];
    console.log(`🔍 Product detail: Checking category ${categoryKey}, products:`, category.products.map(p => p.id));
    const product = category.products.find(p => p.id === productId);
    if (product) {
      console.log('✅ Product detail: Found product:', product);
      return { product, category: categoryKey, categoryData: category };
    }
  }
  console.log('❌ Product detail: Product not found');
  return null;
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(price);
}

// Get color class for styling
function getColorClass(colorName) {
  return colorName.toLowerCase().replace(/\s+/g, '');
}

// Get color for color swatch
function getColorForSwatch(colorName) {
  const colorMap = {
    'black': '#000',
    'white': '#fff',
    'red': '#dc3545',
    'blue': '#0066cc',
    'navy': '#001f3f',
    'green': '#28a745',
    'gray': '#6c757d',
    'pink': '#e91e63',
    'purple': '#6f42c1',
    'beige': '#f5f5dc',
    'cream': '#fffdd0',
    'ivory': '#fffff0',
    'brown': '#8b4513',
    'yellow': '#ffc107',
    'orange': '#fd7e14',
    'burgundy': '#800020',
    'emerald': '#50c878',
    'champagne': '#f7e7ce',
    'sage': '#9caf88',
    'charcoal': '#36454f',
    'camel': '#c19a6b',
    'olive': '#808000',
    'midnight': '#191970'
  };
  
  const colorKey = colorName.toLowerCase();
  for (const key in colorMap) {
    if (colorKey.includes(key)) {
      return colorMap[key];
    }
  }
  return '#333'; // default color
}

// Set main image
function setMainImage(imageSrc, thumbnailIndex) {
  const mainImage = document.getElementById('main-product-image');
  mainImage.src = imageSrc;
  
  // Update active state on thumbnails
  const thumbnails = document.querySelectorAll('.product-thumbnails img');
  thumbnails.forEach((thumb, index) => {
    thumb.classList.remove('active');
    if (index === thumbnailIndex) {
      thumb.classList.add('active');
    }
  });
}

// Populate product details
function populateProductDetails(productData) {
  const { product, category, categoryData } = productData;
  
  // Update page title and meta
  document.getElementById('product-title').textContent = `${product.name} - ELISA SANNA`;
  document.title = `${product.name} - ELISA SANNA`;
  
  // Update breadcrumb
  const categoryLink = document.getElementById('category-link');
  categoryLink.textContent = categoryData.name;
  
  // Map categories to their respective pages
  const categoryPages = {
    'prive_ceremonial': 'prive-ceremonial.html',
    'collections': 'collections.html', 
    'kids': 'kids.html'
  };
  
  categoryLink.href = categoryPages[category] || '#';
  document.getElementById('product-breadcrumb').textContent = product.name;
  
  // Populate main image and thumbnails
  const mainImage = document.getElementById('main-product-image');
  mainImage.src = product.image;
  mainImage.alt = product.name;
  
  // Thumbnails - use gallery array with multiple images
  const thumbnail1 = document.getElementById('thumbnail-1');
  const thumbnail2 = document.getElementById('thumbnail-2');
  const thumbnail3 = document.getElementById('thumbnail-3');
  
  const thumbnails = [thumbnail1, thumbnail2, thumbnail3];
  
  // Debug logging
  console.log('🔍 Product images debug:');
  console.log('Image 1:', product.image);
  console.log('Image 2:', product.image_2);
  console.log('Image 3:', product.image_3);
  
  const images = [product.image, product.image_2, product.image_3].filter(img => img && img.trim());
  console.log('🖼️ Filtered images:', images);
  
  // Set up thumbnails with available images
  thumbnails.forEach((thumbnail, index) => {
    if (thumbnail) {
      if (images[index]) {
        thumbnail.src = images[index];
        thumbnail.style.display = 'block';
        thumbnail.onclick = () => setMainImage(images[index], index);
        thumbnail.classList.toggle('active', index === 0);
        console.log(`✅ Set thumbnail ${index + 1}:`, images[index]);
      } else {
        thumbnail.style.display = 'none';
        console.log(`❌ No image for thumbnail ${index + 1}`);
      }
    }
  });
  
  // Product information
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-subtitle').textContent = product.fabric;
  
  // Product description
  const descriptionContainer = document.getElementById('product-description');
  descriptionContainer.innerHTML = `<p>${product.description}</p>`;
  
  // Pricing
  document.getElementById('price-standard').textContent = formatPrice(product.prices.standard);
  document.getElementById('price-range').textContent = `${formatPrice(product.prices.minimum)} - ${formatPrice(product.prices.maximum)}`;
  
  // Colors - Commented out for now
  // const colorsContainer = document.getElementById('product-colors');
  // colorsContainer.innerHTML = product.colors.map((color, index) => 
  //   `<div class="color-option ${index === 0 ? 'selected' : ''}" data-color="${getColorClass(color)}" title="${color}" style="background-color: ${getColorForSwatch(color)}"></div>`
  // ).join('');
  
  // Sizes
  const sizesContainer = document.getElementById('product-sizes');
  sizesContainer.innerHTML = product.sizes.map((size, index) => 
    `<div class="size-option ${index === 0 ? 'selected' : ''}" data-size="${size}">${size}</div>`
  ).join('');
  
  // Fabric info in accordion
  document.getElementById('product-fabric').textContent = product.fabric;
  
  // Add click handlers for colors and sizes
  addColorSizeHandlers();
  
  currentProduct = product;
}

// Add click handlers for color and size selection
function addColorSizeHandlers() {
  // Color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
  
  // Size selection
  document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

// Action handlers
function requestConsultation() {
  if (currentProduct) {
    alert(`Personal Consultation Request for "${currentProduct.name}"\n\nThank you for your interest! Our personal stylist will contact you within 24 hours to schedule a consultation.\n\nFor immediate assistance, please call our atelier directly.`);
  }
}

function contactAtelier() {
  alert(`Contatta l'Atelier Elisa Sanna\n\nTelefono: +39 3270329874\nEmail: info@elisasanna.com\nIndirizzo: Via San Maurilio 18, 20123 Milano\n\nOrari Atelier:\nLun-Sab: 9:30 - 19:30\nDom: Su appuntamento`);
}

// Buy standard size
function buyStandardSize() {
  if (currentProduct) {
    const selectedColor = document.querySelector('.color-option.selected');
    const selectedSize = document.querySelector('.size-option.selected');
    
    let orderDetails = `Buongiorno, vorrei acquistare: "${currentProduct.name}" - Taglia Standard`;
    if (selectedColor) {
      orderDetails += `\nColore: ${selectedColor.title}`;
    }
    orderDetails += `\nPrezzo: ${formatPrice(currentProduct.prices.standard)}`;
    orderDetails += `\n\nLa mia taglia è: `;
    orderDetails += `\n\nCome posso procedere?`;
    
    const whatsappUrl = `https://wa.me/393270329874?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');
  }
}

// Buy made to measure
function buyMadeToMeasure() {
  if (currentProduct) {
    const orderDetails = `Buongiorno, sono interessato al servizio Su Misura per: "${currentProduct.name}"\n\nFascia di prezzo: ${formatPrice(currentProduct.prices.minimum)} - ${formatPrice(currentProduct.prices.maximum)}\n\nVorrei prenotare una consulenza personale e le misurazioni.\n\nCome posso procedere?`;
    
    const whatsappUrl = `https://wa.me/393270329874?text=${encodeURIComponent(orderDetails)}`;
    window.open(whatsappUrl, '_blank');
  }
}

// Toggle accordion
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.accordion-icon');
  
  if (content.style.display === 'none' || !content.style.display) {
    content.style.display = 'block';
    icon.textContent = '−';
    header.classList.add('active');
  } else {
    content.style.display = 'none';
    icon.textContent = '+';
    header.classList.remove('active');
  }
}

// Initialize page
async function initializeProductDetail() {
  const productId = getProductIdFromURL();
  
  if (!productId) {
    showError('No product specified');
    return;
  }
  
  try {
    // Load products data
    const data = await loadProductsData();
    allProductsData = data;
    
    // Find the specific product
    const productData = findProductById(data, productId);
    
    if (!productData) {
      showError('Product not found');
      return;
    }
    
    // Hide loading, show content
    document.getElementById('product-loading').style.display = 'none';
    document.getElementById('product-content').style.display = 'block';
    
    // Populate product details
    populateProductDetails(productData);
    
  } catch (error) {
    console.error('Error loading product:', error);
    showError('Error loading product details');
  }
}

// Show error state
function showError(message) {
  document.getElementById('product-loading').style.display = 'none';
  document.getElementById('product-content').style.display = 'none';
  
  const errorElement = document.getElementById('product-error');
  errorElement.querySelector('p').textContent = message;
  errorElement.style.display = 'block';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProductDetail);
