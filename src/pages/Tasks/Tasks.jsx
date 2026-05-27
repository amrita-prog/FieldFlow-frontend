import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/Pagination';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../hooks/useToast';
import { getTasks } from '../../api/tasks';

export const Tasks = () => {
  const navigate = useNavigate();
  const { can } = usePermission();
  const { showToast } = useToast();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        status: status || undefined,
        priority: priority || undefined,
        search: debouncedSearch || undefined,
      };
      const data = await getTasks(params);
      setTasks(data.results);
      setTotalCount(data.count);
    } catch (err) {
      showToast(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, status, priority, debouncedSearch, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getStatusBadge = (s) => {
    switch(s) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      case 'pending': return <Badge variant="info">Pending</Badge>;
      default: return <Badge>{s}</Badge>;
    }
  };

  const getPriorityBadge = (p) => {
    switch(p) {
      case 'critical': return <Badge variant="danger">Critical</Badge>;
      case 'high': return <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>High</span>;
      case 'medium': return <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Medium</span>;
      case 'low': return <span className="badge" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>Low</span>;
      default: return <Badge>{p}</Badge>;
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
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search tasks..." 
              style={{ paddingLeft: '2.5rem' }} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="form-select" 
            style={{ width: '150px' }}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            className="form-select" 
            style={{ width: '150px' }}
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
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
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No tasks found.</td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} style={{ cursor: 'pointer' }}>
                  <td className="font-medium">{task.title}</td>
                  <td>{getStatusBadge(task.status)}</td>
                  <td>{getPriorityBadge(task.priority)}</td>
                  <td>{task.assigned_to?.full_name || task.assigned_to?.username || 'Unassigned'}</td>
                  <td>{task.region_name || task.region?.name || '-'}</td>
                  <td>{task.team_name || task.team?.name || '-'}</td>
                  <td>{task.due_date || '-'}</td>
                  <td>
                    <Button variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${task.id}`); }}>View</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
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
