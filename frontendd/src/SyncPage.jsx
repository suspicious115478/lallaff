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

function SyncPage({ user, onLogout, onSelectAgent }) {
  const [resp, setResp] = useState("Starting auto-sync...");
  const [writeHistory, setWriteHistory] = useState([]);
  const [agents, setAgents] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [countdown, setCountdown] = useState(10);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("dashboard_theme") || "light"
  );

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  /* ===================== SYNC ===================== */
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
      setCountdown(10);
    } catch (err) {
      setResp("Error: " + err.message);
    }
  }

  /* ===================== AGENTS (SUPABASE VIA BACKEND) ===================== */
  async function fetchAgents() {
    try {
      const r = await fetch(
        `${backendUrl}/agents?admin_id=${user.admin_id}`
      );
      const json = await r.json();

      if (Array.isArray(json)) {
        setAgents(
          json.map((a) => ({
            name: a.agent_id,
            active: a.status === true || a.status === "active",
          }))
        );
      } else {
        setAgents([]);
      }
    } catch (err) {
      console.error("Agents fetch error:", err);
    }
  }

  /* ===================== INTERVALS ===================== */
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

  /* ===================== DERIVED ===================== */
  const writeChartData = writeHistory.map((count, idx) => ({
    name: `${idx + 1}`,
    count,
  }));

  const totalWrites = useMemo(
    () => writeHistory.reduce((s, v) => s + v, 0),
    [writeHistory]
  );

  const activeAgentCount = useMemo(
    () => agents.filter((a) => a.active).length,
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

  /* ===================== UI ===================== */
  return (
    <div className={`min-h-screen flex ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* ========== SIDEBAR ========== */}
      <aside
        className={`w-64 p-5 border-r ${
          isDark ? "bg-gray-900 border-gray-800 text-gray-200" : "bg-white"
        }`}
      >
        <div className="text-xl font-bold mb-6">Dispatch Admin</div>

        <nav className="space-y-2 text-sm">
          {["Dashboard", "Agents", "Sync Logs", "Settings"].map((item) => (
            <div
              key={item}
              className={`px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  isDark
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* ========== MAIN ========== */}
      <main className="flex-1 p-6">
        {/* TOP BAR */}
        <div
          className={`flex items-center justify-between mb-6 px-5 py-4 rounded-xl
            ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
        >
          <div>
            <div className="font-semibold">{user.email}</div>
            <div className="text-xs text-gray-400">
              Admin ID: {user.admin_id}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="text-xs text-gray-400">Last Sync</div>
              <div>{niceTime(lastSync)}</div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
            >
              {isDark ? "Light" : "Dark"}
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1 rounded-md bg-red-600 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* STATS */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {[
              ["Total Writes (last 10)", totalWrites],
              ["Active Agents", activeAgentCount],
              ["Next Sync In", `${countdown}s`],
            ].map(([label, value]) => (
              <div
                key={label}
                className={`p-4 rounded-xl ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="text-sm text-gray-400">{label}</div>
                <div className="text-2xl font-bold mt-1">{value}</div>
              </div>
            ))}
          </div>

          {/* GRAPH */}
          <div className="col-span-12 lg:col-span-8">
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-3">
                Last 10 Write Counts
              </h3>

              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={writeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RAW SYNC */}
          <div className="col-span-12 lg:col-span-7">
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-2">Sync Status</h3>
              <pre className="bg-black/80 text-green-400 p-3 rounded-md max-h-64 overflow-auto text-xs">
                {resp}
              </pre>
            </div>
          </div>

          {/* AGENTS */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-3">Agents</h3>

              {agents.length ? (
                <table className="w-full text-sm">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="text-left">Agent</th>
                      <th className="text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((a, i) => (
                      <tr key={i} className="border-t border-gray-700/20">
                        <td className="py-2">{a.name}</td>
                        <td className="py-2 text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              a.active
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {a.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-sm text-gray-400">
                  No agents found
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-center text-gray-400">
          Professional Admin Dashboard • UI only • Backend unchanged
        </div>
      </main>
    </div>
  );
}

export default SyncPage;
