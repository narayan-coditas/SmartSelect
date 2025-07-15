from fastapi import FastAPI
from database_layer.database import create_tables
from fastapi.middleware.cors import CORSMiddleware
from routers import resume_upload, extract_fields, extract_key_skills, similarity_search

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()


app.include_router(resume_upload.router)
app.include_router(extract_fields.router)
app.include_router(extract_key_skills.router)
app.include_router(similarity_search.router)
