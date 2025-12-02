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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5",
      padding: 20
    }}>
      
      <div style={{
        width: "100%",
        maxWidth: 380,
        background: "white",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        
        <h2 style={{
          textAlign: "center",
          marginBottom: 20,
          fontSize: "26px",
          fontWeight: "600",
          color: "#333"
        }}>
          Login
        </h2>

        <form onSubmit={submitLogin}>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "15px"
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "15px"
              }}
            />
          </div>

          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: 5
          }}>
            Login
          </button>
        </form>

        <button
          onClick={goToSignup}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: 15,
            background: "#e5e7eb",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Don't have an account? Signup
        </button>

        <pre style={{
          marginTop: 20,
          background: "#f9fafb",
          padding: "10px",
          borderRadius: "10px",
          fontSize: "13px",
          color: "#555"
        }}>
          {status}
        </pre>

      </div>
    </div>
  );
}

export default LoginPage;
