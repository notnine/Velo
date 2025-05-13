"""
Usage tracking module for OpenAI API calls.
Implements in-memory tracking for rate limiting and token usage.
"""
from datetime import datetime, timedelta
from typing import Dict, Any
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()

# Rate limiting configuration
RATE_LIMIT_WINDOW = 3600  # 1 hour in seconds
MAX_REQUESTS_PER_HOUR = 100
MAX_TOKENS_PER_HOUR = 100000

# In-memory storage
request_counts: Dict[str, int] = {}
token_usage: Dict[str, int] = {}
last_reset: Dict[str, datetime] = {}

def check_and_reset_counters(client_id: str) -> bool:
    """
    Check if rate limit window has passed and reset counters if needed.
    Returns True if counters were reset.
    """
    now = datetime.now()
    if client_id not in last_reset:
        last_reset[client_id] = now
        request_counts[client_id] = 0
        token_usage[client_id] = 0
        return True
        
    if now - last_reset[client_id] > timedelta(seconds=RATE_LIMIT_WINDOW):
        request_counts[client_id] = 0
        token_usage[client_id] = 0
        last_reset[client_id] = now
        return True
    return False

@router.get("/usage")
async def get_usage_stats(request: Request) -> Dict[str, Any]:
    """Get current usage statistics for a client."""
    client_id = request.client.host
    check_and_reset_counters(client_id)
    
    if client_id not in request_counts:
        return {
            "request_count": 0,
            "token_usage": 0,
            "last_reset": datetime.now()
        }
    
    return {
        "request_count": request_counts[client_id],
        "token_usage": token_usage[client_id],
        "last_reset": last_reset[client_id]
    }

def update_usage(client_id: str, tokens_used: int):
    """Update usage statistics for a client."""
    if client_id not in request_counts:
        request_counts[client_id] = 0
        token_usage[client_id] = 0
        last_reset[client_id] = datetime.now()
    
    request_counts[client_id] += 1
    token_usage[client_id] += tokens_used

def check_rate_limit(client_id: str, estimated_tokens: int = 0) -> bool:
    """Check if a client has exceeded their rate limits."""
    check_and_reset_counters(client_id)
    
    if request_counts.get(client_id, 0) >= MAX_REQUESTS_PER_HOUR:
        return False
    
    if token_usage.get(client_id, 0) + estimated_tokens >= MAX_TOKENS_PER_HOUR:
        return False
    
    return True 