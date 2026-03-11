from flask import Blueprint
from flask_restful import Api


survey_bp = Blueprint("survey", __name__)
survey_api = Api(survey_bp)

from . import __routes__