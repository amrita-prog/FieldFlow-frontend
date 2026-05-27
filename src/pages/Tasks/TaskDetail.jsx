import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">
        &larr; Back to Tasks
      </Button>
      <h1 className="h2 mb-4">Task Detail: {id}</h1>
      <div className="card">
        <p>This is a dummy task detail page for task #{id}.</p>
      </div>
    </div>
  );
};
