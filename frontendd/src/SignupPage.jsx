import React, { useState } from 'react';

function SignupPage({ onSignupSuccess, goToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [status, setStatus] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const submitSignup = async (e) => {
    e.preventDefault();
    setStatus("Creating account...");

    try {
      const r = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, admin_id: adminId })
      });

      const json = await r.json();
      if (r.ok) {
        setStatus("Signup successful!");
        onSignupSuccess(json); // Redirect to sync
      } else {
        setStatus(`Error: ${json.error || "Signup failed"}`);
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup Page</h2>

      <form onSubmit={submitSignup}>
        <div style={{ margin: '8px 0' }}>
          <label>Email: </label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div style={{ margin: '8px 0' }}>
          <label>Password: </label>
          <input 
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div style={{ margin: '8px 0' }}>
          <label>Admin ID: </label>
          <input 
            required
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)} 
          />
        </div>

        <button type="submit">Signup</button>
      </form>

      <button 
        onClick={goToLogin}
        style={{ marginTop: 10 }}
      >
        Already have an account? Login
      </button>

      <pre style={{ marginTop: 20 }}>{status}</pre>
    </div>
  );
}

export default SignupPage;
