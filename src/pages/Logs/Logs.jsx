import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../hooks/useToast';
import { getLogs } from '../../api/logs';

export const Logs = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [targetType, setTargetType] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        action: action || undefined,
        target_type: targetType || undefined,
      };
      const data = await getLogs(params);
      setLogs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      if (err.code === 'PERMISSION_DENIED') {
        showToast('You do not have access to view logs.', 'error');
      } else {
        showToast(err.message || 'Failed to fetch logs', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [page, action, targetType, showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatAction = (str) => {
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getActionBadgeColor = (actionStr) => {
    if (actionStr.includes('created')) return 'success';
    if (actionStr.includes('deleted') || actionStr.includes('deactivated') || actionStr.includes('failed') || actionStr.includes('cancelled')) return 'danger';
    if (actionStr.includes('updated') || actionStr.includes('started') || actionStr.includes('notes')) return 'warning';
    return 'info';
  };

  const handleTargetClick = (type, id) => {
    if (type === 'task') navigate(`/tasks/${id}`);
    if (type === 'visit') navigate(`/visits/${id}`);
    if (type === 'user') navigate(`/users`); // We don't have a user detail page right now, just redirect to users
  };

  return (
    <div className="page-container">
      <h1 className="h2 mb-6">Activity Logs</h1>

      <Card className="mb-6">
        <div className="flex gap-4 items-center flex-wrap">
          <select 
            className="form-select" 
            style={{ width: '200px' }}
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
          >
            <option value="">All Actions</option>
            <option value="user_logged_in">User Logged In</option>
            <option value="user_logged_out">User Logged Out</option>
            <option value="task_created">Task Created</option>
            <option value="task_assigned">Task Assigned</option>
            <option value="task_status_updated">Task Status Updated</option>
            <option value="visit_created">Visit Created</option>
            <option value="visit_started">Visit Started</option>
            <option value="visit_completed">Visit Completed</option>
            <option value="visit_notes_added">Visit Notes Added</option>
            <option value="ai_output_generated">AI Output Generated</option>
            <option value="user_created">User Created</option>
            <option value="user_deactivated">User Deactivated</option>
          </select>
          <select 
            className="form-select" 
            style={{ width: '150px' }}
            value={targetType}
            onChange={(e) => { setTargetType(e.target.value); setPage(1); }}
          >
            <option value="">All Targets</option>
            <option value="task">Task</option>
            <option value="visit">Visit</option>
            <option value="user">User</option>
          </select>
          {/* We would add Actor Search here if we had an actor_id dropdown or search, but for now we rely on the API's standard filters */}
          <div className="flex gap-2 items-center text-sm text-muted">
            <label>From:</label>
            <input type="date" className="form-input py-1" onChange={(e) => { /* To implement date filter logic if needed by API */ }} />
          </div>
          <div className="flex gap-2 items-center text-sm text-muted">
            <label>To:</label>
            <input type="date" className="form-input py-1" onChange={(e) => { /* To implement date filter logic if needed by API */ }} />
          </div>
        </div>
      </Card>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No logs found.</td></tr>
            ) : (
              logs.map(log => (
                <React.Fragment key={log.id}>
                  <tr 
                    style={{ cursor: log.metadata && Object.keys(log.metadata).length > 0 ? 'pointer' : 'default' }} 
                    onClick={() => log.metadata && Object.keys(log.metadata).length > 0 && toggleRow(log.id)}
                  >
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div className="font-medium">{log.actor?.full_name || log.actor?.username}</div>
                      <div className="text-xs text-muted">{log.actor?.role_name}</div>
                    </td>
                    <td>
                      <Badge variant={getActionBadgeColor(log.action)}>
                        {formatAction(log.action)}
                      </Badge>
                    </td>
                    <td>
                      {log.target_id ? (
                        <button 
                          className="btn-link flex items-center gap-1"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: '0.875rem', fontWeight: 500 }}
                          onClick={(e) => { e.stopPropagation(); handleTargetClick(log.target_type, log.target_id); }}
                        >
                          {log.target_type} ({log.target_id.substring(0,8)}) <ArrowRight size={14} />
                        </button>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>
                      {log.metadata && Object.keys(log.metadata).length > 0 ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                          {expandedRow === log.id ? 'Hide Details' : 'View Details'}
                        </span>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                  </tr>
                  {expandedRow === log.id && log.metadata && Object.keys(log.metadata).length > 0 && (
                    <tr>
                      <td colSpan="5" style={{ backgroundColor: 'var(--bg-body)', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <pre style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {!loading && totalCount > 0 && (
          <Pagination 
            count={totalCount} 
            page={page} 
            pageSize={20} 
            onPageChange={(p) => setPage(p)} 
          />
        )}
      </div>
    </div>
  );
};
