import React, { useState } from 'react';

function LoginPage({ onLoginSuccess, goToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const submitLogin = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");

    try {
      const r = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const json = await r.json();
      if (r.ok) {
        setStatus("Login successful!");
        onLoginSuccess(json);
      } else {
        setStatus("Error: " + (json.error || "Login failed"));
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={submitLogin}>
        <div style={{ margin: '8px 0' }}>
          <label>Email: </label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div style={{ margin: '8px 0' }}>
          <label>Password: </label>
          <input 
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <button 
        onClick={goToSignup}
        style={{ marginTop: 10 }}
      >
        Don't have an account? Signup
      </button>

      <pre style={{ marginTop: 20 }}>{status}</pre>
    </div>
  );
}

export default LoginPage;
