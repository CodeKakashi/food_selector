import React, { useEffect, useRef } from "react";
import "../components/notFound.css";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

const NotFound = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };

    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="not-found-container" ref={containerRef}>
      <ThemeToggle />
      <div className="not-found-parallax layer-one" aria-hidden="true" />
      <div className="not-found-parallax layer-two" aria-hidden="true" />
      <div className="not-found-card">
        <div className="not-found-badge">404</div>
        <h1>Page not found</h1>
        <p>
          The page you are looking for doesn’t exist or has been moved. Try going
          back to the home screen and start fresh.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-link">
            Go back home
          </Link>
          <span className="not-found-divider">•</span>
          <Link to="/intro" className="not-found-link secondary">
            Find recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
