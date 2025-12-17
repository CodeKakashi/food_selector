import { useLocation, Navigate } from "react-router-dom";
import RecipeListPage from "./RecipeListPage";

const DashboardGuard = () => {
  const location = useLocation();

  if (!location.state?.filtered_recipes) {
    return <Navigate to="/" replace />;
  }

  return <RecipeListPage data={location.state.filtered_recipes} />;
};

export default DashboardGuard;
