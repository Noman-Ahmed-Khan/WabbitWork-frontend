import { Component } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import Button from './primitives/Button'

/**
 * Error boundary component
 * Catches errors in the component tree and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo)

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    // Log to external service (e.g., Sentry) in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    // Full page reload as fallback
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
          <div className="max-w-md w-full">
            <div className="bg-base-200 rounded-lg border-2 border-error/30 p-6 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-error/20 p-3 rounded-full">
                  <AlertTriangle size={32} className="text-error" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold mb-2">Something went wrong</h1>

              {/* Description */}
              <p className="text-sm text-base-content/70 mb-4">
                An unexpected error occurred. Please try reloading the page.
                {isDev && " The error details are shown in the browser console."}
              </p>

              {/* Error details (dev only) */}
              {isDev && this.state.error && (
                <details className="text-left mb-4 bg-base-300 p-3 rounded text-xs">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Error Details
                  </summary>
                  <pre className="overflow-auto max-h-40 whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              {/* Reload button */}
              <Button
                onClick={this.handleReload}
                variant="primary"
                size="sm"
                className="w-full"
              >
                <RefreshCw size={16} />
                Reload Page
              </Button>

              {/* Fallback text */}
              <p className="text-xs text-base-content/50 mt-4">
                If the problem persists, please contact support or try clearing your browser cache.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
