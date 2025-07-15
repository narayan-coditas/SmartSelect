import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database_layer.database import SessionLocal
from database_layer.models import EmployeeResume
from services import pdf_extraction_service

router = APIRouter()

UPLOAD_DIR = "uploaded_resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")

    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        resume_text = pdf_extraction_service.extract_text_from_pdf(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    db: Session = SessionLocal()
    resume_entry = EmployeeResume(id=file_id, content=resume_text)
    db.add(resume_entry)
    db.commit()
    db.refresh(resume_entry)
    db.close()

    return JSONResponse(content={"message": "Resume uploaded and processed", "id": file_id})
