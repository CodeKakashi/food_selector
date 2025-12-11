import { createBrowserRouter } from "react-router-dom";
import NotFound from "./components/notFound";
import IntroPage from "./pages/intro";
import Dashboard from "./pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IntroPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  //   Add your routes here
  {
    path: "*",
    element: <NotFound />,
  }
]);

export default router;
