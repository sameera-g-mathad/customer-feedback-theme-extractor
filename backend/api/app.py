from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".pdf", ".docx", ".txt", ".json"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],  # POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Multiple files uploaded from the frontend is handled
    in this method.
    :param files: Multipart formdata.
    :type files: List[UploadFile]
    """
    result = []

    for file in files:
        if file.filename is None:
            raise HTTPException(
                status_code=400,
                detail="One of the uploaded files has no filename",
            )
        ext = Path(file.filename).suffix.lower()

        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, detail=f"Unsupported file type: {file.filename}"
            )

        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as f:
            f.write(await file.read())

        result.append({"filename": file.filename, "status": "uploaded"})

    return result
