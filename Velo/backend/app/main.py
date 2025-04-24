"""
Main application module for the Velo backend API.
This module initializes the FastAPI application and sets up the API routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import llm

app = FastAPI(
    title="Velo API",
    description="Backend API for Velo",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(llm.router, prefix="/api/llm", tags=["llm"])

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns:
        dict: Status message indicating API health
    """
    return {"status": "healthy"} 