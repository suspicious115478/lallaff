import React, { useState, useEffect } from 'react';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import SyncPage from './SyncPage';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("signup"); // signup | login | sync

  // --------------------------
  // LOAD USER ON PAGE REFRESH
  // --------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("logged_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage("sync");   // ⬅️ Go directly to dashboard
    }
  }, []);

  // --------------------------
  // SAVE USER WHEN LOGGED IN
  // --------------------------
  const handleUserLogin = (u) => {
    setUser(u);
    setPage("sync");
    localStorage.setItem("logged_user", JSON.stringify(u));
  };

  // --------------------------
  // LOGOUT (CLEAR EVERYTHING)
  // --------------------------
  const handleLogout = () => {
    setUser(null);
    setPage("login");
    localStorage.removeItem("logged_user"); // only remove user
  };

  // --------------------------
  // PAGE ROUTING
  // --------------------------
  if (user) {
    return <SyncPage user={user} onLogout={handleLogout} />;
  }

  if (page === "signup") {
    return (
      <SignupPage
        onSignupSuccess={handleUserLogin}
        goToLogin={() => setPage("login")}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleUserLogin}
        goToSignup={() => setPage("signup")}
      />
    );
  }

  return null;
}

export default App;
