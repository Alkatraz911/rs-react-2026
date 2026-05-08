import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error('ErrorBoundary caught:', error);
    }

    handleReset = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error">
                    <h2>Something went wrong</h2>

                    <p>
                        An unexpected error occurred in the application.
                        Try reloading the page or check your connection.
                    </p>

                    <button onClick={this.handleReset}>
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;