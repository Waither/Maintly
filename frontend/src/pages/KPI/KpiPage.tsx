/**
 * KPI Analytics Page
 * Charts and statistics for selected period
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const [dateFrom, setDateFrom] = useState(janFirst());
    const [dateTo,   setDateTo]   = useState(today());
    const [data,     setData]     = useState<KpiStats | null>(null);
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState<string | null>(null);

    const load = useCallback(async () => {
        if (dateFrom > dateTo) {
            setError(t('kpi.errors.invalidRange', { defaultValue: 'Data początkowa musi być wcześniejsza lub równa dacie końcowej.' }));
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await getKpiStats(dateFrom, dateTo);
            setData(result);
        } catch {
            setError(t('kpi.errors.loadFailed', { defaultValue: 'Nie udało się załadować danych KPI.' }));
        } finally {
            setLoading(false);
        }
    }, [dateFrom, dateTo, t]);

    useEffect(() => { load(); }, [load]);

    const exportCsv = () => {
        if (!data) {
            return;
        }

        const rows: string[] = [];
        const pushSection = (title: string, header: string[], dataRows: Array<Array<string | number>>) => {
            rows.push(title);
            rows.push(header.join(';'));
            dataRows.forEach(row => rows.push(row.map(value => String(value).replace(/;/g, ',')).join(';')));
            rows.push('');
        };

        pushSection(t('kpi.sections.summary', { defaultValue: 'Podsumowanie' }), [t('kpi.common.metric', { defaultValue: 'Metryka' }), t('kpi.common.value', { defaultValue: 'Wartość' })], [
            [t('kpi.period.from', { defaultValue: 'Zakres od' }), data.period.from],
            [t('kpi.period.to', { defaultValue: 'Zakres do' }), data.period.to],
            [t('kpi.cards.total', { defaultValue: 'Wszystkich zgłoszeń' }), data.workOrders.total],
            [t('status.completed', { defaultValue: 'Zakończone' }), data.workOrders.completed],
            [t('status.in_progress', { defaultValue: 'W trakcie' }), data.workOrders.inProgress],
            [t('status.open', { defaultValue: 'Otwarte' }), data.workOrders.open],
            [t('kpi.cards.overdue', { defaultValue: 'Zaległe' }), data.workOrders.overdue],
            ['MTTR (h)', data.kpi.mttr ?? '—'],
            ['MTBF (h)', data.kpi.mtbf ?? '—'],
        ]);

        pushSection(t('kpi.sections.statuses', { defaultValue: 'Statusy' }), [t('workOrder.status', { defaultValue: 'Status' }), t('kpi.common.count', { defaultValue: 'Ilość' })], [
            [t('status.open', { defaultValue: 'Otwarte' }), data.workOrders.open],
            [t('status.in_progress', { defaultValue: 'W trakcie' }), data.workOrders.inProgress],
            [t('status.completed', { defaultValue: 'Zakończone' }), data.workOrders.completed],
            [t('status.on_hold', { defaultValue: 'Wstrzymane' }), data.workOrders.onHold],
            [t('status.cancelled', { defaultValue: 'Anulowane' }), data.workOrders.cancelled],
        ]);

        pushSection(t('kpi.sections.topEquipment', { defaultValue: 'Top urządzenia' }), [t('equipment.name', { defaultValue: 'Nazwa' }), t('kpi.charts.workOrdersCount', { defaultValue: 'Liczba zgłoszeń' })], data.topEquipment.map(item => [item.name, item.count]));

        pushSection(t('kpi.sections.topWorkTime', { defaultValue: 'Top czas pracy' }), [t('equipment.name', { defaultValue: 'Nazwa' }), t('kpi.workTime.direct', { defaultValue: 'Direct [min]' }), t('kpi.workTime.total', { defaultValue: 'Total [min]' })], (data.equipment.topByWorkTime ?? []).map(item => [item.name, item.directMinutes, item.totalMinutes]));

        pushSection(t('kpi.sections.trend', { defaultValue: 'Trend' }), [t('kpi.common.month', { defaultValue: 'Miesiąc' }), t('kpi.trend.created', { defaultValue: 'Utworzone' }), t('kpi.trend.completed', { defaultValue: 'Zakończone' })], data.trend.map(item => [item.month, item.created, item.completed]));

        const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `kpi-${data.period.from}-do-${data.period.to}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    const exportPdf = () => {
        if (!data) {
            return;
        }

        const win = window.open('', '_blank', 'width=1200,height=900');
        if (!win) {
            return;
        }

        const metricsHtml = [
            [t('kpi.cards.total', { defaultValue: 'Wszystkich zgłoszeń' }), data.workOrders.total],
            [t('status.completed', { defaultValue: 'Zakończone' }), data.workOrders.completed],
            [t('status.in_progress', { defaultValue: 'W trakcie' }), data.workOrders.inProgress],
            [t('status.open', { defaultValue: 'Otwarte' }), data.workOrders.open],
            [t('kpi.cards.overdue', { defaultValue: 'Zaległe' }), data.workOrders.overdue],
            ['MTTR', fmt(data.kpi.mttr, 'h')],
            ['MTBF', fmt(data.kpi.mtbf, 'h')],
            [t('kpi.summary.completionRateShort', { defaultValue: 'Skuteczność' }), `${data.workOrders.completionRate}%`],
        ].map(([label, value]) => `<tr><td>${label}</td><td style="text-align:right;font-weight:700">${value}</td></tr>`).join('');

        const workTimeHtml = (data.equipment.topByWorkTime ?? []).map(item => `<tr><td>${item.name}</td><td style="text-align:right">${item.directMinutes}</td><td style="text-align:right">${item.totalMinutes}</td></tr>`).join('');

        win.document.write(`
            <html>
              <head>
                <title>${t('kpi.title', { defaultValue: 'KPI i analityka' })} ${data.period.from} - ${data.period.to}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
                  h1, h2 { margin: 0 0 12px; }
                  .muted { color: #6b7280; margin-bottom: 16px; }
                  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
                  .card { border: 1px solid #d1d5db; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
                  table { width: 100%; border-collapse: collapse; }
                  td, th { border-bottom: 1px solid #e5e7eb; padding: 8px 6px; font-size: 13px; }
                  th { text-align: left; background: #f9fafb; }
                  .page-break { page-break-after: always; }
                </style>
              </head>
              <body>
                                <h1>${t('kpi.title', { defaultValue: 'KPI i analityka' })}</h1>
                                <div class="muted">${t('kpi.period.labelShort', { defaultValue: 'Zakres:' })} ${data.period.from} - ${data.period.to}</div>
                <div class="grid">
                                    <div class="card"><h2>${t('kpi.sections.summary', { defaultValue: 'Podsumowanie' })}</h2><table>${metricsHtml}</table></div>
                                    <div class="card"><h2>${t('kpi.sections.topEquipment', { defaultValue: 'Top urządzenia' })}</h2><table><tr><th>${t('equipment.name', { defaultValue: 'Nazwa' })}</th><th style="text-align:right">${t('nav.workOrders', { defaultValue: 'Zgłoszenia' })}</th></tr>${data.topEquipment.map(item => `<tr><td>${item.name}</td><td style="text-align:right">${item.count}</td></tr>`).join('')}</table></div>
                </div>
                                <div class="card page-break"><h2>${t('kpi.sections.topWorkTime', { defaultValue: 'Top czas pracy' })}</h2><table><tr><th>${t('equipment.name', { defaultValue: 'Nazwa' })}</th><th style="text-align:right">${t('kpi.workTime.direct', { defaultValue: 'Direct [min]' })}</th><th style="text-align:right">${t('kpi.workTime.total', { defaultValue: 'Total [min]' })}</th></tr>${workTimeHtml}</table></div>
                                <div class="card"><h2>${t('kpi.sections.trendMonthlyShort', { defaultValue: 'Trend miesięczny' })}</h2><table><tr><th>${t('kpi.common.month', { defaultValue: 'Miesiąc' })}</th><th style="text-align:right">${t('kpi.trend.created', { defaultValue: 'Utworzone' })}</th><th style="text-align:right">${t('kpi.trend.completed', { defaultValue: 'Zakończone' })}</th></tr>${data.trend.map(item => `<tr><td>${item.month}</td><td style="text-align:right">${item.created}</td><td style="text-align:right">${item.completed}</td></tr>`).join('')}</table></div>
              </body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 250);
    };

    // ── derived chart data ──────────────────────────────────────────────

    const statusPieData = data
        ? [
            { name: t('status.open', { defaultValue: 'Otwarte' }), value: data.workOrders.open, color: STATUS_COLORS.open },
            { name: t('status.in_progress', { defaultValue: 'W trakcie' }), value: data.workOrders.inProgress, color: STATUS_COLORS.inProgress },
            { name: t('status.completed', { defaultValue: 'Zakończone' }), value: data.workOrders.completed, color: STATUS_COLORS.completed },
            { name: t('status.on_hold', { defaultValue: 'Wstrzymane' }), value: data.workOrders.onHold, color: STATUS_COLORS.onHold },
            { name: t('status.cancelled', { defaultValue: 'Anulowane' }), value: data.workOrders.cancelled, color: STATUS_COLORS.cancelled },
        ].filter(d => d.value > 0)
        : [];

    const priorityData = data
        ? [
            { name: t('priority.critical', { defaultValue: 'Krytyczny' }), value: data.workOrders.byPriority.critical, fill: PRIORITY_COLORS.critical },
            { name: t('priority.high', { defaultValue: 'Wysoki' }), value: data.workOrders.byPriority.high, fill: PRIORITY_COLORS.high },
            { name: t('priority.medium', { defaultValue: 'Średni' }), value: data.workOrders.byPriority.medium, fill: PRIORITY_COLORS.medium },
            { name: t('priority.low', { defaultValue: 'Niski' }), value: data.workOrders.byPriority.low, fill: PRIORITY_COLORS.low },
        ]
        : [];

    const trendData = data?.trend.map(t => ({
        ...t,
        label: formatMonth(t.month),
    })) ?? [];

    const topEquipmentData = data?.topEquipment ?? [];
    const topWorkTimeData = data?.equipment.topByWorkTime ?? [];

    // ── render ──────────────────────────────────────────────────────────

    return (
        <MDBContainer fluid className="p-4">

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="mb-0 fw-bold">
                        <MDBIcon fas icon="chart-bar" className="me-2 text-primary" />
                        {t('kpi.title', { defaultValue: 'KPI i analityka' })}
                    </h2>
                    {data && (
                        <small className="text-muted">
                            {t('kpi.period.label', { defaultValue: 'Dane za okres:' })} {data.period.from} – {data.period.to}
                        </small>
                    )}
                </div>

                {/* Date range + refresh */}
                <div className="d-flex flex-wrap align-items-end gap-2">
                    <div>
                        <label className="form-label small mb-1 text-muted">{t('kpi.filters.from', { defaultValue: 'Od' })}</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="form-label small mb-1 text-muted">{t('kpi.filters.to', { defaultValue: 'Do' })}</label>
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
                        {t('kpi.actions.refresh', { defaultValue: 'Odśwież' })}
                    </MDBBtn>
                    <MDBBtn size="sm" color="success" onClick={exportCsv} disabled={!data || loading}>
                        <MDBIcon fas icon="file-csv" className="me-1" />
                        CSV
                    </MDBBtn>
                    <MDBBtn size="sm" color="dark" onClick={exportPdf} disabled={!data || loading}>
                        <MDBIcon fas icon="file-pdf" className="me-1" />
                        PDF
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
                    <div className="mt-2 text-muted">{t('kpi.loading', { defaultValue: 'Ładowanie danych…' })}</div>
                </div>
            )}

            {data && (
                <>
                    {/* ── KPI metric cards ──────────────────────────── */}
                    <MDBRow className="g-3 mb-4">
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label={t('kpi.cards.total', { defaultValue: 'Wszystkich zgłoszeń' })}
                                value={data.workOrders.total}
                                icon="clipboard-list"
                                color="#0d6efd"
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label={t('status.completed', { defaultValue: 'Zakończone' })}
                                value={data.workOrders.completed}
                                icon="check-circle"
                                color="#198754"
                                sub={`${data.workOrders.completionRate}% ${t('kpi.cards.effectiveness', { defaultValue: 'skuteczność' })}`}
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label={t('status.in_progress', { defaultValue: 'W trakcie' })}
                                value={data.workOrders.inProgress}
                                icon="tools"
                                color="#ffc107"
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label={t('kpi.cards.overdue', { defaultValue: 'Zaległe' })}
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
                                sub={t('kpi.cards.mttrSub', { defaultValue: 'Śr. czas naprawy' })}
                            />
                        </MDBCol>
                        <MDBCol md="2" sm="6">
                            <StatCard
                                label="MTBF"
                                value={fmt(data.kpi.mtbf, 'h')}
                                icon="history"
                                color="#20c997"
                                sub={t('kpi.cards.mtbfSub', { defaultValue: 'Śr. czas między awariami' })}
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
                                        {t('kpi.sections.trendMonthly', { defaultValue: 'Trend zgłoszeń (miesięcznie)' })}
                                    </MDBCardTitle>
                                    {trendData.length === 0 ? (
                                        <div className="text-muted text-center py-4">{t('kpi.empty.period', { defaultValue: 'Brak danych dla wybranego okresu.' })}</div>
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
                                                    name={t('kpi.trend.created', { defaultValue: 'Utworzone' })}
                                                    stroke="#0d6efd"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="completed"
                                                    name={t('kpi.trend.completed', { defaultValue: 'Zakończone' })}
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
                                        {t('kpi.sections.statusesChart', { defaultValue: 'Statusy zgłoszeń' })}
                                    </MDBCardTitle>
                                    {statusPieData.length === 0 ? (
                                        <div className="text-muted text-center py-4">{t('common.noData', { defaultValue: 'Brak danych do wyświetlenia' })}</div>
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
                                        {t('kpi.sections.byPriority', { defaultValue: 'Zgłoszenia wg priorytetu' })}
                                    </MDBCardTitle>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={priorityData} layout="vertical" margin={{ left: 10, right: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                                            <Tooltip />
                                            <Bar dataKey="value" name={t('kpi.charts.workOrdersCount', { defaultValue: 'Liczba zgłoszeń' })} radius={[0, 4, 4, 0]}>
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
                                        {t('kpi.sections.topEquipmentChart', { defaultValue: 'Top 8 urządzeń — liczba zgłoszeń' })}
                                    </MDBCardTitle>
                                    {topEquipmentData.length === 0 ? (
                                        <div className="text-muted text-center py-4">{t('common.noData', { defaultValue: 'Brak danych do wyświetlenia' })}</div>
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
                                                <Bar dataKey="count" name={t('nav.workOrders', { defaultValue: 'Zgłoszenia' })} fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>

                    {/* ── Row 4: Work time table ────────────────────── */}
                    <MDBRow className="g-3 mb-4">
                        <MDBCol lg="12">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="clock" className="me-2 text-success" />
                                        {t('kpi.sections.topWorkTimeChart', { defaultValue: 'Urządzenia z największym czasem pracy' })}
                                    </MDBCardTitle>
                                    {topWorkTimeData.length === 0 ? (
                                        <div className="text-muted text-center py-4">{t('common.noData', { defaultValue: 'Brak danych do wyświetlenia' })}</div>
                                    ) : (
                                        <table className="table table-sm table-hover mb-0 align-middle">
                                            <thead>
                                                <tr>
                                                    <th>{t('equipment.name', { defaultValue: 'Nazwa' })}</th>
                                                    <th className="text-end">{t('kpi.workTime.direct', { defaultValue: 'Direct [min]' })}</th>
                                                    <th className="text-end">{t('kpi.workTime.total', { defaultValue: 'Total [min]' })}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topWorkTimeData.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td className="text-end">{item.directMinutes}</td>
                                                        <td className="text-end fw-semibold">{item.totalMinutes}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>

                    {/* ── Row 5: Summary table + overdue alert ─────── */}
                    <MDBRow className="g-3">
                        <MDBCol lg="6">
                            <MDBCard className="shadow-sm h-100">
                                <MDBCardBody>
                                    <MDBCardTitle className="fw-semibold mb-3">
                                        <MDBIcon fas icon="table" className="me-2 text-info" />
                                        {t('kpi.sections.summary', { defaultValue: 'Podsumowanie zgłoszeń' })}
                                    </MDBCardTitle>
                                    <table className="table table-sm table-hover mb-0">
                                        <tbody>
                                            <tr>
                                                <td>{t('kpi.cards.totalShort', { defaultValue: 'Wszystkich' })}</td>
                                                <td className="text-end fw-bold">{data.workOrders.total}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('status.completed', { defaultValue: 'Zakończone' })}</td>
                                                <td className="text-end text-success fw-bold">{data.workOrders.completed}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('status.in_progress', { defaultValue: 'W trakcie' })}</td>
                                                <td className="text-end text-warning fw-bold">{data.workOrders.inProgress}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('status.open', { defaultValue: 'Otwarte' })}</td>
                                                <td className="text-end text-info fw-bold">{data.workOrders.open}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('status.on_hold', { defaultValue: 'Wstrzymane' })}</td>
                                                <td className="text-end text-secondary fw-bold">{data.workOrders.onHold}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('status.cancelled', { defaultValue: 'Anulowane' })}</td>
                                                <td className="text-end text-danger fw-bold">{data.workOrders.cancelled}</td>
                                            </tr>
                                            <tr className="table-warning">
                                                <td><strong>{t('kpi.summary.overdueAfterDue', { defaultValue: 'Zaległe (po terminie)' })}</strong></td>
                                                <td className="text-end text-danger fw-bold">{data.workOrders.overdue}</td>
                                            </tr>
                                            <tr className="table-light">
                                                <td>{t('kpi.summary.completionRate', { defaultValue: 'Skuteczność zamknięcia' })}</td>
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
                                        {t('kpi.sections.metrics', { defaultValue: 'Wskaźniki KPI' })}
                                    </MDBCardTitle>
                                    <table className="table table-sm table-hover mb-0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>MTTR</strong>
                                                    <div className="text-muted small">{t('kpi.cards.mttrSub', { defaultValue: 'Średni czas naprawy' })}</div>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {fmt(data.kpi.mttr, 'h')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>MTBF</strong>
                                                    <div className="text-muted small">{t('kpi.cards.mtbfSub', { defaultValue: 'Śr. czas między awariami' })}</div>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {fmt(data.kpi.mtbf, 'h')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>{t('kpi.summary.completionRate', { defaultValue: 'Skuteczność zamknięcia' })}</strong>
                                                    <div className="text-muted small">{t('kpi.summary.closedToAll', { defaultValue: 'Zakończone / wszystkich' })}</div>
                                                </td>
                                                <td className="text-end fw-bold fs-5">
                                                    {data.workOrders.completionRate}%
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>{t('kpi.summary.equipmentTotal', { defaultValue: 'Urządzeń w bazie' })}</strong>
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
                                                <strong>{data.workOrders.overdue}</strong> {t('kpi.alerts.overdueAttention', { defaultValue: 'zgłoszeń jest po terminie i wymaga uwagi.' })}
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
