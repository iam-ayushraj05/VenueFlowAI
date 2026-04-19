import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, Map as MapIcon, Compass, ListOrdered, 
  MapPin, Truck, AlertTriangle, LogOut, Navigation 
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('/api/incidents')
      .then(r => r.json())
      .then(data => setIncidents(data));
  }, []);

  const navItemClass = ({ isActive }) => isActive ? 'nav-item active' : 'nav-item';

  return (
    <nav className="sidebar">
      <div className="nav-section">Overview</div>
      <NavLink to="/dashboard" className={navItemClass}>
        <div className="nav-icon"><LayoutGrid size={14} /></div>
        Command Center
      </NavLink>

      <div className="nav-section">Crowd Intelligence</div>
      <NavLink to="/heatmap" className={navItemClass}>
        <div className="nav-icon"><MapIcon size={14} /></div>
        Heat Map
      </NavLink>
      <NavLink to="/wayfinding" className={navItemClass}>
        <div className="nav-icon"><Compass size={14} /></div>
        AR Wayfinding
      </NavLink>

      <div className="nav-section">Fan Services</div>
      <NavLink to="/queue" className={navItemClass}>
        <div className="nav-icon"><ListOrdered size={14} /></div>
        Smart Queue
      </NavLink>
      <NavLink to="/restroom" className={navItemClass}>
        <div className="nav-icon"><MapPin size={14} /></div>
        Restroom Index
      </NavLink>
      <NavLink to="/delivery" className={navItemClass}>
        <div className="nav-icon"><Truck size={14} /></div>
        In-Seat Delivery
      </NavLink>

      <div className="nav-section">Safety & Ops</div>
      <NavLink to="/incident" className={navItemClass}>
        <div className="nav-icon"><AlertTriangle size={14} /></div>
        Incidents
        {incidents.length > 0 && <span className="nav-badge">{incidents.length}</span>}
      </NavLink>
      <NavLink to="/exit" className={navItemClass}>
        <div className="nav-icon"><LogOut size={14} /></div>
        Exit Orchestration
      </NavLink>

      <div className="nav-section">Fan Journey</div>
      <NavLink to="/journey" className={navItemClass}>
        <div className="nav-icon"><Navigation size={14} /></div>
        Fan Journey
      </NavLink>
    </nav>
  );
}
