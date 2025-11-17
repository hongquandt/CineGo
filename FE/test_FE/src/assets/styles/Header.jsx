import React from "react";
import { Link, useLocation } from "react-router-dom";
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
      <Link to="/" className="logo-link">
        <img src={CineGoLogo} alt="CineGo Logo" className="logo-img-header" />
      </Link>
      <nav className="main-nav">
        <Link to="/" className={isActive("/")}>
          Home
        </Link>
        <Link to="/movies" className={isActive("/movies")}>
          Movies
        </Link>
        <Link to="/theatres" className={isActive("/theatres")}>
          Theatres
        </Link>
        <Link to="/releases" className={isActive("/releases")}>
          Releases
        </Link>
      </nav>
      <div className="user-actions">
        <button className="search-btn">
          <img src={SearchIcon} alt="Search" className="search-icon" />
        </button>
        <Link to="/auth" className="btn btn-primary">
          Log in
        </Link>
      </div>
    </header>
  );
};

export default Header;
