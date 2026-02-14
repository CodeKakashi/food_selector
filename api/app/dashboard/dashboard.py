import os
from flask import request
from flask_restful import Resource
import pandas as pd
from app.db import get_collection

from .functions import filter_recipes, show_all_exact_duplicates


class Dashboard(Resource):
    def post(self):
        data = request.get_json(force=True)

        # ---------------------------
        # Validate input
        # ---------------------------
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
        # Fetch data from MongoDB
        # ---------------------------
        food_collection = get_collection("recipes", "foodInfo")

        # exclude Mongo internal _id to avoid pandas issues
        mongo_cursor = food_collection.find({}, {"_id": 0})

        food_df = pd.DataFrame(list(mongo_cursor))

        if food_df.empty:
            return {
                "status": 0,
                "class": "error",
                "message": "No food data available in database",
            }, 404

        # ---------------------------
        # Ingredient filtering
        # ---------------------------
        filtered_df = filter_recipes(
            food_df,
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
