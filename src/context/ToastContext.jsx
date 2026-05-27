import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// ── Internal container — renders all active toasts ──
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={containerStyle}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const colors = {
    success: { bg: '#D1FAE5', border: '#10B981', text: '#065F46', icon: '✓' },
    error:   { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', icon: '✕' },
    warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', icon: '⚠' },
    info:    { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF', icon: 'ℹ' },
  };

  const c = colors[toast.type] || colors.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: '280px',
        maxWidth: '400px',
        animation: 'slideIn 0.2s ease',
      }}
    >
      <span style={{ fontSize: '1rem', color: c.border, fontWeight: '700', flexShrink: 0 }}>
        {c.icon}
      </span>
      <p style={{ flex: 1, fontSize: '0.875rem', color: c.text, margin: 0, lineHeight: '1.4' }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.text,
          opacity: 0.6,
          fontSize: '1rem',
          padding: 0,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
};

const containerStyle = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  zIndex: 9999,
};
