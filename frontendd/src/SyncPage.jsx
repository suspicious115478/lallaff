import React, { useState, useEffect, useMemo } from "react";
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
  const [lastSync, setLastSync] = useState(null);
  const [countdown, setCountdown] = useState(10); // 🔥 countdown state

  const [theme, setTheme] = useState(
    () => localStorage.getItem("dashboard_theme") || "light"
  );

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

      setLastSync(new Date().toISOString());
      setCountdown(10); // 🔥 reset countdown
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

  // Auto Sync + Countdown Timer
  useEffect(() => {
    doSync();
    fetchAgents();

    const syncInterval = setInterval(() => {
      doSync();
      fetchAgents();
    }, 10000);

    const countdownInterval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(countdownInterval);
    };
  }, [user.admin_id]);

  const writeChartData = writeHistory.map((count, idx) => ({
    name: `${idx + 1}`,
    count,
  }));

  const totalWrites = useMemo(
    () => writeHistory.reduce((s, v) => s + v, 0),
    [writeHistory]
  );

  const activeAgentCount = useMemo(
    () => agents.filter((a) => a.active === 1).length,
    [agents]
  );

  useEffect(() => {
    localStorage.setItem("dashboard_theme", theme);
  }, [theme]);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  function niceTime(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* TOP NAV */}
        <div
          className={`flex items-center justify-between mb-6 px-5 py-4 rounded-xl ${
            isDark
              ? "bg-gray-800 border border-gray-700 shadow-md"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-md font-bold text-lg ${
                isDark ? "bg-indigo-700" : "bg-indigo-600 text-white"
              }`}
            >
              AD
            </div>

            <div>
              <div className="text-lg font-semibold">Dispatch Admin</div>
              <div className="text-sm text-gray-400">
                {user.email} • Admin ID{" "}
                <span className="font-mono text-sm">{user.admin_id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-md text-sm ${
                isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="text-xs text-gray-400">Last Sync</div>
              <div className="text-sm font-medium">{niceTime(lastSync)}</div>
            </div>

            {/* DARK MODE TOGGLE */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400 mr-2">Dark Mode</label>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  isDark ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block transform bg-white w-5 h-5 rounded-full shadow transition-transform ${
                    isDark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* KPI CARDS */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* TOTAL WRITES */}
            <div
              className={`p-4 rounded-xl ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-400">Total Writes (last 10)</div>
              <div className="mt-2 text-2xl font-bold">{totalWrites}</div>
            </div>

            {/* ACTIVE AGENTS */}
            <div
              className={`p-4 rounded-xl ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-400">Active Agents</div>
              <div className="mt-2 text-2xl font-bold">{activeAgentCount}</div>
            </div>

            {/* COUNTDOWN CARD */}
            <div
              className={`p-4 rounded-xl ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-400">
                Auto Sync Interval (10s)
              </div>
              <div className="mt-2 text-2xl font-bold flex items-baseline gap-2">
                10s
                <span className="text-red-500 text-sm font-semibold">
                  (next sync in {countdown}s)
                </span>
              </div>
            </div>
          </div>

          {/* WRITE CHART */}
          <div className="col-span-12 lg:col-span-8">
            <div
              className={`p-4 rounded-xl h-full ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="mb-3 text-md font-semibold">
                Last 10 Write Counts
              </h3>

              <div style={{ width: "100%", height: 260 }}>
                {writeHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={writeChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? "#2d2d2d" : "#ddd"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={isDark ? "#cbd5e1" : "#64748b"}
                      />
                      <YAxis
                        stroke={isDark ? "#cbd5e1" : "#64748b"}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={isDark ? "#60a5fa" : "#2563eb"}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Waiting for sync data...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SYNC RESPONSE */}
          <div className="col-span-12 lg:col-span-7">
            <div
              className={`p-4 rounded-xl h-full ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="mb-3 text-md font-semibold">Sync Status (raw)</h3>
              <pre
                className={`p-3 rounded-md text-sm ${
                  isDark
                    ? "bg-gray-900 text-green-300"
                    : "bg-gray-50 text-gray-800"
                } max-h-64 overflow-auto`}
              >
                {resp}
              </pre>
            </div>
          </div>

          {/* AGENT LIST */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className={`p-4 rounded-xl h-full ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="mb-3 text-md font-semibold">Active Agents</h3>

              {agents.length > 0 ? (
                <div className="overflow-auto max-h-64">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-400">
                        <th className="pb-2">Agent</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((a, idx) => (
                        <tr
                          key={idx}
                          className={`${
                            idx % 2 === 0
                              ? isDark
                                ? "bg-gray-900/20"
                                : "bg-gray-50"
                              : ""
                          }`}
                        >
                          <td className="py-2 font-mono">{a.name}</td>
                          <td className="py-2 text-right">
                            {a.active === 1 ? (
                              <span className="inline-flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-sm text-red-400">
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                Inactive
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  No agents found...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center">
          Professional Admin Dashboard — auto sync client. UI only; backend unchanged.
        </div>
      </div>
    </div>
  );
}

export default SyncPage;
