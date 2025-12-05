import React, { useEffect, useState } from "react";

function AgentDetailsPage({ user, agentName, goBack }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDetails() {
    try {
      const fbURL = `https://project-8812136035477954307-default-rtdb.firebaseio.com/agents/${user.admin_id}/${agentName}.json`;
      const res = await fetch(fbURL);
      const data = await res.json();
      setDetails(data || {});
    } catch (err) {
      console.error("Agent details error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400 text-lg">
        Loading agent details...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow">
        
        {/* BACK BUTTON */}
        <button
          onClick={goBack}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Agent Details: {agentName}
        </h2>

        <div className="space-y-3 text-lg">
          <div><b>Answered:</b> {details.answered ?? "-"}</div>
          <div><b>Login Time:</b> {details.login_time ?? "-"}</div>
          <div><b>Logout Time:</b> {details.logout_time ?? "-"}</div>
          <div><b>Rating:</b> {details.rating ?? "-"}</div>
          <div><b>Total Calls:</b> {details.total_calls ?? "-"}</div>
          <div><b>Total Call Time:</b> {details.total_calltime ?? "-"}</div>
        </div>

      </div>
    </div>
  );
}

export default AgentDetailsPage;
