import React from 'react';
import { useState } from 'react';

function App() {
  const [adminId, setAdminId] = useState('');
  const [mode, setMode] = useState('all');
  const [resp, setResp] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const submit = async (e) => {
    e.preventDefault();
    setResp('working...');
    try {
      const r = await fetch(`${backendUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId, mode })
      });
      const json = await r.json();
      setResp(JSON.stringify(json, null, 2));
    } catch (err) {
      setResp('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Send admin_id to Backend</h2>
      <form onSubmit={submit}>
        <div style={{ margin: '8px 0' }}>
          <label>admin_id: </label>
          <input value={adminId} onChange={e => setAdminId(e.target.value)} />
        </div>
        <div style={{ margin: '8px 0' }}>
          <label>mode: </label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="all">all (write every row)</option>
            <option value="single">single (latest)</option>
          </select>
        </div>
        <button type="submit">Sync</button>
      </form>

      <pre style={{ marginTop: 20 }}>{resp}</pre>
    </div>
  );
}

export default App;

