import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Topbar() {
  const [time, setTime] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0') + ':' +
        now.getSeconds().toString().padStart(2, '0')
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-dot"></div>
        VenueFlow AI
      </div>
      <div className="topbar-match mono">Arsenal FC vs Chelsea FC · Match Day 32</div>
      <div className="topbar-spacer"></div>
      
      <button onClick={toggleTheme} className="btn btn-sm" style={{ padding: '6px', borderRadius: '50%' }} title="Toggle Theme">
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <div className="status-pill"><div className="status-dot"></div>LIVE MATCH IN PROGRESS</div>
      <div className="topbar-time mono" id="clock">{time}</div>
    </header>
  );
}
