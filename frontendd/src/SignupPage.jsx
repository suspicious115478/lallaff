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
