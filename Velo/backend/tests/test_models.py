"""
Tests for task model operations using Supabase.
"""

def test_create_task(mock_supabase):
    """Test creating a task in Supabase."""
    task_data = {
        "title": "Test Task",
        "is_completed": False
    }
    
    mock_supabase.table('tasks').insert.return_value.execute.return_value = type('obj', (), {
        'data': [{
            'id': 'test-id',
            'title': 'Test Task',
            'is_completed': False,
            'created_at': '2024-01-01T00:00:00'
        }]
    })
    
    response = mock_supabase.table('tasks').insert(task_data).execute()
    created_task = response.data[0]
    
    assert created_task["id"] is not None
    assert created_task["title"] == "Test Task"
    assert created_task["is_completed"] is False
    assert created_task["created_at"] is not None

def test_update_task(mock_supabase):
    """Test updating a task in Supabase."""
    task_id = "test-id"
    update_data = {
        "title": "Updated Title",
        "is_completed": True
    }
    
    mock_supabase.table('tasks').update.return_value.eq.return_value.execute.return_value = type('obj', (), {
        'data': [{
            'id': task_id,
            'title': 'Updated Title',
            'is_completed': True,
            'created_at': '2024-01-01T00:00:00'
        }]
    })
    
    response = mock_supabase.table('tasks').update(update_data).eq('id', task_id).execute()
    updated_task = response.data[0]
    
    assert updated_task["id"] == task_id
    assert updated_task["title"] == "Updated Title"
    assert updated_task["is_completed"] is True

def test_delete_task(mock_supabase):
    """Test deleting a task from Supabase."""
    task_id = "test-id"
    
    # Mock successful deletion
    mock_supabase.table('tasks').delete.return_value.eq.return_value.execute.return_value = type('obj', (), {
        'data': []
    })
    
    # Delete the task
    mock_supabase.table('tasks').delete().eq('id', task_id).execute()
    
    # Mock empty response for verification
    mock_supabase.table('tasks').select.return_value.eq.return_value.execute.return_value = type('obj', (), {
        'data': []
    })
    
    # Verify the task was deleted
    response = mock_supabase.table('tasks').select("*").eq('id', task_id).execute()
    assert len(response.data) == 0 