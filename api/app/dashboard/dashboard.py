import json
from flask_restful import Resource
import pandas as pd

from api.app.dashboard.functions import (
    detect_foreign_in_df,
    export_to_excel,
    filter_recipes,
    show_all_exact_duplicates,
)

class Dashboard(Resource):
    def get(self):
        foodData = pd.read_csv("main.csv")
        foodData.head()

        foodData.info()

        # checked the closed matches manually and found no false positives

        print("EXACT DUPLICATE ROWS:")
        print(show_all_exact_duplicates("name", foodData))

        # Apply detection
        processed_df = detect_foreign_in_df(foodData)

        # Export to Excel
        export_to_excel(processed_df, "foreign_ingredients_check.xlsx")

        ingredients = ["mil", "sug"]

        result, suggestions = filter_recipes(foodData, ingredients_list=ingredients)

        print("Filtered Recipes:")
        print(result[["name", "ingredients"]])

        print("\nSuggested Ingredients (cleaned):")
        print(suggestions)

        filtered_df, suggestions = filter_recipes(foodData, ingredients_list=["milk"])

        output_json = json.dumps({
            "filtered_recipes": filtered_df.to_dict(orient="records"),
            "ingredient_suggestions": suggestions
        }, indent=4)

        return {
            "status": 1,
            "class": "success",
            "message": "Dashboard data successfully retrieved",
            "payload": output_json,
        }
