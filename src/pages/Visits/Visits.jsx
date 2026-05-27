import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../hooks/useToast';
import { getVisits } from '../../api/visits';

export const Visits = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [outcome, setOutcome] = useState('');

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        status: status || undefined,
        outcome: outcome || undefined,
      };
      const data = await getVisits(params);
      setVisits(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      if (err.code === 'PERMISSION_DENIED') {
        showToast('You do not have access to visits', 'error');
      } else {
        showToast(err.message || 'Failed to fetch visits', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [page, status, outcome, showToast]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const getStatusBadge = (s) => {
    switch(s) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'scheduled': return <Badge variant="info">Scheduled</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge>{s}</Badge>;
    }
  };

  const getOutcomeBadge = (o) => {
    if (!o) return <span className="text-muted text-sm">-</span>;
    switch(o) {
      case 'successful': return <Badge variant="success">Successful</Badge>;
      case 'failed': return <Badge variant="danger">Failed</Badge>;
      case 'partial': return <Badge variant="warning">Partial</Badge>;
      default: return <Badge>{o}</Badge>;
    }
  };

  const getRiskFlagBadge = (flag) => {
    if (!flag) return null;
    if (flag === 'high') {
      return (
        <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldAlert size={12} /> High Risk
        </span>
      );
    }
    if (flag === 'medium') {
      return (
        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
          Medium
        </span>
      );
    }
    return (
      <span className="badge" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
        Low
      </span>
    );
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">Visits</h1>
        {/* We can add a "Create Visit" button here later if needed, but per specs it might be auto-created or done from Task */}
      </div>

      <Card className="mb-6">
        <div className="flex gap-4 items-center">
          <select 
            className="form-select" 
            style={{ width: '150px' }}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            className="form-select" 
            style={{ width: '150px' }}
            value={outcome}
            onChange={(e) => { setOutcome(e.target.value); setPage(1); }}
          >
            <option value="">All Outcomes</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </Card>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Agent</th>
              <th>Task</th>
              <th>Status</th>
              <th>Outcome</th>
              <th>Risk</th>
              <th>Started At</th>
              <th>Completed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>Loading visits...</td>
              </tr>
            ) : visits.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No visits found.</td>
              </tr>
            ) : (
              visits.map(visit => (
                <tr key={visit.id} onClick={() => navigate(`/visits/${visit.id}`)} style={{ cursor: 'pointer' }}>
                  <td className="font-medium">{visit.location}</td>
                  <td>{visit.agent?.full_name || visit.agent?.username || 'Unknown'}</td>
                  <td style={{ color: 'var(--primary)' }}>{visit.task_title || '-'}</td>
                  <td>{getStatusBadge(visit.status)}</td>
                  <td>{getOutcomeBadge(visit.outcome)}</td>
                  <td>{getRiskFlagBadge(visit.risk_flag)}</td>
                  <td>{visit.started_at ? new Date(visit.started_at).toLocaleString() : '-'}</td>
                  <td>{visit.completed_at ? new Date(visit.completed_at).toLocaleString() : '-'}</td>
                  <td>
                    <Button variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/visits/${visit.id}`); }}>View</Button>
                  </td>
                </tr>
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
