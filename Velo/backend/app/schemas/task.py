from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, conint

class TaskBase(BaseModel):
    """Base schema for task data."""
    title: str = Field(..., min_length=1, max_length=255)
    duration: conint(gt=0) = Field(..., description="Task duration in minutes")
    is_completed: bool = Field(default=False)

class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass

class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    duration: Optional[conint(gt=0)] = Field(None, description="Task duration in minutes")
    is_completed: Optional[bool] = None

class TaskInDB(TaskBase):
    """Schema for task as stored in database."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Task(TaskInDB):
    """Schema for task responses."""
    pass 