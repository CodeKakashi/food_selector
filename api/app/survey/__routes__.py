from app.survey.survey import Survey
from . import survey_api

survey_api.add_resource(Survey, "/survey")