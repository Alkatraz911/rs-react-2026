'use client';

import { Component } from 'react';
import type { ReactNode } from 'react';
import ErrorFallback from '@/components/ErrorFallback/ErrorFallback';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

// Catches client-side render errors anywhere in the app shell (including the
// navbar, which lives in the layout and is therefore outside `error.tsx`).
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
