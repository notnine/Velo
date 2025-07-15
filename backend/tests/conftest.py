"""
Test configuration and fixtures.
"""

import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Set test environment variables
os.environ['SUPABASE_URL'] = 'https://test-project.supabase.co'
os.environ['SUPABASE_KEY'] = 'test-key-123'
os.environ['JWT_SECRET'] = 'test-jwt-secret'

import pytest
from fastapi.testclient import TestClient
from app.main import app

# Mock user data for testing
TEST_USER = {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "test@example.com",
    "full_name": "Test User"
}

@pytest.fixture(scope="function")
def mock_supabase():
    """Create a mock Supabase client for testing."""
    mock_client = MagicMock()
    
    # Mock user object
    mock_user = type('obj', (), {
        'id': TEST_USER["id"],
        'email': TEST_USER["email"],
        'user_metadata': {'full_name': TEST_USER["full_name"]}
    })
    
    # Mock session object
    mock_session = type('obj', (), {
        'access_token': 'test-token',
        'refresh_token': 'test-refresh-token'
    })
    
    # Mock auth operations
    mock_client.auth.sign_up.return_value = type('obj', (), {
        'user': mock_user,
        'session': mock_session
    })
    
    mock_client.auth.sign_in_with_password.return_value = type('obj', (), {
        'user': mock_user,
        'session': mock_session
    })
    
    mock_client.auth.get_user.return_value = type('obj', (), {
        'user': mock_user
    })
    
    mock_client.auth.update_user.return_value = type('obj', (), {
        'user': mock_user
    })
    
    mock_client.auth.refresh_session.return_value = type('obj', (), {
        'access_token': 'new-test-token'
    })
    
    # Mock table operations
    mock_table = MagicMock()
    mock_table.select.return_value.execute.return_value = type('obj', (), {'data': []})
    mock_client.table.return_value = mock_table
    
    return mock_client

@pytest.fixture
def client(mock_supabase):
    """Create a test client with mocked Supabase."""
    from app.database import get_supabase_client
    
    def get_test_supabase():
        return mock_supabase
    
    app.dependency_overrides[get_supabase_client] = get_test_supabase
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def auth_header():
    """Create an authentication header for testing."""
    return {"Authorization": "Bearer test_token"}

@pytest.fixture
def authenticated_client(client, auth_header):
    """Create a test client with authentication headers."""
    class AuthenticatedClient:
        def __init__(self, client, headers):
            self.client = client
            self.headers = headers
        
        def get(self, url, **kwargs):
            headers = kwargs.pop('headers', {})
            headers.update(self.headers)
            return self.client.get(url, headers=headers, **kwargs)
        
        def post(self, url, **kwargs):
            headers = kwargs.pop('headers', {})
            headers.update(self.headers)
            return self.client.post(url, headers=headers, **kwargs)
        
        def put(self, url, **kwargs):
            headers = kwargs.pop('headers', {})
            headers.update(self.headers)
            return self.client.put(url, headers=headers, **kwargs)
        
        def patch(self, url, **kwargs):
            headers = kwargs.pop('headers', {})
            headers.update(self.headers)
            return self.client.patch(url, headers=headers, **kwargs)
        
        def delete(self, url, **kwargs):
            headers = kwargs.pop('headers', {})
            headers.update(self.headers)
            return self.client.delete(url, headers=headers, **kwargs)
    
    return AuthenticatedClient(client, auth_header) 