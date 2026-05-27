/**
 * KPI Analytics Page
 * Charts and statistics for selected period
 */

import { useState, useCallback, useEffect } from 'react';
import {
    MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody,
    MDBCardTitle, MDBBtn, MDBSpinner, MDBBadge, MDBIcon,
} from 'mdb-react-ui-kit';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getKpiStats, KpiStats } from '../../services/kpiService';

// ─── helpers ───────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().slice(0, 10);
const janFirst = () => `${new Date().getFullYear()}-01-01`;

const fmt = (n: number | null, unit = '') =>
    n === null ? '—' : `${n.toLocaleString('pl-PL', { maximumFractionDigits: 1 })}${unit ? ' ' + unit : ''}`;

const STATUS_COLORS: Record<string, string> = {
    open:       '#0dcaf0',
    inProgress: '#ffc107',
    completed:  '#198754',
    onHold:     '#6f42c1',
    cancelled:  '#dc3545',
    overdue:    '#fd7e14',
};

const PRIORITY_COLORS: Record<string, string> = {
    critical: '#dc3545',
    high:     '#fd7e14',
    medium:   '#ffc107',
    low:      '#20c997',
};

const MONTH_NAMES: Record<string, string> = {
    '01': 'Sty', '02': 'Lut', '03': 'Mar', '04': 'Kwi',
    '05': 'Maj', '06': 'Cze', '07': 'Lip', '08': 'Sie',
    '09': 'Wrz', '10': 'Paź', '11': 'Lis', '12': 'Gru',
};

const formatMonth = (ym: string) => {
    const [year, month] = ym.split('-');
    return `${MONTH_NAMES[month] ?? month} ${year}`;
};

// ─── sub-components ────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    color: string;
    sub?: string;
}

const StatCard = ({ label, value, icon, color, sub }: StatCardProps) => (
    <MDBCard className="h-100 shadow-sm">
        <MDBCardBody className="d-flex align-items-center gap-3">
            <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 52, height: 52, backgroundColor: color + '22' }}
            >
                <MDBIcon fas icon={icon} style={{ color, fontSize: '1.25rem' }} />
            </div>
            <div>
                <div className="text-muted small mb-1">{label}</div>
                <div className="fw-bold fs-4 lh-1">{value}</div>
                {sub && <div className="text-muted" style={{ fontSize: '0.72rem' }}>{sub}</div>}
            </div>
        </MDBCardBody>
    </MDBCard>
);

// ─── main component ────────────────────────────────────────────────────────

