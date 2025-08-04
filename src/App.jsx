import { Component } from 'react'
import MutationEngine from './core/MutationEngine'
import './App.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', backgroundColor: 'black', height: '100vh' }}>
          <h1>🔥 The Orphanarium encountered an error!</h1>
          <pre>{this.state.error?.toString()}</pre>
          <p>Check the browser console for details.</p>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className="orphanarium-app">
        <MutationEngine />
      </div>
    </ErrorBoundary>
  )
}

export default App
