// Simple build script to combine components
import fs from 'fs';
import path from 'path';

function buildPage(pageContent, title, outputPath, pageCss = '', pageJs = '') {
  // Read components
  const template = fs.readFileSync('components/base-template.html', 'utf8');
  const header = fs.readFileSync('components/header.html', 'utf8');
  const footer = fs.readFileSync('components/footer.html', 'utf8');
  
  // Replace placeholders
  let html = template
    .replace('{{TITLE}}', title)
    .replace('<!-- HEADER_PLACEHOLDER -->', header)
    .replace('<!-- CONTENT_PLACEHOLDER -->', pageContent)
    .replace('<!-- FOOTER_PLACEHOLDER -->', footer)
    .replace('<!-- PAGE_CSS_PLACEHOLDER -->', pageCss ? `<link rel="stylesheet" href="${pageCss}">` : '')
    .replace('<!-- PAGE_JS_PLACEHOLDER -->', pageJs ? `<script src="${pageJs}"></script>` : '');
  
  // Write output file
  fs.writeFileSync(outputPath, html);
  console.log(`✅ Built: ${outputPath}`);
}

// Build index page
const homeContent = `
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Craftsmanship" />
        <div class="hero-overlay">
          <p class="hero-text">Discover the artistry behind every stitch</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Two Column Section -->
  <section class="two-column">
    <a href="pages/personalized-for-you.html" class="column">
      <div class="column-image">
        <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Personalized fitting" />
      </div>
      <div class="column-content">
        <div class="column-title">Personalized For You</div>
      </div>
    </a>
    <a href="pages/made-to-measure.html" class="column">
      <div class="column-image">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Made to measure" />
      </div>
      <div class="column-content">
        <div class="column-title">Made To Measure</div>
      </div>
    </a>
  </section>

  <!-- Prive Section -->
  <section class="prive-section">
    <div class="section-header">
      <div class="section-title">Couture e Cerimonia</div>
      <p>Curated looks for special occasions and refined experiences</p>
    </div>
    <div class="product-carousel">
      <button type="button" class="carousel-button prev" aria-label="Previous">‹</button>
      <div class="product-grid">
        <div class="product-item">
          <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1988&q=80" alt="White dress with red details" />
          <div class="product-info">
            <p>PRIVE COLLECTION DRESS</p>
          </div>
        </div>
        <div class="product-item">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Green backless dress" />
          <div class="product-info">
            <p>SILK BACK DETAIL DRESS</p>
          </div>
        </div>
        <div class="product-item">
          <img src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Checkered blazer" />
          <div class="product-info">
            <p>SILK CHECKERED BLAZER</p>
          </div>
        </div>
        <div class="product-item">
          <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Yellow floral dress" />
          <div class="product-info">
            <p>FLORAL SILK DRESS</p>
          </div>
        </div>
      </div>
      <button type="button" class="carousel-button next" aria-label="Next">›</button>
    </div>
  </section>

  <!-- Craftsmanship Section -->
  <section class="craftsmanship-section">
    <div class="section-header">
      <div class="section-title">Our Craftsmanship and Values</div>
      <p>Curated looks for women with our artisans</p>
    </div>
    <div class="craftsmanship-image">
      <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Craftsmanship" />
    </div>
  </section>

  <!-- Journey Section -->
  <section class="journey-section">
    <div class="section-header">
      <div class="section-title">Our Journey</div>
      <p>Curated looks for women with our artisans</p>
    </div>
    <div class="journey-content">
      <div class="journey-image">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Journey" />
      </div>
      <div class="journey-text">
        <h3>CHARMANT COLLECTION</h3>
        <p>We believe in crafting garments through deep understanding of our clients' needs and desires. Each piece is meticulously designed to reflect individual style while maintaining the highest standards of quality and elegance.</p>
        <p>Our atelier combines traditional techniques with modern innovation, ensuring every garment tells a unique story. From the initial sketch to the final fitting, we pour our passion into creating pieces that transcend trends and become timeless treasures.</p>
        <p>Experience the art of haute couture with our dedicated team of master craftspeople, who bring decades of expertise to every creation.</p>
      </div>
    </div>
  </section>

  <!-- Latest Pieces Section -->
  <section class="latest-pieces">
    <div class="section-header">
      <div class="section-title">Be Inspired With Our Latest Pieces</div>
      <p>Discover the fashion that expresses different life goals, stories of style, handcrafted with care, designed to inspire.</p>
    </div>
    <div class="pieces-grid">
      <div class="piece-item">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Red dress" />
        <div class="piece-info">
          <h4>COLLECTION</h4>
          <p>A bold statement piece that embodies confidence and elegance for the modern woman.</p>
        </div>
      </div>
      <div class="piece-item">
        <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1988&q=80" alt="White dress" />
        <div class="piece-info">
          <h4>READY-TO-WEAR</h4>
          <p>Effortless sophistication meets contemporary design in this versatile ensemble.</p>
        </div>
      </div>

    </div>
  </section>
`;

buildPage(homeContent, 'Luxury Fashion', 'index.html');

// Note: pages/made-to-measure.html and pages/our-brand.html are complete standalone files
// and should not be rebuilt by this script to avoid corruption

console.log('🎉 Build complete!');
