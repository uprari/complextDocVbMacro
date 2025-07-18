from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path

app = FastAPI()

class DocumentRequest(BaseModel):
    document_name: str
    class_id: str
    type: str

DOCUMENTS_DIR = Path("common")
OUTPUT_DIR = Path("generated")
OUTPUT_DIR.mkdir(exist_ok=True)

@app.post("/process-document/")
async def process_document(request: DocumentRequest):
    file_path = DOCUMENTS_DIR / request.document_name

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        # Read original content
        content = file_path.read_text(encoding="utf-8")

        # Split into pages using form feed
        pages = content.split('\f')

        # Create 2-page result content
        result_page_1 = f"Results Page 1\nClass ID: {request.class_id}\nType: {request.type}"
        result_page_2 = f"Results Page 2\nMore details for Class ID: {request.class_id}"
        result_pages = [result_page_1, result_page_2]

        final_pages = []
        for page in pages:
            if "<results>" in page:
                # Remove placeholder and insert results
                cleaned_page = page.replace("<results>", "")
                final_pages.append(cleaned_page)
                final_pages.extend(result_pages)
            else:
                final_pages.append(page)

        # Reconstruct final content
        final_content = '\f'.join(final_pages)

        # Generate output filename
        base_name = Path(request.document_name).stem
        safe_class_id = request.class_id.replace(" ", "_")
        safe_type = request.type.replace(" ", "_")
        new_filename = f"{base_name}_{safe_class_id}_{safe_type}.txt"
        output_path = OUTPUT_DIR / new_filename

        # Save to disk
        output_path.write_text(final_content, encoding="utf-8")

        return {
            "message": "Document processed and saved successfully.",
            "output_file": str(output_path)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
