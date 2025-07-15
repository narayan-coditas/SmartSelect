# SmartSelect

SmartSelect is an intelligent resume parsing and profile matching system. It allows users to upload resumes (PDF), extracts structured data using an LLM, and performs smart profile matching based on key skills using FAISS and semantic search. It features a full-stack setup using **FastAPI (Backend)** and **React (Frontend via Lovable.dev)**.

---

## 🚀 Features

- Upload and store resumes securely
- Extract structured fields using a Large Language Model
- Identify key skills independently using LLM with a temperature-tuned approach
- Perform semantic similarity matching using FAISS and SentenceTransformers
- Full-stack architecture with RESTful APIs and interactive frontend UI

---

## 🛠️ Technologies Used

### Backend:
- Python 3.10+
- FastAPI
- SQLAlchemy + SQLite
- FAISS
- SentenceTransformers
- Groq API (LLM integration with LLaMA 3)
- Uvicorn

### Frontend:
- React (via [Lovable.dev](https://lovable.dev))
- Vite + JSX
- Deployed as static files served via FastAPI


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/narayan-coditas/SmartSelect
cd smartselect
```
### 2. Python Environment Setup (Backend)
```bash
python -m venv .venv
source .venv/bin/activate   # or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
```
### 3. Environment Variables
Create a .env file in the root with:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=company
GROQ_API_KEY=your_groq_api_key
```
### 4. Frontend Setup
```bash
cd frontend
npm install
npm run build
```

### 4. Run Backend Server (in main directory)
```bash
uvicorn main:app --reload
```

---

## 🔍 Available API Endpoints

| Endpoint               | Method | Description                            |
|------------------------|--------|----------------------------------------|
| `/upload-resume`       | POST   | Upload PDF resume                      |
| `/extract-fields`      | POST   | Extract structured fields using LLM    |
| `/extract-key-skills`  | POST   | Extract key skills from fields         |
| `/build-index`         | POST   | Build FAISS index from skills          |
| `/search?query=...`    | GET    | Search similar profiles by skills      |
 