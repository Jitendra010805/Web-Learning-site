import React from 'react';
import "./footer.css";
import { FaFacebook, FaTwitter, FaInstagramSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer fade-in">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2026 Estudy. All rights reserved.</p>
        </div>

        <div className="footer-center">
          <p>Made with ❤️ by <a href="#">Jitendra Singh Rathore</a></p>
        </div>

        <div className="footer-right">
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagramSquare /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
