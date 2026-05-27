import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  MapPin, 
  BarChart2, 
  FileText, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { hasRole } = usePermission();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['Admin', 'Regional Manager', 'Team Lead', 'Field Agent', 'Auditor'] },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, roles: ['Admin', 'Regional Manager', 'Team Lead', 'Field Agent'] },
    { name: 'Visits', path: '/visits', icon: MapPin, roles: ['Admin', 'Regional Manager', 'Team Lead', 'Field Agent'] },
    { name: 'Reports', path: '/reports', icon: BarChart2, roles: ['Admin', 'Regional Manager', 'Team Lead', 'Auditor'] },
    { name: 'Logs', path: '/logs', icon: FileText, roles: ['Admin', 'Regional Manager', 'Team Lead', 'Auditor'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['Admin'] },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <h2 style={styles.logoText}>FieldFlow</h2>
        <span className="badge badge-info mt-2">{user?.role}</span>
      </div>
      
      <nav style={styles.nav}>
        {navItems.map((item) => {
          if (!hasRole(item.roles)) return null;
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.name} 
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-inverse)',
                opacity: isActive ? 1 : 0.7,
              })}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
          <div style={styles.userDetails}>
            <span style={styles.userName}>{user?.username}</span>
            <span style={styles.userEmail}>{user?.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-sidebar)',
    color: 'var(--text-inverse)',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  logoContainer: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--border-radius-sm)',
    textDecoration: 'none',
    transition: 'all var(--transition-speed) ease',
    fontWeight: '500',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.75rem',
    opacity: 0.7,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.625rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 'var(--border-radius-sm)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color var(--transition-speed) ease',
  }
};
