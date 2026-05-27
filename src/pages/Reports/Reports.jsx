import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { id: 'pending', label: 'Pending Tasks' },
    { id: 'performance', label: 'Agent Performance' },
    { id: 'visits', label: 'Recent Visits' },
    { id: 'distribution', label: 'Task Distribution' },
  ];

  return (
    <div className="page-container">
      <h1 className="h2 mb-6">Reports</h1>
      
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {tabs.map(tab => (
          <Button 
            key={tab.id} 
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card>
        {activeTab === 'pending' && (
          <div>
            <h3 className="card-title mb-4">Pending Tasks by Region</h3>
            <p className="text-muted mb-4">Summary of tasks that are past due or approaching deadline.</p>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Region</th><th>Team</th><th>Pending Count</th><th>High Priority</th></tr>
                </thead>
                <tbody>
                  <tr><td>North</td><td>Alpha</td><td>12</td><td>3</td></tr>
                  <tr><td>South</td><td>Beta</td><td>5</td><td>1</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div>
            <h3 className="card-title mb-4">Agent Performance</h3>
            <p className="text-muted mb-4">Metrics on task completion rates and average time.</p>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Agent Name</th><th>Completed Tasks</th><th>Avg Time (Hours)</th></tr>
                </thead>
                <tbody>
                  <tr><td>Alice Smith</td><td>45</td><td>2.5</td></tr>
                  <tr><td>Bob Jones</td><td>38</td><td>3.1</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'visits' && (
          <div>
            <h3 className="card-title mb-4">Recent Visits (Last 7 Days)</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Agent</th><th>Visits Completed</th><th>Successful</th><th>Failed</th></tr>
                </thead>
                <tbody>
                  <tr><td>Alice Smith</td><td>15</td><td>14</td><td>1</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div>
            <h3 className="card-title mb-4">Task Distribution</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Manager</th><th>Status</th><th>Count</th><th>Percentage</th></tr>
                </thead>
                <tbody>
                  <tr><td>David Lee</td><td>Completed</td><td>120</td><td>80%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
