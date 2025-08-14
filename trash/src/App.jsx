import React from 'react'

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">ELISA SPINA</div>
            <div className="header-icons">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <a href="#" className="nav-item">Prêt-à-Porter</a>
            <a href="#" className="nav-item">Collections</a>
            <a href="#" className="nav-item">Kids</a>
            <a href="#" className="nav-item">Accessories</a>
            <a href="#" className="nav-item">Special Prices</a>
            <a href="#" className="nav-item">Handcrafted Experiences</a>
            <a href="#" className="nav-item">Our Brand</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Page Title */}
          <div className="page-title">
            <h1>The Designer</h1>
            <p>Get to know her</p>
          </div>

          {/* Intro Text */}
          <div className="intro-text">
            <p>
              Hand embroidery is the art of decorating fabric using a needle and thread. Unlike machine embroidery, it's entirely done by hand, 
              allowing for a personal touch, intricate detail, and endless creative possibilities. Whether you're stitching a delicate floral motif or a 
              bold geometric design, hand embroidery transforms simple cloth into expressive artwork.
            </p>
          </div>

          {/* First Section with Image */}
          <div className="section-with-image">
            <div className="image-container">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Designer working on embroidery" 
                className="main-image"
              />
            </div>
            <div className="text-content">
              <h2>1. Ideation & Design</h2>
              <ul>
                <li><strong>Conceptualization:</strong> Begin with a theme or inspiration—floral, geometric, abstract, or narrative.</li>
                <li><strong>Sketching:</strong> Create a design on paper or digitally. This helps visualize the final piece.</li>
                <li><strong>Customization:</strong> Tailor the design to suit the fabric, purpose, and personal style.</li>
              </ul>

              <h3>2. Material Selection</h3>
              <ul>
                <li><strong>Fabric:</strong> Choose cotton, linen, silk, or velvet depending on the project's complexity and texture.</li>
                <li><strong>Threads:</strong> Use embroidery floss in various colors and sheens—cotton for softness, silk for luxury, metallic for sparkle.</li>
                <li><strong>Tools:</strong> Gather embroidery needles, hoops, scissors, and tracing tools.</li>
              </ul>

              <h3>3. Transferring the Design</h3>
              <ul>
                <li><strong>Techniques:</strong> Use tracing paper, water-soluble pens, or carbon pens to transfer the design onto the fabric.</li>
                <li><strong>Accuracy:</strong> Ensure every detail is preserved to guide your stitching.</li>
              </ul>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="philosophy-section">
            <div className="container">
              <div className="philosophy-content">
                <div className="philosophy-text">
                  <p>
                    We believe in building garments through deep research—with those who share our values, heritage, and our future. Understanding how our manufacturers work is not just practical and essential to us, together, we craft each piece with intention, blending tradition and innovation like a true family.
                  </p>
                  <p>
                    We are proud to partner with master artisans who embody the spirit of Italian excellence. Their expertise, rooted in generations of craftsmanship, brings our vision to life with every stitch and detail. From our signature 70's style design every element of our process reflects a shared reverence for artistry and authenticity.
                  </p>
                  <p>
                    Elisa Spina is more than a brand. It's a family bound by respect, creativity, and a commitment to timeless Italian craftsmanship.
                  </p>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Designer with fabric samples" 
                    className="philosophy-image"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Images */}
          <div className="bottom-images">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
              alt="Designer sketching" 
              className="bottom-image"
            />
            <img 
              src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
              alt="Designer working" 
              className="bottom-image"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Atelier Locator</h3>
              <p>Find the Elisa Spina Atelier closest to you and discover her latest collections.</p>
              <a href="#">Find the atelier</a>
            </div>
            <div className="footer-section">
              <h3>Atelier Opening Hours</h3>
              <p>Elisa Spina Atelier is here to help you with your new and personalized wardrobe.</p>
              <a href="#">Opening hours</a>
            </div>
            <div className="footer-section">
              <h3>Subscribe to our Newsletter</h3>
              <p>Stay updated on the latest collections, information on latest updates, and receive other exclusive offers.</p>
              <a href="#">Login</a>
            </div>
            <div className="footer-section">
              <h3>Our World</h3>
              <a href="#">The Designer</a>
              <a href="#">Craftsmanship and Values</a>
              <a href="#">Size Guide</a>
              <a href="#">Reviews</a>
              <a href="#">Work With Us</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Copyright © 2022 Elisa Spina Srl - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
