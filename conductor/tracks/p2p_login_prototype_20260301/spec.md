# Specification: P2P Login Prototype (PoC)

## Overview
This track aims to implement a Proof-of-Concept (PoC) for a decentralized login system where users can authenticate through any server node in a peer-to-peer network. The system distinguishes between a "Home Server" (authoritative owner of user data) and a "Visiting Server" (temporary proxy).

## Functional Requirements
- **FR1: Multiple Server Nodes (FastAPI):** Support running multiple **FastAPI** instances simultaneously on different local ports (e.g., 8000 for Server A, 8001 for Server B).
- **FR2: Static User Registry:** Use a shared static configuration file (`user_registry.json`) that maps each username to its designated Home Server.
- **FR3: Local Authentication:** If a user logs into their Home Server, the server should validate credentials against its local store (simulated for the PoC).
- **FR4: Inter-Server Authentication:** If a user logs into a Visiting Server:
    - The Visiting Server identifies the Home Server from the registry.
    - The Visiting Server sends an internal "Login Request" to the Home Server's API using **credentials** (username/password).
    - The Home Server validates credentials and returns a temporary Access Token (Simple String/UUID).
- **FR5: Frontend Node Selection:** The ReactJS UI must include a mechanism (dropdown or similar) to select which server node (port) the frontend is communicating with.
- **FR6: Session Feedback:** Display clear feedback in the UI indicating whether the login was "Local" (Home) or "Proxied" (Visiting), along with the received token and node information.

## Non-Functional Requirements
- **Simplicity:** Prioritize the "Proof of Concept" logic over production-grade security features for this prototype.
- **Traceability:** Logging of inter-server requests should be visible in the console to demonstrate the communication.
- **Asynchronicity:** Use FastAPI's async capabilities to handle cross-server calls without blocking.

## Acceptance Criteria
- [ ] Successfully log in as a "Home" user on Server A.
- [ ] Successfully log in as a "Visiting" user on Server A (where User belongs to Server B).
- [ ] The Visiting Server must correctly query the Home Server and receive a token.
- [ ] The UI displays the correct session state and server node information.
- [ ] Both Server A and Server B terminals show clear logs of the communication.

## Out of Scope
- Full Django user model integration (using a simplified mock or dictionary).
- JWT implementation (simple strings/UUIDs are sufficient).
- Automated database synchronization (static JSON is used instead).
- Deployment to cloud (local development environment only).
