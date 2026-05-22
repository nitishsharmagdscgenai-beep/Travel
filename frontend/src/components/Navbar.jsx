import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/components/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="navbar-user"
            onClick={() => navigate("/profile")}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?.name}</span>
          </motion.div>

          <button onClick={logout} className="logout-btn" title="Logout">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
