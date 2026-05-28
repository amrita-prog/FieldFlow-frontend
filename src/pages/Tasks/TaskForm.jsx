import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { createTask } from '../../api/tasks';
import { getUsers } from '../../api/users';

export const TaskForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    due_date: '',
    assigned_to_id: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch field agents for the dropdown
    const fetchAgents = async () => {
      try {
        const data = await getUsers({ role: 'Field Agent', page: 1 }); // might need to handle pagination if > 20 agents
        setAgents(data.results || []);
      } catch (err) {
        console.error('Failed to load agents', err);
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    // Clean empty strings for optional fields
    const payload = { ...formData };
    if (!payload.description) delete payload.description;
    if (!payload.due_date) delete payload.due_date;
    if (!payload.assigned_to_id) delete payload.assigned_to_id;

    try {
      const newTask = await createTask(payload);
      showToast('Task created successfully', 'success');
      navigate('/tasks');
    } catch (err) {
      if (err.details) {
        setErrors(err.details);
      }
      showToast(err.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">
        &larr; Back to Tasks
      </Button>
      <h1 className="h2 mb-4">Create New Task</h1>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="form-label">Title <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              name="title"
              className={`form-input ${errors.title ? 'is-invalid' : ''}`} 
              required 
              placeholder="Enter task title" 
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.title.join(', ')}</div>}
          </div>
          
          <div className="form-group mb-4">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              className={`form-textarea ${errors.description ? 'is-invalid' : ''}`} 
              rows="4" 
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.description.join(', ')}</div>}
          </div>
          
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group mb-4">
              <label className="form-label">Priority <span style={{color: 'red'}}>*</span></label>
              <select 
                name="priority" 
                className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.priority && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.priority.join(', ')}</div>}
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                name="due_date"
                className={`form-input ${errors.due_date ? 'is-invalid' : ''}`} 
                value={formData.due_date}
                onChange={handleChange}
              />
              {errors.due_date && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.due_date.join(', ')}</div>}
            </div>
          </div>
          
          <div className="form-group mb-4">
            <label className="form-label">Assign To (Field Agent)</label>
            <select 
              name="assigned_to_id" 
              className={`form-select ${errors.assigned_to_id ? 'is-invalid' : ''}`}
              value={formData.assigned_to_id}
              onChange={handleChange}
            >
              <option value="">-- Unassigned --</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.full_name || agent.username} ({agent.email})
                </option>
              ))}
            </select>
            {errors.assigned_to_id && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{errors.assigned_to_id.join(', ')}</div>}
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/tasks')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
