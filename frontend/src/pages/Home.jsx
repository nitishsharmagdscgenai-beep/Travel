// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMap, FiCpu, FiCloud, FiTrendingUp, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import labels from "../labels/common";

const Home = () => {
  const { user } = useAuth();

  const usps = [
    {
      icon: FiCpu,
      title: "AI-Powered Planning",
      desc: "Smart itineraries tailored to your preferences",
    },
    {
      icon: FiMap,
      title: "Interactive Maps",
      desc: "Explore destinations with detailed maps",
    },
    {
      icon: FiCloud,
      title: "Real-time Weather",
      desc: "Stay updated with weather forecasts",
    },
    {
      icon: FiTrendingUp,
      title: "Budget Tracking",
      desc: "Manage and optimize your travel budget",
    },
  ];

  return (
    <>
      <div className="home-container">
        <div className="container">
          <Header />

          <div className="hero-container">
            <div className="hero-txt">
              <h2>{labels.heroBannerTitle}</h2>
              <p>{labels.heroBannerDesc}</p>
            </div>
            <div className="hero-btn">
              <Link to="/dashboard" className="secondary-btn">
                DashBoard
              </Link>
              <Link to="/register" className="primary-btn">
                Get Started
              </Link>
            </div>
          </div>

          <div className="home-usp">
            {usps &&
              usps.map((usp, index) => (
                <div className="usp">
                  {<usp.icon className="icon" />}
                  <h3>{usp.title}</h3>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
