import { useAuth } from './useAuth';

export const usePermission = () => {
  const { user } = useAuth();

  const can = (module, action) => {
    if (!user || !user.permissions) return false;
    
    // Check if user has specific permission like "tasks.create"
    return user.permissions.includes(`${module}.${action}`);
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    const roleName = typeof user.role === 'object' ? user.role.name : user.role;
    return roles.includes(roleName);
  };

  return { can, hasRole };
};
