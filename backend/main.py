import os
import json
import uuid
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from pathlib import Path
from typing import Optional

app = FastAPI()

# Configuration from environment (set by run_nodes.py)
NODE_ID = os.getenv("NODE_ID", "node_a")
PORT = os.getenv("PORT", "8000")

# Load registry
REGISTRY_PATH = Path("user_registry.json")
with open(REGISTRY_PATH, "r") as f:
    REGISTRY = json.load(f)

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    home_node: str
    session_type: str # "local" or "proxied"
    node_id: str

@app.get("/")
async def root():
    return {"message": f"P2P Login Prototype - {NODE_ID} (Port {PORT})"}

@app.get("/status")
async def status():
    return {"status": "online", "node_id": NODE_ID}

@app.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    # Check if user exists in registry
    if req.username not in REGISTRY["users"]:
        raise HTTPException(status_code=404, detail="User not found in global registry")
    
    user_data = REGISTRY["users"][req.username]
    
    # Check if this node is the home node
    if user_data["home_node"] == NODE_ID:
        # LOCAL LOGIN
        if req.password == user_data["password"]:
            return LoginResponse(
                token=str(uuid.uuid4()),
                home_node=NODE_ID,
                session_type="local",
                node_id=NODE_ID
            )
        else:
            raise HTTPException(status_code=401, detail="Invalid password for home server")
    
    # PROXIED LOGIN (To be implemented in Phase 3)
    raise HTTPException(status_code=501, detail=f"User's home node is {user_data['home_node']}. Proxying not yet implemented.")
