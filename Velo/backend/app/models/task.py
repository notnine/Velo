# NOT IN USE - This file is preserved for reference but is not actively used in the MVP
# Task models are handled directly in the frontend using TypeScript interfaces

"""
Task model module.
Defines the SQLAlchemy model for tasks in the database.
"""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base

class Task(Base):
    """
    Task database model.
    
    Attributes:
        id (UUID): Unique identifier for the task
        user_id (UUID): ID of the user who owns the task
        title (str): Task title
        description (str, optional): Detailed description of the task
        is_completed (bool): Whether the task is completed
        scheduled_time (datetime, optional): When the task is scheduled for
        created_at (datetime): When the task was created
        duration (int): Duration of the task in minutes
        updated_at (datetime): When the task was last updated
    """
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    scheduled_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    duration = Column(Integer, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="tasks") 