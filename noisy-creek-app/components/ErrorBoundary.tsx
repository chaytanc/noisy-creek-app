'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center p-4">
          <div className="bg-red-800/90 rounded-lg p-4 sm:p-8 max-w-md w-full mx-auto border-4 border-red-600">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 mb-4 pixel-text">
              Oops! Something went wrong
            </h2>
            <p className="text-white mb-4 text-sm sm:text-base">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-4 py-3 sm:px-6 sm:py-2 rounded font-semibold transition-colors w-full sm:w-auto min-h-[44px]"
            >
              Try Again
            </button>
            {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && (
              <details className="mt-4">
                <summary className="text-yellow-300 cursor-pointer text-sm">
                  Error Details
                </summary>
                <pre className="text-xs sm:text-sm text-white mt-2 overflow-auto max-h-32 bg-black/20 p-2 rounded">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}