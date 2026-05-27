import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

export const VisitNotesForm = ({ onSubmit, loading }) => {
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ notes, outcome: outcome || undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-4">
        <label className="form-label">Visit Notes <span style={{color: 'red'}}>*</span></label>
        <textarea 
          className="form-textarea" 
          rows="4" 
          placeholder="Enter detailed visit notes. Min 5 characters."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          required
          minLength={5}
        />
        <p className="text-sm text-muted mt-1">Note: Submitting notes will trigger the AI risk detection engine.</p>
      </div>

      <div className="form-group mb-4">
        <label className="form-label">Outcome (Optional at this stage)</label>
        <select 
          className="form-select" 
          value={outcome}
          onChange={e => setOutcome(e.target.value)}
        >
          <option value="">-- Select Outcome --</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      <Button type="submit" disabled={loading || notes.trim().length < 5}>
        {loading ? 'Submitting...' : 'Submit Notes'}
      </Button>
    </form>
  );
};
