import React, { useEffect, useState, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // TailwindCSS

// ---- Dark Mode Context so App can read it easily ---- //
export const ThemeContext = createContext();

function Main() {
  const [theme, setTheme] = useState(() => {
    // Load saved theme or default light
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply class to <body>
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <App />
    </ThemeContext.Provider>
  );
}

const el = document.getElementById('root');
createRoot(el).render(<Main />);
