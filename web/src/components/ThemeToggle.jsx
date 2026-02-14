import React, { useEffect, useMemo, useState } from "react";
import "./themeToggle.css";

const THEME_KEY = "theme";

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getStoredTheme = () => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
};

const applyTheme = (nextTheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = nextTheme;
};

const ThemeToggle = ({ placement = "fixed", className = "" }) => {
  const storedTheme = useMemo(() => getStoredTheme(), []);
  const [theme, setTheme] = useState(storedTheme || getSystemTheme());
  const [hasPreference, setHasPreference] = useState(Boolean(storedTheme));

  useEffect(() => {
    applyTheme(theme);
    if (hasPreference) {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, hasPreference]);

  useEffect(() => {
    if (hasPreference || typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };

    if (media.addEventListener) {
      media.addEventListener("change", onChange);
    } else {
      media.addListener(onChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, [hasPreference]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setHasPreference(true);
    window.localStorage.setItem(THEME_KEY, next);
  };

  return (
    <div className={`theme-toggle theme-toggle--${placement} ${className}`.trim()}>
      <button
        type="button"
        className={`theme-switch ${theme === "dark" ? "is-night" : "is-day"}`}
        onClick={toggleTheme}
        aria-pressed={theme === "dark"}
        aria-label={theme === "dark" ? "Switch to Day theme" : "Switch to Night theme"}
      >
        <span className="theme-switch-track">
          <span className="theme-bg theme-bg-day" aria-hidden="true" />
          <span className="theme-bg theme-bg-night" aria-hidden="true" />
          <span className="theme-clouds" aria-hidden="true" />
          <span className="theme-stars" aria-hidden="true" />
          <span className="theme-orb" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
