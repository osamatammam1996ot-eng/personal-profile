"use client";
import React, { ReactNode, ErrorInfo } from 'react';
import { translations } from '../../translations';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the children after an error. Pass null to drop a failed section quietly. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Details stay in the console; visitors never see a stack trace
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    // Sits above LanguageProvider, so read the language it last set on <html>
    const t = translations[document.documentElement.lang === 'ar' ? 'ar' : 'en'].errorBoundary;

    return (
      <div className="dark min-h-screen flex flex-col items-center justify-center gap-5 p-8 bg-surface text-center">
        <h1 className="m-0 font-heading font-bold text-2xl text-text-primary">{t.title}</h1>
        <p className="m-0 max-w-sm text-text-muted">{t.body}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl border-none cursor-pointer font-semibold bg-brand text-on-brand"
        >
          {t.reload}
        </button>
      </div>
    );
  }
}
