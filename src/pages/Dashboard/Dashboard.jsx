import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="h2">Dashboard</h1>
      </div>
      <p className="text-muted mb-6">Welcome back, {user?.username}!</p>
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="text-muted text-sm font-medium">Total Tasks</h3>
          <p className="h1 mt-2">24</p>
        </div>
        <div className="card">
          <h3 className="text-muted text-sm font-medium">Pending Tasks</h3>
          <p className="h1 mt-2" style={{ color: 'var(--warning)' }}>8</p>
        </div>
        <div className="card">
          <h3 className="text-muted text-sm font-medium">Visits This Week</h3>
          <p className="h1 mt-2" style={{ color: 'var(--info)' }}>12</p>
        </div>
      </div>
      
      <div className="card">
        <h3 className="card-title mb-4">Recent Activity</h3>
        <p className="text-muted">Activity logs will appear here.</p>
      </div>
    </div>
  );
};
