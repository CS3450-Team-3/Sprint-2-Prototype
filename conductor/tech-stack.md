# Technology Stack: CodePop

## Frontend
*   **Framework:** ReactJS
*   **Description:** A component-based JavaScript library for building user interfaces, ensuring a fast and interactive experience for CodePop users.

## Backend
*   **Framework:** Django / Django REST Framework
*   **Language:** Python 3.12.x
*   **Description:** A high-level Python web framework that encourages rapid development and clean, pragmatic design, used to power the CodePop API and business logic. **Note:** Version 3.12.x is strictly required.

## Database
*   **Type:** PostgreSQL
*   **Description:** A powerful, open-source object-relational database system used for storing user profiles, drink recipes, inventory, and order history.

## Development Tools
*   **Version Control:** Git
*   **Environment:** Virtualenv (Python)

---

## Design Deviations

### 2026-03-01: P2P Login Prototype (Track)
*   **Framework:** FastAPI
*   **Rationale:** Chosen for the prototype to facilitate rapid development of asynchronous inter-server communication (P2P logic) and to provide interactive API documentation (OpenAPI) for showcasing node-to-node interactions.
*   **Scope:** This deviation applies specifically to the P2P Login Prototype track.
