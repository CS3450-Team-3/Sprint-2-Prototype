"""
P2P Login Prototype Backend

This module implements a FastAPI server that handles local authentication
and proxies login requests to other nodes in a peer-to-peer network.
"""

import os
import json
import uuid
import httpx
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from typing import Optional

# Configuration from environment (set by run_nodes.py)
NODE_ID = os.getenv("NODE_ID", "node_a")
PORT = os.getenv("PORT", "8000")
LOG_FILE = f"{NODE_ID}.log"

# Set up logging to both file and console
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For the PoC, allow all origins. In production, specify the frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load registry
REGISTRY_PATH = Path("user_registry.json")
with open(REGISTRY_PATH, "r") as f:
    REGISTRY = json.load(f)

class LoginRequest(BaseModel):
    """Schema for login request credentials."""
    username: str
    password: str

class LoginResponse(BaseModel):
    """Schema for successful login response including session metadata."""
    token: str
    home_node: str
    session_type: str # "local" or "proxied"
    node_id: str

@app.get("/")
async def root():
    """Root endpoint for node identification."""
    return {"message": f"P2P Login Prototype - {NODE_ID} (Port {PORT})"}

@app.get("/status")
async def status():
    """Status endpoint for health checks and node ID verification."""
    return {"status": "online", "node_id": NODE_ID}

@app.get("/logs")
async def get_logs():
    """Endpoint to fetch logs for this node."""
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            # For simplicity, returning the last 100 lines
            lines = f.readlines()
            return {"logs": "".join(lines[-100:])}
    return {"logs": "No logs found."}

@app.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, request: Request):
    """
    Handle user login with friendly logging of the authentication path.
    """
    logger.info("") # Logical separation from previous actions
    proxy_source = request.headers.get("X-Proxy-Source")
    server_display_name = "Server A" if NODE_ID == "node_a" else "Server B"
    
    if proxy_source:
        source_display = "Server A" if proxy_source == "node_a" else "Server B"
        logger.info(f"--- 📥 Received Proxied Request ---")
        logger.info(f"[{server_display_name}] {source_display} is asking me to verify user '{req.username}'.")
    else:
        logger.info(f"--- 🔑 New Login Attempt ---")
        logger.info(f"[{server_display_name}] User '{req.username}' is trying to log in directly through this server.")

    # Check if user exists in registry
    if req.username not in REGISTRY["users"]:
        logger.error(f"[{server_display_name}] User '{req.username}' not found in the global registry.")
        raise HTTPException(
            status_code=404, 
            detail=f"User '{req.username}' does not exist in our network."
        )
    
    user_data = REGISTRY["users"][req.username]
    home_node_id = user_data["home_node"]
    home_display_name = "Server A" if home_node_id == "node_a" else "Server B"
    
    # Check if this node is the home node
    if home_node_id == NODE_ID:
        logger.info(f"[{server_display_name}] User '{req.username}' info is stored locally on this server.")
        logger.info(f"[{server_display_name}] Validating credentials for '{req.username}'...")
        
        if req.password == user_data["password"]:
            if proxy_source:
                logger.info(f"[{server_display_name}] ✅ Password correct! Sending success back to {source_display}.")
            else:
                logger.info(f"[{server_display_name}] ✅ Password correct! Access granted.")
                
            return LoginResponse(
                token=str(uuid.uuid4()),
                home_node=NODE_ID,
                session_type="local",
                node_id=NODE_ID
            )
        else:
            logger.warning(f"[{server_display_name}] ❌ Login failed: Incorrect password for user '{req.username}'.")
            raise HTTPException(
                status_code=401, 
                detail={
                    "message": f"{server_display_name} found the password to be incorrect.",
                    "home_node": NODE_ID,
                    "node_id": NODE_ID
                }
            )
    
    # PROXIED LOGIN
    logger.info(f"[{server_display_name}] User '{req.username}' info is NOT on this server. It is stored on {home_display_name}.")
    logger.info(f"[{server_display_name}] 🚀 Forwarding login request to {home_display_name}...")
    
    home_node_config = REGISTRY["nodes"].get(home_node_id)
    if not home_node_config:
        logger.error(f"[{server_display_name}] System error: Could not find configuration for {home_display_name}.")
        raise HTTPException(status_code=500, detail=f"Home node {home_node_id} not found.")
    
    home_url = home_node_config["internal_url"]
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{home_url}/login",
                json={"username": req.username, "password": req.password},
                headers={"X-Proxy-Source": NODE_ID},
                timeout=5.0
            )
            
            if resp.status_code == 200:
                logger.info(f"[{server_display_name}] ✅ {home_display_name} confirmed the user is valid.")
                logger.info(f"[{server_display_name}] Completing proxied login for '{req.username}'.")
                data = resp.json()
                return LoginResponse(
                    token=data["token"],
                    home_node=home_node_id,
                    session_type="proxied",
                    node_id=NODE_ID
                )
            else:
                logger.warning(f"[{server_display_name}] ❌ {home_display_name} rejected the login.")
                try:
                    error_data = resp.json()
                    # If it's a structured error from the home server, pass it through but update node_id
                    if isinstance(error_data.get("detail"), dict):
                        detail = error_data["detail"]
                        detail["node_id"] = NODE_ID # The user is connected to THIS node
                        raise HTTPException(status_code=resp.status_code, detail=detail)
                except (ValueError, KeyError):
                    pass
                
                raise HTTPException(status_code=resp.status_code, detail=f"{home_display_name} reported an error.")
                
    except httpx.RequestError as exc:
        logger.error(f"[{server_display_name}] 📡 Connection failed: Could not reach {home_display_name}.")
        raise HTTPException(status_code=503, detail=f"Could not connect to home server {home_node_id}")
