import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import { getTaskById, updateTaskStatus, assignTask, deleteTask } from '../../api/tasks';
import { getUsers } from '../../api/users';
import { getVisits, createVisit } from '../../api/visits';

export const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { can, hasRole } = usePermission();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [agents, setAgents] = useState([]);
  const [assignedToId, setAssignedToId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [linkedVisits, setLinkedVisits] = useState([]);
  const [creatingVisit, setCreatingVisit] = useState(false);

  const fetchTaskData = useCallback(async () => {
    try {
      const taskData = await getTaskById(id);
      setTask(taskData);
      setAssignedToId(taskData.assigned_to?.id || '');
      
      // Fetch linked visits (note: exact param might depend on backend, usually task_id or task)
      const visitsData = await getVisits({ task: id });
      setLinkedVisits(visitsData.results || []);
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        showToast('Task not found or access denied', 'error');
      } else {
        showToast(err.message || 'Failed to fetch task', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchTaskData();
  }, [fetchTaskData]);

  // Only fetch agents if user can update tasks (to populate dropdown)
  useEffect(() => {
    if (can('tasks', 'update')) {
      getUsers({ role: 'Field Agent', page: 1 })
        .then(res => setAgents(res.results || []))
        .catch(err => console.error(err));
    }
  }, [can]);

  const handleAssign = async () => {
    if (!assignedToId) return showToast('Select an agent first', 'warning');
    setAssignLoading(true);
    try {
      await assignTask(id, assignedToId);
      showToast('Task assigned successfully', 'success');
      await fetchTaskData();
    } catch (err) {
      showToast(err.details?.assigned_to_id?.[0] || err.message, 'error');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusLoading(true);
    try {
      await updateTaskStatus(id, newStatus);
      showToast(`Task status updated to ${newStatus}`, 'success');
      await fetchTaskData();
    } catch (err) {
      showToast(err.details?.status?.[0] || err.message, 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to cancel/delete this task?")) return;
    setDeleteLoading(true);
    try {
      await deleteTask(id);
      showToast('Task cancelled successfully', 'success');
      navigate('/tasks');
    } catch (err) {
      showToast(err.message || 'Failed to cancel task', 'error');
      setDeleteLoading(false); // only stop loading if it failed, else we navigate away
    }
  };

  const handleCreateVisit = async () => {
    const location = window.prompt("Enter location for this visit:");
    if (!location) return;
    setCreatingVisit(true);
    try {
      const visit = await createVisit({ task: id, task_id: id, location });
      showToast('Visit created successfully', 'success');
      // Redirect to the newly created visit or refresh list
      if (visit && visit.id) {
        navigate(`/visits/${visit.id}`);
      } else {
        await fetchTaskData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create visit', 'error');
    } finally {
      setCreatingVisit(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading task...</div>;
  }

  if (!task) {
    return (
      <div className="page-container">
        <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">&larr; Back to Tasks</Button>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Task not found or you don't have access to it.
        </div>
      </div>
    );
  }

  // Determine valid status transitions
  let availableStatuses = [];
  if (task.status === 'pending') availableStatuses = ['in_progress', 'cancelled'];
  if (task.status === 'in_progress') availableStatuses = ['completed', 'cancelled'];

  return (
    <div className="page-container">
      <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">
        &larr; Back to Tasks
      </Button>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="h2 mb-2">{task.title}</h1>
          <div className="flex gap-2 items-center text-sm text-muted">
            <span>Created by {task.created_by?.full_name || task.created_by?.username}</span>
            <span>•</span>
            <span>{new Date(task.created_at).toLocaleString()}</span>
          </div>
        </div>
        {hasRole(['Admin']) && task.status !== 'cancelled' && (
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Cancelling...' : 'Cancel Task'}
          </Button>
        )}
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Main Details */}
        <div className="flex flex-col gap-6">
          <Card>
            <h3 className="h4 mb-4">Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{task.description || 'No description provided.'}</p>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="h4 m-0">Linked Visits</h3>
              <Button size="sm" onClick={handleCreateVisit} disabled={creatingVisit}>
                {creatingVisit ? 'Creating...' : '+ Create Visit'}
              </Button>
            </div>
            {linkedVisits.length === 0 ? (
              <p className="text-muted">No visits linked to this task.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Location</th>
                    <th style={{ padding: '0.5rem' }}>Agent</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedVisits.map(visit => (
                    <tr key={visit.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>
                        <Link to={`/visits/${visit.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                          {visit.location}
                        </Link>
                      </td>
                      <td style={{ padding: '0.5rem' }}>{visit.agent?.full_name || visit.agent?.username}</td>
                      <td style={{ padding: '0.5rem' }}>{visit.status}</td>
                      <td style={{ padding: '0.5rem' }}>{new Date(visit.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Sidebar Info & Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Status & Priority Card */}
          <Card>
            <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted font-medium">Status</span>
              <Badge variant={task.status === 'completed' ? 'success' : task.status === 'cancelled' ? 'danger' : task.status === 'in_progress' ? 'warning' : 'info'}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted font-medium">Priority</span>
              <Badge variant={task.priority === 'critical' ? 'danger' : 'secondary'}>{task.priority.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted font-medium">Due Date</span>
              <span className="font-medium">{task.due_date || '-'}</span>
            </div>
            
            {/* Status Actions */}
            {availableStatuses.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Update Status:</p>
                <div className="flex gap-2">
                  {availableStatuses.map(s => (
                    <Button 
                      key={s} 
                      variant="secondary" 
                      onClick={() => handleStatusUpdate(s)}
                      disabled={statusLoading}
                      style={{ flex: 1 }}
                    >
                      {s.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Assignment Card */}
          <Card>
            <h3 className="h5 mb-4">Assignment & Location</h3>
            <div className="mb-4">
              <p className="text-sm text-muted mb-1">Region</p>
              <p className="font-medium">{task.region?.name || '-'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted mb-1">Team</p>
              <p className="font-medium">{task.team?.name || '-'}</p>
            </div>
            
            {/* Show assignment dropdown if user has Admin or Team Lead roles, else show static agent name */}
            {hasRole(['Admin', 'Team Lead']) ? (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <p className="text-sm text-muted mb-2">Assigned Agent</p>
                <div className="flex gap-2">
                  <select 
                    className="form-select" 
                    value={assignedToId} 
                    onChange={e => setAssignedToId(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="">-- Select Agent --</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.full_name || a.username}</option>
                    ))}
                  </select>
                  <Button onClick={handleAssign} disabled={assignLoading || assignedToId === task.assigned_to?.id}>
                    Assign
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <p className="text-sm text-muted mb-1">Assigned Agent</p>
                <p className="font-medium">{task.assigned_to?.full_name || task.assigned_to?.username || 'Unassigned'}</p>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};
