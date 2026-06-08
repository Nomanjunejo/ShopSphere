import os
import uuid
from fastapi import UploadFile
from app.core.config import settings

# Designed to be swappable with Cloudinary later
class ImageService:
    def __init__(self, upload_dir: str = None):
        self.upload_dir = upload_dir or settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save(self, file: UploadFile) -> str:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise ValueError("Unsupported image type")
        filename = f"{uuid.uuid4().hex}{ext}"
        path = os.path.join(self.upload_dir, filename)
        content = await file.read()
        with open(path, "wb") as f:
            f.write(content)
        # Return relative URL served via /uploads
        return f"/uploads/{filename}"

image_service = ImageService()
