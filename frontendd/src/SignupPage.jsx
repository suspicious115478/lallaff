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
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the Dispatch Sync System</p>

        <form onSubmit={submitSignup} style={styles.form}>
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

          <div style={styles.inputGroup}>
            <input
              required
              placeholder=" "
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              style={styles.input}
            />
            <label style={styles.floatingLabel}>Admin ID</label>
          </div>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <button onClick={goToLogin} style={styles.switchButton}>
          Already have an account? <span style={styles.linkText}>Login</span>
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

export default SignupPage;

// -------------------------------- STYLES --------------------------------

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
    animation: "fadeIn 0.7s ease",
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

  form: { },

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
    transition: "0.2s",
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
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    transition: "0.25s",
  },

  switchButton: {
    marginTop: 18,
    background: "none",
    border: "none",
    color: "white",
    fontSize: 15,
    cursor: "pointer",
  },

  linkText: { color: "#a5b4fc", fontWeight: "600" },

  status: {
    marginTop: 20,
    padding: 10,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    textAlign: "center",
  },
};
