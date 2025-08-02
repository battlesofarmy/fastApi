from fastapi import FastAPI, Depends
from pydantic import BaseModel, EmailStr
from typing import List
from sqlalchemy.orm import Session

import models
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware


# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic schema
class TodoCreate(BaseModel):
    email: EmailStr
    data: str

class TodoOut(TodoCreate):
    id: int

    class Config:
        orm_mode = True

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET all todos
@app.get("/todos", response_model=List[TodoOut])
def all_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).all()

# GET a single todo
@app.get("/todos/{id}", response_model=TodoOut)
def single_todo(id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == id).first()
    if todo:
        return todo
    return {"error": "Todo Not Found!"}

# POST a new todo
@app.post("/todos/new", response_model=TodoOut)
def add_todo(new_todo: TodoCreate, db: Session = Depends(get_db)):
    todo = models.Todo(email=new_todo.email, data=new_todo.data)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

# PUT update a todo
@app.put("/todos/update/{id}", response_model=TodoOut)
def update_todo(id: int, updated_todo: TodoCreate, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == id).first()
    if todo:
        todo.email = updated_todo.email
        todo.data = updated_todo.data
        db.commit()
        db.refresh(todo)
        return todo
    return {"error": "Todo Not Found!"}

# DELETE a todo
@app.delete("/todos/{id}")
def delete_one(id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == id).first()
    if todo:
        db.delete(todo)
        db.commit()
        return {"message": "Todo deleted"}
    return {"error": "Todo not found!"}