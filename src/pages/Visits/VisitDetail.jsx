import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const VisitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Button variant="ghost" onClick={() => navigate('/visits')} className="mb-4">
        &larr; Back to Visits
      </Button>
      <h1 className="h2 mb-4">Visit Detail: {id}</h1>
      <div className="card">
        <p>This is a dummy visit detail page for visit #{id}.</p>
      </div>
    </div>
  );
};
