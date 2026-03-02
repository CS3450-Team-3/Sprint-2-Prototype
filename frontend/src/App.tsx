import React, { useState } from "react";
import "./App.css";

/** Schema for successful login response from backend nodes. */
interface LoginResponse {
    token: string;
    home_node: string;
    session_type: string;
    node_id: string;
}

function App() {
    const [selectedNode, setSelectedNode] = useState("http://localhost:8000");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState<LoginResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${selectedNode}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Login failed");
            }

            const data: LoginResponse = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-wrapper">
            {/* Top App Header */}
            <header className="app-header">
                <div className="logo">
                    <span className="logo-icon">✨</span> Codepop P2P
                </div>
            </header>

            {/* Main Content Area */}
            <main className="main-content">
                <h2 className="section-title">Authentication</h2>

                {/* Node Selection Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>1. Select Server Node</h3>
                        <span className="price-tag">Status: OK</span>
                    </div>
                    <p className="card-subtitle">
                        Choose your entry point into the P2P network.
                    </p>

                    <select
                        value={selectedNode}
                        onChange={(e) => setSelectedNode(e.target.value)}
                        className="modern-input"
                    >
                        <option value="http://localhost:8000">
                            Node A (Home for Alice) - Port 8000
                        </option>
                        <option value="http://localhost:8001">
                            Node B (Home for Bob) - Port 8001
                        </option>
                    </select>
                    <p className="helper-text">
                        Testing Tip: Log in as 'bob' on Node A to trigger
                        proxying.
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="card">
                    <div className="card-header">
                        <h3>2. Login Credentials</h3>
                    </div>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="modern-input"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="modern-input"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="primary-btn"
                        >
                            {loading ? "Authenticating..." : "Secure Login"}
                        </button>
                    </form>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="alert error">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {result && (
                    <div className="alert success">
                        <h3>Login Successful!</h3>
                        <div className="result-details">
                            <p>
                                <strong>Connected Node:</strong>{" "}
                                {result.node_id}
                            </p>
                            <p>
                                <strong>Home Node:</strong> {result.home_node}
                            </p>
                            <p>
                                <strong>Session Type:</strong>
                                <span
                                    className={`badge session-${result.session_type}`}
                                >
                                    {result.session_type}
                                </span>
                            </p>
                            <p className="token-text">
                                <strong>Token:</strong>{" "}
                                <code>{result.token}</code>
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
