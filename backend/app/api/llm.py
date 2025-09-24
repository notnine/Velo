"""
LLM Integration Module for Velo Task Management

This module provides the core LLM (Language Learning Model) integration for Velo's task management system.
It handles natural language processing of user inputs to understand task-related requests and generate
appropriate actions.

Key Features:
- Single /chat endpoint for all LLM interactions
- Structured response format for consistent task handling
- Context-aware task suggestions
- OpenAI GPT integration for natural language understanding
- Rate limiting and token tracking

Example Usage:
    POST /chat
    {
        "message": "Schedule a meeting with Okuda tomorrow at 2pm",
        "context": {
            "current_tasks": [...],
            "calendar_events": [...]
        }
    }

    Response:
    {
        "response": "I'll help you schedule that meeting...",
        "suggested_actions": [{
            "action": "create_task",
            "parameters": {
                "title": "Meeting with Okuda",
                "due_date": "2024-03-20T14:00:00"
            }
        }]
    }

Dependencies:
    - OpenAI API key must be set in environment variables
    - FastAPI for API routing
    - Pydantic for request/response validation
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional, List, Dict
from openai import OpenAI, OpenAIError, AuthenticationError, RateLimitError
import os
from functools import lru_cache
import json
from dotenv import load_dotenv
import pathlib

# Import usage tracking functionality
from .usage_tracking import check_rate_limit, update_usage

# Load environment variables from .env file in root directory
root_dir = pathlib.Path(__file__).parents[3]  # Go up 3 levels: api -> app -> backend -> root
env_path = root_dir / '.env'
load_dotenv(dotenv_path=env_path)

router = APIRouter()

# OpenAI Configuration
class OpenAIConfig:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(f"OPENAI_API_KEY not found in environment variables. Please check your .env file at {env_path}")
        self.client = OpenAI(api_key=self.api_key)
        self.model = "gpt-3.5-turbo"
        self.max_tokens = 500
        self.temperature = 0.7

@lru_cache()
def get_openai_config() -> OpenAIConfig:
    return OpenAIConfig()

class TaskSuggestion(BaseModel):
    """Model for structured task suggestions from LLM."""
    action: str  # create_task, update_task, delete_task, etc.
    parameters: Dict  # Task parameters like title, description, due_date

class LLMRequest(BaseModel):
    """Request model for LLM interactions."""
    message: str
    context: Optional[dict] = None

class LLMResponse(BaseModel):
    """Response model for LLM interactions."""
    response: str
    suggested_actions: Optional[List[TaskSuggestion]] = None
    error: Optional[str] = None

def create_chat_prompt(message: str, context: Optional[dict] = None) -> List[Dict]:
    """Create a structured prompt for the LLM."""
    # Get current date and time dynamically for each request
    # Use UTC to avoid timezone issues
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")
    tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")
    
    # Debug: Print the current date context
    print(f"[LLM] Current date context - Today: {today}, Tomorrow: {tomorrow}, Now: {now} (UTC)")
    
    # Build enhanced context with calendar data
    enhanced_context = {
        "current_date": today,
        "current_time": now.strftime("%H:%M"),
        "tomorrow_date": tomorrow,
        "user_calendar": context.get("calendarEvents", []) if context else [],
        "user_tasks": context.get("currentTasks", []) if context else [],
        "chat_history": context.get("chatHistory", []) if context else []
    }
    
    system_prompt = f"""You are Velo's AI assistant, helping users manage their tasks and schedule.
Your role is to understand task-related requests and provide clear, actionable responses.

CURRENT DATE CONTEXT:
- Today is {today} (YYYY-MM-DD format)
- Tomorrow is {tomorrow} (YYYY-MM-DD format)
- Current time is {now.strftime("%H:%M")}

IMPORTANT: When the user says "today", ALWAYS use {today} as the date.
When the user says "tomorrow", ALWAYS use {tomorrow} as the date.

Execute actions immediately when the user makes a request. Do not ask for confirmation.

TASK TYPES:
There are two types of tasks in Velo:

1. TIMELESS TASKS (Home Page):
   - No scheduled time or date
   - Use voice commands like: "add", "create", "remember to" + task name
   - Examples: "add buy groceries", "create workout routine", "remember to call mom"
   - These go to the home page todo list

2. SCHEDULED TASKS (Calendar):
   - Have specific times and dates
   - Use voice commands like: "schedule", "book", "plan" + task + time keywords
   - Examples: "schedule dinner at 7 PM", "book meeting tomorrow at 2", "plan workout on Monday at 6 AM"
   - These go to the calendar view

