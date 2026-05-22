import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiCompass,
  FiMessageSquare,
  FiUser,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false); // Always false for now
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dark mode toggle - disabled for now, but kept for future
  const toggleDarkMode = () => {
    // Will implement dark mode later
    console.log("Dark mode will be implemented later");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/create-trip", icon: FiCompass, label: "Create Trip" },
    { path: "/chat", icon: FiMessageSquare, label: "AI Assistant" },
    { path: "/profile", icon: FiUser, label: "Profile" },
  ];

  if (isMobile) {
    return (
      <>
        <button onClick={toggleSidebar} className="mobile-menu-btn">
          <FiMenu size={24} />
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
                className="mobile-overlay"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="mobile-sidebar"
              >
                <div className="mobile-sidebar-header">
                  <div className="sidebar-logo">TravelAI</div>
                  <button onClick={closeMobileMenu} className="close-btn">
                    <FiX size={24} />
                  </button>
                </div>
                <nav className="mobile-sidebar-nav">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                  <button onClick={logout} className="sidebar-link logout">
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </nav>
                <div className="mobile-sidebar-footer">
                  <button onClick={toggleDarkMode} className="theme-toggle">
                    <FiMoon size={20} />
                    <span>Dark Mode (Coming Soon)</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="sidebar"
    >
      <div className="sidebar-content">
        <div className="sidebar-header">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="sidebar-logo"
          >
            TravelAI
          </motion.div>
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isOpen ? (
              <FiChevronLeft size={16} />
            ) : (
              <FiChevronRight size={16} />
            )}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={20} />
              <motion.span
                animate={{
                  opacity: isOpen ? 1 : 0,
                  display: isOpen ? "inline" : "none",
                }}
              >
                {item.label}
              </motion.span>
            </NavLink>
          ))}
          <button onClick={logout} className="sidebar-link logout">
            <FiLogOut size={20} />
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? "inline" : "none",
              }}
            >
              Logout
            </motion.span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleDarkMode} className="theme-toggle">
            <FiMoon size={20} />
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? "inline" : "none",
              }}
            >
              Dark Mode (Coming Soon)
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
