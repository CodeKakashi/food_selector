import re
from fuzzywuzzy import fuzz, process
import pandas as pd

# Function to show all exact duplicates in a dataframe based on a column
def show_all_exact_duplicates(col,foodData):
            return foodData[foodData.duplicated(col, keep=False)].sort_values(col)


# Function to find close matches
def find_close_matches_export(foodData, col, threshold=85, limit=1000):
    # work only on first N rows
    names = foodData[col].head(limit).tolist()
    
    results = []
    
    for name in names:
        close = process.extract(name, names, scorer=fuzz.token_set_ratio)
        # Filter only close matches above threshold
        close_filtered = [x for x in close if x[0] != name and x[1] >= threshold]
        
        for match, score in close_filtered:
            results.append([name, match, score])
    
    # Convert to dataframe
    df_results = pd.DataFrame(results, columns=['Name', 'Close Match', 'Match Score'])
    
    # Export to Excel
    df_results.to_excel("close_match_results.xlsx", index=False)
    
    return df_results

output_df = find_close_matches_export('name', threshold=85, limit=1000)
output_df.head()

# cleaned every duplicate in the excel sheet
# No false positives found
def contains_foreign_language(text):
    """
    Detects non-English alphabet characters but ALLOWS symbols, including:
    () [] {} !@#$%^&*_-+=;:'",.<>?/ 
    Only flags characters outside A–Z and a–z.
    """
    if pd.isna(text):
        return False
    
    # Match any unicode letter that is NOT English A–Z
    # Allowed: all symbols, numbers, spaces, punctuation, parentheses
    pattern = r"[^\W\d_a-zA-Z]"
    
    return bool(re.search(pattern, text))

# Detection Function
# Adds detection foreign language columns to the dataframe
def detect_foreign_in_df(df):
    """
    Adds detection columns:
    - foreign_in_name
    - foreign_in_ingredients
    """

    df["foreign_in_name"] = df["name"].apply(contains_foreign_language)
    df["foreign_in_ingredients"] = df["ingredients"].apply(contains_foreign_language)

    return df

# Export Function
# Uses the detection function and exports to Excel
def export_to_excel(df, filename="foreign_language_output.xlsx"):
    """
    Exports the dataframe with foreign-language detection to Excel.
    """
    filtered = df[(df["foreign_in_name"] == True) | 
                (df["foreign_in_ingredients"] == True)]

    # Export only those rows
    filtered.to_excel(filename, index=False)
    print(f"Foreign-language rows exported: {filename}")

# Fuzzy Filtering Function
# Uses fuzzy matching to filter recipes based on ingredients, diet, and course type
def filter_recipes(df, ingredients_list=None, diet_type=None, course_type=None):
    """
    Filters recipes with fuzzy match and returns:
    1. Filtered recipes
    2. Ingredient suggestions (comma-based, cleaned, sorted by length)
    """

    mask = pd.Series([True] * len(df))

    # --------------------------
    # Fuzzy Ingredient Matching
    # --------------------------
    if ingredients_list:
        if not isinstance(ingredients_list, list):
            raise ValueError("ingredients_list must be a list, e.g. ['milk', 'sugar']")
        
        for ing in ingredients_list:
            mask &= df["ingredients"].str.contains(ing, case=False, na=False)

    # --------------------------
    # Fuzzy Diet Matching
    # --------------------------
    if diet_type:
        mask &= df["diet"].str.contains(diet_type, case=False, na=False)

    # --------------------------
    # Fuzzy Course Matching
    # --------------------------
    if course_type:
        mask &= df["course"].str.contains(course_type, case=False, na=False)

    filtered_df = df[mask]

    # -----------------------------------------------------
    # BUILD CLEAN SUGGESTIONS (BASED ON COMMAS ONLY)
    # -----------------------------------------------------
    # extract comma-separated ingredient phrases
    all_ingredient_phrases = (
        df["ingredients"]
        .str.lower()
        .str.split(",")          
        .explode()
        .str.strip()             
        .unique()
        .tolist()
    )

    # remove empty values
    all_ingredient_phrases = [i for i in all_ingredient_phrases if i]

    # fuzzy remove user ingredients
    user_words = [w.lower() for w in ingredients_list] if ingredients_list else []

    def is_not_related(phrase):
        return not any(user_word in phrase for user_word in user_words)

    suggestions = [p for p in all_ingredient_phrases if is_not_related(p)]

    # sort by phrase length
    suggestions = sorted(suggestions, key=len)

    return filtered_df, suggestions