import { useAuth } from './useAuth';

/**
 * usePermission — checks the real permissions array from the API.
 *
 * Real API permissions shape (from /auth/login/ and /auth/me/):
 * [
 *   { module: "tasks", can_create: true, can_read: true, can_update: true, can_delete: false, scope: "team" },
 *   { module: "visits", can_create: false, can_read: true, ... },
 * ]
 *
 * Usage:
 *   const { can, hasRole } = usePermission();
 *   can('tasks', 'create')        → true/false
 *   can('visits', 'delete')       → true/false
 *   hasRole(['Admin', 'Team Lead']) → true/false
 */
export const usePermission = () => {
  const { user } = useAuth();

  /**
   * can(module, action)
   * action: 'create' | 'read' | 'update' | 'delete'
   */
  const can = (module, action) => {
    if (!user || !Array.isArray(user.permissions)) return false;

    const perm = user.permissions.find((p) => p.module === module);
    if (!perm) return false;

    const actionMap = {
      create: 'can_create',
      read:   'can_read',
      update: 'can_update',
      delete: 'can_delete',
    };

    const key = actionMap[action];
    return key ? perm[key] === true : false;
  };

  /**
   * hasRole(roles)
   * roles: string[] — e.g. ['Admin', 'Team Lead']
   * Reads from user.role.name (nested object from API)
   */
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    // role is always a nested object from the real API: { id, name, description }
    const roleName = typeof user.role === 'object' ? user.role.name : user.role;
    return roles.includes(roleName);
  };

  /**
   * getRoleName()
   * Returns the role name as a plain string regardless of shape
   */
  const getRoleName = () => {
    if (!user || !user.role) return '';
    return typeof user.role === 'object' ? user.role.name : user.role;
  };

  return { can, hasRole, getRoleName };
};
