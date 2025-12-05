import React, { useState, useEffect } from 'react';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import SyncPage from './SyncPage';
import AgentDetailsPage from './AgentDetailsPage';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("signup");
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("logged_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage("sync");
    }
  }, []);

  const handleUserLogin = (u) => {
    setUser(u);
    setPage("sync");
    localStorage.setItem("logged_user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
    localStorage.removeItem("logged_user");
  };

  // ------------------- ROUTING -------------------
  if (page === "agent_details" && user) {
    return (
      <AgentDetailsPage
        user={user}
        agentName={selectedAgent}
        goBack={() => setPage("sync")}
      />
    );
  }

  if (user && page === "sync") {
    return (
      <SyncPage
        user={user}
        onLogout={handleLogout}
        onSelectAgent={(agentName) => {
          setSelectedAgent(agentName);
          setPage("agent_details");
        }}
      />
    );
  }

  if (page === "signup") {
    return <SignupPage onSignupSuccess={handleUserLogin} goToLogin={() => setPage("login")} />;
  }

  if (page === "login") {
    return <LoginPage onLoginSuccess={handleUserLogin} goToSignup={() => setPage("signup")} />;
  }

  return null;
}

export default App;
