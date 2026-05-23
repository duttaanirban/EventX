import { Component } from 'react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Refresh the page or return home to continue.</p>
            <Button className="mt-5" onClick={() => (window.location.href = '/')}>
              Go home
            </Button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
