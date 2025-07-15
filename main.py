import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from database_layer.database import create_tables
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

# Mount the static frontend
frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "dist")
app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))

# API routes
app.include_router(resume_upload.router)
app.include_router(extract_fields.router)
app.include_router(extract_key_skills.router)
app.include_router(similarity_search.router)
