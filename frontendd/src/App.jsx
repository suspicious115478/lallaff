import React, { useState } from 'react';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import SyncPage from './SyncPage';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("signup"); // signup | login | sync

  // LOGOUT HANDLER (passed to SyncPage)
  const handleLogout = () => {
    setUser(null);      // Clear user → go back to login
    setPage("login");   // Show login page
    localStorage.clear(); // optional
  };

  // If logged in → show dashboard
  if (user) return <SyncPage user={user} onLogout={handleLogout} />;

  if (page === "signup") {
    return (
      <SignupPage 
        onSignupSuccess={(u) => setUser(u)}
        goToLogin={() => setPage("login")}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage 
        onLoginSuccess={(u) => setUser(u)}
        goToSignup={() => setPage("signup")}
      />
    );
  }

  return null;
}

export default App;
