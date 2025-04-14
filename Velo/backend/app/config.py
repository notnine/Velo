"""
Configuration settings for the Velo API.
Loads environment variables and provides application settings.
"""

from typing import Optional
from datetime import timedelta
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database Configuration
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    
    # API Configuration
    api_env: str = "development"
    port: int = 8000
    host: str = "0.0.0.0"
    api_version: str = "v1"
    api_prefix: str = "/api"
    
    # Security
    jwt_secret: str = "your_jwt_secret_here"  # Override this in production
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    @property
    def access_token_expire_delta(self) -> timedelta:
        """Get the access token expiration time as a timedelta."""
        return timedelta(minutes=self.access_token_expire_minutes)
    
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=False,
        env_prefix=""
    )

# Create a global settings instance
settings = Settings() 