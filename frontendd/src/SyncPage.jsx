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

/**
 * Professional Enterprise Admin SyncPage
 * - Auto syncs every 10s (doSync)
 * - Tracks last 10 write counts
 * - Fetches agents from Firebase realtime DB
 * - Dark / Light mode toggle (persisted in localStorage)
 *
 * NOTE: This file only changes UI. Core fetching/writing logic is unchanged.
 */

function SyncPage({ user }) {
  const [resp, setResp] = useState("Starting auto-sync...");
  const [writeHistory, setWriteHistory] = useState([]); // last 10 write counts
  const [agents, setAgents] = useState([]);
  const [lastSync, setLastSync] = useState(null);

  // theme: 'auto' | 'dark' | 'light' (we only store 'dark'/'light' for simplicity)
  const [theme, setTheme] = useState(
    () => localStorage.getItem("dashboard_theme") || "light"
  );

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Keep doSync identical in function (just UI logging added)
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

      // Track last 10 write counts
      if (json.written_count !== undefined) {
        setWriteHistory((prev) => {
          const updated = [...prev, json.written_count];
          if (updated.length > 10) updated.shift();
          return updated;
        });
      }

      setLastSync(new Date().toISOString());
    } catch (err) {
      setResp("Error: " + err.message);
    }
  }

  // Fetch Agents from Firebase realtime DB (unchanged approach)
  async function fetchAgents() {
    try {
      const fbURL = `https://project-8812136035477954307-default-rtdb.firebaseio.com/agents/${user.admin_id}.json`;

      const res = await fetch(fbURL);
      const data = await res.json();

      if (data) {
        // convert to array of { name, active }
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

  // Auto-run and interval
  useEffect(() => {
    doSync();
    fetchAgents();

    const interval = setInterval(() => {
      doSync();
      fetchAgents();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.admin_id]);

  // prepare chart data
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

  // theme handling
  useEffect(() => {
    localStorage.setItem("dashboard_theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function niceTime(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString();
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
            {/* KPI mini readouts */}
            <div
              className={`px-4 py-2 rounded-md text-sm ${
                isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="text-xs text-gray-400">Last Sync</div>
              <div className="text-sm font-medium">{niceTime(lastSync)}</div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400 mr-2">Dark Mode</label>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
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

        {/* GRID: KPI cards + charts + lists */}
        <div className="grid grid-cols-12 gap-6">
          {/* KPI CARDS */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-400">Total Writes (last 10)</div>
              <div className="mt-2 text-2xl font-bold">{totalWrites}</div>
              <div className="text-xs text-gray-400 mt-1">Sum of the last 10 sync write counts</div>
            </div>

            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-400">Active Agents</div>
              <div className="mt-2 text-2xl font-bold">{activeAgentCount}</div>
              <div className="text-xs text-gray-400 mt-1">Agents currently marked active</div>
            </div>

            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-400">Auto Sync Interval</div>
              <div className="mt-2 text-2xl font-bold">10s</div>
              <div className="text-xs text-gray-400 mt-1">Automatic background sync</div>
            </div>
          </div>

          {/* WRITE CHART */}
          <div className="col-span-12 lg:col-span-8">
            <div
              className={`p-4 rounded-xl h-full ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold">Last 10 Write Counts</h3>
                <div className="text-sm text-gray-400">Realtime overview</div>
              </div>

              <div style={{ width: "100%", height: 260 }}>
                {writeHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={writeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2d2d2d" : "#f0f0f0"} />
                      <XAxis dataKey="name" stroke={isDark ? "#cbd5e1" : "#64748b"} />
                      <YAxis stroke={isDark ? "#cbd5e1" : "#64748b"} />
                      <Tooltip
                        wrapperStyle={{
                          background: isDark ? "#111827" : "#fff",
                          border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
                        }}
                      />
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
                  <div className="flex items-center justify-center h-full text-gray-400">Waiting for sync data...</div>
                )}
              </div>
            </div>
          </div>

          {/* SYNC LOG + AGENTS LIST */}
          <div className="col-span-12 lg:col-span-7">
            <div
              className={`p-4 rounded-xl h-full ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold">Sync Status (raw)</h3>
                <div className="text-sm text-gray-400">Latest response</div>
              </div>
              <pre
                className={`p-3 rounded-md text-sm ${
                  isDark ? "bg-gray-900 text-green-300" : "bg-gray-50 text-gray-800"
                } overflow-auto max-h-64`}
              >
                {resp}
              </pre>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div
              className={`p-4 rounded-xl h-full ${
                isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold">Active Agents</h3>
                <div className="text-sm text-gray-400">{agents.length} total</div>
              </div>

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
                          className={`${idx % 2 === 0 ? (isDark ? "bg-gray-900/20" : "bg-gray-50") : ""}`}
                        >
                          <td className="py-2 font-mono">{a.name}</td>
                          <td className="py-2 text-right">
                            {a.active === 1 ? (
                              <span className="inline-flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                                <span className="text-sm font-medium">Active</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                                <span className="text-sm font-medium text-red-400">Inactive</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-gray-400">No agents found...</div>
              )}
            </div>
          </div>
        </div>

        {/* footer small */}
        <div className="mt-6 text-xs text-gray-400 text-center">
          Professional Admin Dashboard — auto sync client. UI only; backend unchanged.
        </div>
      </div>
    </div>
  );
}

export default SyncPage;