export const KpiPage = () => {
    const [dateFrom, setDateFrom] = useState(janFirst());
    const [dateTo,   setDateTo]   = useState(today());
    const [data,     setData]     = useState<KpiStats | null>(null);
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getKpiStats(dateFrom, dateTo);
            setData(result);
        } catch {
            setError('Nie udało się załadować danych KPI.');
        } finally {
            setLoading(false);
        }
    }, [dateFrom, dateTo]);

    useEffect(() => { load(); }, [load]);

    // ── derived chart data ──────────────────────────────────────────────

    const statusPieData = data
        ? [
            { name: 'Otwarte',      value: data.workOrders.open,       color: STATUS_COLORS.open },
            { name: 'W trakcie',    value: data.workOrders.inProgress,  color: STATUS_COLORS.inProgress },
            { name: 'Zakończone',   value: data.workOrders.completed,   color: STATUS_COLORS.completed },
            { name: 'Wstrzymane',   value: data.workOrders.onHold,      color: STATUS_COLORS.onHold },
            { name: 'Anulowane',    value: data.workOrders.cancelled,   color: STATUS_COLORS.cancelled },
        ].filter(d => d.value > 0)
        : [];

    const priorityData = data
        ? [
            { name: 'Krytyczny', value: data.workOrders.byPriority.critical, fill: PRIORITY_COLORS.critical },
            { name: 'Wysoki',    value: data.workOrders.byPriority.high,     fill: PRIORITY_COLORS.high },
            { name: 'Średni',    value: data.workOrders.byPriority.medium,   fill: PRIORITY_COLORS.medium },
            { name: 'Niski',     value: data.workOrders.byPriority.low,      fill: PRIORITY_COLORS.low },
        ]
        : [];

    const trendData = data?.trend.map(t => ({
        ...t,
        label: formatMonth(t.month),
    })) ?? [];

    const topEquipmentData = data?.topEquipment ?? [];

    // ── render ──────────────────────────────────────────────────────────

    return (
        <MDBContainer fluid className="p-4">

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="mb-0 fw-bold">
                        <MDBIcon fas icon="chart-bar" className="me-2 text-primary" />
                        KPI &amp; Analityka
                    </h2>
                    {data && (
                        <small className="text-muted">
                            Dane za okres: {data.period.from} – {data.period.to}
                        </small>
                    )}
                </div>

                {/* Date range + refresh */}
                <div className="d-flex flex-wrap align-items-end gap-2">
                    <div>
                        <label className="form-label small mb-1 text-muted">Od</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="form-label small mb-1 text-muted">Do</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                        />
                    </div>
                    <MDBBtn size="sm" onClick={load} disabled={loading}>
                        {loading
                            ? <MDBSpinner size="sm" role="status" tag="span" className="me-1" />
                            : <MDBIcon fas icon="sync-alt" className="me-1" />
                        }
                        Odśwież
                    </MDBBtn>
                </div>
            </div>

            {/* ── Error ─────────────────────────────────────────────── */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <MDBIcon fas icon="exclamation-triangle" />
                    {error}
                </div>
            )}

            {/* ── Loading skeleton ──────────────────────────────────── */}
            {loading && !data && (
                <div className="text-center py-5">
                    <MDBSpinner grow color="primary" />
                    <div className="mt-2 text-muted">Ładowanie danych…</div>
                </div>
            )}

            {data && (
                <>
                    {/* ── KPI metric cards ──────────────────────────── */}
                    <MDBRow className="g-3 mb-4">
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="Wszystkich zgłoszeń"
                                value={data.workOrders.total}
                                icon="clipboard-list"
                                color="#0d6efd"
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="Zakończone"
                                value={data.workOrders.completed}
                                icon="check-circle"
                                color="#198754"
                                sub={`${data.workOrders.completionRate}% skuteczność`}
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="W trakcie"
                                value={data.workOrders.inProgress}
                                icon="tools"
                                color="#ffc107"
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="Zaległe"
                                value={data.workOrders.overdue}
                                icon="exclamation-circle"
                                color="#dc3545"
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="MTTR"
                                value={fmt(data.kpi.mttr, 'h')}
                                icon="stopwatch"
                                color="#6f42c1"
                                sub="Śr. czas naprawy"
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="MTBF"
                                value={fmt(data.kpi.mtbf, 'h')}
                                icon="history"
                                color="#20c997"
                                sub="Śr. czas między awariami"
                            />
                        </MDBCol>
                    </MDBRow>

                    {/* ── Row 2: Trend + Status pie ─────────────────── */}
                    <MDBRow className="g-3 mb-4">
                        <MDBCol lg="8">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="chart-line" className="me-2 text-primary" />
                                        Trend zgłoszeń (miesięcznie)
                                    </MDBCardTitle>
                                    {trendData.length === 0 ? (
                                        <div className="text-muted text-center py-4">Brak danych dla wybranego okresu.</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="created"
                                                    name="Utworzone"
                                                    stroke="#0d6efd"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="completed"
                                                    name="Zakończone"
                                                    stroke="#198754"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        <MDBCol lg="4">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="chart-pie" className="me-2 text-primary" />
                                        Statusy zgłoszeń
                                    </MDBCardTitle>
                                    {statusPieData.length === 0 ? (
                                        <div className="text-muted text-center py-4">Brak danych.</div>
                                    ) : (
                                        <>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={statusPieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={80}
                                                        paddingAngle={3}
                                                        dataKey="value"
                                                    >
                                                        {statusPieData.map((entry, i) => (
                                                            <Cell key={i} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(v) => [v, 'szt.']} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="d-flex flex-column gap-1 mt-2">
                                                {statusPieData.map((s, i) => (
                                                    <div key={i} className="d-flex justify-content-between align-items-center">
                                                        <span className="d-flex align-items-center gap-1 small">
                                                            <span
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: 10, height: 10,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: s.color,
                                                                }}
                                                            />
                                                            {s.name}
                                                        </span>
                                                        <MDBBadge style={{ backgroundColor: s.color }}>
                                                            {s.value}
                                                        </MDBBadge>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>

                    {/* ── Row 3: Priority bar + Top equipment ──────── */}
                    <MDBRow className="g-3 mb-4">
                        <MDBCol lg="5">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="flag" className="me-2 text-warning" />
                                        Zgłoszenia wg priorytetu
                                    </MDBCardTitle>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={priorityData} layout="vertical" margin={{ left: 10, right: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                                            <Tooltip />
                                            <Bar dataKey="value" name="Liczba zgłoszeń" radius={[0, 4, 4, 0]}>
                                                {priorityData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        <MDBCol lg="7">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="cogs" className="me-2 text-secondary" />
                                        Top 8 urządzeń — liczba zgłoszeń
                                    </MDBCardTitle>
                                    {topEquipmentData.length === 0 ? (
                                        <div className="text-muted text-center py-4">Brak danych.</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={220}>
                                            <BarChart data={topEquipmentData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 11 }}
                                                    angle={-35}
                                                    textAnchor="end"
                                                    interval={0}
                                                />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Bar dataKey="count" name="Zgłoszenia" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>

                    {/* ── Row 4: Summary table + overdue alert ─────── */}
                    <MDBRow className="g-3">
                        <MDBCol lg="6">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="table" className="me-2 text-info" />
                                        Podsumowanie zgłoszeń
                                    </MDBCardTitle>
                                    <table className="table table-sm table-hover mb-0">
                                        <tbody>
                                            <tr>
                                                <td>Wszystkich</td>
                                                <td className="text-end fw-bold">{data.workOrders.total}</td>
                                            </tr>
                                            <tr>
                                                <td>Zakończone</td>
                                                <td className="text-end text-success fw-bold">{data.workOrders.completed}</td>
                                            </tr>
                                            <tr>
                                                <td>W trakcie</td>
                                                <td className="text-end text-warning fw-bold">{data.workOrders.inProgress}</td>
                                            </tr>
                                            <tr>
                                                <td>Otwarte</td>
                                                <td className="text-end text-info fw-bold">{data.workOrders.open}</td>
                                            </tr>
                                            <tr>
                                                <td>Wstrzymane</td>
                                                <td className="text-end text-secondary fw-bold">{data.workOrders.onHold}</td>
                                            </tr>
                                            <tr>
                                                <td>Anulowane</td>
                                                <td className="text-end text-danger fw-bold">{data.workOrders.cancelled}</td>
                                            </tr>
                                            <tr className="table-warning">
                                                <td><strong>Zaległe (po terminie)</strong></td>
                                                <td className="text-end text-danger fw-bold">{data.workOrders.overdue}</td>
                                            </tr>
                                            <tr className="table-light">
                                                <td>Skuteczność zamknięcia</td>
                                                <td className="text-end fw-bold">{data.workOrders.completionRate}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>

                        <MDBCol lg="6">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="tachometer-alt" className="me-2 text-success" />
                                        Wskaźniki KPI
                                    </MDBCardTitle>
                                    <table className="table table-sm table-hover mb-0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>MTTR</strong>
                                                    <div className="text-muted small">Średni czas naprawy</div>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {fmt(data.kpi.mttr, 'h')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>MTBF</strong>
                                                    <div className="text-muted small">Śr. czas między awariami</div>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {fmt(data.kpi.mtbf, 'h')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Skuteczność zamknięcia</strong>
                                                    <div className="text-muted small">Zakończone / wszystkich</div>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {data.workOrders.completionRate}%
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Urządzeń w bazie</strong>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {data.equipment.total}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {data.workOrders.overdue > 0 && (
                                        <div className="alert alert-warning d-flex align-items-center gap-2 mt-3 mb-0 p-2">
                                            <MDBIcon fas icon="exclamation-triangle" />
                                            <span className="small">
                                                <strong>{data.workOrders.overdue}</strong> zgłoszeń jest po terminie i wymaga uwagi.
                                            </span>
                                        </div>
                                    )}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </>
            )}
        </MDBContainer>
    );
};
