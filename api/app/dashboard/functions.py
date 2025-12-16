import re
from fuzzywuzzy import fuzz, process
import pandas as pd
import requests


# ---------------------------------------------------------
# Duplicates
# ---------------------------------------------------------
def show_all_exact_duplicates(col, foodData):
    """Show all exact duplicate rows based on a column."""
    return foodData[foodData.duplicated(col, keep=False)].sort_values(col)


# ---------------------------------------------------------
# Close matches export
# ---------------------------------------------------------
def find_close_matches_export(foodData, col, threshold=85, limit=1000):
    """
    Find close matches within the first N rows of a column and export results to Excel.
    """
    names = foodData[col].head(limit).dropna().astype(str).tolist()

    results = []

    for name in names:
        close = process.extract(name, names, scorer=fuzz.token_set_ratio)
        close_filtered = [x for x in close if x[0] != name and x[1] >= threshold]

        for match, score in close_filtered:
            results.append([name, match, score])

    df_results = pd.DataFrame(results, columns=["Name", "Close Match", "Match Score"])
    df_results.to_excel("close_match_results.xlsx", index=False)

    return df_results


# ---------------------------------------------------------
# Foreign language detection
# ---------------------------------------------------------
def contains_foreign_language(text):
    """
    Detects non-English alphabet characters but ALLOWS symbols:
    () [] {} !@#$%^&*_-+=;:'",.<>?/
    Only flags unicode letters outside A–Z and a–z.
    """
    if pd.isna(text):
        return False

    pattern = r"[^\W\d_a-zA-Z]"
    return bool(re.search(pattern, str(text)))


def detect_foreign_in_df(df):
    """
    Adds detection columns:
      - foreign_in_name
      - foreign_in_ingredients
    """
    df = df.copy()
    df["foreign_in_name"] = df["name"].apply(contains_foreign_language)
    df["foreign_in_ingredients"] = df["ingredients"].apply(contains_foreign_language)
    return df


def export_to_excel(df, filename="foreign_language_output.xlsx"):
    """
    Exports only rows containing foreign language in name or ingredients.
    """
    filtered = df[
        (df["foreign_in_name"] == True) | (df["foreign_in_ingredients"] == True)
    ]
    filtered.to_excel(filename, index=False)
    print(f"Foreign-language rows exported: {filename}")


# ---------------------------------------------------------
# Main filtering (ingredients + optional diet/course)
# ---------------------------------------------------------
import pandas as pd


def filter_recipes(
    df,
    ingredients_list,  # compulsory
    name=None,
    diet=None,
    prep_time=None,  # <=
    cook_time=None,  # <=
    course=None,
    state=None,
):
    df = df.copy()

    # Required columns
    required_cols = {
        "ingredients",
        "name",
        "diet",
        "prep_time",
        "cook_time",
        "course",
        "state",
    }
    missing = required_cols - set(df.columns)
    if missing:
        raise KeyError(
            f"Missing required columns in dataframe: {sorted(list(missing))}"
        )

    # Safe types
    df["ingredients"] = df["ingredients"].astype("string")
    df["name"] = df["name"].astype("string")
    df["diet"] = df["diet"].astype("string")
    df["course"] = df["course"].astype("string")
    df["state"] = df["state"].astype("string")
    df["prep_time"] = pd.to_numeric(df["prep_time"], errors="coerce")
    df["cook_time"] = pd.to_numeric(df["cook_time"], errors="coerce")

    # Validate ingredients_list
    if not isinstance(ingredients_list, list) or len(ingredients_list) == 0:
        raise ValueError(
            "ingredients_list must be a non-empty list, e.g. ['milk', 'sugar']"
        )

    user_words = [str(x).strip().lower() for x in ingredients_list if str(x).strip()]
    if not user_words:
        raise ValueError(
            "ingredients_list must contain at least one non-empty ingredient string"
        )

    # 1) Filter by ingredients (AND)
    mask = pd.Series(True, index=df.index)
    for ing in user_words:
        mask &= df["ingredients"].str.contains(ing, case=False, na=False)

    filtered_df = df[mask]

    # 2) Optional filters (applied after ingredients)
    if name:
        filtered_df = filtered_df[
            filtered_df["name"].str.contains(str(name), case=False, na=False)
        ]

    if diet:
        filtered_df = filtered_df[filtered_df["diet"].str.lower() == str(diet).lower()]

    if prep_time is not None:
        prep_time_val = int(prep_time)
        filtered_df = filtered_df[
            filtered_df["prep_time"].notna()
            & (filtered_df["prep_time"] <= prep_time_val)
        ]

    if cook_time is not None:
        cook_time_val = int(cook_time)
        filtered_df = filtered_df[
            filtered_df["cook_time"].notna()
            & (filtered_df["cook_time"] <= cook_time_val)
        ]

    if course:
        filtered_df = filtered_df[
            filtered_df["course"].str.lower() == str(course).lower()
        ]

    if state:
        filtered_df = filtered_df[
            filtered_df["state"].str.lower() == str(state).lower()
        ]

    # 3) Missing ingredients PER RECIPE (row-wise)
    def compute_missing_per_row(ingredient_text):
        if pd.isna(ingredient_text):
            return {"count": 0, "missing_ingredients": []}

        # split recipe ingredients
        recipe_ings = [
            x.strip().lower() for x in str(ingredient_text).split(",") if x.strip()
        ]

        # keep only ingredients not provided by user (containment match)
        # example: user "milk" removes "milk", "milk powder", etc.
        missing_list = [
            ing
            for ing in dict.fromkeys(recipe_ings)  # preserve order, unique
            if not any(uw in ing for uw in user_words)
        ]

        return {"count": len(missing_list), "missing_ingredients": missing_list}

    filtered_df = filtered_df.copy()
    filtered_df["missing_ingredients"] = filtered_df["ingredients"].apply(compute_missing_per_row)

    filtered_df["_missing_count"] = filtered_df["missing_ingredients"].apply(
        lambda d: d.get("count", 0) if isinstance(d, dict) else 0
    )
    filtered_df = filtered_df.sort_values("_missing_count", ascending=True).drop(columns=["_missing_count"])
    
    filtered_df["youtube_link"] = filtered_df["name"].apply(
    lambda n: "https://www.youtube.com/results?search_query=" + "+".join(str(n).split()))


    return filtered_df


# def fetch_image_urls(name: str, limit: int = 1) -> list[str]:
#     """
#     Fetch real image URLs from Wikimedia Commons
#     Input : dish name
#     Output: list of direct image URLs
#     """

#     if not name or len(name.strip()) < 2:
#         raise ValueError("name must be at least 2 characters")

#     url = "https://commons.wikimedia.org/w/api.php"

#     params = {
#         "action": "query",
#         "format": "json",
#         "generator": "search",
#         "gsrsearch": name.strip(),
#         "gsrnamespace": 6,     # File namespace
#         "gsrlimit": limit,
#         "prop": "imageinfo",
#         "iiprop": "url"
#     }

#     headers = {
#         # REQUIRED by Wikimedia policy
#         "User-Agent": "food-selector/1.0 (https://example.com; contact@example.com)"
#     }

#     response = requests.get(url, params=params, headers=headers, timeout=20)
#     response.raise_for_status()

#     data = response.json()
#     pages = data.get("query", {}).get("pages", {})

#     urls = []
#     for page in pages.values():
#         info = page.get("imageinfo", [{}])[0]
#         if "url" in info:
#             urls.append(info["url"])

#     return urls
