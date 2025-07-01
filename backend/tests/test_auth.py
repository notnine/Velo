"""
Tests for authentication endpoints and functionality.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from tests.conftest import TEST_USER
from app.models.auth import UserCreate, TokenData
from app.api.v1.endpoints.auth import router, get_supabase_client
from fastapi import HTTPException

client = TestClient(app)

# Test data
TEST_USER_RESPONSE = {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "test@example.com",
    "full_name": "Test User"
}

def test_signup_endpoint_success(client, mock_supabase):
    """Test successful user signup."""
    response = client.post("/api/v1/auth/signup", json={
        "email": TEST_USER["email"],
        "password": "testpass123",  # Valid password
        "full_name": TEST_USER["full_name"]
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == TEST_USER["email"]
    assert data["user"]["full_name"] == TEST_USER["full_name"]

def test_signup_weak_password(client):
    """Test signup with weak password."""
    # Test too short
    response = client.post("/api/v1/auth/signup", json={
        "email": TEST_USER["email"],
        "password": "short",
        "full_name": TEST_USER["full_name"]
    })
    assert response.status_code == 422
    
    # Test no numbers
    response = client.post("/api/v1/auth/signup", json={
        "email": TEST_USER["email"],
        "password": "noNumbersHere",
        "full_name": TEST_USER["full_name"]
    })
    assert response.status_code == 422
    
    # Test no letters
    response = client.post("/api/v1/auth/signup", json={
        "email": TEST_USER["email"],
        "password": "12345678",
        "full_name": TEST_USER["full_name"]
    })
    assert response.status_code == 422

def test_signup_endpoint_existing_user(client, mock_supabase):
    """Test signup with existing email."""
    # Configure mock to raise exception
    mock_supabase.auth.sign_up.side_effect = Exception("User already registered")
    
    response = client.post("/api/v1/auth/signup", json={
        "email": TEST_USER["email"],
        "password": "testpass123",
        "full_name": TEST_USER["full_name"]
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()

def test_signup_endpoint_invalid_data(client):
    """Test signup with invalid data."""
    invalid_user = {
        "email": "invalid-email",
        "password": "short",
        "full_name": ""
    }
    
    response = client.post("/api/v1/auth/signup", json=invalid_user)
    assert response.status_code == 422

def test_signin_endpoint_success(client, mock_supabase):
    """Test successful signin."""
    response = client.post("/api/v1/auth/signin", json={
        "email": TEST_USER["email"],
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == TEST_USER["email"]

def test_signin_endpoint_invalid_credentials(client, mock_supabase):
    """Test signin with invalid credentials."""
    mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid credentials")
    
    response = client.post("/api/v1/auth/signin", json={
        "email": TEST_USER["email"],
        "password": "wrong_password"
    })
    assert response.status_code == 401
    assert "invalid credentials" in response.json()["detail"].lower()

def test_get_current_user_success(client, mock_supabase):
    """Test getting current user with valid token."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer test_token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == TEST_USER["email"]
    assert data["full_name"] == TEST_USER["full_name"]

def test_get_current_user_invalid_token(client, mock_supabase):
    """Test getting current user with invalid token."""
    # Configure mock to raise exception
    mock_supabase.auth.get_user.side_effect = Exception("Invalid token")
    
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
    assert "invalid token" in response.json()["detail"].lower()

def test_get_current_user_missing_token(client):
    """Test getting current user without token."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "not authenticated" in response.json()["detail"].lower()

def test_signup_invalid_email(client):
    """Test signup with invalid email format."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "invalid-email",
            "password": "testpass123",
            "full_name": TEST_USER["full_name"]
        }
    )
    assert response.status_code == 422  # Validation error

def test_signup_missing_password(client):
    """Test signup with missing password."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
            "full_name": TEST_USER["full_name"]
        }
    )
    assert response.status_code == 422

def test_protected_route_with_token(authenticated_client):
    """Test accessing a protected route with valid token."""
    response = authenticated_client.get("/api/v1/tasks")
    assert response.status_code == 200

def test_protected_route_without_token(client):
    """Test accessing a protected route without token."""
    response = client.get("/api/v1/tasks")
    assert response.status_code == 401
    assert "not authenticated" in response.json()["detail"].lower()

def test_protected_route_invalid_token(client, mock_supabase):
    """Test accessing a protected route with invalid token."""
    # Configure mock to raise exception for invalid token
    mock_supabase.auth.get_user.side_effect = Exception("Invalid JWT")
    
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/v1/tasks", headers=headers)
    assert response.status_code == 401
    assert "Invalid token" in response.json()["detail"]

def test_get_me(client, mock_supabase):
    """Test retrieving user profile."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer test_token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == TEST_USER["email"]
    assert data["full_name"] == TEST_USER["full_name"]

def test_update_me(client, mock_supabase):
    """Test updating user profile."""
    mock_supabase.auth.update_user.return_value = type('obj', (), {
        'user': type('obj', (), {
            'id': TEST_USER["id"],
            'email': TEST_USER["email"],
            'user_metadata': {'full_name': "Updated Name"}
        })
    })
    
    response = client.patch(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer test_token"},
        json={"full_name": "Updated Name"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"

def test_refresh_token(client, mock_supabase):
    """Test token refresh."""
    mock_supabase.auth.refresh_session.return_value = type('obj', (), {
        'access_token': 'new_test_token'
    })
    
    response = client.post(
        "/api/v1/auth/refresh",
        headers={"Authorization": "Bearer test_token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == "new_test_token"
    assert data["token_type"] == "bearer" 