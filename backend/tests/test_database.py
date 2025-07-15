"""Tests for database configuration and connection management."""

import os
import pytest
from unittest.mock import patch, MagicMock
from postgrest import APIError
from app.database import (
    DatabaseError,
    DatabaseConnectionManager,
    get_supabase_client
)

# Test data
VALID_URL = "https://test.supabase.co"
VALID_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
INVALID_URL = "not-a-url"
INVALID_KEY = "not-a-key"

@pytest.fixture
def mock_env_vars():
    """Fixture to set mock environment variables."""
    with patch.dict(os.environ, {
        'SUPABASE_URL': VALID_URL,
        'SUPABASE_KEY': VALID_KEY
    }):
        yield

@pytest.fixture
def mock_supabase_client():
    """Fixture to create a mock Supabase client."""
    mock_client = MagicMock()
    mock_client.table.return_value.select.return_value.execute.return_value = True
    return mock_client

@pytest.fixture
def mock_table_client():
    """Fixture to provide a mock Supabase client specifically for table tests."""
    mock_client = MagicMock()
    
    # Mock for table existence check
    mock_select_response = MagicMock()
    mock_select_response.data = []
    mock_client.table.return_value.select.return_value.limit.return_value.execute.return_value = mock_select_response
    
    # Mock for table insert
    mock_insert_response = MagicMock()
    mock_insert_response.data = [{
        'id': '123',
        'title': 'Test Task',
        'is_completed': False,
        'created_at': '2024-03-20T00:00:00'
    }]
    mock_client.table.return_value.insert.return_value.execute.return_value = mock_insert_response
    
    # Mock for table delete
    mock_client.table.return_value.delete.return_value.eq.return_value.execute.return_value = MagicMock()
    
    return mock_client

class TestDatabaseConnectionManager:
    """Test cases for DatabaseConnectionManager class."""
    
    def test_validate_credentials_success(self):
        """Test successful credential validation."""
        DatabaseConnectionManager.validate_credentials(VALID_URL, VALID_KEY)
        
    def test_validate_credentials_missing(self):
        """Test validation with missing credentials."""
        with pytest.raises(DatabaseError, match="Missing required credentials"):
            DatabaseConnectionManager.validate_credentials("", VALID_KEY)
            
        with pytest.raises(DatabaseError, match="Missing required credentials"):
            DatabaseConnectionManager.validate_credentials(VALID_URL, "")
            
    def test_validate_credentials_invalid_format(self):
        """Test validation with invalid credential format."""
        with pytest.raises(DatabaseError, match="Invalid URL format"):
            DatabaseConnectionManager.validate_credentials(INVALID_URL, VALID_KEY)
            
        with pytest.raises(DatabaseError, match="Invalid API key format"):
            DatabaseConnectionManager.validate_credentials(VALID_URL, INVALID_KEY)
            
    def test_get_credentials_from_env_success(self, mock_env_vars):
        """Test successful retrieval of credentials from environment."""
        url, key = DatabaseConnectionManager.get_credentials_from_env()
        assert url == VALID_URL
        assert key == VALID_KEY
        
    def test_get_credentials_from_env_missing(self):
        """Test retrieval with missing environment variables."""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(DatabaseError, match="Missing required environment variables"):
                DatabaseConnectionManager.get_credentials_from_env()
                
    def test_verify_connection_success(self, mock_supabase_client):
        """Test successful connection verification."""
        result = DatabaseConnectionManager.verify_connection(mock_supabase_client)
        assert result is True
        
    def test_verify_connection_failure(self, mock_supabase_client):
        """Test failed connection verification."""
        mock_supabase_client.table.return_value.select.return_value.execute.side_effect = Exception("Connection failed")
        with pytest.raises(DatabaseError, match="Failed to verify database connection"):
            DatabaseConnectionManager.verify_connection(mock_supabase_client)

class TestSupabaseClient:
    """Test cases for Supabase client creation."""
    
    @patch('app.database.create_client')
    def test_get_supabase_client_success(self, mock_create_client, mock_env_vars, mock_supabase_client):
        """Test successful client creation and caching."""
        mock_create_client.return_value = mock_supabase_client
        get_supabase_client.cache_clear()  # Clear cache before test
        
        # First call should create new client
        client1 = get_supabase_client()
        assert client1 == mock_supabase_client
        
        # Second call should return cached client
        client2 = get_supabase_client()
        assert client2 == client1
        mock_create_client.assert_called_once()
        
    @patch('app.database.create_client')
    def test_get_supabase_client_creation_failure(self, mock_create_client, mock_env_vars):
        """Test client creation failure."""
        mock_create_client.side_effect = Exception("Failed to create client")
        get_supabase_client.cache_clear()  # Clear cache before test
        
        with pytest.raises(DatabaseError, match="Failed to create Supabase client"):
            get_supabase_client()

class TestTableOperations:
    """Test cases for table operations."""
    
    def test_tasks_table_exists(self, mock_table_client):
        """Test that the tasks table exists in Supabase."""
        response = mock_table_client.table('tasks').select("*").limit(1).execute()
        assert isinstance(response.data, list)

    def test_tasks_table_schema(self, mock_table_client):
        """Test that the tasks table has the expected schema."""
        test_task = {
            "title": "Test Task",
            "is_completed": False
        }
        
        try:
            response = mock_table_client.table('tasks').insert(test_task).execute()
            inserted_task = response.data[0]
            
            assert "id" in inserted_task
            assert "title" in inserted_task
            assert "is_completed" in inserted_task
            assert "created_at" in inserted_task
            
            # Verify cleanup call works
            mock_table_client.table('tasks').delete().eq('id', inserted_task['id']).execute()
            
        except APIError as e:
            pytest.fail(f"Failed to test tasks table schema: {str(e)}")

@pytest.mark.usefixtures("mock_env_vars")
def test_supabase_environment_variables():
    """Test that required environment variables are set."""
    assert 'SUPABASE_URL' in os.environ
    assert 'SUPABASE_KEY' in os.environ
    assert os.environ['SUPABASE_URL'].startswith('https://')
    assert len(os.environ['SUPABASE_KEY']) > 0

def test_get_supabase_client_missing_env():
    """Test client creation fails with missing environment variables."""
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(DatabaseError, match="Missing required environment variables"):
            get_supabase_client.cache_clear()
            get_supabase_client()

def test_get_supabase_client_invalid_url():
    """Test client creation fails with invalid URL format."""
    with patch.dict(os.environ, {
        'SUPABASE_URL': 'invalid-url',
        'SUPABASE_KEY': VALID_KEY
    }):
        with pytest.raises(DatabaseError, match="Invalid URL format"):
            get_supabase_client.cache_clear()
            get_supabase_client() 