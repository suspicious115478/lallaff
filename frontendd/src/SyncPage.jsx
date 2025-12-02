import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

function SyncPage({ user }) {
  const [resp, setResp] = useState("Starting auto-sync...");
  const [writeHistory, setWriteHistory] = useState([]);
  const [agents, setAgents] = useState([]);
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

  // 🔥 Fetch Active Agents from Firebase
  async function fetchAgents() {
    try {
      const fbURL = `https://project-8812136035477954307-default-rtdb.firebaseio.com/`;

      const res = await fetch(fbURL);
      const data = await res.json();

      if (data) {
        const arr = Object.keys(data).map(name => ({
          name,
          active: data[name] === true ? 1 : 0
        }));
        setAgents(arr);
      } else {
        setAgents([]);
      }
    } catch (err) {
      console.error("Agents fetch error:", err);
    }
  }

  useEffect(() => {
    doSync();
    fetchAgents();

    const interval = setInterval(() => {
      doSync();
      fetchAgents();
    }, 10000);

    return () => clearInterval(interval);
  }, [user.admin_id]);

  const writeChartData = writeHistory.map((count, idx) => ({
    name: `#${idx + 1}`,
    count
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        
        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, {user.email} | Admin ID: <span className="font-mono">{user.admin_id}</span>
          </p>
          <p className="text-sm text-green-600 mt-1">
            Auto Sync: Running every 10 seconds
          </p>
        </header>

        {/* SYNC STATUS */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Sync Status</h2>
          <pre className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-auto text-sm">{resp}</pre>
        </section>

        {/* WRITE COUNT CHART */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Last 10 Write Counts</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {writeHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={writeChartData}>
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

        {/* ACTIVE AGENTS CHART */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Active Agents</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {agents.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="active" fill="#10b981" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No active agents found...</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default SyncPage;
