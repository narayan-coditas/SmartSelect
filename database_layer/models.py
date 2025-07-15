from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
import uuid
from sqlalchemy.dialects.sqlite import BLOB
from database_layer.base import Base
from datetime import datetime

class EmployeeResume(Base):
    __tablename__ = "employee_resumes"

    id = Column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class ExtractedData(Base):
    __tablename__ = "extracted_data"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    education = Column(Text)  # should be long enough for stringified lists
    experience = Column(Text)
    skills = Column(Text)
    professional_summary = Column(Text)
    key_skills = Column(Text)

class KeySkill(Base):
    __tablename__ = "key_skills"
    id = Column(Integer, ForeignKey("employee_resumes.id"), primary_key=True)
    key_skills = Column(Text, nullable=True)

