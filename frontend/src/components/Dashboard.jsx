import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import FaceMatch from './FaceMatch';

const stats = [
  { label: 'Total projects', value: 120 },
  { label: 'Pending projects', value: 64 },
  { label: 'Current projects', value: 32 },
  { label: 'Completed projects', value: 24 },
];

const initialPendingProjects = Array(10).fill({ name: 'Amrita-Deepak', pkg: 'Gold', date: '22 May 2024', mobile: '9426585858' });
const initialCurrentProjects = [
  { name: 'Amrita-Deepak', pkg: 'Gold', date: '22 May 2024', mobile: '9426585858' },
  { name: 'Amrita-Deepak', pkg: 'Silver', date: '22 May 2024', mobile: '9426585858' },
  { name: 'Amrita-Deepak', pkg: 'Platinum', date: '22 May 2024', mobile: '9426585858' },
  { name: 'Amrita-Deepak', pkg: 'Gold', date: '22 May 2024', mobile: '9426585858' },
];
const initialCompletedProjects = initialCurrentProjects;

const pkgColor = {
  Gold: '#FFD700',
  Silver: '#C0C0C0',
  Platinum: '#E5E4E2',
};

const ProjectTable = ({ title, projects, onDelete }) => {
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(index);
    }
  };

  return (
    <div className="dash-table-section">
      <div className="dash-table-header">
        <span>{title} projects</span>
        <a href="#" className="dash-viewall">View All</a>
      </div>
      <table className="dash-table">
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Wedding Name</th>
            <th>Package</th>
            <th>Date</th>
            <th>Mobile Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={i}>
              <td>{(i + 1).toString().padStart(2, '0')}</td>
              <td><b>{p.name}</b></td>
              <td style={{ color: pkgColor[p.pkg] || '#222', fontWeight: 600 }}>{p.pkg}</td>
              <td>{p.date}</td>
              <td>{p.mobile}</td>
              <td>
                <span className="dash-action dash-edit" title="Edit">✏️</span>
                <span 
                  className="dash-action dash-delete" 
                  title="Delete"
                  onClick={() => handleDelete(i)}
                  style={{ cursor: 'pointer' }}
                >
                  🗑️
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = ({ section }) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(section || 'dashboard');
  const [pendingProjects, setPendingProjects] = useState(initialPendingProjects);
  const [currentProjects, setCurrentProjects] = useState(initialCurrentProjects);
  const [completedProjects, setCompletedProjects] = useState(initialCompletedProjects);

  useEffect(() => {
    if (section && section !== currentSection) {
      setCurrentSection(section);
    }
    if (!section) {
      setCurrentSection('dashboard');
    }
  }, [section]);

  const handleNav = (sec) => {
    setCurrentSection(sec);
    navigate(sec === 'dashboard' ? '/dashboard' : `/dashboard/${sec}`);
  };

  const handleDelete = (type, index) => {
    switch (type) {
      case 'pending':
        setPendingProjects(prev => prev.filter((_, i) => i !== index));
        break;
      case 'current':
        setCurrentProjects(prev => prev.filter((_, i) => i !== index));
        break;
      case 'completed':
        setCompletedProjects(prev => prev.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-root">
      <aside className="dash-sidebar">
       
        <nav className="dash-sidebar-nav">
          <a href="#" className={currentSection === 'dashboard' ? 'active' : ''} onClick={() => handleNav('dashboard')}><span>🏠</span> Dashboard</a>
          <a href="#" className={currentSection === 'pending' ? 'active' : ''} onClick={() => handleNav('pending')}><span>⏳</span> Pending</a>
          <a href="#" className={currentSection === 'current' ? 'active' : ''} onClick={() => handleNav('current')}><span>📂</span> Current</a>
          <a href="#" className={currentSection === 'completed' ? 'active' : ''} onClick={() => handleNav('completed')}><span>✅</span> Completed</a>
        </nav>
      </aside>
      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-search">
            <input type="text" placeholder="Search ..." />
          </div>
          <div className="dash-actions">
            <button className="dash-add-btn" type="button" onClick={() => navigate('/face-match')}>+ Add project</button>
            <span className="dash-bell">🔔</span>
          </div>
        </header>
        <section className="dash-content">
          {(!currentSection || currentSection === 'dashboard') && <>
            <h2 className="dash-title">Dashboard</h2>
            <div className="dash-stats">
              {stats.map((s, i) => (
                <div className="dash-stat-card" key={i}>
                  <div className="dash-stat-value">{s.value}</div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <ProjectTable 
              title="Pending" 
              projects={pendingProjects.slice(0, 4)} 
              onDelete={(index) => handleDelete('pending', index)}
            />
            <ProjectTable 
              title="Current" 
              projects={currentProjects}
              onDelete={(index) => handleDelete('current', index)}
            />
            <ProjectTable 
              title="Completed" 
              projects={completedProjects}
              onDelete={(index) => handleDelete('completed', index)}
            />
          </>}
          {currentSection === 'pending' && <>
            <h2 className="dash-title">Pending projects</h2>
            <ProjectTable 
              title="Pending" 
              projects={pendingProjects}
              onDelete={(index) => handleDelete('pending', index)}
            />
          </>}
          {currentSection === 'current' && <>
            <h2 className="dash-title">Current projects</h2>
            <ProjectTable 
              title="Current" 
              projects={currentProjects}
              onDelete={(index) => handleDelete('current', index)}
            />
          </>}
          {currentSection === 'completed' && <>
            <h2 className="dash-title">Completed projects</h2>
            <ProjectTable 
              title="Completed" 
              projects={completedProjects}
              onDelete={(index) => handleDelete('completed', index)}
            />
          </>}
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 