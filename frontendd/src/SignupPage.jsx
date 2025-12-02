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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>

        <form onSubmit={submitSignup} style={styles.form}>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Admin ID"
            required
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={goToLogin}>
            Login
          </span>
        </p>

        <p style={styles.status}>{status}</p>
      </div>
    </div>
  );
}

export default SignupPage;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f5f6fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "14px",
    padding: "35px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    padding: "12px",
    fontSize: "17px",
    background: "#4C6EF5",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "5px",
    transition: "0.2s",
  },
  link: {
    color: "#4C6EF5",
    cursor: "pointer",
    fontWeight: "500",
  },
  switchText: {
    marginTop: "15px",
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
  },
  status: {
    marginTop: "15px",
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
  },
};

