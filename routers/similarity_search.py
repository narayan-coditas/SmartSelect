from fastapi import APIRouter, HTTPException
from services.faiss_service import build_index, query_index

router = APIRouter()

@router.post("/build-index")
def build_faiss_index():
    try:
        build_index()
        return {"message": "FAISS index built successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
def search_similar_profiles(query: str):
    try:
        results = query_index(query)
        return {"matches": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
