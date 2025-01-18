import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from './components/Chat';
import useThemeStore from './store/themeStore';
import './styles/themes.css';

const App = () => {
  const { currentTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    setTheme(currentTheme);
  }, []);

  return (
    <div className="min-h-screen">
      <Chat />
    </div>
  );
};

export default App
