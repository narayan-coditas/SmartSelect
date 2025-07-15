import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from database_layer.database import SessionLocal
from database_layer.models import ExtractedData
from sklearn.metrics.pairwise import cosine_similarity
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

index = None
id_map = []

def build_index():
    global index, id_map
    db: Session = SessionLocal()
    records = db.query(ExtractedData).filter(ExtractedData.key_skills != None).all()
    db.close()

    id_map.clear()
    embeddings = []

    for record in records:
        emb = model.encode(record.key_skills, normalize_embeddings=True)
        embeddings.append(emb)
        id_map.append(record.id)

    if embeddings:
        embeddings_np = np.array(embeddings).astype("float32")
        index = faiss.IndexFlatIP(embeddings_np.shape[1])
        index.add(embeddings_np)

def query_index(query: str, top_k: int = 10):
    if index is None:
        raise ValueError("FAISS index is not built yet.")

    query_embedding = model.encode(query, normalize_embeddings=True).astype("float32")
    D, I = index.search(np.array([query_embedding]), top_k)

    results = []
    db: Session = SessionLocal()

    for idx in I[0]:
        if idx < len(id_map):
            record = db.query(ExtractedData).filter(ExtractedData.id == id_map[idx]).first()
            if not record or not record.key_skills:
                continue

            try:
                key_skills = json.loads(record.key_skills)
            except:
                key_skills = []

            if not key_skills:
                continue

            skill_embeddings = model.encode(key_skills)
            sim_scores = cosine_similarity([query_embedding], skill_embeddings)[0]
            top_idx = int(np.argmax(sim_scores))
            similarity_percent = sim_scores[top_idx]

            if similarity_percent > 0.5:
                results.append({
                    "id": record.id,
                    "name": record.name,
                    "email": record.email,
                    "matched_skill": key_skills[top_idx],
                    "score": float(round(similarity_percent, 3)*100)
                })

    db.close()
    return results
