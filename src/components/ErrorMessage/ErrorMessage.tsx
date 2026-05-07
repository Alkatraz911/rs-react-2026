import { Component } from 'react';

class ErrorMessage extends Component<{ message: string }> {
    render() {
        return <div>{this.props.message}</div>;
    }
}

export default ErrorMessage;