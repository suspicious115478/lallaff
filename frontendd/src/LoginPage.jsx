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
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Welcome Back</h2>
        <p style={subtitleStyle}>Login to continue</p>

        <form onSubmit={submitLogin}>
          {/* EMAIL */}
          <div style={inputGroupStyle}>
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <label style={floatingLabelStyle}>Email</label>
          </div>

          {/* PASSWORD */}
          <div style={inputGroupStyle}>
            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <label style={floatingLabelStyle}>Password</label>
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <button onClick={goToSignup} style={switchButtonStyle}>
          Don’t have an account? <span style={switchTextStyle}>Sign Up</span>
        </button>

        {status && <p style={statusStyle}>{status}</p>}
      </div>
    </div>
  );
}

export default LoginPage;


// ---------------- MATCHING STYLES ----------------

const pageStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 12s ease infinite",
};

const cardStyle = {
  width: "100%",
  maxWidth: 420,
  padding: "40px 32px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
  color: "white",
};

const titleStyle = {
  margin: 0,
  fontSize: 32,
  fontWeight: 700,
  textAlign: "center",
};

const subtitleStyle = {
  textAlign: "center",
  marginTop: 6,
  marginBottom: 25,
  fontSize: 15,
  opacity: 0.8,
};

const inputGroupStyle = {
  position: "relative",
  marginBottom: 22,
};

const inputStyle = {
  width: "100%",
  padding: "14px 12px",
  fontSize: 16,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.4)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
  transition: "0.2s",
};

const floatingLabelStyle = {
  position: "absolute",
  left: 14,
  top: 14,
  color: "rgba(255,255,255,0.7)",
  fontSize: 14,
  transition: "0.2s",
  pointerEvents: "none",
};

const buttonStyle = {
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
  transition: "0.25s",
};

const switchButtonStyle = {
  marginTop: 18,
  background: "none",
  border: "none",
  color: "white",
  fontSize: 15,
  cursor: "pointer",
};

const switchTextStyle = {
  color: "#a5b4fc",
  fontWeight: 600,
};

const statusStyle = {
  marginTop: 20,
  padding: 10,
  background: "rgba(255,255,255,0.15)",
  borderRadius: 10,
  textAlign: "center",
};
