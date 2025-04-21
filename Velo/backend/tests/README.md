# Velo Backend Tests

## Overview
This directory contains tests for the Velo backend API. We use pytest for testing and implement mocking to isolate our tests from external dependencies.

## Test Structure
```
tests/
├── conftest.py          # Shared test fixtures and configuration
├── test_auth.py         # Authentication endpoint tests
├── test_database.py     # Database connection tests
├── test_models.py       # Database model tests
└── README.md           # This documentation
```

## Test Setup

### Fixtures (conftest.py)
We provide several pytest fixtures for testing:

1. **Database Fixtures**
   - `engine`: Creates test database engine
   - `db_session`: Provides database session for tests

2. **Authentication Fixtures**
   - `mock_supabase`: Mocks Supabase authentication
   - `auth_header`: Provides authentication headers
   - `authenticated_client`: Client with auth headers

3. **Mock Data**
   ```python
   TEST_USER = {
       "id": "123e4567-e89b-12d3-a456-426614174000",
       "email": "test@example.com",
       "full_name": "Test User"
   }
   ```

### Mocking Strategy
We mock external dependencies (like Supabase) to:
- Prevent modification of production data
- Ensure test reliability
- Enable offline testing
- Speed up test execution

Example of mocked Supabase calls:
```python
# In conftest.py
@pytest.fixture
def mock_supabase():
    with patch("app.api.v1.endpoints.auth.supabase") as mock_supabase:
        mock_supabase.auth.sign_up.return_value.user = TEST_USER
        yield mock_supabase
```

## Running Tests

### Basic Test Run
```powershell
cd backend
pytest
```

### Run with Verbosity
```powershell
pytest -v
```

### Run Specific Test File
```powershell
pytest tests/test_auth.py -v
```

### Run with Coverage Report
```powershell
pytest --cov=app tests/
```

## Test Categories

### 1. Authentication Tests (test_auth.py)
- Signup functionality
- Login functionality
- Protected route access
- Error cases

### 2. Database Tests (test_database.py)
- Connection testing
- Migration verification

### 3. Model Tests (test_models.py)
- Task model validation
- Relationship testing

## Writing New Tests

### Test File Template
```python
"""
Tests for [feature] functionality.
"""

import pytest
from fastapi.testclient import TestClient

def test_feature_success(client):
    """Test successful case of feature."""
    response = client.post("/api/v1/endpoint")
    assert response.status_code == 200

def test_feature_failure(client):
    """Test failure case of feature."""
    response = client.post("/api/v1/endpoint")
    assert response.status_code == 400
```

### Best Practices
1. Use descriptive test names
2. One assertion per test when possible
3. Use fixtures for shared setup
4. Mock external dependencies
5. Test both success and failure cases
6. Add docstrings to test functions

## Debugging Tests

### Show More Detail
```powershell
pytest -v --tb=long
```

### Debug Print Statements
```python
def test_something(caplog):
    caplog.set_level(logging.DEBUG)
    # Your test code here
```

## Adding New Tests
1. Create test file in `tests/` directory
2. Import necessary fixtures from `conftest.py`
3. Write tests following the template above
4. Run tests to verify 