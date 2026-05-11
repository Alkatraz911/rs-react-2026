import { Component } from 'react';

class ErrorMessage extends Component<{ message: string }> {
    render() {
        return <div data-testid="error-message">{this.props.message}</div>;
    }
}

export default ErrorMessage;