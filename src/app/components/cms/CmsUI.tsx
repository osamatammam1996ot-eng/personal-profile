import React from 'react';

// Theme colors and UI components
export const C = {
  // Colors
  bg: '#0f0f12',
  sidebar: '#1a1a1e',
  border: '#2a2a2f',
  borderAccent: '#6366f1',
  text: '#ffffff',
  textMuted: '#a0a0a8',
  textSub: '#808086',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  accent: '#6366f1',
  accentMuted: 'rgba(99, 102, 241, 0.1)',
  accentHover: '#a5b4fc',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  dangerMuted: 'rgba(239, 68, 68, 0.1)',
  
  // UI Components
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`border rounded-lg p-4 ${className || ''}`}>{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className || ''}>{children}</div>
  ),
  Button: ({ 
    children, 
    onClick, 
    className, 
    variant = 'default' 
  }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    className?: string;
    variant?: string;
  }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded border ${variant === 'outline' ? 'border-gray-300' : 'bg-blue-500 text-white'} ${className || ''}`}
    >
      {children}
    </button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded ${props.className || ''}`}
    />
  ),
  Label: ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium ${className || ''}`}>
      {children}
    </label>
  ),
};
