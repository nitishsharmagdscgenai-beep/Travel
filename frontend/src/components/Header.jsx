import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo/Logo.png";
import labels from "../labels/common";

function Header() {
  return (
    <div className="header-container container">
      <header>
        <div className="header-logo">
          <Link to="/">
            <img src={Logo} alt={labels.appName} />
            <h1>TravelAI</h1>
          </Link>
        </div>

        <div className="header-btn">
          <Link to="/register" className="secondary-btn">
            SignUp
          </Link>
          <Link to="/login" className="primary-btn">
            SignIn
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Header;
