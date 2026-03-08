import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

const RISK_COLORS = {
    'Very High': '#ef4444',
    'High': '#f97316',
    'Medium': '#f59e0b',
    'Low': '#3b82f6',
    'Very Low': '#22c55e',
};

/* ── Stat card ───────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, color }) => (
    <div style={{
        background: 'white', borderRadius: '16px', padding: '22px 24px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s, box-shadow 0.2s',
    }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
    >
        <div style={{
            width: 52, height: 52, borderRadius: '14px', background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
        }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
            {sub && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
        </div>
    </div>
);

/* ── Tooltip ─────────────────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
            padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{payload[0].name || payload[0].payload?.field}</p>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>{payload[0].value}{payload[0].unit}</p>
        </div>
    );
};

/* ── Custom label inside pie slice ──────────────── */
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.45;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (value === 0) return null;
    return (
        <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={600}>
            {name} ({percentage}%)
        </text>
    );
};

/* ── Bar chart custom label ──────────────────────── */
const BarValueLabel = (props) => {
    const { x, y, width, height, value } = props;
    return (
        <text x={x + width + 6} y={y + height / 2} fill="#374151" fontSize={11} fontWeight={600} dominantBaseline="central">
            {value}%
        </text>
    );
};

/* ── Chart card wrapper ─────────────────────────── */
const Card = ({ children, title }) => (
    <div style={{
        background: 'white', borderRadius: '18px', padding: '24px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
    }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
        {children}
    </div>
);

/* ── Main dashboard ──────────────────────────────── */
const ChartsDashboard = ({ data }) => {
    if (!data?.risk_distribution) return null;

    const pieData = Object.entries(data.risk_distribution)
        .map(([k, v]) => ({ name: k, value: v.count, percentage: v.percentage }))
        .filter(d => d.value > 0);

    const fieldData = (data.field_churn || []);

    const highRisk = pieData
        .filter(d => ['Very High', 'High'].includes(d.name))
        .reduce((s, d) => s + d.value, 0);
    const highPct = ((highRisk / data.total_customers) * 100).toFixed(1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <StatCard icon="👥" label="Total Analyzed" value={data.total_customers.toLocaleString()} color="#6366f1" />
                <StatCard icon="🔴" label="High Risk" value={highRisk.toLocaleString()} sub={`${highPct}% of total`} color="#ef4444" />
                <StatCard icon="✅" label="Safe Customers" value={(data.total_customers - highRisk).toLocaleString()} sub={`${(100 - parseFloat(highPct)).toFixed(1)}% of total`} color="#22c55e" />
                <StatCard icon="📊" label="Risk Categories" value="5" sub="Very Low → Very High" color="#f59e0b" />
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>

                {/* PIE — risk level distribution (count + %) */}
                <Card title="🍩 Churn Risk Distribution">
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData} cx="50%" cy="50%"
                                    innerRadius={70} outerRadius={110}
                                    paddingAngle={4} dataKey="value"
                                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                    label={<PieLabel />}
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={RISK_COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} formatter={v => [`${v} customers`]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Mini legend below pie */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8 }}>
                        {pieData.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: RISK_COLORS[d.name], flexShrink: 0 }} />
                                <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 500 }}>
                                    {d.name}: <strong>{d.value}</strong>
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* BAR — churn risk level per service field */}
                <Card title="📌 Churn Risk Level by Service Field">
                    {fieldData.length === 0 ? (
                        <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: 60, fontSize: '0.875rem' }}>
                            No field data available
                        </div>
                    ) : (
                        <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={fieldData} layout="vertical"
                                    margin={{ top: 0, right: 90, left: 10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" domain={[0, 5]} hide />
                                    <YAxis
                                        dataKey="field" type="category" width={150}
                                        tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                                        axisLine={false} tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        formatter={(_, __, props) => [props.payload.risk_level, 'Churn Risk']}
                                    />
                                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                                        {fieldData.map((entry, i) => (
                                            <Cell key={i} fill={RISK_COLORS[entry.risk_level]} />
                                        ))}
                                        <LabelList
                                            dataKey="risk_level"
                                            position="right"
                                            style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    <p style={{ margin: '12px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        Average churn risk level for customers with each churn-associated service attribute
                    </p>
                </Card>


            </div>
        </div>
    );
};

export default ChartsDashboard;
