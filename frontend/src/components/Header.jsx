import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/Logo/Logo.png";
import "../styles/components/Header.css";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <img src={Logo} alt="TravelAI Logo" className="logo-image" />
            <span className="logo-text">TravelAI</span>
          </Link>
        </div>
        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link secondary-btn">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link primary-btn">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link secondary-btn">
                Login
              </Link>
              <Link to="/register" className="primary-btn small nav-link">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
