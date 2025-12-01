import React, { useState } from 'react';
import SignupPage from './SignupPage';
import SyncPage from './SyncPage';

function App() {
  const [user, setUser] = useState(null); // store logged-in user

  // If not logged in → show signup
  if (!user) return <SignupPage onSignupSuccess={(u) => setUser(u)} />;

  // If logged in → show main sync page
  return <SyncPage user={user} />;
}

export default App;
