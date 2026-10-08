from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.concurrency import run_in_threadpool
from pathlib import Path
from PIL import Image, UnidentifiedImageError
import torch
import open_clip
import json
import io
import os
import warnings
import asyncio

BASE = Path(__file__).resolve().parent
MAX_UPLOAD = 10 * 1024 * 1024
app = FastAPI(title="HEXSHOES Visual Search", version="1.0.0")
origins = [value.strip() for value in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if value.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST"], allow_headers=["Content-Type"])
app.mount("/catalog", StaticFiles(directory=BASE / "catalog_images"), name="catalog")
print("Loading existing CLIP model...")
model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='openai')
model.eval()
with (BASE / "catalog_embeddings.json").open(encoding="utf-8") as handle:
    catalog = json.load(handle)
with (BASE / "product_mapping.json").open(encoding="utf-8") as handle:
    product_mapping = json.load(handle).get("products", {})
# Empty until verified filename -> canonical Firestore document ID assignments exist.
inference_lock = asyncio.Lock()


def get_embedding_from_bytes(image_bytes):
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            image = Image.open(io.BytesIO(image_bytes))
            if image.format not in ("JPEG", "PNG"):
                raise HTTPException(status_code=415, detail="Only JPEG and PNG images are accepted.")
            image.load()
            image_input = preprocess(image.convert("RGB")).unsqueeze(0)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise HTTPException(status_code=422, detail="The uploaded file is not a valid, safely decodable image.")
    with torch.no_grad():
        embedding = model.encode_image(image_input)
        embedding = embedding / embedding.norm(dim=-1, keepdim=True)
    return embedding.squeeze()


def rank(image_bytes):
    query_embedding = get_embedding_from_bytes(image_bytes)
    results = []
    for item in catalog:
        score = torch.dot(query_embedding, torch.tensor(item["embedding"])).item()
        results.append({"productId": product_mapping.get(item["filename"]), "filename": item["filename"], "score": round(score, 4)})
    results.sort(key=lambda item: item["score"], reverse=True)
    return {"matches": results[:5], "metric": "cosine_similarity"}


@app.get("/health")
def health():
    return {"status": "ready", "model": "ViT-B-32", "catalogSize": len(catalog), "mappedProducts": len(product_mapping)}


@app.post("/search")
async def search(file: UploadFile = File(...)):
    try:
        if file.content_type not in ("image/jpeg", "image/png"):
            raise HTTPException(status_code=415, detail="Only JPEG and PNG images are accepted.")
        image_bytes = await file.read(MAX_UPLOAD + 1)
        if len(image_bytes) > MAX_UPLOAD:
            raise HTTPException(status_code=413, detail="Choose an image smaller than 10 MB.")
        if not image_bytes:
            raise HTTPException(status_code=422, detail="The uploaded image is empty.")
        async with inference_lock:
            return await run_in_threadpool(rank, image_bytes)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail="Visual search is temporarily unavailable.")
    finally:
        await file.close()
