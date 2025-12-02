import React, { useState } from "react";

const ui = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f5f9",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#ffffff",
    padding: "36px 30px",
    borderRadius: 18,
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 28,
    fontWeight: 700,
    color: "#1f2d5a",
  },
  label: { fontWeight: 600, fontSize: 14, color: "#1f2d5a" },
  input: {
    width: "100%",
    padding: "13px 14px",
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid #d8dde8",
    fontSize: 15,
    outline: "none",
    transition: "0.2s",
  },
  buttonPrimary: {
    width: "100%",
    marginTop: 18,
    padding: "13px 14px",
    background: "#3757ff",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
  buttonSecondary: {
    width: "100%",
    marginTop: 14,
    padding: "12px 14px",
    background: "#eef1ff",
    color: "#3757ff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
};

function LoginPage({ onLoginSuccess, goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const submitLogin = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");

    try {
      const r = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await r.json();
      if (r.ok) {
        setStatus("Success!");
        onLoginSuccess(json);
      } else {
        setStatus(json.error || "Login failed");
      }
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div style={ui.container}>
      <div style={ui.card}>
        <h2 style={ui.title}>Welcome Back</h2>

        <form onSubmit={submitLogin}>
          <div style={{ marginBottom: 18 }}>
            <label style={ui.label}>Email</label>
            <input
              style={ui.input}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={ui.label}>Password</label>
            <input
              style={ui.input}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={ui.buttonPrimary}>Login</button>
        </form>

        <button style={ui.buttonSecondary} onClick={goToSignup}>
          Create new account
        </button>

        <p style={{ marginTop: 16, textAlign: "center", color: "#3a3a3a" }}>
          {status}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
