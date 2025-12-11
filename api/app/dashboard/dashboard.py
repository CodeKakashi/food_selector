from flask_restful import Resource

class Dashboard(Resource):
    def get(self):
        dashboardContent = {
            "message": "Start your construction work here",
        }
        return {
            "status": 1,
            "class": "success",
            "message": "Dashboard data successfully retrieved",
            "payload": dashboardContent,
        }


