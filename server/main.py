# from fastapi import FastAPI
# from routes import router

# app = FastAPI()
# app.include_router(router)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
import tensorflow as tf
import numpy as np

app = FastAPI()

# Add Cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from your frontend
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
    print('image preprocessing done.')
    return image

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    print('file received')
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        print('file read')
        
        # Preprocess and classify
        processed_img = preprocess_image(image)
        predictions = model.predict(processed_img)
        print('image predicted')
        decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=3)[0]
        print('predictions decoded: ', decoded_predictions)

        # Return the top-3 predictions
        return JSONResponse(content={"predictions": decoded_predictions[0][1]})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)