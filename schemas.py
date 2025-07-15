from pydantic import BaseModel

class EmployeeCreate(BaseModel):
    name: str
    email: str
    job_title: str

class EmployeeOut(EmployeeCreate):
    id: int

    class Config:
        orm_mode = True
