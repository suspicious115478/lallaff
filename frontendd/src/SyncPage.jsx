import React, { useState, useEffect } from 'react';

function SyncPage({ user }) {
  const [resp, setResp] = useState("Starting auto-sync...");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {

    async function doSync() {
      try {
        setResp("working...");

        const r = await fetch(`${backendUrl}/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            admin_id: user.admin_id,
            mode: "all"     // auto-all mode
          })
        });

        const json = await r.json();
        setResp(JSON.stringify(json, null, 2));

      } catch (err) {
        setResp("Error: " + err.message);
      }
    }

    doSync(); // 🚀 auto-run when page loads

  }, [user.admin_id]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.email}</h2>
      <h3>Admin ID (auto): {user.admin_id}</h3>
      <h4>Auto Sync Running...</h4>

      <pre style={{ marginTop: 20 }}>{resp}</pre>
    </div>
  );
}

export default SyncPage;
