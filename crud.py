from sqlalchemy.orm import Session
import schemas
from database_layer import models


def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_all_employees(db: Session):
    return db.query(models.Employee).all()

def delete_employee(db: Session, employee_id: int):
    employee = get_employee(db, employee_id)
    if employee:
        db.delete(employee)
        db.commit()
        return True
    return False
