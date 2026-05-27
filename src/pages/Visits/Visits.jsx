import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Play, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const Visits = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([
    { id: 1, location: 'Store 104', agent: 'Alice Smith', task: 'Store Audit - Downtown', status: 'scheduled', outcome: null, started_at: null, completed_at: null },
    { id: 2, location: 'Warehouse B', agent: 'Bob Jones', task: 'Restock Verification', status: 'in_progress', outcome: null, started_at: '2026-05-27T10:00:00Z', completed_at: null },
    { id: 3, location: 'Branch C', agent: 'Charlie Brown', task: 'Compliance Check', status: 'completed', outcome: 'successful', started_at: '2026-05-26T09:00:00Z', completed_at: '2026-05-26T11:00:00Z' },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'scheduled': return <Badge variant="info">Scheduled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getOutcomeBadge = (outcome) => {
    if (!outcome) return <span className="text-muted text-sm">-</span>;
    switch(outcome) {
      case 'successful': return <Badge variant="success">Successful</Badge>;
      case 'failed': return <Badge variant="danger">Failed</Badge>;
      case 'partial': return <Badge variant="warning">Partial</Badge>;
      default: return <Badge>{outcome}</Badge>;
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">Visits</h1>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4 items-center">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search visits..." style={{ paddingLeft: '2.5rem' }} />
          </div>
          <select className="form-select" style={{ width: '150px' }}>
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className="form-select" style={{ width: '150px' }}>
            <option value="">All Outcomes</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="partial">Partial</option>
          </select>
          <input type="date" className="form-input" style={{ width: '150px' }} />
          <Button variant="secondary"><Filter size={18} /> Filter</Button>
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
              <th>Started At</th>
              <th>Completed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map(visit => (
              <tr key={visit.id} onClick={() => navigate(`/visits/${visit.id}`)} style={{ cursor: 'pointer' }}>
                <td className="font-medium">{visit.location?.name || visit.location}</td>
                <td>{visit.agent?.name || visit.agent?.username || visit.agent}</td>
                <td style={{ color: 'var(--primary)' }}>{visit.task?.title || visit.task?.name || visit.task}</td>
                <td>{getStatusBadge(visit.status)}</td>
                <td>{getOutcomeBadge(visit.outcome)}</td>
                <td>{visit.started_at ? new Date(visit.started_at).toLocaleString() : '-'}</td>
                <td>{visit.completed_at ? new Date(visit.completed_at).toLocaleString() : '-'}</td>
                <td>
                  <Button variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/visits/${visit.id}`); }}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
