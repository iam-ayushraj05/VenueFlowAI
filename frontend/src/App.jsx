import { Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import Wayfinding from './pages/Wayfinding';
import Queue from './pages/Queue';
import Restroom from './pages/Restroom';
import Delivery from './pages/Delivery';
import Incident from './pages/Incident';
import Exit from './pages/Exit';
import Journey from './pages/Journey';
import ToastContainer from './components/ToastContainer';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="bg-grid"></div>
        <ToastContainer />
        <div className="app">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/wayfinding" element={<Wayfinding />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/restroom" element={<Restroom />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/incident" element={<Incident />} />
            <Route path="/exit" element={<Exit />} />
            <Route path="/journey" element={<Journey />} />
          </Routes>
        </main>
      </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
