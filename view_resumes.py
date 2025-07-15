from database_layer.database import SessionLocal, create_tables
from database_layer.models import EmployeeResume

def view_resumes():
    create_tables()

    session = SessionLocal()
    resumes = session.query(EmployeeResume).all()

    print("\n--- All Uploaded Resumes ---")
    for resume in resumes:
        print(f"ID: {resume.id}")
        print(f"Uploaded At: {resume.uploaded_at}")
        print(f"Content: {resume.content[:500]}...\n")
    session.close()

if __name__ == "__main__":
    view_resumes()
