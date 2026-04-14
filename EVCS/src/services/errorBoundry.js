import React from "react";

class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error };
  }

  state = {
    error: null,
  };

  componentDidMount() {
    window.onerror = this.logError;
  }

  componentDidCatch(error, info) {
    this.logError(error);
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return "System is updating. Please refresh the page.";
    }

    return this.props.children;
  }

  logError(args) {
    console.log(args);
  }
}

export default ErrorBoundary;
