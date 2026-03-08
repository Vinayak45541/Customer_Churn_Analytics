const DownloadReportButton = () => {
    const handleDownload = async () => {
        try {
            const res = await fetch('http://localhost:8000/download_report');
            if (!res.ok) throw new Error('Report not found. Run an analysis first.');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'churn_analysis_report.pdf';
            document.body.appendChild(a); a.click(); a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) { alert('Download failed: ' + err.message); }
    };

    return (
        <button onClick={handleDownload} style={{
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 4px 14px rgba(15,23,42,0.3)',
            transition: 'all 0.2s', fontFamily: 'inherit',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(15,23,42,0.3)'; }}
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
        </button>
    );
};

export default DownloadReportButton;
