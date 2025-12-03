import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SyncPage({ user }) {
  const [resp, setResp] = useState("Starting auto-sync...");
  const [writeHistory, setWriteHistory] = useState([]);
  const [agents, setAgents] = useState([]);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  async function doSync() {
    try {
      setResp("working...");

      const r = await fetch(`${backendUrl}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: user.admin_id,
          mode: "all",
        }),
      });

      const json = await r.json();
      setResp(JSON.stringify(json, null, 2));

      if (json.written_count !== undefined) {
        setWriteHistory((prev) => {
          const updated = [...prev, json.written_count];
          if (updated.length > 10) updated.shift();
          return updated;
        });
      }
    } catch (err) {
      setResp("Error: " + err.message);
    }
  }

  async function fetchAgents() {
    try {
      const fbURL = `https://project-8812136035477954307-default-rtdb.firebaseio.com/agents/${user.admin_id}.json`;

      const res = await fetch(fbURL);
      const data = await res.json();

      if (data) {
        const arr = Object.keys(data).map((name) => ({
          name,
          active: data[name] === true ? 1 : 0,
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
    count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/30">

        {/* HEADER */}
        <header className="mb-10 bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="text-gray-100 mt-2 text-lg">
            Welcome, <span className="font-bold">{user.email}</span> |
            Admin ID:{" "}
            <span className="font-mono bg-black/40 px-2 py-1 rounded text-green-300">
              {user.admin_id}
            </span>
          </p>
          <p className="text-green-300 text-sm mt-2">
            🔄 Auto Sync Running (every 10 seconds)
          </p>
        </header>

        {/* SYNC STATUS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-3 drop-shadow">
            Sync Status
          </h2>
          <pre className="bg-black/40 text-green-300 p-4 rounded-xl max-h-64 overflow-auto shadow-inner border border-white/10">
            {resp}
          </pre>
        </section>

        {/* WRITE COUNT CHART */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
            Last 10 Write Counts
          </h2>
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl">
            {writeHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={writeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#00ffea"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-100">Waiting for data...</p>
            )}
          </div>
        </section>

        {/* ACTIVE AGENTS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
            Active Agents
          </h2>

          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl">
            {agents.length > 0 ? (
              <table className="w-full border-collapse text-white">
                <thead>
                  <tr className="bg-white/20">
                    <th className="p-3 font-semibold">Agent Name</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/20 hover:bg-white/10 transition"
                    >
                      <td className="p-3 font-mono">{a.name}</td>
                      <td className="p-3 text-center">
                        {a.active === 1 ? (
                          <span className="px-3 py-1 bg-green-500/80 rounded-full text-white font-bold shadow">
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-500/80 rounded-full text-white font-bold shadow">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-200">No agents found...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SyncPage;