When suggesting actions, use the following format:

For TIMELESS TASKS:
SUGGESTION: [
    {{
        "action": "create_task",
        "parameters": {{
            "title": "Task title",
            "description": "Task description"
        }}
    }}
]

For SCHEDULED TASKS:
SUGGESTION: [
    {{
        "action": "create_task",
        "parameters": {{
            "title": "Task title",
            "description": "Task description",
            "start_date": "{today}T14:00:00",
            "end_date": "{today}T15:00:00"
        }}
    }}
]

Guidelines:
- Determine if the task is timeless or scheduled based on the voice command pattern
- For timeless tasks: NO start_date or end_date fields
- For scheduled tasks: ALWAYS provide both start_date and end_date in ISO 8601 format
- Use today's date when the user doesn't specify a date for scheduled tasks
- For "tonight" or "this evening", use today's date with evening hours (18:00-22:00)
- For "tomorrow", use tomorrow's date
- Execute actions immediately without asking for confirmation
- Provide a brief description of what you're doing (e.g., "Adding buy groceries to your todo list" or "Scheduling dinner at 7 PM")
- If the user provides a correction, update the action and execute immediately
- Do not use or mention 'due_date'
- Only include fields that are relevant for the user's request
- Always include title and description if possible

Available actions:
- create_task: Create a new task (timeless or scheduled)
- update_task: Update an existing task
- delete_task: Delete a task
- reschedule_task: Reschedule an existing task
"""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message}
    ]
    
    # Add enhanced context to the user message
    context_str = f"\n\nUSER CONTEXT:\n{json.dumps(enhanced_context, indent=2)}"
    messages[1]["content"] += context_str
    
    return messages

@router.get("/test")
async def test_openai_connection(config: OpenAIConfig = Depends(get_openai_config)) -> dict:
    """Test endpoint to verify OpenAI API key and connection."""
    try:
        response = config.client.chat.completions.create(
            model=config.model,
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        return {
            "status": "success",
            "message": "OpenAI API connection successful",
            "model": config.model
        }
    except AuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="OpenAI API key is invalid"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error testing OpenAI connection: {str(e)}"
        )

@router.post("/chat", response_model=LLMResponse)
async def chat_with_llm(
    request: LLMRequest,
    request_obj: Request,
    config: OpenAIConfig = Depends(get_openai_config)
) -> LLMResponse:
    """Process a chat message and return the LLM's response."""
    client_id = request_obj.client.host
    
    # Check rate limits using the usage_tracking module
    if not check_rate_limit(client_id, estimated_tokens=len(request.message.split()) * 2):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later."
        )
    
    try:
        messages = create_chat_prompt(request.message, request.context)
        
        response = config.client.chat.completions.create(
            model=config.model,
            messages=messages,
            max_tokens=config.max_tokens,
            temperature=config.temperature
        )
        
        # Extract the assistant's message
        assistant_message = response.choices[0].message.content
        
        # Update usage statistics with actual token usage using the usage_tracking module
        tokens_used = response.usage.total_tokens
        update_usage(client_id, tokens_used)
        
        # Parse suggestions from the response
        suggested_actions = []
        if "SUGGESTION:" in assistant_message:
            try:
                suggestion_part = assistant_message.split("SUGGESTION:")[1].strip()
                # Find the end of the JSON array by looking for the closing bracket
                bracket_count = 0
                json_end = 0
                for i, char in enumerate(suggestion_part):
                    if char == '[':
                        bracket_count += 1
                    elif char == ']':
                        bracket_count -= 1
                        if bracket_count == 0:
                            json_end = i + 1
                            break
                
                if json_end > 0:
                    json_str = suggestion_part[:json_end]
                    action_data = json.loads(json_str)
                    if isinstance(action_data, list):
                        suggested_actions = [TaskSuggestion(**action) for action in action_data]
                    else:
                        suggested_actions = [TaskSuggestion(**action_data)]
                    print(f"Successfully parsed {len(suggested_actions)} suggested actions")
                else:
                    print("Could not find complete JSON array in suggestion")
            except (json.JSONDecodeError, ValueError) as e:
                print(f"Failed to parse suggestions: {e}")
                print(f"Raw suggestion part: {suggestion_part}")
        
        return LLMResponse(
            response=assistant_message,
            suggested_actions=suggested_actions
        )
        
    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later."
        )
    except AuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="OpenAI API authentication failed"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing LLM request: {str(e)}"
        ) 