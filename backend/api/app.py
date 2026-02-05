from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

# pylint: disable=import-error
# Import the processing modules
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from services.file_parser import parse_all_files


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


@app.post("/analyze")
async def analyze_feedback():
    """
    Analyze all uploaded feedback files and extract themes.
    This processes files uploaded via /upload endpoint.
    """
    try:
        # Step 1: Parse all files in upload directory
        feedback_list = parse_all_files(UPLOAD_DIR)

        if not feedback_list:
            raise HTTPException(
                status_code=400, detail="No valid feedback found in uploaded files"
            )

        print(feedback_list)

        return {
            "success": True,
            "total_feedback": len(feedback_list),
            "feedback": feedback_list,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error analyzing feedback: {str(e)}"
        )


@app.get("/status")
async def get_status():
    """
    Check how many files are ready for analysis
    """
    files = list(UPLOAD_DIR.glob("*"))
    valid_files = [
        f.name for f in files if f.is_file() and f.suffix.lower() in ALLOWED_EXTENSIONS
    ]

    return {
        "files_uploaded": len(valid_files),
        "files": valid_files,
        "ready_for_analysis": len(valid_files) > 0,
    }


@app.delete("/clear")
async def clear_uploads():
    """
    Clear all uploaded files
    """
    try:
        for file_path in UPLOAD_DIR.iterdir():
            if file_path.is_file():
                file_path.unlink()

        return {"success": True, "message": "All files cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing files: {str(e)}")
