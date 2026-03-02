import React, { useState } from 'react'

interface LoginResponse {
  token: string
  home_node: string
  session_type: string
  node_id: string
}

function App() {
  const [selectedNode, setSelectedNode] = useState('http://localhost:8000')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<LoginResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${selectedNode}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Login failed')
      }

      const data: LoginResponse = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>P2P Login Prototype</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>1. Select Server Node</h3>
        <select 
          value={selectedNode} 
          onChange={(e) => setSelectedNode(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        >
          <option value="http://localhost:8000">Node A (Home for Alice) - Port 8000</option>
          <option value="http://localhost:8001">Node B (Home for Bob) - Port 8001</option>
        </select>
        <p><small>Testing Tip: Log in as 'bob' on Node A to trigger proxying.</small></p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>2. Login</h3>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '10px' }}>
            <label>Username: </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password: </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffdada', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ padding: '15px', backgroundColor: '#e7f3ff', border: '1px solid #2196f3' }}>
          <h3>Login Successful!</h3>
          <p><strong>Connected Node:</strong> {result.node_id}</p>
          <p><strong>Home Node:</strong> {result.home_node}</p>
          <p><strong>Session Type:</strong> <span style={{ 
            color: result.session_type === 'local' ? 'green' : 'orange',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>{result.session_type}</span></p>
          <p><strong>Access Token:</strong> <code>{result.token}</code></p>
          <p><small>Check backend terminal for inter-server logs.</small></p>
        </div>
      )}
    </div>
  )
}

export default App
