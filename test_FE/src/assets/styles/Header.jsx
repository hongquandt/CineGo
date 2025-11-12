import React from "react";
import { useLocation } from "react-router-dom";
import CineGoLogo from "../images/CineGoLogo.png";
import SearchIcon from "../images/searchIcon.svg";
import "./Header.css";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="main-header">
      <a href="/" className="logo-link">
        <img src={CineGoLogo} alt="CineGo Logo" className="logo-img-header" />
      </a>
      <nav className="main-nav">
        <a href="/" className={isActive("/")}>
          Home
        </a>
        <a href="/movies" className={isActive("/movies")}>
          Movies
        </a>
        <a href="/theatres" className={isActive("/theatres")}>
          Theatres
        </a>
        <a href="/releases" className={isActive("/releases")}>
          Releases
        </a>
      </nav>
      <div className="user-actions">
        <button className="search-btn">
          <img src={SearchIcon} alt="Search" className="search-icon" />
        </button>
        <a href="/auth" className="btn btn-primary">
          Log in
        </a>
      </div>
    </header>
  );
};

export default Header;
