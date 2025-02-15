import requests
import configparser
import os
from dotenv import load_dotenv

# Load config
# config = configparser.ConfigParser()
# config.read("nutritionix.cfg")

# NUTRITIONIX_CLIENT_ID = config.get("NUTRITIONIX", "NUTRITIONIX_CLIENT_ID")
# NUTRITIONIX_CLIENT_KEY = config.get("NUTRITIONIX", "NUTRITIONIX_CLIENT_KEY")

# Load .env file
load_dotenv()

# Your FatSecret API credentials
NUTRITIONIX_CLIENT_ID = os.getenv("NUTRITIONIX_CLIENT_ID")
NUTRITIONIX_CLIENT_KEY = os.getenv("NUTRITIONIX_CLIENT_KEY")

def nutrient_search(food_name):
    # url = "https://trackapi.nutritionix.com/v2/search/instant"
    url = 'https://trackapi.nutritionix.com/v2/natural/nutrients/'

    print('NUTRITIONIX_CLIENT_ID =', NUTRITIONIX_CLIENT_ID)
    print('NUTRITIONIX_CLIENT_KEY =', NUTRITIONIX_CLIENT_KEY)

    headers = {
        "x-app-id": NUTRITIONIX_CLIENT_ID,
        "x-app-key": NUTRITIONIX_CLIENT_KEY,
        "Accept": "application/json",
        "Content-Type": "application/json",  # Optional, but good practice
    }

    params = {
        "query": food_name
    }

    response = requests.post(url, headers=headers, json=params)

    if response.status_code == 200:
        return response.json()
    
    return None

def get_essential_nutrients(food_name):
    result = nutrient_search(food_name)
    food_item = result['foods'][0]

    key_nutrients = {
        "Food Name": food_item.get("food_name"),
        "Serving Size": f"{food_item.get('serving_qty')} {food_item.get('serving_unit')}",
        "Calories": food_item.get("nf_calories"),
        "Total Fat": food_item.get("nf_total_fat"),
        "Saturated Fat": food_item.get("nf_saturated_fat"),
        "Cholesterol": food_item.get("nf_cholesterol"),
        "Sodium": food_item.get("nf_sodium"),
        "Total Carbohydrates": food_item.get("nf_total_carbohydrate"),
        "Dietary Fiber": food_item.get("nf_dietary_fiber"),
        "Sugars": food_item.get("nf_sugars"),
        "Protein": food_item.get("nf_protein"),
    }

    return key_nutrients

# print(get_essential_nutrients('hamburger'))