import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { 
    hasError: false,
    error: null 
  };

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // You can log errors to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;