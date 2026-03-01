import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unknown runtime error',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-5">
        <div className="max-w-[520px] w-full rounded-2xl border border-red-200 bg-white p-5">
          <h1 className="text-lg font-semibold text-red-700">Runtime Error</h1>
          <p className="text-sm text-gray-700 mt-2">
            The app hit an error and could not render this screen.
          </p>
          <pre className="mt-3 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-700 whitespace-pre-wrap break-words">
            {this.state.message}
          </pre>
          <button
            onClick={() => window.location.assign('/welcome')}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
          >
            Go to Welcome
          </button>
        </div>
      </div>
    );
  }
}
