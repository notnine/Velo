"""
LLM interaction endpoint for Velo's AI features.
This module handles natural language processing of user inputs for task management,
providing a single endpoint that processes text and returns structured responses.

Key features:
- Single /chat endpoint for all LLM interactions
- Structured response format for consistent frontend handling
- Support for context-aware task suggestions
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class LLMRequest(BaseModel):
    """Request model for LLM interactions.
    
    Attributes:
        message: The user's natural language input
        context: Optional dict containing relevant task/schedule context
    """
    message: str
    context: Optional[dict] = None

class LLMResponse(BaseModel):
    """Response model for LLM interactions.
    
    Attributes:
        response: The LLM's natural language response
        suggested_actions: Optional list of actions for the frontend to perform
        error: Optional error message if processing fails
    """
    response: str
    suggested_actions: Optional[list] = None
    error: Optional[str] = None

@router.post("/chat", response_model=LLMResponse)
async def chat_with_llm(request: LLMRequest) -> LLMResponse:
    """Process a chat message and return the LLM's response.
    
    The endpoint handles:
    - Task creation/modification requests
    - Schedule inquiries and updates
    - General task management questions
    
    Args:
        request: The chat request containing the user's message and optional context
        
    Returns:
        LLMResponse containing the AI's response and any suggested actions
        
    Raises:
        HTTPException: If LLM processing fails
    """
    try:
        # TODO: Implement actual LLM integration
        # For now, return a mock response
        return LLMResponse(
            response="This is a placeholder response. LLM integration coming soon!",
            suggested_actions=["create_task", "update_schedule"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing LLM request: {str(e)}"
        ) 