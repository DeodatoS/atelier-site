import React from 'react'

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="#" className="logo">ELSA SASA</a>
          <nav>
            <ul className="nav">
              <li><a href="#">MADE TO MEASURE</a></li>
              <li><a href="#">COLLECTIONS</a></li>
              <li><a href="#">BLOG</a></li>
              <li><a href="#">ACCESSORIES</a></li>
              <li><a href="#">ONLINE PROFILE</a></li>
              <li><a href="#">HANDBOOK INFORMATION</a></li>
              <li><a href="#">OUR BRAND</a></li>
            </ul>
          </nav>
          <div className="header-icons">
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
            </svg>
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7M9 3V4H15V3H9M7 6V19H17V6H7Z"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="playfair">ELSA SASA</h1>
          <p>MADE TO MEASURE</p>
        </div>
      </section>

      {/* Made to Measure Section */}
      <section className="made-to-measure">
        <div className="container">
          <h2 className="section-title playfair">MADE TO MEASURE</h2>
          <p className="section-description">
            Made to Measure is our solution to ethical elegance crafted 
            especially for you. Collaborate with our artisans to choose the finest 
            fabrics and fits, your own design. We design & construct your personal 
            style, reflecting Italian craftsmanship with modern functionality.
          </p>

          <div className="services-grid">
            <div>
              <div className="service-image">
                <span>Consultation Image</span>
              </div>
            </div>
            <div className="service-content">
              <h3 className="playfair">Consultation</h3>
              <p>
                A beautiful internal analysis where a specialist 
                performs a thoughtful assessment to perfectly 
                reflect the client's measurements and personal 
                preferences.
              </p>
              <p>
                We believe in recommendation-driven consulting 
                from fashion that is meaningful to the client. 
                Patterns that focus attention and mirror design 
                trends are available, like the structure of the 
                garment ensures balance and harmonized.
              </p>
              <p>
                <strong>Fit and Design:</strong> Made-to-measure provides a 
                refined fit that surpasses off-the-rack options, 
                ensuring a tailored silhouette that flatters your 
                measurements and preferences.
              </p>
              <p>
                <strong>Exclusive:</strong> Made-to-measure reflects perfect 
                balance between personalization and efficiency, 
                delivering a unique garment alongside your 
                needs in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="process-grid">
            <div className="process-content">
              <h2 className="playfair">The Process</h2>
              
              <div className="process-step">
                <h4>First step - Book an appointment</h4>
                <p>
                  Whether you are in Milano, overseas, our 
                  appointment only. Please note that bookings can 
                  be made through telephone, directions or during 
                  an online.
                </p>
              </div>

              <div className="process-step">
                <h4>Second step - Measurements</h4>
                <p>
                  All fittings develop detailed for each individual 
                  client. We take precise measurements and 
                  measurements process with an extensive 
                  database to detail. Aesthetic aspects such as 
                  silhouette, design and style are thoroughly 
                  discussed. The detailed check guideline chosen 
                  interior throughout the process.
                </p>
                <p><em>Approximately 45 minutes</em></p>
              </div>

              <div className="process-step">
                <h4>Third step - Fitting</h4>
                <p>
                  The second meeting is scheduled 4 weeks after 
                  the first meeting. During the second meeting a 
                  primary fitting is conducted on the garment, 
                  outlined alterations are made and the fit is 
                  refined. Specific fit samples, future orders 
                  outlined.
                </p>
                <p><em>Approximately 45 minutes</em></p>
              </div>

              <div className="process-step">
                <h4>Fourth step - Collection</h4>
                <p>
                  The piece is ready to be collected in store.
                </p>
              </div>
            </div>

            <div className="process-images">
              <div className="process-image">
                <span>Process Image 1</span>
              </div>
              <div className="process-image">
                <span>Process Image 2</span>
              </div>
              <div className="process-image">
                <span>Process Image 3</span>
              </div>
              <div className="process-image">
                <span>Process Image 4</span>
              </div>
              <div className="process-image large">
                <span>Large Process Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section">
        <div className="container">
          <h2 className="booking-title playfair">BOOK YOUR APPOINTMENT</h2>
          
          <div className="booking-grid">
            <div className="booking-card">
              <h3>Appointment at your home</h3>
              <p>
                We offer a home fitting service for our existing 
                clients. For new clients, we recommend visiting 
                our atelier for the initial consultation.
              </p>
              <button className="btn">BOOK YOUR MEETING</button>
            </div>

            <div className="booking-card">
              <h3>Virtual appointment</h3>
              <p>
                Book a virtual appointment with our team to discuss 
                your requirements and get expert advice on our 
                made-to-measure services.
              </p>
              <button className="btn">BOOK YOUR MEETING</button>
            </div>

            <div className="booking-card">
              <h3>Appointment in our Atelier</h3>
              <p>
                Visit our atelier in Milano for a complete 
                consultation experience. Our team will guide you 
                through the entire process.
              </p>
              <button className="btn">BOOK YOUR MEETING</button>
            </div>
          </div>

          <button className="btn btn-outline">BOOK ON WHATSAPP</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>ATELIER LOCATION</h4>
              <p>Visit Our Elsa Sasa Atelier</p>
              <p>Easily find directions via Gmaps</p>
              <p>and discover our latest</p>
              <p>collections.</p>
              <a href="#">Find Us Here</a>
            </div>

            <div className="footer-section">
              <h4>ATELIER OPENING HOURS</h4>
              <p>Our Elsa Sasa Atelier is open by</p>
              <p>appointment only. Please contact</p>
              <p>us with your size appointment</p>
              <p>preferences.</p>
              <a href="#">Contact Details</a>
            </div>

            <div className="footer-section">
              <h4>SUBSCRIBE TO OUR NEWSLETTER</h4>
              <p>Subscribe to the Elsa Sasa newsletter and</p>
              <p>receive exclusive offers, seasonal and limited-time</p>
              <p>exclusive offers.</p>
              <a href="#">Email</a>
            </div>

            <div className="footer-section">
              <h4>TERMS AND CONDITIONS</h4>
              <p>Terms and Conditions</p>
              <p>Privacy Policy</p>
              <p>Cookie Policy</p>
              <p>Refund Policy</p>
              <p>Delivery</p>
            </div>
          </div>

          <div className="footer-content">
            <div className="footer-section">
              <h4>OUR WORLD</h4>
              <a href="#">Our Designer</a>
              <a href="#">Sustainability and Ethics</a>
              <a href="#">Our Atelier</a>
              <a href="#">Testimonials</a>
              <a href="#">Work With Us</a>
            </div>

            <div className="footer-section">
              <h4>DO YOU NEED HELP?</h4>
              <a href="#">Size Guide</a>
              <a href="#">FAQ</a>
              <a href="#">Cleaning Experience with us</a>
              <a href="#">Frequently Asked Questions</a>
              <a href="#">Shipping and Returns</a>
              <a href="#">Terms and Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Authenticity</a>
            </div>

            <div className="footer-section">
              <h4>FOLLOW US ON SOCIAL MEDIA</h4>
              <p>€ 0.00 (0)</p>
              <p>Ready to Measure</p>
              <p>Back to Store</p>
            </div>

            <div className="footer-section">
              <h4>TERMS AND CONDITIONS</h4>
              <p>Terms and Conditions</p>
              <p>Privacy Policy</p>
              <p>Cookie Policy</p>
              <p>Refund Policy</p>
              <p>Delivery</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Copyright © 2024 Elsa Sasa SRL - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
