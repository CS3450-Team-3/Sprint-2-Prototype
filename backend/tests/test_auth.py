import json
import pytest
from pathlib import Path

# This is a unit test for the logic that will live in main.py
# For now, we'll mock the Registry logic or test it once implemented.

def test_user_lookup_logic():
    # Load the registry to verify our tests match the data
    registry_path = Path("user_registry.json")
    with open(registry_path, "r") as f:
        registry = json.load(f)
    
    users = registry["users"]
    
    # Test Alice (node_a)
    assert "alice" in users
    assert users["alice"]["password"] == "password123"
    assert users["alice"]["home_node"] == "node_a"
    
    # Test Bob (node_b)
    assert "bob" in users
    assert users["bob"]["password"] == "password456"
    assert users["bob"]["home_node"] == "node_b"

def test_invalid_user():
    registry_path = Path("user_registry.json")
    with open(registry_path, "r") as f:
        registry = json.load(f)
    
    assert "charlie" not in registry["users"]
