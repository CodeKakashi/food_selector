import { createBrowserRouter } from "react-router-dom";
import NotFound from "./components/notFound";
import IntroPage from "./pages/intro";
import DashboardGuard from "./pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IntroPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardGuard />,
  },
  //   Add your routes here
  {
    path: "*",
    element: <NotFound />,
  }
]);

export default router;
