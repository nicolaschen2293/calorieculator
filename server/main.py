# Run 'uvicorn main:app --reload' to start server

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import tensorflow as tf
import numpy as np
# from server.fatsecret import get_essential_nutrition
from nutritionix import get_essential_nutrients
import os
from dotenv import load_dotenv

app = FastAPI()

# Load .env file
load_dotenv()
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN")

# Add Cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load a pre-trained model (for example, MobileNetV2)
model = tf.keras.applications.MobileNetV2(weights="imagenet")

# Function to preprocess the image
def preprocess_image(image):
    image = image.resize((224, 224))  # Resize for model
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    print('processing image from = ', ALLOWED_ORIGIN)
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess and classify
        processed_img = preprocess_image(image)
        predictions = model.predict(processed_img)
        decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=3)[0]

        # Return the top-3 predictions
        nutrition_values = get_essential_nutrients(decoded_predictions[0][1])
        return JSONResponse(content={"result": nutrition_values})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)