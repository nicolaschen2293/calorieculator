from fastapi import APIRouter, File, UploadFile
from app.models import process_image
from app.utils import save_image

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    image_path = await save_image(file)
    result = process_image(image_path)
    return {"recognized_food": result}