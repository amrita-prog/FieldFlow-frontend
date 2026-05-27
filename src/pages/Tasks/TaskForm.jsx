import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const TaskForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/tasks');
  };

  return (
    <div className="page-container">
      <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">
        &larr; Back to Tasks
      </Button>
      <h1 className="h2 mb-4">Create New Task</h1>
      <div className="card max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" required placeholder="Enter task title" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows="4" placeholder="Enter task description"></textarea>
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="submit">Create Task</Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/tasks')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
