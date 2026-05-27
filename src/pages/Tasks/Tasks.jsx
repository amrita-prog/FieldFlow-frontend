import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { usePermission } from '../../hooks/usePermission';

export const Tasks = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const [tasks, setTasks] = useState([
    // Mock Data
    { id: 1, title: 'Store Audit - Downtown', status: 'pending', priority: 'high', assigned_to: 'Alice Smith', region: 'North', team: 'Alpha', due_date: '2026-06-01' },
    { id: 2, title: 'Restock Verification', status: 'in_progress', priority: 'medium', assigned_to: 'Bob Jones', region: 'South', team: 'Beta', due_date: '2026-06-05' },
    { id: 3, title: 'Compliance Check', status: 'completed', priority: 'critical', assigned_to: 'Charlie Brown', region: 'East', team: 'Gamma', due_date: '2026-05-28' },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'pending': return <Badge variant="info">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'critical': return <Badge variant="danger">Critical</Badge>;
      case 'high': return <span className="badge" style={{ backgroundColor: 'var(--priority-high-bg)', color: 'var(--priority-high-text)' }}>High</span>;
      case 'medium': return <span className="badge" style={{ backgroundColor: 'var(--priority-medium-bg)', color: 'var(--priority-medium-text)' }}>Medium</span>;
      case 'low': return <span className="badge" style={{ backgroundColor: 'var(--priority-low-bg)', color: 'var(--priority-low-text)' }}>Low</span>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">Tasks</h1>
        {can('tasks', 'create') && (
          <Button onClick={() => navigate('/tasks/new')}>
            <Plus size={18} /> Create Task
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="flex gap-4 items-center">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search tasks..." style={{ paddingLeft: '2.5rem' }} />
          </div>
          <select className="form-select" style={{ width: '150px' }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select className="form-select" style={{ width: '150px' }}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <input type="date" className="form-input" style={{ width: '150px' }} />
          <Button variant="secondary"><Filter size={18} /> Filter</Button>
        </div>
      </Card>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Region</th>
              <th>Team</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} style={{ cursor: 'pointer' }}>
                <td className="font-medium">{task.title}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{getPriorityBadge(task.priority)}</td>
                <td>{task.assigned_to?.name || task.assigned_to?.username || task.assigned_to}</td>
                <td>{task.region?.name || task.region}</td>
                <td>{task.team?.name || task.team}</td>
                <td>{task.due_date}</td>
                <td>
                  <Button variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${task.id}`); }}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
