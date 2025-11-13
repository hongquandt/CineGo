import React from "react";
import { Link } from "react-router-dom";
import CineGoLogo from "../images/CineGoLogo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-col about">
          <img src={CineGoLogo} alt="CineGo Logo" className="logo-img-footer" />
          <p>
            Lorem ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="footer-col links">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/privacy">Privacy policy</Link>
        </div>
        <div className="footer-col contact">
          <h4>Get in touch</h4>
          <span>+1-212-456-7890</span>
          <span>contact@example.com</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright 2025 © GreatStack. All Right Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
