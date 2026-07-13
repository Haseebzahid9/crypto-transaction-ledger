import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('animationsEnabled');
    if (saved !== null) setAnimationsEnabled(JSON.parse(saved));
  }, []);

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => {
      localStorage.setItem('animationsEnabled', JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <AppContext.Provider value={{ sidebarOpen, setSidebarOpen, animationsEnabled, toggleAnimations }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
