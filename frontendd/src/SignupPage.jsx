import React, { useState } from "react";

function SignupPage({ onSignupSuccess, goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [status, setStatus] = useState("");

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const submitSignup = async (e) => {
    e.preventDefault();
    setStatus("Creating account...");

    try {
      const r = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, admin_id: adminId }),
      });

      const json = await r.json();
      if (r.ok) {
        setStatus("Signup successful!");
        onSignupSuccess(json);
      } else {
        setStatus(`Error: ${json.error || "Signup failed"}`);
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Sign up to manage your dispatch sync</p>

        <form onSubmit={submitSignup} style={styles.form}>
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin ID</label>
            <input
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              style={styles.input}
              placeholder="Enter Admin ID"
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <button onClick={goToLogin} style={styles.linkButton}>
          Already have an account? <span style={styles.linkText}>Login</span>
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

export default SignupPage;

// ------------------ STYLES ------------------

const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f3f4f6",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "white",
    borderRadius: 16,
    padding: "32px 28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 25,
  },
  form: {
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: "12px 0",
    background: "#2563eb",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "0.2s",
  },
  linkButton: {
    marginTop: 18,
    background: "transparent",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    color: "#6b7280",
  },
  linkText: {
    color: "#2563eb",
    fontWeight: 600,
  },
  status: {
    marginTop: 15,
    fontSize: 14,
    color: "#374151",
    whiteSpace: "pre-wrap",
  },
};
