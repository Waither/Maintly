import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { PageHeader, StatCard, StatusBadge, PriorityBadge, ErrorState } from '../../components/ui';
import { dashboardService, workOrderService, realtimeService } from '../../services';
import { WorkOrder } from '../../types';

interface DashboardStats {
    workOrders: {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        overdue: number;
    };
    equipment: {
        total: number;
        active: number;
        maintenance: number;
    };
    users: {
        total: number;
        active: number;
    };
    reports: {
        total: number;
        pending: number;
    };
}

/**
 * Dashboard Page
 * Main dashboard with statistics and recent activity
 */
export const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentWorkOrders, setRecentWorkOrders] = useState<WorkOrder[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        const unsubscribeRealtime = realtimeService.subscribe((event) => {
            if (
                event.type === 'work_order.created' ||
                event.type === 'work_order.updated' ||
                event.type === 'dashboard.updated' ||
                event.type === 'notification.created'
            ) {
                loadDashboardData();
            }
        });

        // Polling fallback when realtime is temporarily unavailable.
        const interval = setInterval(loadDashboardData, 30000);

        return () => {
            clearInterval(interval);
            unsubscribeRealtime();
        };
    }, []);

    const loadDashboardData = async () => {
        setError(null);
        
        try {
            // Load stats and recent work orders in parallel
            const [statsData, workOrdersData] = await Promise.all([
                dashboardService.getDashboardStats().catch((err) => {
                    console.error('Dashboard stats error:', err);
                    return null;
                }),
                workOrderService.getWorkOrders(1, 5).catch(() => ({ data: [] }))
            ]);
            
            console.log('Dashboard stats received:', statsData);
            
            // Map API response to our format
            if (statsData) {
                const workOrdersStats = statsData.workOrders || {};
                const byStatus = workOrdersStats.byStatus as Record<string, number> | undefined;

                setStats({
                    workOrders: {
                        total: workOrdersStats.total || 0,
                        pending: workOrdersStats.pending ?? byStatus?.new ?? 0,
                        inProgress: workOrdersStats.inProgress ?? byStatus?.in_progress ?? 0,
                        completed: workOrdersStats.completed || 0,
                        overdue: workOrdersStats.overdue ?? workOrdersStats.overdueCount ?? 0,
                    },
                    equipment: {
                        total: statsData.equipment?.total || 0,
                        active: statsData.equipment?.total || 0, // No active/maintenance split in backend
                        maintenance: 0,
                    },
                    users: {
                        total: statsData.users?.total || 0,
                        active: statsData.users?.active || 0,
                    },
                    reports: {
                        total: statsData.reports?.total || 0,
                        pending: statsData.reports?.pending || 0,
                    },
                });
            } else {
                // API failed - show zeros instead of fake data
                setStats({
                    workOrders: { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 },
                    equipment: { total: 0, active: 0, maintenance: 0 },
                    users: { total: 0, active: 0 },
                    reports: { total: 0, pending: 0 },
                });
            }
            
            setRecentWorkOrders(workOrdersData.data || []);
        } catch (err: any) {
            console.error('Dashboard load error:', err);
            setError(err.message || 'Nie udało się załadować danych');
        }
    };

    if (error) {
        return <ErrorState message={error} onRetry={loadDashboardData} />;
    }

    return (
        <div data-testid="dashboard-page">
            <PageHeader 
                title={t('dashboard.title', { defaultValue: 'Dashboard' })}
                subtitle={t('dashboard.subtitle', { defaultValue: 'CMMS Maintly system overview' })}
                actions={
                    <MDBBtn color="primary" onClick={() => navigate('/work-orders/new')}>
                        <MDBIcon icon="plus" className="me-2" />
                        {t('workOrder.create', { defaultValue: 'New Work Order' })}
                    </MDBBtn>
                }
            />

            {/* Stats Cards */}
            <MDBRow className="mb-4">
                <MDBCol md="6" lg="3" className="mb-3 mb-lg-0">
                    <StatCard
                        title={t('dashboard.workOrders', { defaultValue: 'Work Orders' })}
                        value={stats?.workOrders.total || 0}
                        icon="clipboard-list"
                        color="primary"
                        subtitle={t('dashboard.inProgressCount', { count: stats?.workOrders.inProgress || 0, defaultValue: '{{count}} in progress' })}
                        onClick={() => navigate('/work-orders')}
                    />
                </MDBCol>
                <MDBCol md="6" lg="3" className="mb-3 mb-lg-0">
                    <StatCard
                        title={t('dashboard.equipment', { defaultValue: 'Equipment' })}
                        value={stats?.equipment.total || 0}
                        icon="cogs"
                        color="success"
                        subtitle={t('dashboard.activeCount', { count: stats?.equipment.active || 0, defaultValue: '{{count}} active' })}
                        onClick={() => navigate('/equipment')}
                    />
                </MDBCol>
                <MDBCol md="6" lg="3" className="mb-3 mb-lg-0">
                    <StatCard
                        title={t('dashboard.users', { defaultValue: 'Users' })}
                        value={stats?.users.total || 0}
                        icon="users"
                        color="info"
                        subtitle={t('dashboard.activeCount', { count: stats?.users.active || 0, defaultValue: '{{count}} active' })}
                        onClick={() => navigate('/users')}
                    />
                </MDBCol>
                <MDBCol md="6" lg="3">
                    <StatCard
                        title={t('dashboard.reports', { defaultValue: 'Reports' })}
                        value={stats?.reports.total || 0}
                        icon="file-alt"
                        color="warning"
                        subtitle={t('dashboard.pendingCount', { count: stats?.reports.pending || 0, defaultValue: '{{count}} in queue' })}
                        onClick={() => navigate('/reports')}
                    />
                </MDBCol>
            </MDBRow>

            {/* Quick Stats */}
            <MDBRow className="mb-4">
                <MDBCol md="6" lg="3" className="mb-3 mb-lg-0">
                    <div className="bg-white p-3 rounded shadow-sm d-flex align-items-center gap-3">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MDBIcon icon="inbox" className="text-info" size="lg" />
                        </div>
                        <div>
                            <p className="text-muted small mb-0">{t('dashboard.newWorkOrders', { defaultValue: 'New orders' })}</p>
                            <h5 className="mb-0 fw-bold text-info">{stats?.workOrders.pending || 0}</h5>
                        </div>
                    </div>
                </MDBCol>
                <MDBCol md="6" lg="3" className="mb-3 mb-lg-0">
                    <div className="bg-white p-3 rounded shadow-sm d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MDBIcon icon="spinner" className="text-primary" size="lg" />
                        </div>
                        <div>
                            <p className="text-muted small mb-0">{t('dashboard.inProgress', { defaultValue: 'In progress' })}</p>
                            <h5 className="mb-0 fw-bold text-primary">{stats?.workOrders.inProgress || 0}</h5>
                        </div>
                    </div>
                </MDBCol>
                <MDBCol md="6" lg="3" className="mb-3 mb-lg-0">
                    <div className="bg-white p-3 rounded shadow-sm d-flex align-items-center gap-3">
                        <div className="bg-success bg-opacity-10 rounded-circle p-2" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MDBIcon icon="check-circle" className="text-success" size="lg" />
                        </div>
                        <div>
                            <p className="text-muted small mb-0">{t('dashboard.completed', { defaultValue: 'Completed' })}</p>
                            <h5 className="mb-0 fw-bold text-success">{stats?.workOrders.completed || 0}</h5>
                        </div>
                    </div>
                </MDBCol>
                <MDBCol md="6" lg="3">
                    <div className="bg-white p-3 rounded shadow-sm d-flex align-items-center gap-3">
                        <div className="bg-danger bg-opacity-10 rounded-circle p-2" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MDBIcon icon="exclamation-triangle" className="text-danger" size="lg" />
                        </div>
                        <div>
                            <p className="text-muted small mb-0">{t('dashboard.overdue', { defaultValue: 'Overdue' })}</p>
                            <h5 className="mb-0 fw-bold text-danger">{stats?.workOrders.overdue || 0}</h5>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>

            {/* Recent Work Orders & Maintenance Schedule */}
            <MDBRow>
                <MDBCol lg="8" className="mb-4 mb-lg-0">
                    <MDBCard className="h-100 shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                            <h5 className="mb-0 fw-bold">
                                <MDBIcon icon="clipboard-list" className="me-2 text-primary" />
                                {t('dashboard.recentWorkOrders', { defaultValue: 'Recent work orders' })}
                            </h5>
                            <MDBBtn 
                                color="link" 
                                className="p-0 text-primary"
                                onClick={() => navigate('/work-orders')}
                            >
                                {t('common.viewAll', { defaultValue: 'View all' })}
                                <MDBIcon icon="arrow-right" className="ms-1" />
                            </MDBBtn>
                        </MDBCardHeader>
                        <MDBCardBody className="p-0">
                            {recentWorkOrders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>{t('workOrder.title', { defaultValue: 'Title' })}</th>
                                                <th>{t('workOrder.status', { defaultValue: 'Status' })}</th>
                                                <th>{t('workOrder.priority', { defaultValue: 'Priority' })}</th>
                                                <th>{t('workOrder.dueDate', { defaultValue: 'Due date' })}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentWorkOrders.map((wo) => (
                                                <tr 
                                                    key={wo.id} 
                                                    onClick={() => navigate(`/work-orders/${wo.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td className="fw-semibold">{wo.title}</td>
                                                    <td>
                                                        <StatusBadge status={wo.status?.name || 'open'} />
                                                    </td>
                                                    <td>
                                                        <PriorityBadge priority={wo.priority?.name || 'medium'} />
                                                    </td>
                                                    <td className="text-muted">
                                                        {wo.plannedEndDate 
                                                            ? new Date(wo.plannedEndDate).toLocaleDateString('pl-PL')
                                                            : '-'
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <MDBIcon icon="inbox" size="3x" className="mb-3 opacity-50" />
                                    <p>{t('dashboard.noRecentWorkOrders', { defaultValue: 'No work orders to display' })}</p>
                                    <MDBBtn color="primary" size="sm" onClick={() => navigate('/work-orders/new')}>
                                        <MDBIcon icon="plus" className="me-2" />
                                        {t('workOrder.create', { defaultValue: 'New Work Order' })}
                                    </MDBBtn>
                                </div>
                            )}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                <MDBCol lg="4">
                    <MDBCard className="h-100 shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold">
                                <MDBIcon icon="wrench" className="me-2 text-warning" />
                                {t('dashboard.maintenanceSchedule', { defaultValue: 'Maintenance' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex flex-column gap-3">
                                {/* Equipment in maintenance */}
                                <div className="d-flex align-items-center gap-3 p-3 bg-warning bg-opacity-10 rounded">
                                    <div className="bg-warning text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <MDBIcon icon="tools" />
                                    </div>
                                    <div>
                                        <p className="mb-0 fw-semibold">{t('dashboard.inMaintenance', { defaultValue: 'In maintenance' })}</p>
                                        <h4 className="mb-0 text-warning">{stats?.equipment.maintenance || 0}</h4>
                                    </div>
                                </div>

                                {/* Active equipment */}
                                <div className="d-flex align-items-center gap-3 p-3 bg-success bg-opacity-10 rounded">
                                    <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <MDBIcon icon="check" />
                                    </div>
                                    <div>
                                        <p className="mb-0 fw-semibold">{t('dashboard.activeEquipment', { defaultValue: 'Active equipment' })}</p>
                                        <h4 className="mb-0 text-success">{stats?.equipment.active || 0}</h4>
                                    </div>
                                </div>

                                {/* Quick action */}
                                <div className="mt-auto">
                                    <MDBBtn 
                                        color="light" 
                                        className="w-100"
                                        onClick={() => navigate('/equipment')}
                                    >
                                        <MDBIcon icon="cogs" className="me-2" />
                                        {t('dashboard.manageEquipment', { defaultValue: 'Manage equipment' })}
                                    </MDBBtn>
                                </div>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </div>
    );
};
