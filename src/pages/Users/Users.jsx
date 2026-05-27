import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { getUsers, createUser, updateUser, deactivateUser } from '../../api/users';

export const Users = () => {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingUserId, setEditingUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role_id: '',
    region_id: '',
    team_id: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers({ page, role: roleFilter || undefined });
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      if (err.code === 'PERMISSION_DENIED') {
        showToast('You do not have access to User Management.', 'error');
      } else {
        showToast(err.message || 'Failed to load users', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      username: '', email: '', password: '', first_name: '', last_name: '', role_id: '', region_id: '', team_id: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setModalMode('edit');
    setEditingUserId(u.id);
    
    // We map role name back to role_id roughly, or just use what we have if backend provides it
    // The API docs say role_id is 1=Admin, 2=RM, 3=TL, 4=Field Agent, 5=Auditor
    let roleId = '';
    const rName = u.role_name || (u.role?.name);
    if (rName === 'Admin') roleId = '1';
    if (rName === 'Regional Manager') roleId = '2';
    if (rName === 'Team Lead') roleId = '3';
    if (rName === 'Field Agent') roleId = '4';
    if (rName === 'Auditor') roleId = '5';

    setFormData({
      username: u.username || '',
      email: u.email || '',
      password: '', // blank for edit
      first_name: u.first_name || u.full_name?.split(' ')[0] || '',
      last_name: u.last_name || u.full_name?.split(' ')[1] || '',
      role_id: roleId,
      region_id: '', // Would need full user object to pre-fill reliably, keeping empty for simplicity
      team_id: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setFormErrors({});
    
    const payload = { ...formData };
    if (!payload.region_id) delete payload.region_id;
    if (!payload.team_id) delete payload.team_id;
    
    try {
      if (modalMode === 'create') {
        if (!payload.role_id) {
           setFormErrors({ role_id: ['Role is required'] });
           setActionLoading(false);
           return;
        }
        await createUser({ ...payload, role_id: parseInt(payload.role_id, 10) });
        showToast('User created successfully', 'success');
      } else {
        delete payload.password; // Don't send empty password
        delete payload.username; // Usually username is read-only on edit
        delete payload.email; // Usually email is read-only on edit
        if (payload.role_id) payload.role_id = parseInt(payload.role_id, 10);
        else delete payload.role_id;

        await updateUser(editingUserId, payload);
        showToast('User updated successfully', 'success');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      if (err.details) {
        setFormErrors(err.details);
      }
      showToast(err.message || 'Failed to save user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async (u) => {
    if (u.email === currentUser?.email) {
      return showToast("You cannot deactivate your own account.", "error");
    }
    
    if (!window.confirm(`Are you sure you want to deactivate ${u.full_name}?`)) return;
    
    try {
      await deactivateUser(u.id);
      showToast('User deactivated successfully', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to deactivate user', 'error');
    }
  };

  return (
    <div className="page-container relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">User Management</h1>
        <Button onClick={openCreateModal}>
          <Plus size={18} /> Create User
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4 items-center">
          <select 
            className="form-select" 
            style={{ width: '200px' }}
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Regional Manager">Regional Manager</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Field Agent">Field Agent</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>
      </Card>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Region / Team</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={{ opacity: u.is_active === false ? 0.6 : 1 }}>
                  <td>
                    <div className="font-medium">{u.full_name}</div>
                    <div className="text-xs text-muted">{u.email}</div>
                  </td>
                  <td><Badge variant="info">{u.role_name || u.role?.name}</Badge></td>
                  <td>
                    <div className="text-sm">{u.region_name || u.region?.name || 'All'}</div>
                    <div className="text-xs text-muted">{u.team_name || u.team?.name || '-'}</div>
                  </td>
                  <td>
                    <Badge variant={u.is_active !== false ? 'success' : 'danger'}>
                      {u.is_active !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => openEditModal(u)} style={{ padding: '0.25rem 0.5rem' }}>
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" onClick={() => handleDeactivate(u)} style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {!loading && totalCount > 0 && (
          <Pagination 
            count={totalCount} 
            page={page} 
            pageSize={20} 
            onPageChange={(p) => setPage(p)} 
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="h3 mb-6">{modalMode === 'create' ? 'Create New User' : 'Edit User'}</h2>
            
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" name="first_name" className="form-input" required value={formData.first_name} onChange={handleFormChange} />
                  {formErrors.first_name && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.first_name.join(', ')}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" name="last_name" className="form-input" required value={formData.last_name} onChange={handleFormChange} />
                  {formErrors.last_name && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.last_name.join(', ')}</div>}
                </div>
              </div>

              {modalMode === 'create' && (
                <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input type="text" name="username" className="form-input" required value={formData.username} onChange={handleFormChange} />
                    {formErrors.username && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.username.join(', ')}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleFormChange} />
                    {formErrors.email && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.email.join(', ')}</div>}
                  </div>
                </div>
              )}

              {modalMode === 'create' && (
                <div className="form-group mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleFormChange} />
                  {formErrors.password && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.password.join(', ')}</div>}
                </div>
              )}

              <div className="form-group mb-4">
                <label className="form-label">Role</label>
                <select name="role_id" className="form-select" value={formData.role_id} onChange={handleFormChange} required>
                  <option value="">-- Select Role --</option>
                  <option value="1">Admin</option>
                  <option value="2">Regional Manager</option>
                  <option value="3">Team Lead</option>
                  <option value="4">Field Agent</option>
                  <option value="5">Auditor</option>
                </select>
                {formErrors.role_id && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.role_id.join(', ')}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Region ID (Optional)</label>
                  <input type="text" name="region_id" className="form-input" placeholder="UUID" value={formData.region_id} onChange={handleFormChange} />
                  {formErrors.region_id && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.region_id.join(', ')}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Team ID (Optional)</label>
                  <input type="text" name="team_id" className="form-input" placeholder="UUID" value={formData.team_id} onChange={handleFormChange} />
                  {formErrors.team_id && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{formErrors.team_id.join(', ')}</div>}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
