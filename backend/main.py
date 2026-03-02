import os
import json
import uuid
import httpx
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
    print(f"[{NODE_ID}] Processing login for {req.username}")
    
    # Check if user exists in registry
    if req.username not in REGISTRY["users"]:
        raise HTTPException(status_code=404, detail="User not found in global registry")
    
    user_data = REGISTRY["users"][req.username]
    home_node_id = user_data["home_node"]
    
    # Check if this node is the home node
    if home_node_id == NODE_ID:
        print(f"[{NODE_ID}] Local login detected for {req.username}")
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
    
    # PROXIED LOGIN
    print(f"[{NODE_ID}] User {req.username} belongs to {home_node_id}. Proxying request...")
    
    home_node_config = REGISTRY["nodes"].get(home_node_id)
    if not home_node_config:
        raise HTTPException(status_code=500, detail=f"Home node {home_node_id} not found in nodes configuration.")
    
    home_url = home_node_config["internal_url"]
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{home_url}/login",
                json={"username": req.username, "password": req.password},
                timeout=5.0
            )
            
            if resp.status_code == 200:
                print(f"[{NODE_ID}] Home node {home_node_id} authorized user {req.username}")
                data = resp.json()
                return LoginResponse(
                    token=data["token"],
                    home_node=home_node_id,
                    session_type="proxied",
                    node_id=NODE_ID
                )
            else:
                print(f"[{NODE_ID}] Home node {home_node_id} rejected login: {resp.text}")
                raise HTTPException(status_code=resp.status_code, detail=f"Home server error: {resp.text}")
                
    except httpx.RequestError as exc:
        print(f"[{NODE_ID}] Failed to connect to home node {home_node_id}: {exc}")
        raise HTTPException(status_code=503, detail=f"Could not connect to home server {home_node_id}")
