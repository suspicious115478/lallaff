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

  const container = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
    padding: 20,
  };

  const card = {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: "32px 28px",
    borderRadius: 16,
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  };

  const header = {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 26,
    fontWeight: 700,
    background:
      "linear-gradient(135deg, #4b68ff 0%, #6a8dff 50%, #7bb2ff 100%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const label = { fontWeight: 600, fontSize: 14 };

  const input = {
    width: "100%",
    padding: "12px 14px",
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid #d7ddea",
    fontSize: 15,
    outline: "none",
  };

  const button = {
    width: "100%",
    marginTop: 16,
    padding: "12px 14px",
    background: "#4b68ff",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  };

  const switchBtn = {
    width: "100%",
    marginTop: 12,
    padding: "10px 14px",
    background: "#eef1ff",
    color: "#4b68ff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={header}>Create Account</h2>

        <form onSubmit={submitSignup}>
          <div style={{ marginBottom: 16 }}>
            <label style={label}>Email</label>
            <input
              style={input}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Password</label>
            <input
              style={input}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Admin ID</label>
            <input
              style={input}
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>

          <button style={button} type="submit">
            Signup
          </button>
        </form>

        <button style={switchBtn} onClick={goToLogin}>
          Already have an account? Login
        </button>

        <p style={{ marginTop: 16, textAlign: "center", color: "#444" }}>
          {status}
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
