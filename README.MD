# FastAPI Resume Parser + Similarity Search

This is a backend system for uploading resumes, extracting structured data using LLMs, identifying key skills, and finding similar profiles using FAISS.

## Features

- Upload PDF resumes
- Extract fields using LLM (Groq)
- Extract key skills separately
- Build FAISS index
- Search profiles by skill match

## Endpoints

- `POST /upload-resume`
- `POST /extract-fields`
- `POST /extract-key-skills`
- `POST /build-index`
- `GET /search?query=...`

## Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
