import { useState } from 'react';
import './App.css';
import UploadPanel from './components/UploadPanel';
import ChartsDashboard from './components/ChartsDashboard';
import SampleDataDropdown from './components/SampleDataDropdown';
import DownloadReportButton from './components/DownloadReportButton';

function App() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalyticsData(data);
    setError(null);
  };

  const handleError = (msg) => setError(msg);
  const handleReset = () => { setAnalyticsData(null); setError(null); };

  return (
    <div style={{ minHeight: '100vh', padding: '0' }}>
      {/* ─── Header ─── */}
      <header style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f4c75 100%)',
        padding: '28px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Icon */}
          <div style={{
            width: 46, height: 46,
            background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(20,184,166,0.4)'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
              Customer Churn Analytics
            </h1>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', fontWeight: 400, marginTop: 2 }}>
              ML-Powered Telecom Churn Prediction Platform
            </p>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px',
          padding: '5px 14px',
          fontSize: '0.72rem',
          color: '#7dd3fc',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          ● LIVE
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderLeft: '4px solid #ef4444',
            borderRadius: '10px', padding: '14px 18px',
            color: '#b91c1c', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 500
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </div>
        )}

        {!analyticsData ? (
          /* ─── Upload Screen ─── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, paddingTop: 24 }}>
            {/* Hero text */}
            <div style={{ textAlign: 'center', maxWidth: 560 }}>
              <h2 style={{
                fontSize: '2.2rem', fontWeight: 800, margin: '0 0 12px',
                background: 'linear-gradient(135deg, #0f172a, #0369a1)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Predict Churn Risk Instantly
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Upload your customer CSV dataset and get ML-powered churn risk scores, interactive charts, and a downloadable PDF report — in seconds.
              </p>
            </div>

            {/* Feature badges */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '🤖', label: 'XGBoost + Random Forest' },
                { icon: '📊', label: 'Real-time Charts' },
                { icon: '📄', label: 'PDF Report Download' },
              ].map(b => (
                <div key={b.label} style={{
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '20px', padding: '6px 14px',
                  fontSize: '0.8rem', color: '#475569', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}>
                  <span>{b.icon}</span>{b.label}
                </div>
              ))}
            </div>

            <div style={{ width: '100%', maxWidth: 600 }}>
              <UploadPanel onSuccess={handleAnalysisComplete} onError={handleError} setLoading={setLoading} loading={loading} />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 480 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
              <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.82rem' }}>OR TRY SAMPLE DATA</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }}></div>
            </div>

            <div style={{ width: '100%', maxWidth: 380 }}>
              <SampleDataDropdown onSuccess={handleAnalysisComplete} onError={handleError} setLoading={setLoading} loading={loading} />
            </div>
          </div>
        ) : (
          /* ─── Results Screen ─── */
          <div className="animate-fade-in-up">
            {/* Results header toolbar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 28,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #f1f5f9'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>
                  📊 Analysis Results
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                  Based on <strong>{analyticsData.total_customers}</strong> customer records
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleReset} style={{
                  padding: '9px 18px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', background: '#f8fafc',
                  color: '#475569', fontWeight: 600, fontSize: '0.85rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                >
                  ← New Analysis
                </button>
                <DownloadReportButton />
              </div>
            </div>

            <ChartsDashboard data={analyticsData} />
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
            Customer Churn Analytics Platform
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['FastAPI', 'XGBoost', 'React', 'Recharts'].map(tech => (
            <span key={tech} style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 500 }}>{tech}</span>
          ))}
        </div>
        <span style={{ color: '#334155', fontSize: '0.75rem' }}>© 2026</span>
      </footer>
    </div>
  );
}

export default App;
