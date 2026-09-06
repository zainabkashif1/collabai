import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * React error boundaries have to be class components — there's no hook
 * equivalent (as of React 19, getDerivedStateFromError/componentDidCatch
 * still require a class). This is the one place in the app that isn't
 * a function component, and it's the standard, expected exception.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled error caught by ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
          <h1 className="font-display text-xl font-semibold">Something went wrong</h1>
          <p className="text-ink/60 text-sm max-w-sm">
            Please refresh the page. If this keeps happening, that's a bug worth reporting.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-signal text-white px-4 py-2 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
