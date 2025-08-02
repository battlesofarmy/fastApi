from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    data: Mapped[str] = mapped_column(index=True)
    email: Mapped[str] = mapped_column(index=True)