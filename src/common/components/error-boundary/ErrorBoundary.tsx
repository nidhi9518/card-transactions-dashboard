import { Component } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("Error has occurred [Errorboundary]:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive">
          <h2>Something went wrong.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}
