import { useRef, useState } from 'react';

const UploadPanel = ({ onSuccess, onError, loading, setLoading }) => {
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const processFile = async (file) => {
        if (!file) return;
        if (!file.name.endsWith('.csv')) { onError('Please upload a valid CSV file.'); return; }
        setLoading(true); onError(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Analysis failed'); }
            onSuccess(await res.json());
        } catch (err) { onError(err.message); }
        finally { setLoading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
    };

    const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); };

    return (
        <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
                background: dragOver ? '#f0fdfa' : 'white',
                border: `2px dashed ${dragOver ? '#14b8a6' : '#e2e8f0'}`,
                borderRadius: '20px',
                padding: '48px 32px',
                textAlign: 'center',
                transition: 'all 0.25s ease',
                boxShadow: dragOver ? '0 0 0 4px rgba(20,184,166,0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
                cursor: 'pointer',
            }}
            onClick={() => !loading && fileInputRef.current?.click()}
        >
            <input type="file" ref={fileInputRef} onChange={e => processFile(e.target.files[0])} className="hidden" accept=".csv" style={{ display: 'none' }} />

            {/* Icon */}
            <div style={{
                width: 72, height: 72, margin: '0 auto 20px',
                background: loading ? '#f0fdfa' : 'linear-gradient(135deg, #ccfbf1, #dbeafe)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(20,184,166,0.2)'
            }}>
                {loading ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 11-3.71-7.29" />
                    </svg>
                ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                )}
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                {loading ? 'Analyzing your data...' : 'Drop your CSV file here'}
            </h3>
            <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: '0.875rem' }}>
                {loading ? 'Running ML predictions, please wait...' : 'CSV must include all telecom feature columns (no Churn column)'}
            </p>

            <button disabled={loading} style={{
                padding: '11px 28px',
                background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
                color: loading ? '#94a3b8' : 'white',
                border: 'none', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(14,165,233,0.35)',
                transition: 'all 0.2s', fontFamily: 'inherit',
                transform: loading ? 'none' : 'translateY(0)',
            }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                {loading ? '⏳ Processing...' : '📂 Browse Files'}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default UploadPanel;
