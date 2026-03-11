import os
from flask import request
from flask_restful import Resource
from app.db import get_collection



class Survey(Resource):
    def post(self):
        data = request.get_json(force=True)
        email = data.get("email")

        survey_collection = get_collection("survey", "foodInfo")

        exising_entry = survey_collection.find_one({"email": email})
        if exising_entry:
            return {
                "status": 0,
                "class": "error",
                "message": "Survey data for this email already exists",
            }, 200
        
        survey_collection.insert_one(data)
            

        return {
            "status": 1,
            "class": "success",
            "message": "Survey data received successfully",
        }, 200
