"""
Authentication module for the Velo API.
Handles user registration, login, and token verification using Supabase.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
from app.models.auth import UserCreate, UserLogin, UserResponse, AuthResponse
from app.database import get_supabase_client
from supabase import Client
from typing import Annotated, Dict, Any

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    supabase: Annotated[Client, Depends(get_supabase_client)]
) -> UserResponse:
    """Get current user from token."""
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.user_metadata.get("full_name", "")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user: UserCreate,
    supabase: Annotated[Client, Depends(get_supabase_client)]
) -> AuthResponse:
    """Create a new user."""
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
            
        return AuthResponse(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            user=UserResponse(
                id=auth_response.user.id,
                email=auth_response.user.email,
                full_name=auth_response.user.user_metadata.get("full_name", "")
            )
        )
    except Exception as e:
        if "already registered" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/signin", response_model=AuthResponse)
async def signin(
    user: UserLogin,
    supabase: Annotated[Client, Depends(get_supabase_client)]
) -> AuthResponse:
    """Authenticate a user."""
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        return AuthResponse(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            user=UserResponse(
                id=auth_response.user.id,
                email=auth_response.user.email,
                full_name=auth_response.user.user_metadata.get("full_name", "")
            )
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[UserResponse, Depends(get_current_user)]
) -> UserResponse:
    """Get current user profile."""
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_profile(
    update_data: Dict[str, Any],
    current_user: Annotated[UserResponse, Depends(get_current_user)],
    supabase: Annotated[Client, Depends(get_supabase_client)]
) -> UserResponse:
    """Update user profile."""
    try:
        user_response = supabase.auth.update_user({
            "data": update_data
        })
        return UserResponse(
            id=user_response.user.id,
            email=user_response.user.email,
            full_name=user_response.user.user_metadata.get("full_name", "")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/refresh")
async def refresh_token(
    response: Response,
    supabase: Annotated[Client, Depends(get_supabase_client)]
) -> Dict[str, str]:
    """Refresh access token."""
    try:
        session = supabase.auth.refresh_session()
        return {
            "access_token": session.access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        ) 