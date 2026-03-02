# Implementation Plan: P2P Login Prototype (PoC)

## Phase 1: Environment Setup & Scaffolding
- [x] Task: Initialize FastAPI project structure and basic React app. (13c7111)
- [x] Task: Define the `user_registry.json` using the provided structure (nodes, users, passwords). (647714f)
- [x] Task: Create a script to launch multiple server nodes on different ports. (1a5f55b)
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) (ec21b58)

## Phase 2: Backend Core Logic (Local Auth)
- [x] Task: Write Tests: User lookup and password validation from `user_registry.json`. (66eb0ba)
- [x] Task: Implement: User lookup and basic login endpoint with local authentication. (66eb0ba)
- [x] Task: Write Tests: Server configuration handling (detecting its own `id` and `url`). (66eb0ba)
- [x] Task: Implement: Server node identification logic in FastAPI. (66eb0ba)
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) (66eb0ba)

## Phase 3: Inter-Server Authentication (Cross-Node)
- [x] Task: Write Tests: Cross-server login request handling (Visiting -> Home) using **credentials**. (e2efece)
- [x] Task: Implement: Inter-server API client (using `httpx`) to send username/password to the Home Server. (e2efece)
- [x] Task: Write Tests: Token generation and session management. (e2efece)
- [x] Task: Implement: Simple token generation logic and session response structure. (e2efece)
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) (e2efece)

## Phase 4: Frontend Development
- [x] Task: Build React Components: Node Selector and Login Form. (6cdac3f)
- [x] Task: Implement: API integration with dynamic target node (port) selection. (6cdac3f)
- [x] Task: Build UI: Results dashboard showing session type (Local/Proxied) and token. (6cdac3f)
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md) (6cdac3f)

## Phase 5: Verification & Demo
- [x] Task: Run end-to-end manual test of Home login on Server A. (6cdac3f)
- [x] Task: Run end-to-end manual test of Visiting login (Home on Server B). (6cdac3f)
- [x] Task: Verify terminal logs for inter-server communication. (6cdac3f)
- [x] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md) (6cdac3f)
