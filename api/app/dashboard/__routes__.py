from app.dashboard.classification import ClassificationExporter
from app.dashboard.dashboard import Dashboard
from . import dashboard_api

dashboard_api.add_resource(Dashboard, "/dashboard")
dashboard_api.add_resource(ClassificationExporter, "/ClassificationExporter")