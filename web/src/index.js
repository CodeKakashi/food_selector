import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

try {
  document.documentElement.dataset.theme = getInitialTheme();
} catch {
  // ignore
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();

const isProd = process.env.NODE_ENV === "production";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (isProd) {
      navigator.serviceWorker.register(
        `${process.env.PUBLIC_URL}/service-worker.js`
      );
    } else {
      // Avoid SW caching and reload loops during development.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
    }
  });
}
