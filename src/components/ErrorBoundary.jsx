import { Component } from 'react'
import Button from './primitives/Button'

/**
 * Error boundary component - Brutalist Editorial Design
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
    console.error('Error caught by boundary:', error, errorInfo)

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#9C9C9C] p-4">
          <div className="max-w-md w-full">
            <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-tertiary/10 p-4 rounded-full">
                  <span className="material-symbols-outlined text-4xl text-tertiary">warning</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-headline font-black text-2xl uppercase tracking-tighter mb-3">
                Something Broke
              </h1>

              {/* Description */}
              <p className="text-sm text-on-surface-variant mb-6 font-body leading-relaxed">
                An unexpected error occurred. Please try reloading the page.
                {isDev && " The error details are shown in the browser console."}
              </p>

              {/* Error details (dev only) */}
              {isDev && this.state.error && (
                <details className="text-left mb-6 bg-surface-container-highest p-4 rounded-lg text-xs">
                  <summary className="cursor-pointer font-headline font-bold uppercase tracking-widest text-[10px] mb-2">
                    Error Details
                  </summary>
                  <pre className="overflow-auto max-h-40 whitespace-pre-wrap break-words font-mono text-on-surface-variant">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              {/* Reload button */}
              <button
                onClick={this.handleReload}
                className="w-full bg-on-tertiary-fixed text-white py-4 font-headline font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Reload Page
              </button>

              {/* Fallback text */}
              <p className="text-[10px] text-on-surface-variant/50 mt-6 uppercase tracking-widest font-bold">
                If the problem persists, contact support or clear cache.
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
