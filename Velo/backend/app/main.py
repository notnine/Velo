"""
Main application module for the Velo backend API.
This module initializes the FastAPI application and sets up the API routes.
"""

from fastapi import FastAPI
from app.api.v1.endpoints import auth, tasks

app = FastAPI(
    title="Velo API",
    description="Backend API for Velo task management mobile application",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns:
        dict: Status message indicating API health
    """
    return {"status": "healthy"} 