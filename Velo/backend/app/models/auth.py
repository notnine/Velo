from pydantic import BaseModel, EmailStr, Field, ConfigDict, validator
from typing import Optional

class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)

class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Password must be at least 8 characters long and contain both letters and numbers"
    )

    @validator("password")
    def validate_password(cls, v: str) -> str:
        """Validate password meets strength requirements."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str

class UserResponse(UserBase):
    """User response model."""
    id: str
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    """Token model."""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Token data model."""
    email: Optional[str] = None

class AuthResponse(BaseModel):
    """Authentication response model."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse 