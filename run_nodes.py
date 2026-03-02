import subprocess
import os
import sys

def run_node(node_id, port):
    print(f"Starting node {node_id} on port {port}...")
    env = os.environ.copy()
    env["NODE_ID"] = node_id
    env["PORT"] = str(port)
    return subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", str(port)],
        env=env
    )

if __name__ == "__main__":
    # Clear log files
    with open("node_a.log", "w") as file:
        pass  # Doing nothing clears the file
    with open("node_b.log", "w") as file:
        pass  # Doing nothing clears the file
    
    node_a = run_node("node_a", 8000)
    node_b = run_node("node_b", 8001)

    try:
        node_a.wait()
        node_b.wait()
    except KeyboardInterrupt:
        node_a.terminate()
        node_b.terminate()
        print("Nodes stopped.")
