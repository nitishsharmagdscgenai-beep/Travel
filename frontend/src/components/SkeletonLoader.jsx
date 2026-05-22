import React from "react";
import { motion } from "framer-motion";
import "../styles/components/SkeletonLoader.css";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="skeleton-card">
            <div className="skeleton-pulse">
              <div className="skeleton-image"></div>
              <div className="skeleton-line w-75"></div>
              <div className="skeleton-line w-50"></div>
              <div className="skeleton-line w-60"></div>
            </div>
          </div>
        );

      case "chart":
        return (
          <div className="skeleton-card">
            <div className="skeleton-pulse">
              <div className="skeleton-chart-header">
                <div className="skeleton-line w-40"></div>
              </div>
              <div className="skeleton-chart"></div>
            </div>
          </div>
        );

      case "trip":
        return (
          <div className="skeleton-trip">
            <div className="skeleton-pulse">
              <div className="skeleton-trip-content">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-trip-info">
                  <div className="skeleton-line w-60"></div>
                  <div className="skeleton-line w-40"></div>
                  <div className="skeleton-trip-meta">
                    <div className="skeleton-line w-30"></div>
                    <div className="skeleton-line w-30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="skeleton-stats">
            <div className="skeleton-pulse">
              <div className="skeleton-stat-icon"></div>
              <div
                className="skeleton-line w-50"
                style={{ margin: "12px auto" }}
              ></div>
              <div
                className="skeleton-line w-30"
                style={{ margin: "0 auto" }}
              ></div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="skeleton-card">
            <div className="skeleton-pulse">
              <div className="skeleton-profile-header">
                <div className="skeleton-avatar-large"></div>
                <div className="skeleton-profile-info">
                  <div className="skeleton-line w-60"></div>
                  <div className="skeleton-line w-40"></div>
                </div>
              </div>
              <div className="skeleton-divider"></div>
              <div className="skeleton-line w-100"></div>
              <div className="skeleton-line w-90"></div>
              <div className="skeleton-line w-80"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="skeleton-card">
            <div className="skeleton-pulse">
              <div className="skeleton-image"></div>
              <div className="skeleton-line w-75"></div>
              <div className="skeleton-line w-50"></div>
            </div>
          </div>
        );
    }
  };

  if (count > 1) {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, index) => (
          <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default SkeletonLoader;
