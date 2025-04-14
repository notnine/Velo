"""
Tasks endpoints module.
Handles CRUD operations for tasks with user authentication.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, UUID4
from supabase import Client

from app.api.v1.endpoints.auth import get_current_user
from app.database import get_supabase_client

router = APIRouter()

class TaskCreate(BaseModel):
    """
    Schema for creating a new task.
    """
    title: str
    description: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    duration: int

class TaskResponse(BaseModel):
    """
    Schema for task response.
    """
    id: UUID4
    title: str
    description: Optional[str]
    is_completed: bool
    scheduled_time: Optional[datetime]
    created_at: datetime
    duration: int

    class Config:
        from_attributes = True

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    user = Depends(get_current_user),
    db: Client = Depends(get_supabase_client)
):
    """
    Create a new task for the authenticated user.
    """
    task_data = {
        "user_id": user.id,
        "title": task.title,
        "description": task.description,
        "scheduled_time": task.scheduled_time.isoformat() if task.scheduled_time else None,
        "duration": task.duration,
        "is_completed": False
    }
    
    response = db.table('tasks').insert(task_data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create task")
    return response.data[0]

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    user = Depends(get_current_user),
    db: Client = Depends(get_supabase_client)
):
    """
    Get all tasks for the authenticated user.
    """
    response = db.table('tasks').select("*").eq('user_id', user.id).execute()
    return response.data

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID4,
    task_update: TaskCreate,
    user = Depends(get_current_user),
    db: Client = Depends(get_supabase_client)
):
    """
    Update a task owned by the authenticated user.
    """
    # First check if task exists and belongs to user
    task = db.table('tasks').select("*").eq('id', str(task_id)).eq('user_id', user.id).execute()
    if not task.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = {
        "title": task_update.title,
        "description": task_update.description,
        "scheduled_time": task_update.scheduled_time.isoformat() if task_update.scheduled_time else None,
        "duration": task_update.duration
    }
    
    response = db.table('tasks').update(update_data).eq('id', str(task_id)).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update task")
    return response.data[0]

@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID4,
    user = Depends(get_current_user),
    db: Client = Depends(get_supabase_client)
):
    """
    Delete a task owned by the authenticated user.
    """
    # First check if task exists and belongs to user
    task = db.table('tasks').select("*").eq('id', str(task_id)).eq('user_id', user.id).execute()
    if not task.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.table('tasks').delete().eq('id', str(task_id)).execute()
    return {"message": "Task deleted successfully"} 