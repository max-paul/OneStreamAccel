import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '3rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'monospace' }}>
          <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>
            ⚠ Application Error
          </div>
          <div style={{ color: '#f0f2f5', fontSize: '13px', marginBottom: '0.75rem' }}>
            {this.state.error.message}
          </div>
          <pre style={{
            background: '#1e2026', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '1rem', fontSize: '11px',
            color: '#9ba3b0', overflow: 'auto', whiteSpace: 'pre-wrap',
          }}>
            {this.state.error.stack}
          </pre>
          <button
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
