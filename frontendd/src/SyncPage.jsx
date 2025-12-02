import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SyncPage({ user }) {
  const [resp, setResp] = useState("Starting auto-sync...");
  const [writeHistory, setWriteHistory] = useState([]); // last 10 write counts
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  async function doSync() {
    try {
      setResp("working...");

      const r = await fetch(`${backendUrl}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: user.admin_id,
          mode: "all"
        })
      });

      const json = await r.json();
      setResp(JSON.stringify(json, null, 2));

      // Track last 10 write counts
      if (json.written_count !== undefined) {
        setWriteHistory(prev => {
          const updated = [...prev, json.written_count];
          if (updated.length > 10) updated.shift();
          return updated;
        });
      }

    } catch (err) {
      setResp("Error: " + err.message);
    }
  }

  useEffect(() => {
    doSync();
    const interval = setInterval(doSync, 10000);
    return () => clearInterval(interval);
  }, [user.admin_id]);

  // Prepare data for chart
  const chartData = writeHistory.map((count, idx) => ({ name: `#${idx + 1}`, count }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user.email} | Admin ID: <span className="font-mono">{user.admin_id}</span></p>
          <p className="text-sm text-green-600 mt-1">Auto Sync: Running every 10 seconds</p>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Sync Status</h2>
          <pre className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-auto text-sm">{resp}</pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Last 10 Write Counts</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {writeHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">Waiting for sync data...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SyncPage;
