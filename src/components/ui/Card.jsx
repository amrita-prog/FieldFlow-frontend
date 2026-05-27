import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, children, className = '' }) => {
  return (
    <div className={`card-header flex justify-between items-center ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};
