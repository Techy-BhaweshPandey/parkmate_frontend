import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaCar, FaInfoCircle, FaCogs, FaRegCalendarAlt, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPark = () => {
  const [theme, setTheme] = useState('light');
  const [showPopup, setShowPopup] = useState(false); // default to false

  const toggleTheme = (theme) => {
    setTheme(theme);
    document.documentElement.className = theme;
  };

  // Show popup only if user hasn't acknowledged it before
  useEffect(() => {
    const hasAccepted = localStorage.getItem('parkMatePrivacyAccepted');
    if (!hasAccepted) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('parkMatePrivacyAccepted', 'true'); // store flag
  };

  return (
    <div className={`landing-page ${theme}`}>
      <Navbar toggleTheme={toggleTheme} />

      {/* Privacy Policy Popup */}
      {showPopup && (
        <div className="popup4-overlay">
          <div className="popup4-content">
            <h3>Privacy Policy</h3>
            <p>
              By using ParkMate, you agree to our Privacy Policy which outlines how we collect, use, and
              safeguard your information. Your data security and privacy are our top priorities.
            </p>
            <button className="popup4-btn" onClick={handleClosePopup}>
              I Understand
            </button>
          </div>
        </div>
      )}

      <section id="home" className="section1 home">
        <h2>Welcome to ParkMate</h2>
        <p>
          Discover a smarter way to park with ParkMate, the ultimate online parking solution.  Whether you're looking for a spot for a few hours or need long-term parking, ParkMate has got you covered.
        </p>
        <p>
          But that's not all! We provide flexible options tailored to your needs, secure parking with 24/7 monitoring, and competitive rates that fit every budget. Plus, our user-friendly app and website make it easy to manage your parking reservations, so you can park with peace of mind wherever you go.
        </p>
        <p>
          Join thousands of drivers who trust ParkMate to make parking easier. Start parking smarter today!
        </p>
        <div className="section-icon">
          <FaCar size={60} />
        </div>
        <div className="cta">
         <Link to='/Login'> <button className="cta-btn">Start Parking</button></Link> 
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section1 about">
        <h2>About Us</h2>
        <p>
          At ParkMate, we aim to make parking simple and stress-free. Our platform connects drivers with
          available parking spots in real-time, making it easier than ever to find parking near your
          destination. We are committed to providing innovative solutions for urban mobility and parking
          efficiency.
        </p>
        <div className="section-icon">
          <FaInfoCircle size={60} />
        </div>
        <div className="about-content">
          <h3>Our Mission</h3>
          <p>
            We strive to provide a user-friendly, accessible, and reliable service for parking, focusing on
            making urban areas more efficient and reducing the time spent searching for parking.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section1 services">
        <h2>Our Services</h2>
        <p>
          ParkMate provides a range of services to make your parking experience hassle-free. From real-time
          parking spot availability to flexible booking, we offer solutions that suit your needs.
        </p>
        <div className="section-icon">
          <FaCogs size={60} />
        </div>
        <div className="service-list">
          <div className="service-item">
            <FaRegCalendarAlt size={40} />
            <h3>Book Parking in Advance</h3>
            <p>
              Reserve a parking spot ahead of time to guarantee you have a space when you arrive.
            </p>
          </div>
          <div className="service-item">
            <FaUserShield size={40} />
            <h3>Secure Parking</h3>
            <p>
              Our parking spaces are secure and monitored, so you can rest easy knowing your vehicle is safe.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPark;
