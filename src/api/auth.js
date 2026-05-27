import api from './axios';

export const login = async (email, password) => {
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a mock user based on the email
  let role = 'Field Agent';
  let permissions = ['tasks.read', 'visits.read', 'visits.update'];
  
  if (email.includes('admin')) {
    role = 'Admin';
    permissions = ['tasks.create', 'tasks.read', 'tasks.update', 'tasks.delete', 'visits.create', 'visits.read', 'visits.update', 'visits.delete'];
  } else if (email.includes('manager')) {
    role = 'Regional Manager';
    permissions = ['tasks.create', 'tasks.read', 'tasks.update', 'visits.read', 'visits.update'];
  } else if (email.includes('lead')) {
    role = 'Team Lead';
    permissions = ['tasks.create', 'tasks.read', 'tasks.update', 'visits.read', 'visits.update'];
  } else if (email.includes('auditor')) {
    role = 'Auditor';
    permissions = ['tasks.read', 'visits.read', 'reports.read', 'logs.read'];
  }
  
  return {
    access: 'mock-access-token-12345',
    refresh: 'mock-refresh-token-67890',
    user: {
      id: 1,
      username: email.split('@')[0],
      email: email,
      role: role,
      permissions: permissions
    }
  };
};

export const logout = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};
