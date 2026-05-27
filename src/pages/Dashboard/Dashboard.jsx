import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, MapPin, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getDashboardSummary } from '../../api/reports';
import { getLogs } from '../../api/logs';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Field Agents get 403 on logs, so we check role
  const isFieldAgent = typeof user?.role === 'object' ? user?.role?.name === 'Field Agent' : user?.role === 'Field Agent';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const sumData = await getDashboardSummary();
        setSummary(sumData);
        
        if (!isFieldAgent) {
          const logsData = await getLogs({ page: 1 });
          setLogs(logsData.results?.slice(0, 5) || []); // just show top 5 on dashboard
        }
      } catch (err) {
        showToast(err.message || 'Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [showToast, isFieldAgent]);

  if (loading) {
    return <div className="page-container">Loading dashboard...</div>;
  }

  const formatAction = (action) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-2">
        <h1 className="h2">Dashboard</h1>
      </div>
      <p className="text-muted mb-6">
        Welcome back, {user?.full_name || user?.username}! 
        {summary?.scope?.region ? ` You are viewing data for ${summary.scope.team || summary.scope.region}.` : ''}
      </p>
      
      {/* Stat Cards */}
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Tasks Stats */}
        <div className="card flex items-center justify-between" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div>
            <h3 className="text-muted text-sm font-medium">Pending Tasks</h3>
            <p className="h1 mt-1" style={{ color: 'var(--text-main)' }}>{summary?.tasks?.pending || 0}</p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: '1rem', borderRadius: '50%' }}>
            <Clock size={24} color="var(--primary)" />
          </div>
        </div>

        <div className="card flex items-center justify-between" style={{ borderLeft: '4px solid var(--success)' }}>
          <div>
            <h3 className="text-muted text-sm font-medium">Completed Tasks</h3>
            <p className="h1 mt-1">{summary?.tasks?.completed || 0}</p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: '1rem', borderRadius: '50%' }}>
            <CheckSquare size={24} color="var(--success)" />
          </div>
        </div>

        {/* Visits Stats */}
        <div className="card flex items-center justify-between" style={{ borderLeft: '4px solid var(--info)' }}>
          <div>
            <h3 className="text-muted text-sm font-medium">Visits This Week</h3>
            <p className="h1 mt-1">{summary?.visits?.completed_this_week || 0}</p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: '1rem', borderRadius: '50%' }}>
            <MapPin size={24} color="var(--info)" />
          </div>
        </div>

        <div className="card flex items-center justify-between" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div>
            <h3 className="text-muted text-sm font-medium">High Risk Flags</h3>
            <p className="h1 mt-1">{summary?.visits?.high_risk || 0}</p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-body)', padding: '1rem', borderRadius: '50%' }}>
            <AlertCircle size={24} color="var(--danger)" />
          </div>
        </div>

      </div>
      
      {/* Recent Activity Table (Hidden for Field Agents) */}
      {!isFieldAgent && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title">Recent Activity</h3>
            <Button variant="ghost" onClick={() => navigate('/logs')}>View All</Button>
          </div>
          
          {logs.length === 0 ? (
            <p className="text-muted">No recent activity found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="font-medium">{log.actor?.full_name || log.actor?.username}</td>
                      <td>
                        <Badge variant="secondary">{formatAction(log.action)}</Badge>
                      </td>
                      <td style={{ color: 'var(--primary)' }}>
                        {log.target_type} ({log.target_id.substring(0,8)}...)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
