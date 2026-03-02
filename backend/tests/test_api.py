import pytest
from fastapi.testclient import TestClient
from backend.main import app, REGISTRY

client = TestClient(app)

def test_read_root():
    """Test the root endpoint for node identification."""
    response = client.get("/")
    assert response.status_code == 200
    assert "P2P Login Prototype" in response.json()["message"]

def test_status():
    """Test the status endpoint."""
    response = client.get("/status")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_local_login_success():
    """Test successful local login for Alice on Node A (default)."""
    # Assuming default node is node_a
    response = client.post(
        "/login",
        json={"username": "alice", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["session_type"] == "local"
    assert data["home_node"] == "node_a"
    assert "token" in data

def test_local_login_invalid_password():
    """Test local login failure with incorrect password."""
    response = client.post(
        "/login",
        json={"username": "alice", "password": "wrongpassword"}
    )
    assert response.status_code == 401

def test_user_not_found():
    """Test login failure for non-existent user."""
    response = client.post(
        "/login",
        json={"username": "nonexistent", "password": "password"}
    )
    assert response.status_code == 404
