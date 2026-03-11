import React from "react";
import { createBrowserRouter } from "react-router-dom";

import NotFound from "./components/notFound";
import IntroPage from "./pages/intro";
import DashboardGuard from "./pages/dashboard";
import LandingPage from "./pages/intro/intro.jsx";
import SurveyPage from "./pages/survey";

import AppLayout from "./pages/title/AppLayout.jsx";

const router = createBrowserRouter([
  // ✅ Landing page WITHOUT layout
  {
    path: "/",
    element: <LandingPage />,
  },

  // ✅ Pages WITH TitleBar layout
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "intro",
        element: <IntroPage />,
      },
      {
        path: "dashboard",
        element: <DashboardGuard />,
      },
      {
        path: "survey",
        element: <SurveyPage />,
      },
    ],
  },

  // ❌ Not found
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
