// DashboardPage.jsx (Guard)
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import RecipeListPage from "./RecipeListPage";

const DashboardGuard = () => {
  const location = useLocation();

  // 1) Try getting recipes from router state
  const recipesFromState = location?.state?.filtered_recipes;

  // 2) Fallback: localStorage (prevents redirect on refresh)
  const recipesFromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem("filtered_recipes");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const ingredientsFromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem("selectedIngredients");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  // Final values
  const finalRecipes =
    Array.isArray(recipesFromState) && recipesFromState.length > 0
      ? recipesFromState
      : recipesFromStorage;

  const finalIngredients =
    Array.isArray(location?.state?.ingredients) && location.state.ingredients.length > 0
      ? location.state.ingredients
      : ingredientsFromStorage;

  // If nothing exists anywhere, go home
  // if (!finalRecipes || finalRecipes.length === 0) {
  //   return <Navigate to="/" replace />;
  // }

  // ✅ Pass through same state shape your RecipeListPage uses
  return (
    <RecipeListPage
      id="recipe-list"
      data={finalRecipes}
      // Optional: you already read from location.state inside RecipeListPage,
      // but passing these props can help if you later refactor.
      ingredients={finalIngredients}
    />
  );
};

export default DashboardGuard;
