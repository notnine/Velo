"""
Usage Tracking Module

This module handles rate limiting and token usage tracking for the LLM API.
Uses Redis for persistent storage of usage data with the following structure:

Keys:
- {client_id}:requests - Number of requests in current window
- {client_id}:tokens - Total tokens used
- {client_id}:window_start - Start timestamp of current window
"""
from datetime import datetime, timedelta
import json
from typing import Tuple
from ..core.redis_client import get_redis_client

# Rate limiting configuration
RATE_LIMIT_WINDOW = 3600  # 1 hour in seconds
MAX_REQUESTS_PER_WINDOW = 100  # Maximum requests per hour
MAX_TOKENS_PER_WINDOW = 100000  # Maximum tokens per hour

def _get_usage_data(client_id: str) -> Tuple[int, int, float]:
    """
    Get current usage data for a client from Redis.
    
    Args:
        client_id: Unique identifier for the client
        
    Returns:
        Tuple[int, int, float]: (request_count, token_count, window_start)
    """
    redis_client = get_redis_client()
    pipe = redis_client.pipeline()
    
    # Get all relevant keys in a single pipeline
    pipe.get(f"{client_id}:requests")
    pipe.get(f"{client_id}:tokens")
    pipe.get(f"{client_id}:window_start")
    
    results = pipe.execute()
    
    request_count = int(results[0]) if results[0] else 0
    token_count = int(results[1]) if results[1] else 0
    window_start = float(results[2]) if results[2] else datetime.now().timestamp()
    
    return request_count, token_count, window_start

def check_rate_limit(client_id: str, estimated_tokens: int = 0) -> bool:
    """
    Check if the client has exceeded their rate limit.
    
    Args:
        client_id: Unique identifier for the client
        estimated_tokens: Estimated number of tokens for the request
        
    Returns:
        bool: True if within limits, False if exceeded
    """
    redis_client = get_redis_client()
    now = datetime.now().timestamp()
    
    request_count, token_count, window_start = _get_usage_data(client_id)
    
    # Check if we need to reset the window
    if now - window_start > RATE_LIMIT_WINDOW:
        pipe = redis_client.pipeline()
        pipe.set(f"{client_id}:requests", 1)
        pipe.set(f"{client_id}:tokens", estimated_tokens)
        pipe.set(f"{client_id}:window_start", now)
        pipe.execute()
        return True
    
    # Check if adding this request would exceed limits
    if (request_count + 1 > MAX_REQUESTS_PER_WINDOW or 
        token_count + estimated_tokens > MAX_TOKENS_PER_WINDOW):
        return False
    
    # Update counters
    pipe = redis_client.pipeline()
    pipe.incr(f"{client_id}:requests")
    pipe.incrby(f"{client_id}:tokens", estimated_tokens)
    pipe.execute()
    
    return True

def update_usage(client_id: str, tokens_used: int) -> None:
    """
    Update the actual token usage for a request.
    
    Args:
        client_id: Unique identifier for the client
        tokens_used: Actual number of tokens used
    """
    redis_client = get_redis_client()
    
    # Get current token count and update it directly
    # No need to calculate differences since we're setting the absolute value
    redis_client.set(f"{client_id}:tokens", tokens_used)

def get_usage_stats(client_id: str) -> dict:
    """
    Get current usage statistics for a client.
    
    Args:
        client_id: Unique identifier for the client
        
    Returns:
        dict: Usage statistics including requests, tokens, and time remaining
    """
    request_count, token_count, window_start = _get_usage_data(client_id)
    now = datetime.now().timestamp()
    
    time_remaining = max(0, RATE_LIMIT_WINDOW - (now - window_start))
    
    return {
        "requests": {
            "used": request_count,
            "limit": MAX_REQUESTS_PER_WINDOW,
            "remaining": MAX_REQUESTS_PER_WINDOW - request_count
        },
        "tokens": {
            "used": token_count,
            "limit": MAX_TOKENS_PER_WINDOW,
            "remaining": MAX_TOKENS_PER_WINDOW - token_count
        },
        "window": {
            "start": datetime.fromtimestamp(window_start).isoformat(),
            "time_remaining_seconds": time_remaining
        }
    } 