import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Info, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { getVisitById, startVisit, updateVisitNotes, completeVisit } from '../../api/visits';
import { VisitNotesForm } from './VisitNotesForm';

export const VisitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [actionLoading, setActionLoading] = useState(false);
  const [completeOutcome, setCompleteOutcome] = useState('');

  const fetchVisitData = useCallback(async () => {
    try {
      const data = await getVisitById(id);
      setVisit(data);
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        showToast('Visit not found or access denied', 'error');
      } else {
        showToast(err.message || 'Failed to fetch visit', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchVisitData();
  }, [fetchVisitData]);

  const handleStart = async () => {
    setActionLoading(true);
    try {
      await startVisit(id);
      showToast('Visit started', 'success');
      await fetchVisitData();
    } catch (err) {
      showToast(err.message || 'Failed to start visit', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotesSubmit = async (notesData) => {
    setActionLoading(true);
    try {
      await updateVisitNotes(id, notesData);
      showToast('Notes submitted successfully', 'success');
      await fetchVisitData();
    } catch (err) {
      showToast(err.message || 'Failed to submit notes', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!completeOutcome) {
      return showToast('Please select an outcome to complete the visit.', 'warning');
    }
    setActionLoading(true);
    try {
      await completeVisit(id, completeOutcome);
      showToast('Visit completed', 'success');
      await fetchVisitData();
    } catch (err) {
      if (err.code === 'INVALID_STATE') {
         showToast(err.message, 'error');
      } else {
         showToast(err.details?.outcome?.[0] || err.message, 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading visit...</div>;
  }

  if (!visit) {
    return (
      <div className="page-container">
        <Button variant="ghost" onClick={() => navigate('/visits')} className="mb-4">&larr; Back to Visits</Button>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Visit not found or you don't have access to it.
        </div>
      </div>
    );
  }

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

  const isOwnVisit = user?.email === visit.agent?.email || user?.username === visit.agent?.username;
  const canPerformActions = isOwnVisit || ['Admin', 'Regional Manager'].includes(typeof user?.role === 'object' ? user?.role?.name : user?.role);

  return (
    <div className="page-container">
      <Button variant="ghost" onClick={() => navigate('/visits')} className="mb-4">
        &larr; Back to Visits
      </Button>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="h2 mb-2">{visit.location}</h1>
          <div className="flex gap-2 items-center text-sm text-muted">
            <span>Created {new Date(visit.created_at).toLocaleString()}</span>
          </div>
        </div>
        {canPerformActions && visit.status === 'scheduled' && (
          <Button onClick={handleStart} disabled={actionLoading}>
            {actionLoading ? 'Starting...' : 'Start Visit'}
          </Button>
        )}
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Main Details */}
        <div className="flex flex-col gap-6">
          
          <Card>
            <h3 className="h5 mb-4">Visit Information</h3>
            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p className="text-sm text-muted mb-1">Agent</p>
                <p className="font-medium">{visit.agent?.full_name || visit.agent?.username || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Linked Task</p>
                {visit.task ? (
                  <Link to={`/tasks/${visit.task.id}`} style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
                    {visit.task.title}
                  </Link>
                ) : (
                  <p className="text-muted">-</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Started At</p>
                <p className="font-medium">{visit.started_at ? new Date(visit.started_at).toLocaleString() : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Completed At</p>
                <p className="font-medium">{visit.completed_at ? new Date(visit.completed_at).toLocaleString() : '-'}</p>
              </div>
            </div>
          </Card>

          {visit.notes ? (
            <Card>
              <h3 className="h5 mb-4 flex items-center gap-2"><FileText size={18} /> Visit Notes</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, backgroundColor: 'var(--bg-body)', padding: '1rem', borderRadius: '8px' }}>
                {visit.notes}
              </p>
            </Card>
          ) : null}

          {visit.ai_output && (
            <Card style={{ border: visit.ai_output.risk_flag === 'high' ? '1px solid #EF4444' : undefined }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="h5 flex items-center gap-2">
                  <ShieldAlert size={18} color={visit.ai_output.risk_flag === 'high' ? '#EF4444' : visit.ai_output.risk_flag === 'medium' ? '#F59E0B' : '#10B981'} /> 
                  AI Analysis Output
                </h3>
                {visit.ai_output.risk_flag === 'high' && <Badge variant="danger">High Risk</Badge>}
                {visit.ai_output.risk_flag === 'medium' && <Badge variant="warning">Medium Risk</Badge>}
                {visit.ai_output.risk_flag === 'low' && <Badge variant="success">Low Risk</Badge>}
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-bold mb-1 text-muted">Summary</p>
                <p className="text-sm" style={{ lineHeight: 1.5 }}>{visit.ai_output.summary}</p>
              </div>
              
              <div className="mb-2">
                <p className="text-sm font-bold mb-1 text-muted">Recommended Follow-up</p>
                <div style={{ backgroundColor: 'var(--bg-body)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                  {visit.ai_output.follow_up}
                </div>
              </div>
              
              <div className="text-xs text-muted text-right mt-4">
                Generated: {new Date(visit.ai_output.generated_at).toLocaleString()}
              </div>
            </Card>
          )}

          {canPerformActions && visit.status === 'in_progress' && (
            <Card>
              <h3 className="h5 mb-4">Add Notes</h3>
              <VisitNotesForm onSubmit={handleNotesSubmit} loading={actionLoading} />
            </Card>
          )}

        </div>

        {/* Sidebar Status & Completion Action */}
        <div className="flex flex-col gap-6">
          <Card>
            <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-muted font-medium">Status</span>
              {getStatusBadge(visit.status)}
            </div>
            <div className="flex justify-between items-center pb-4" style={visit.status === 'in_progress' ? { borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' } : {}}>
              <span className="text-muted font-medium">Outcome</span>
              {getOutcomeBadge(visit.outcome)}
            </div>

            {/* Complete Visit Action */}
            {canPerformActions && visit.status === 'in_progress' && (
              <div className="mt-4 pt-4">
                <p className="text-sm font-medium mb-3">Mark Visit as Completed</p>
                <select 
                  className="form-select mb-3" 
                  value={completeOutcome}
                  onChange={e => setCompleteOutcome(e.target.value)}
                >
                  <option value="">-- Select Final Outcome --</option>
                  <option value="successful">Successful</option>
                  <option value="failed">Failed</option>
                  <option value="partial">Partial</option>
                </select>
                <Button 
                  className="w-full" 
                  variant="primary" 
                  onClick={handleComplete} 
                  disabled={actionLoading || !completeOutcome}
                >
                  {actionLoading ? 'Completing...' : 'Complete Visit'}
                </Button>
                <p className="text-xs text-muted mt-2 text-center">Note: You can add notes before completing.</p>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};
