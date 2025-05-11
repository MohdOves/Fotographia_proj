import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DashboardLayout = ({ section = 'dashboard', children }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-root">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <img src="/logo192.png" alt="Logo" />
          <span>Fotographiya</span>
        </div>
        <nav className="dash-sidebar-nav">
          <a href="#" className={section === 'dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}><span>🏠</span> Dashboard</a>
          <a href="#" className={section === 'pending' ? 'active' : ''} onClick={() => navigate('/dashboard/pending')}><span>⏳</span> Pending</a>
          <a href="#" className={section === 'current' ? 'active' : ''} onClick={() => navigate('/dashboard/current')}><span>📂</span> Current</a>
          <a href="#" className={section === 'completed' ? 'active' : ''} onClick={() => navigate('/dashboard/completed')}><span>✅</span> Completed</a>
        </nav>
      </aside>
      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-search">
            <input type="text" placeholder="Search ..." />
          </div>
          <div className="dash-actions">
            <button className="dash-add-btn" type="button" onClick={() => navigate('/dashboard/add')}>+ Add project</button>
            <span className="dash-bell">🔔</span>
          </div>
        </header>
        <section className="dash-content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout; 