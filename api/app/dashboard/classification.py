import os
import time
import random
import pandas as pd
import requests
from flask_restful import Resource
from flask import send_file
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# -------------------------------------------------
# Paths (ABSOLUTE — critical)
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CSV_PATH = os.path.abspath(
    os.path.join(BASE_DIR, "..", "..", "diet.csv")
)

OUTPUT_CSV = os.path.abspath(
    os.path.join(BASE_DIR, "food_diet_web_verified.csv")
)

# -------------------------------------------------
# Wikidata configuration
# -------------------------------------------------

WD_API = "https://www.wikidata.org/w/api.php"
WDQS  = "https://query.wikidata.org/sparql"

NONVEG_CLASSES = [
    "Q10990",    # meat
    "Q600396",   # fish as food
    "Q192935",   # seafood
    "Q6501235",  # shellfish
    "Q93189",    # egg as food
    "Q18087876", # poultry meat
    "Q629103"    # animal product
]

# -------------------------------------------------
# Helper utilities
# -------------------------------------------------

def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": "food-selector/1.0 (contact: youremail@example.com)",
        "Accept": "application/json"
    })

    retry = Retry(
        total=5,
        backoff_factor=1.2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=frozenset(["GET"]),
        raise_on_status=False,
    )

    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    return session


def polite_sleep():
    time.sleep(random.uniform(0.3, 0.7))


def get_wikidata_qid(dish_name: str, session: requests.Session) -> str | None:
    params = {
        "action": "wbsearchentities",
        "search": dish_name,
        "language": "en",
        "format": "json",
        "limit": 1,
    }

    r = session.get(WD_API, params=params, timeout=25)
    r.raise_for_status()

    results = r.json().get("search", [])
    return results[0]["id"] if results else None


def is_nonveg_qid(qid: str, session: requests.Session) -> bool:
    values = " ".join(f"wd:{q}" for q in NONVEG_CLASSES)

    sparql = f"""
    ASK {{
      wd:{qid} (wdt:P527|wdt:P186) ?ingredient .
      ?ingredient (wdt:P279*|wdt:P31/wdt:P279*) ?cls .
      VALUES ?cls {{ {values} }}
    }}
    """

    r = session.get(
        WDQS,
        params={"query": sparql},
        headers={"Accept": "application/sparql-results+json"},
        timeout=35,
    )
    r.raise_for_status()
    return bool(r.json().get("boolean"))


def classify_dish_web(name: str, session: requests.Session) -> str:
    if not isinstance(name, str) or not name.strip():
        return "unknown"

    qid = get_wikidata_qid(name.strip(), session)
    polite_sleep()

    if not qid:
        return "unknown"

    nonveg = is_nonveg_qid(qid, session)
    polite_sleep()

    return "non-vegetarian" if nonveg else "vegetarian"

# -------------------------------------------------
# Flask-RESTful Resource
# -------------------------------------------------

class ClassificationExporter(Resource):

    def get(self):

        # ---- Load CSV
        foodData = pd.read_csv(CSV_PATH)

        # ---- Validate columns
        required_cols = {"name", "_id"}
        missing = required_cols - set(foodData.columns)
        if missing:
            return {
                "status": "error",
                "message": f"Missing required columns: {sorted(missing)}"
            }, 400

        # ---- Session + cache
        session = build_session()
        cache: dict[str, str] = {}

        def classify_with_cache(name: str) -> str:
            key = str(name).strip().lower()
            if not key:
                return "unknown"

            if key in cache:
                return cache[key]

            print(f"🔍 Classifying dish: {name}")
            label = classify_dish_web(name, session)
            cache[key] = label
            return label

        # ---- Apply classification
        foodData["diet_web_verified"] = foodData["name"].apply(classify_with_cache)

        # ---- Export CSV (core pandas only)
        export_df = foodData[["name", "_id", "diet_web_verified"]].copy()
        export_df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")

        # ---- Final sanity check (prevents FileNotFoundError)
        if not os.path.exists(OUTPUT_CSV):
            return {
                "status": "error",
                "message": "CSV export failed"
            }, 500

        # ---- Send file
        return send_file(
            OUTPUT_CSV,
            as_attachment=True,
            download_name="food_diet_web_verified.csv",
            mimetype="text/csv"
        )
