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

        <form onSubmit={submitLogin}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <label style={styles.floatingLabel}>Email</label>
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <label style={styles.floatingLabel}>Password</label>
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <button onClick={goToSignup} style={styles.switchButton}>
          Don’t have an account? <span style={styles.linkText}>Sign Up</span>
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

// SAME STYLE OBJECT AS SIGNUP

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 12s ease infinite",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    padding: "40px 32px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
    color: "white",
  },

  title: { margin: 0, fontSize: 32, fontWeight: 700, textAlign: "center" },

  subtitle: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 25,
    fontSize: 15,
    opacity: 0.8,
  },

  inputGroup: {
    position: "relative",
    marginBottom: 22,
  },

  input: {
    width: "100%",
    padding: "14px 12px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
  },

  floatingLabel: {
    position: "absolute",
    left: 14,
    top: 14,
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    transition: "0.2s",
    pointerEvents: "none",
  },

  button: {
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "white",
    fontSize: 17,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 5,
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },

  switchButton: {
    marginTop: 18,
    background: "none",
    border: "none",
    color: "white",
    fontSize: 15,
    cursor: "pointer",
  },

  linkText: {
    color: "#a5b4fc",
    fontWeight: 600,
  },

  status: {
    marginTop: 20,
    padding: 10,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    textAlign: "center",
  },
};
