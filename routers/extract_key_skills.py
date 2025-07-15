from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database_layer.database import get_db
from database_layer import models
from services.key_skills_extractor import extract_key_skills
import json
import logging

router = APIRouter()

@router.post("/extract-key-skills")
def extract_key_skills_endpoint(db: Session = Depends(get_db)):
    try:
        all_data = db.query(models.ExtractedData).all()

        for ed in all_data:
            if ed.key_skills:
                continue

            print(f"Calling LLM for: {ed.skills}")
            ks = extract_key_skills(ed.skills)
            print(f"Raw response: {ks}")
            print(f"Extracted skills: {ks}")
            ed.key_skills = json.dumps(ks)

            db.add(ed)
            print(f"Saving to DB: {ed.key_skills} (type: {type(ed.key_skills)})")
        db.commit()
        return {"status": "Key skills extraction completed.", "key_skills" : ed.key_skills}

    except Exception as e:
        logging.exception("Key skill extraction failed.")
        raise HTTPException(status_code=500, detail=str(e))
