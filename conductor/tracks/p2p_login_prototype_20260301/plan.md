# Implementation Plan: P2P Login Prototype (PoC)

## Phase 1: Environment Setup & Scaffolding
- [ ] Task: Initialize FastAPI project structure and basic React app.
- [ ] Task: Define the `user_registry.json` using the provided structure (nodes, users, passwords).
- [ ] Task: Create a script to launch multiple server nodes on different ports.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Backend Core Logic (Local Auth)
- [ ] Task: Write Tests: User lookup and password validation from `user_registry.json`.
- [ ] Task: Implement: User lookup and basic login endpoint with local authentication.
- [ ] Task: Write Tests: Server configuration handling (detecting its own `id` and `url`).
- [ ] Task: Implement: Server node identification logic in FastAPI.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Inter-Server Authentication (Cross-Node)
- [ ] Task: Write Tests: Cross-server login request handling (Visiting -> Home) using **credentials**.
- [ ] Task: Implement: Inter-server API client (using `httpx`) to send username/password to the Home Server.
- [ ] Task: Write Tests: Token generation and session management.
- [ ] Task: Implement: Simple token generation logic and session response structure.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Frontend Development
- [ ] Task: Build React Components: Node Selector and Login Form.
- [ ] Task: Implement: API integration with dynamic target node (port) selection.
- [ ] Task: Build UI: Results dashboard showing session type (Local/Proxied) and token.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)

## Phase 5: Verification & Demo
- [ ] Task: Run end-to-end manual test of Home login on Server A.
- [ ] Task: Run end-to-end manual test of Visiting login (Home on Server B).
- [ ] Task: Verify terminal logs for inter-server communication.
- [ ] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)
