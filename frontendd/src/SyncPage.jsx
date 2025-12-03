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
    <div className="min-h-screen bg-[#f4f6f9] p-6">

      {/* TOP NAVBAR */}
      <div className="w-full bg-white shadow-md p-4 rounded-xl mb-8 border">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Welcome, <span className="font-semibold">{user.email}</span> | 
          Admin ID:{" "}
          <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
            {user.admin_id}
          </span>
        </p>
        <p className="text-green-600 text-sm mt-1">
          🔄 Auto Sync Running (every 10 seconds)
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* SYNC STATUS CARD */}
        <section className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Sync Status
          </h2>
          <pre className="bg-[#111] text-green-400 p-4 rounded-lg max-h-64 overflow-auto shadow-inner border border-gray-800">
            {resp}
          </pre>
        </section>

        {/* WRITE COUNT CHART CARD */}
        <section className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Last 10 Write Counts
          </h2>

          {writeHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={writeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#007bff"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">Waiting for data...</p>
          )}
        </section>

        {/* ACTIVE AGENTS CARD */}
        <section className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Active Agents
          </h2>

          {agents.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-semibold text-left">Agent Name</th>
                  <th className="p-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-mono text-gray-800">{a.name}</td>
                    <td className="p-3 text-center">
                      {a.active === 1 ? (
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm shadow">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm shadow">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No agents found...</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default SyncPage;
