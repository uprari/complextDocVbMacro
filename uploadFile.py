from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import json
import os
from pathlib import Path
from typing import Dict, List
import shutil

app = FastAPI()

# Define paths
DOCS_FOLDER = Path("common")
JSON_FILE = Path("data.json")

# Ensure the common folder exists
DOCS_FOLDER.mkdir(exist_ok=True)

@app.post("/upload")
async def upload_document(
    name: str = Form(...),
    description: str = Form(...),
    version: str = Form(...),
    file: UploadFile = File(...),
    metaInfo: str = Form(...)  # Receive as string, parse to dict
):
    try:
        # Parse metaInfo from string to dict
        meta_info = json.loads(metaInfo)
        
        # Save the uploaded file
        file_path = DOCS_FOLDER / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Prepare new data object
        new_data = {
            "name": name,
            "description": description,
            "version": version,
            "file_path": str(file_path),
            "metaInfo": meta_info
        }
        
        # Read existing JSON data or initialize empty list
        existing_data = []
        if JSON_FILE.exists():
            with JSON_FILE.open("r") as f:
                existing_data = json.load(f)
        
        # Append new data
        existing_data.append(new_data)
        
        # Write back to JSON file
        with JSON_FILE.open("w") as f:
            json.dump(existing_data, f, indent=2)
        
        return JSONResponse(
            status_code=200,
            content={"message": "Data saved successfully"}
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error: {str(e)}"}
        )
