# P2P Login Prototype

This repository is a proof-of-concept for a peer-to-peer (P2P) login prototype. It contains a simple Python backend that runs node processes and a TypeScript/React frontend built with Vite.

## Repository layout

- `backend/`: Python backend and tests
- `frontend/`: Vite + React frontend
- `run_nodes.py`: helper to start backend node processes

## Quick start

### Backend (from repository root):

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
python run_nodes.py
```

### Frontend (from `frontend/`):

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The backend expects a virtual environment at `.venv`; create one with `python -m venv .venv` and install dependencies from `backend/requirements.txt` before running.

## Testing

Run `python -m pytest -q` from the root folder.
