from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database_layer.database import get_db
from database_layer.models import EmployeeResume, ExtractedData
from services.field_extractor import extract_fields

router = APIRouter()

def stringify(value):
    if value is None:
        return ""
    if isinstance(value, (list, dict)):
        return ", ".join(map(str, value))
    return str(value)

@router.post("/extract-fields")
def extract_fields_endpoint(db: Session = Depends(get_db)):
    resumes = db.query(EmployeeResume).all()
    if not resumes:
        raise HTTPException(status_code=404, detail="No resumes found")

    for r in resumes:
        if not db.query(ExtractedData).get(r.id):
            try:
                d = extract_fields(r.content)
            except ValueError as e:
                raise HTTPException(status_code=500, detail=str(e))

            if d.get("skills"):
                ed = ExtractedData(
                    id=r.id,
                    name=stringify(d.get("name")),
                    email=stringify(d.get("email")),
                    phone=stringify(d.get("phone")),
                    education=stringify(d.get("education")),
                    experience=stringify(d.get("experience")),
                    skills=stringify(d.get("skills")),
                    professional_summary=stringify(d.get("professionalDetails")),
                )
                print({
                    "id": r.id,
                    "name": stringify(d.get("name")),
                    "email": stringify(d.get("email")),
                    "phone": stringify(d.get("phone")),
                    "education": stringify(d.get("education")),
                    "experience": stringify(d.get("experience")),
                    "skills": stringify(d.get("skills")),
                    "professional_summary": stringify(d.get("professionalDetails")),
                })

                db.merge(ed)
                db.commit()

    return {"status": "done"}
