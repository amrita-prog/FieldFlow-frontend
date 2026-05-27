import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  MapPin,
  BarChart2,
  FileText,
  Users,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';

// Role → allowed nav items mapping (from frontend_guide.md)
const NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    roles: ['Admin', 'Regional Manager', 'Team Lead', 'Field Agent', 'Auditor'],
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: CheckSquare,
    roles: ['Admin', 'Regional Manager', 'Team Lead', 'Field Agent'],
  },
  {
    name: 'Visits',
    path: '/visits',
    icon: MapPin,
    roles: ['Admin', 'Regional Manager', 'Team Lead', 'Field Agent'],
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: BarChart2,
    roles: ['Admin', 'Regional Manager', 'Team Lead', 'Auditor'],
  },
  {
    name: 'Logs',
    path: '/logs',
    icon: FileText,
    roles: ['Admin', 'Regional Manager', 'Team Lead', 'Auditor'],
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users,
    roles: ['Admin'],
  },
];

// Role badge colours
const ROLE_COLORS = {
  'Admin':            { bg: '#EDE9FE', text: '#5B21B6' },
  'Regional Manager': { bg: '#DBEAFE', text: '#1E40AF' },
  'Team Lead':        { bg: '#D1FAE5', text: '#065F46' },
  'Field Agent':      { bg: '#FEF3C7', text: '#92400E' },
  'Auditor':          { bg: '#FEE2E2', text: '#991B1B' },
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { hasRole, getRoleName } = usePermission();

  const roleName = getRoleName();
  const roleColor = ROLE_COLORS[roleName] || { bg: '#F3F4F6', text: '#374151' };

  // First letter of full name or username for avatar
  const avatarLetter = (user?.full_name || user?.username || '?').charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <Zap size={18} color="#fff" />
        </div>
        <h2 style={styles.logoText}>FieldFlow</h2>
      </div>

      {/* Role Badge */}
      <div style={{ padding: '0 1.25rem 1rem' }}>
        <span
          style={{
            ...styles.roleBadge,
            backgroundColor: roleColor.bg,
            color: roleColor.text,
          }}
        >
          {roleName || 'Loading...'}
        </span>
      </div>

      {/* Nav Links */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          if (!hasRole(item.roles)) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              })}
            >
              <Icon size={18} strokeWidth={isActive => isActive ? 2.5 : 1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer — User info + Logout */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{avatarLetter}</div>
          <div style={styles.userDetails}>
            <span style={styles.userName}>
              {user?.full_name || user?.username || 'User'}
            </span>
            <span style={styles.userEmail}>{user?.email || ''}</span>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    background: 'linear-gradient(180deg, #2D1B69 0%, #1E1B4B 100%)',
    color: '#fff',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '1.5rem 1.25rem 1rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--primary)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.625rem',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  nav: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.15s ease',
    marginLeft: '-3px',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
  },
  userName: {
    fontSize: '0.8125rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#fff',
  },
  userEmail: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.5)',
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
    padding: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontWeight: '500',
    transition: 'all 0.15s ease',
  },
};
