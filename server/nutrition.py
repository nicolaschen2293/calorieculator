import requests
import base64

# Your FatSecret API credentials
CLIENT_ID = "a7d7926381a44442b4f3b7297de6aad1"
CLIENT_SECRET = "669bf4a999704840a87856f34842a851"

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
    global token
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
    print('food id response received', response)
    
    if response.status_code == 200:
        print('here')
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

# Example: Get nutrition for "Pizza"
nutrition_data = get_food_nutrition("Fried rice")
print('Nutritions: ')
print(nutrition_data)