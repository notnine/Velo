"""
Redis Client Configuration

This module provides a Redis client for persistent storage of rate limiting data.
Uses connection pooling for better performance and includes error handling.
"""
from typing import Optional
import redis
from redis.connection import ConnectionPool
from functools import lru_cache
import os
from dotenv import load_dotenv
import pathlib

# Load environment variables
root_dir = pathlib.Path(__file__).parents[3]  # Go up 3 levels: core -> app -> backend -> root
env_path = root_dir / '.env'
load_dotenv(dotenv_path=env_path)

class RedisConfig:
    """Redis configuration with connection pooling."""
    def __init__(self):
        self.host = os.getenv("REDIS_HOST", "localhost")
        self.port = int(os.getenv("REDIS_PORT", "6379"))
        self.db = int(os.getenv("REDIS_DB", "0"))
        self.password = os.getenv("REDIS_PASSWORD")
        
        # Create a connection pool
        self.pool = ConnectionPool(
            host=self.host,
            port=self.port,
            db=self.db,
            password=self.password,
            decode_responses=True,  # Automatically decode responses to strings
            max_connections=10  # Limit maximum connections
        )

@lru_cache()
def get_redis_client() -> redis.Redis:
    """
    Get a Redis client instance with connection pooling.
    Uses LRU cache to maintain a single instance.
    
    Returns:
        redis.Redis: Configured Redis client instance
        
    Raises:
        redis.ConnectionError: If connection to Redis fails
    """
    try:
        config = RedisConfig()
        client = redis.Redis(connection_pool=config.pool)
        # Test the connection
        client.ping()
        return client
    except redis.ConnectionError as e:
        raise redis.ConnectionError(f"Failed to connect to Redis: {str(e)}")
    except Exception as e:
        raise Exception(f"Error initializing Redis client: {str(e)}") 