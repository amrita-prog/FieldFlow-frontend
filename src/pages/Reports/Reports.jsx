import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { 
  getPendingTasksReport, 
  getAgentPerformanceReport, 
  getRecentVisitsReport, 
  getTaskDistributionReport 
} from '../../api/reports';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { showToast } = useToast();

  const tabs = [
    { id: 'pending', label: 'Pending Tasks' },
    { id: 'performance', label: 'Agent Performance' },
    { id: 'visits', label: 'Recent Visits' },
    { id: 'distribution', label: 'Task Distribution' },
  ];

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setData([]);
      try {
        let res;
        switch(activeTab) {
          case 'pending':
            res = await getPendingTasksReport();
            break;
          case 'performance':
            res = await getAgentPerformanceReport();
            break;
          case 'visits':
            res = await getRecentVisitsReport({ days: 30 }); // default to 30 days
            break;
          case 'distribution':
            res = await getTaskDistributionReport();
            break;
          default:
            return;
        }
        setData(res.results || []);
      } catch (err) {
        if (err.code === 'PERMISSION_DENIED') {
          showToast('You do not have access to view reports.', 'error');
        } else {
          showToast(err.message || 'Failed to load report data', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [activeTab, showToast]);

  const renderContent = () => {
    if (loading) {
      return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading report data...</div>;
    }

    if (data.length === 0) {
      return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data available for this report.</div>;
    }

    switch(activeTab) {
      case 'pending':
        return (
          <div>
            <h3 className="card-title mb-4">Pending Tasks by Region</h3>
            <p className="text-muted mb-4">Summary of tasks that are past due or approaching deadline.</p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Team</th>
                    <th>Pending Count</th>
                    <th>High Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium">{item.region}</td>
                      <td>{item.team}</td>
                      <td>{item.pending_count}</td>
                      <td style={item.high_priority_count > 0 ? { color: 'var(--danger)', fontWeight: 'bold' } : {}}>
                        {item.high_priority_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div>
            <h3 className="card-title mb-4">Agent Performance</h3>
            <p className="text-muted mb-4">Metrics on task completion rates and average time.</p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Agent Name</th>
                    <th>Completed Tasks</th>
                    <th>Avg Time (Hours)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium">{item.agent_name}</td>
                      <td>{item.total_completed}</td>
                      <td>{item.avg_hours_to_complete != null ? parseFloat(item.avg_hours_to_complete).toFixed(1) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'visits':
        return (
          <div>
            <h3 className="card-title mb-4">Recent Visits (Last 30 Days)</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Visits Completed</th>
                    <th>Successful</th>
                    <th>Failed</th>
                    <th>Partial</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium">{item.agent || item.agent_email}</td>
                      <td>{item.visits_completed}</td>
                      <td style={{ color: 'var(--success)' }}>{item.successful}</td>
                      <td style={item.failed > 0 ? { color: 'var(--danger)' } : {}}>{item.failed}</td>
                      <td style={{ color: 'var(--warning)' }}>{item.partial}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'distribution':
        return (
          <div>
            <h3 className="card-title mb-4">Task Distribution by Manager</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Manager</th>
                    <th>Pending</th>
                    <th>In Progress</th>
                    <th>Completed</th>
                    <th>Cancelled</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i}>
                      <td className="font-medium">{item.manager || item.manager_email}</td>
                      <td>{item.statuses?.pending || 0}</td>
                      <td>{item.statuses?.in_progress || 0}</td>
                      <td>{item.statuses?.completed || 0}</td>
                      <td>{item.statuses?.cancelled || 0}</td>
                      <td className="font-bold">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <h1 className="h2 mb-6">Reports</h1>
      
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <Button 
            key={tab.id} 
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};
