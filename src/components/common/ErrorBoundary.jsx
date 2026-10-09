import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.hash = '#home';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d131a',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Alexandria', sans-serif"
        }} dir="rtl">
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#16202c',
            border: '1px solid #334155',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎢</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffd15c', marginBottom: '8px' }}>
              عذراً، حدث خطأ غير متوقع
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>
              نعتذر عن هذا الخطأ المؤقت. يمكنك الضغط على الزر أدناه للعودة للصفحة الرئيسية واستئناف التصفح بأمان.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#0c6177',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 28px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(12,97,119,0.4)'
              }}
            >
              العودة للصفحة الرئيسية 🏠
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
