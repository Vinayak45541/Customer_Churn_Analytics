import { useState, useRef, useEffect } from 'react';

const SAMPLES = [
    { name: 'Sample Data 1', file: 'sample_data_1.csv' },
    { name: 'Sample Data 2', file: 'sample_data_2.csv' },
    { name: 'Sample Data 3', file: 'sample_data_3.csv' },
    { name: 'Sample Data 4', file: 'sample_data_4.csv' },
    { name: 'Sample Data 5', file: 'sample_data_5.csv' },
];

/* ── CSV Preview Modal ─────────────────────────────── */
const CsvModal = ({ file, onClose }) => {
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/sample_data/${file}`)
            .then(r => r.text())
            .then(text => {
                const lines = text.trim().split('\n');
                setHeaders(lines[0].split(','));
                setRows(lines.slice(1, 11).map(l => l.split(',')));
                setLoading(false);
            });
    }, [file]);

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(3px)'
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: 'white', borderRadius: '18px',
                maxWidth: '92vw', maxHeight: '80vh',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                {/* Modal header */}
                <div style={{
                    padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                            📄 {file}
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                            Showing first 10 rows
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        width: 32, height: 32, border: 'none', background: '#f1f5f9',
                        borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'
                    }}>✕</button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
                    ) : (
                        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.75rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                                    {headers.map((h, i) => (
                                        <th key={i} style={{
                                            padding: '10px 12px', textAlign: 'left', whiteSpace: 'nowrap',
                                            fontWeight: 700, color: '#374151', borderBottom: '2px solid #e2e8f0'
                                        }}>{h.replace(/"/g, '')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, ri) => (
                                    <tr key={ri} style={{ borderBottom: '1px solid #f3f4f6', background: ri % 2 === 0 ? 'white' : '#fafafa' }}>
                                        {row.map((cell, ci) => (
                                            <td key={ci} style={{ padding: '8px 12px', whiteSpace: 'nowrap', color: '#4b5563' }}>
                                                {cell.replace(/"/g, '')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Main Dropdown ─────────────────────────────────── */
const SampleDataDropdown = ({ onSuccess, onError, loading, setLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = async (filename) => {
        setIsOpen(false); setLoading(true); onError(null);
        try {
            const resFile = await fetch(`http://localhost:8000/sample_data/${filename}`);
            if (!resFile.ok) throw new Error('Failed to load sample data');
            const blob = await resFile.blob();
            const file = new File([blob], filename, { type: 'text/csv' });
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('http://localhost:8000/analyze', { method: 'POST', body: formData });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Analysis failed'); }
            onSuccess({ data: await res.json(), fileName: filename });
        } catch (err) { onError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <>
            {previewFile && <CsvModal file={previewFile} onClose={() => setPreviewFile(null)} />}

            <div ref={ref} style={{ position: 'relative', width: '100%' }}>
                <button
                    disabled={loading}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%', padding: '13px 20px', background: 'white',
                        border: `1.5px solid ${isOpen ? '#6366f1' : '#e2e8f0'}`,
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: isOpen ? '0 0 0 3px rgba(99,102,241,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s', fontFamily: 'inherit', opacity: loading ? 0.6 : 1,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            </svg>
                        </div>
                        <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Try Sample Data</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {isOpen && (
                    <div style={{
                        position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0,
                        background: 'white', border: '1px solid #e2e8f0',
                        borderRadius: '14px', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
                        overflow: 'hidden', zIndex: 50,
                    }}>
                        {SAMPLES.map((s, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center',
                                borderBottom: i < SAMPLES.length - 1 ? '1px solid #f3f4f6' : 'none',
                            }}>
                                {/* Analyze button */}
                                <button onClick={() => handleSelect(s.file)} style={{
                                    flex: 1, padding: '13px 18px', background: 'transparent',
                                    border: 'none', textAlign: 'left', fontFamily: 'inherit',
                                    cursor: 'pointer', fontWeight: 600, color: '#374151', fontSize: '0.875rem',
                                    transition: 'background 0.15s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8f7ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {s.name}
                                </button>

                                {/* View button */}
                                <button onClick={(e) => { e.stopPropagation(); setPreviewFile(s.file); setIsOpen(false); }} style={{
                                    padding: '6px 12px', margin: '0 10px',
                                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                                    borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '0.72rem', fontWeight: 600, color: '#475569',
                                    fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ff'; e.currentTarget.style.color = '#4338ca'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                                >
                                    👁 View
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SampleDataDropdown;
