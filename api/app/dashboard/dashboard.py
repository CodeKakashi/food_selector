import os
from flask import request
from flask_restful import Resource
import pandas as pd

from .functions import filter_recipes, show_all_exact_duplicates

class Dashboard(Resource):
    def post(self):
        data = request.get_json(force=True)
    

        if "ingredients" not in data or not isinstance(data["ingredients"], list):
            return {
                "status": 0,
                "class": "error",
                "message": "ingredients (list) is mandatory",
            }, 400

        ingredients = data["ingredients"]

        # ---------------------------
        # Optional filters
        # ---------------------------
        name = data.get("name")
        diet = data.get("diet")
        prep_time = data.get("prep_time")
        cook_time = data.get("cook_time")
        course = data.get("course")
        state = data.get("state")

        # ---------------------------
        # Load dataset
        # ---------------------------
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        CSV_PATH = os.path.join(BASE_DIR, "..", "..", "main.csv")
        CSV_PATH = os.path.abspath(CSV_PATH)
        foodData = pd.read_csv(CSV_PATH)

        # # ---------------------------
        # # Ingredient filtering (fuzzy)
        # # ---------------------------
        filtered_df = filter_recipes(
            foodData,
            ingredients_list=ingredients,
            name=name,
            diet=diet,
            prep_time=prep_time,
            cook_time=cook_time,
            course=course,
            state=state
        )

        # ---------------------------
        # Prepare response
        # ---------------------------
        payload = {
            "filtered_recipes": filtered_df.to_dict(orient="records"),
        }

        return {
            "status": 1,
            "class": "success",
            "message": "Recipes filtered successfully",
            "payload": payload,
        }, 200
