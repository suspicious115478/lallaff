import React, { useState } from "react";

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <form onSubmit={submitLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <button onClick={goToSignup} style={styles.switchBtn}>
          Don’t have an account?{" "}
          <span style={styles.linkText}>Sign Up</span>
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 18,
    padding: "40px 32px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
    animation: "fadeIn 0.4s ease",
  },

  title: {
    fontSize: 28,
    margin: 0,
    fontWeight: 700,
    textAlign: "center",
    color: "#1e293b",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748b",
    marginTop: 6,
    marginBottom: 28,
  },

  form: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    display: "block",
    fontWeight: 600,
    color: "#334155",
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 15,
    outline: "none",
    background: "#f9fafb",
    transition: "0.2s",
  },

  button: {
    width: "100%",
    padding: "13px 0",
    background: "#4f46e5",
    color: "white",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    marginTop: 10,
    fontWeight: 600,
    transition: "0.2s",
  },

  switchBtn: {
    marginTop: 18,
    width: "100%",
    textAlign: "center",
    background: "none",
    border: "none",
    color: "#475569",
    fontSize: 14,
    cursor: "pointer",
  },

  linkText: {
    color: "#4f46e5",
    fontWeight: 600,
  },

  status: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 14,
    color: "#475569",
  },
};

