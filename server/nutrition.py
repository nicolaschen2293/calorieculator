import requests
import base64
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Your FatSecret API credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# Step 1: Get OAuth Access Token
def get_access_token():
    url = "https://oauth.fatsecret.com/connect/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    }
    data = {"grant_type": "client_credentials", "scope": "basic"}

    response = requests.post(url, headers=headers, data=data)
    
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

# Step 2: Search for Food Name and Get food_id
def get_food_id(food_name):
    token = get_access_token()
    if not token:
        return {"error": "Failed to get access token"}

    url = "https://platform.fatsecret.com/rest/server.api"
    params = {
        "method": "foods.search",
        "search_expression": food_name,
        "format": "json"
    }
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        try:
            # Get the first food item and extract food_id
            food_list = response.json()["foods"]["food"]
            if isinstance(food_list, list):
                return food_list[0]["food_id"]
            else:
                return food_list["food_id"]
        except KeyError:
            return {"error": "No food found"}
    return {"error": "Failed to fetch food data"}

# Step 3: Fetch Nutritional Details Using food_id
def get_food_nutrition(food_name):
    token = get_access_token()
    if not token:
        return {"error": "Failed to get access token"}

    # Get the food_id first
    food_id = get_food_id(food_name)
    if isinstance(food_id, dict) and "error" in food_id:
        return food_id  # Return error if food_id not found

    url = "https://platform.fatsecret.com/rest/server.api"
    params = {
        "method": "food.get",
        "food_id": food_id,
        "format": "json"
    }
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()["food"]
    return {"error": "Failed to fetch food details"}

def extract_nutrition(data):
    important_nutrients = [
        "calories", "carbohydrate", "protein", "fat", 
        "fiber", "sugar", "sodium", "cholesterol", "saturated_fat"
    ]

    # Get the first serving option (e.g., "1 cup")
    servings = data.get("servings", {}).get("serving", [])

    if isinstance(servings, list):
        serving = servings[0]  # Select the first serving
    else:
        serving = servings  # If it's already a single dict

    # Extract only the relevant nutritional values
    extracted_data = {
        "food_name": data.get("food_name"),
        "serving_size": serving.get("serving_description"),
        "nutrition": {key: serving.get(key) for key in important_nutrients}
    }
    
    return extracted_data

def get_essential_nutrition(food_name):

    nutrition_data = get_food_nutrition(food_name)
    extracted_data = extract_nutrition(nutrition_data)

    return extracted_data