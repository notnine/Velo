"""
Database configuration module.
Provides Supabase client configuration and connection management.
"""

import os
from functools import lru_cache
from typing import Optional
from supabase import create_client, Client

class DatabaseError(Exception):
    """Custom exception for database-related errors."""
    pass

class DatabaseConnectionManager:
    """Manages database connections and configuration."""
    
    _instance: Optional[Client] = None
    
    @staticmethod
    def validate_credentials(url: str, key: str) -> None:
        """
        Validate Supabase credentials.
        
        Args:
            url: Supabase project URL
            key: Supabase API key
            
        Raises:
            DatabaseError: If credentials are invalid
        """
        if not url or not key:
            raise DatabaseError("Missing required credentials")
            
        if not url.startswith('https://'):
            raise DatabaseError("Invalid URL format. Must start with 'https://'")
            
        if not key.startswith('eyJ'):
            raise DatabaseError("Invalid API key format")

    @classmethod
    def get_credentials_from_env(cls) -> tuple[str, str]:
        """
        Get Supabase credentials from environment variables.
        
        Returns:
            tuple: (url, key)
            
        Raises:
            DatabaseError: If environment variables are missing
        """
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        
        if not url or not key:
            raise DatabaseError(
                "Missing required environment variables: SUPABASE_URL and/or SUPABASE_KEY"
            )
            
        cls.validate_credentials(url, key)
        return url, key

    @classmethod
    def verify_connection(cls, client: Client) -> bool:
        """
        Verify database connection is working.
        
        Args:
            client: Supabase client instance
            
        Returns:
            bool: True if connection is successful
            
        Raises:
            DatabaseError: If connection test fails
        """
        try:
            # Test connection with a simple query
            client.table('tasks').select('count', count='exact').execute()
            return True
        except Exception as e:
            raise DatabaseError(f"Failed to verify database connection: {str(e)}")

@lru_cache()
def get_supabase_client() -> Client:
    """
    Get or create a cached Supabase client instance.
    
    Returns:
        Client: Configured Supabase client instance
        
    Raises:
        DatabaseError: If client creation fails
    """
    try:
        url, key = DatabaseConnectionManager.get_credentials_from_env()
        client = create_client(url, key)
        DatabaseConnectionManager.verify_connection(client)
        return client
    except DatabaseError as e:
        raise e
    except Exception as e:
        raise DatabaseError(f"Failed to create Supabase client: {str(e)}") 