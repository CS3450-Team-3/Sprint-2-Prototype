import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/** Schema for successful login response from backend nodes. */
interface LoginResponse {
    token: string;
    home_node: string;
    session_type: string;
    node_id: string;
}

function App() {
    const [currentTab, setCurrentTab] = useState<"login" | "node_a" | "node_b">("login");
    const [selectedNode, setSelectedNode] = useState("http://localhost:8000");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState<LoginResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string>("");
    const logEndRef = useRef<HTMLDivElement>(null);

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

    const fetchLogs = async (node: "node_a" | "node_b") => {
        const url = node === "node_a" ? "http://localhost:8000/logs" : "http://localhost:8001/logs";
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs);
            } else {
                setLogs("Failed to fetch logs.");
            }
        } catch (err) {
            setLogs("Error connecting to node.");
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentTab !== "login") {
            fetchLogs(currentTab as "node_a" | "node_b");
            interval = setInterval(() => {
                fetchLogs(currentTab as "node_a" | "node_b");
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [currentTab]);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    return (
        <div className="app-wrapper">
            {/* Top App Header */}
            <header className="app-header">
                <div className="logo">
                    <span className="logo-icon">✨</span> Codepop P2P
                </div>
            </header>

            {/* Category Pills - Now acting as Main Tabs */}
            <div className="pill-nav">
                <button 
                    className={`pill ${currentTab === "login" ? "active" : ""}`}
                    onClick={() => setCurrentTab("login")}
                >
                    🔑 Login Page
                </button>
                <button 
                    className={`pill ${currentTab === "node_a" ? "active" : ""}`}
                    onClick={() => setCurrentTab("node_a")}
                >
                    🖥️ Server A
                </button>
                <button 
                    className={`pill ${currentTab === "node_b" ? "active" : ""}`}
                    onClick={() => setCurrentTab("node_b")}
                >
                    🖥️ Server B
                </button>
            </div>

            {/* Main Content Area */}
            <main className="main-content">
                {currentTab === "login" ? (
                    <>
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
                                                        {result.node_id === "node_a" ? "Server A" : "Server B"}
                                                    </p>
                                                    <p>
                                                        <strong>Home Node:</strong>{" "}
                                                        {result.home_node === "node_a" ? "Server A" : "Server B"}
                                                    </p>
                                                    <p>
                                                        <strong>Session Type:</strong>
                                                        <span
                                                            className={`badge session-${result.session_type}`}
                                                        >
                                                            {result.session_type === "local" 
                                                                ? `LOCAL (Verified and Connected on ${result.node_id === "node_a" ? "Server A" : "Server B"})`
                                                                : `PROXIED (Password Verified in ${result.home_node === "node_a" ? "Server A" : "Server B"} -> User is Connected to ${result.node_id === "node_a" ? "Server A" : "Server B"})`
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="token-text">
                                                        <strong>Token:</strong>{" "}
                                                        <code>{result.token}</code>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                        
                    </>
                ) : (
                    <>
                        <h2 className="section-title">
                            {currentTab === "node_a" ? "Server A Logs" : "Server B Logs"}
                        </h2>
                        <div className="card log-card">
                            <div className="log-viewer">
                                <pre>{logs}</pre>
                                <div ref={logEndRef} />
                            </div>
                            <div className="log-actions">
                                <button className="secondary-btn" onClick={() => fetchLogs(currentTab as "node_a" | "node_b")}>
                                    Refresh Now
                                </button>
                                <span className="helper-text">Auto-refreshing every 2s</span>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
