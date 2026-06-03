import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NeuralBackground from './NeuralBackground';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <NeuralBackground />

      <div className="app-layout" style={{ position: 'relative', zIndex: 10 }}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(o => !o)}
          navigate={navigate}
        />

        <main className="content-frame">
          <TopBar
            onToggleSidebar={() => setSidebarOpen(o => !o)}
            navigate={navigate}
          />
          <div className="viewports-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
