import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const Users = () => {
  const users = [
    { id: 1, username: 'admin_dave', email: 'dave@fieldflow.com', role: 'Admin', region: 'All', team: 'All', is_active: true },
    { id: 2, username: 'alice_smith', email: 'alice@fieldflow.com', role: 'Field Agent', region: 'North', team: 'Alpha', is_active: true },
  ];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2">User Management</h1>
        <Button>
          <Plus size={18} /> Create User
        </Button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Username</th><th>Email</th><th>Role</th><th>Region</th><th>Team</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="font-medium">{u.username}</td>
                <td>{u.email}</td>
                <td><Badge variant="info">{u.role}</Badge></td>
                <td>{u.region}</td>
                <td>{u.team}</td>
                <td>
                  <Badge variant={u.is_active ? 'success' : 'danger'}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <Button variant="secondary" className="mr-2 text-xs">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
