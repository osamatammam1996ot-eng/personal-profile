"use client";
import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dark p-8 min-h-screen bg-surface text-text-primary font-mono text-xs">
          <h1 className="mt-0 text-danger">Application Error</h1>
          <p className="text-warning">{this.state.error?.message}</p>
          <pre className="p-4 rounded-lg overflow-auto text-[11px] bg-scrim/40">
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded border-none cursor-pointer bg-brand text-on-brand"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
