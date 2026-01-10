/**
 * Audit Logs List Page
 * View system audit logs with filters
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon, 
    MDBRow,
    MDBCol,
    MDBBadge,
    MDBSelect,
    MDBInput,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    useToast,
    MDBDataTable
} from '../../components/ui';
import { auditLogService } from '../../services';
import { AuditLog } from '../../types';

type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

// Type for MDBDatatable row data
interface DatatableRow {
    id: number;
    timestamp: string;
    user: React.ReactNode;
    action: React.ReactNode;
    entityType: string;
    entityId: string;
    ipAddress: string;
    details: React.ReactNode;
    _original: AuditLog;
    [key: string]: unknown;
}

interface SelectData {
    text: string;
    value: string;
    defaultSelected?: boolean;
}

export const AuditLogList = () => {
    const { t } = useTranslation();
    const { error } = useToast();

    // State
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [actionFilter, setActionFilter] = useState('');
    const [entityTypeFilter, setEntityTypeFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Filter options
    const [actionTypes, setActionTypes] = useState<string[]>([]);
    const [entityTypes, setEntityTypes] = useState<string[]>([]);
    
    // Detail modal
    const [detailModal, setDetailModal] = useState<{ open: boolean; log: AuditLog | null }>({
        open: false,
        log: null,
    });

    // Load filter options
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [actions, entities] = await Promise.all([
                    auditLogService.getActionTypes(),
                    auditLogService.getEntityTypes(),
                ]);
                setActionTypes(actions);
                setEntityTypes(entities);
            } catch (err) {
                console.error('Failed to load filter options:', err);
            }
        };
        loadFilterOptions();
    }, []);

    // Load data
    const loadLogs = useCallback(async () => {
        setLoading(true);
        try {
            const filters: Record<string, string> = {};
            if (actionFilter) filters.action = actionFilter;
            if (entityTypeFilter) filters.entityType = entityTypeFilter;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const response = await auditLogService.getAuditLogs(1, 500, filters);
            setLogs(response.data || []);
        } catch (err) {
            console.error('Failed to load audit logs:', err);
            error(t('auditLog.loadError', { defaultValue: 'Failed to load audit logs' }));
        } finally {
            setLoading(false);
        }
    }, [actionFilter, entityTypeFilter, startDate, endDate, t, error]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    // Clear filters
    const clearFilters = () => {
        setActionFilter('');
        setEntityTypeFilter('');
        setStartDate('');
        setEndDate('');
    };

    // Get action color
    const getActionColor = (action: string): BadgeColor => {
        if (action.includes('created') || action.includes('login')) return 'success';
        if (action.includes('updated') || action.includes('changed')) return 'warning';
        if (action.includes('deleted') || action.includes('logout')) return 'danger';
        return 'info';
    };

    // Get action icon
    const getActionIcon = (action: string): string => {
        if (action.includes('login')) return 'sign-in-alt';
        if (action.includes('logout')) return 'sign-out-alt';
        if (action.includes('created')) return 'plus-circle';
        if (action.includes('updated')) return 'edit';
        if (action.includes('deleted')) return 'trash';
        if (action.includes('generated')) return 'file-alt';
        return 'history';
    };

    // Format action for display
    const formatAction = (action: string): string => {
        return action
            .replace(/([._])/g, ' ')
            .replace(/^\w/, c => c.toUpperCase());
    };

    // Action select data
    const actionSelectData = useMemo((): SelectData[] => {
        const allOption: SelectData = {
            text: t('auditLog.allActions', { defaultValue: 'All actions' }),
            value: '',
            defaultSelected: actionFilter === '',
        };
        
        const options: SelectData[] = actionTypes.map(action => ({
            text: formatAction(action),
            value: action,
            defaultSelected: actionFilter === action,
        }));

        return [allOption, ...options];
    }, [actionTypes, actionFilter, t]);

    // Entity type select data
    const entityTypeSelectData = useMemo((): SelectData[] => {
        const allOption: SelectData = {
            text: t('auditLog.allEntities', { defaultValue: 'All entities' }),
            value: '',
            defaultSelected: entityTypeFilter === '',
        };
        
        const options: SelectData[] = entityTypes.map(entity => ({
            text: entity,
            value: entity,
            defaultSelected: entityTypeFilter === entity,
        }));

        return [allOption, ...options];
    }, [entityTypes, entityTypeFilter, t]);

    // Prepare datatable columns
    const datatableColumns = useMemo(() => [
        { label: t('auditLog.timestamp', { defaultValue: 'Timestamp' }), field: 'timestamp', sort: true, width: 170 },
        { label: t('auditLog.user', { defaultValue: 'User' }), field: 'user', sort: false, width: 180 },
        { label: t('auditLog.action', { defaultValue: 'Action' }), field: 'action', sort: false, width: 180 },
        { label: t('auditLog.entity', { defaultValue: 'Entity' }), field: 'entityType', sort: true, width: 120 },
        { label: t('auditLog.entityId', { defaultValue: 'ID' }), field: 'entityId', sort: true, width: 80 },
        { label: t('auditLog.ipAddress', { defaultValue: 'IP Address' }), field: 'ipAddress', sort: true, width: 130 },
        { label: '', field: 'details', sort: false, width: 60 },
    ], [t]);

    // Prepare datatable rows
    const datatableRows: DatatableRow[] = useMemo(() => {
        return logs.map((log) => ({
            id: log.id,
            timestamp: new Date(log.createdAt).toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
            user: log.user ? (
                <div className="d-flex align-items-center">
                    <div 
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white me-2"
                        style={{ width: 28, height: 28, fontSize: '0.75rem' }}
                    >
                        {log.user.firstName?.[0]}{log.user.lastName?.[0]}
                    </div>
                    <span className="small">{log.user.fullName || log.user.email}</span>
                </div>
            ) : (
                <span className="text-muted small">{t('auditLog.system', { defaultValue: 'System' })}</span>
            ),
            action: (
                <MDBBadge color={getActionColor(log.action)} pill>
                    <MDBIcon icon={getActionIcon(log.action)} className="me-1" />
                    {formatAction(log.action)}
                </MDBBadge>
            ),
            entityType: log.entityType || '-',
            entityId: log.entityId?.toString() || '-',
            ipAddress: log.ipAddress || '-',
            details: (
                <MDBBtn
                    size="sm"
                    color="light"
                    floating
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setDetailModal({ open: true, log });
                    }}
                    title={t('common.details', { defaultValue: 'Details' })}
                >
                    <MDBIcon icon="info-circle" />
                </MDBBtn>
            ),
            _original: log,
        }));
    }, [logs, t]);

    // Stats
    const stats = useMemo(() => ({
        total: logs.length,
        logins: logs.filter(l => l.action.includes('login')).length,
        changes: logs.filter(l => l.action.includes('created') || l.action.includes('updated') || l.action.includes('deleted')).length,
        today: logs.filter(l => {
            const logDate = new Date(l.createdAt);
            const today = new Date();
            return logDate.toDateString() === today.toDateString();
        }).length,
    }), [logs]);

    return (
        <div>
            <PageHeader
                title={t('auditLog.list', { defaultValue: 'Audit Logs' })}
                subtitle={t('auditLog.listSubtitle', { 
                    defaultValue: `Total ${stats.total} entries`,
                    count: stats.total 
                })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.auditLogs', { defaultValue: 'Audit Logs' }) },
                ]}
            />

            {/* Quick Stats */}
            <MDBRow className="mb-4 g-3">
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="history" size="lg" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.total}</h4>
                                <small className="text-muted">{t('auditLog.total', { defaultValue: 'Total' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="sign-in-alt" size="lg" className="text-success" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.logins}</h4>
                                <small className="text-muted">{t('auditLog.logins', { defaultValue: 'Logins' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="exchange-alt" size="lg" className="text-warning" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.changes}</h4>
                                <small className="text-muted">{t('auditLog.changes', { defaultValue: 'Data Changes' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="calendar-day" size="lg" className="text-info" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.today}</h4>
                                <small className="text-muted">{t('auditLog.today', { defaultValue: 'Today' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Filters */}
            <MDBCard className="mb-4 shadow-sm border-0">
                <MDBCardBody>
                    <MDBRow className="g-3 align-items-end">
                        <MDBCol md="3">
                            <label className="form-label small text-muted">
                                {t('auditLog.filterByAction', { defaultValue: 'Filter by action' })}
                            </label>
                            {/* @ts-expect-error MDB types issue */}
                            <MDBSelect
                                data={actionSelectData}
                                onValueChange={(data: unknown) => {
                                    const selected = Array.isArray(data) ? data[0] : data;
                                    const value = (selected as SelectData)?.value || '';
                                    setActionFilter(value);
                                }}
                                search
                                searchLabel={t('common.search', { defaultValue: 'Search...' })}
                            />
                        </MDBCol>
                        <MDBCol md="3">
                            <label className="form-label small text-muted">
                                {t('auditLog.filterByEntity', { defaultValue: 'Filter by entity' })}
                            </label>
                            {/* @ts-expect-error MDB types issue */}
                            <MDBSelect
                                data={entityTypeSelectData}
                                onValueChange={(data: unknown) => {
                                    const selected = Array.isArray(data) ? data[0] : data;
                                    const value = (selected as SelectData)?.value || '';
                                    setEntityTypeFilter(value);
                                }}
                            />
                        </MDBCol>
                        <MDBCol md="2">
                            <MDBInput
                                type="date"
                                label={t('auditLog.startDate', { defaultValue: 'Start date' })}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </MDBCol>
                        <MDBCol md="2">
                            <MDBInput
                                type="date"
                                label={t('auditLog.endDate', { defaultValue: 'End date' })}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </MDBCol>
                        <MDBCol md="2">
                            <MDBBtn 
                                type="button" 
                                color="light"
                                onClick={clearFilters}
                                disabled={!actionFilter && !entityTypeFilter && !startDate && !endDate}
                                className="w-100"
                            >
                                <MDBIcon icon="times" className="me-2" />
                                {t('common.clear', { defaultValue: 'Clear' })}
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

            {/* DataTable */}
            <MDBCard className="shadow-sm border-0">
                <MDBCardBody className="p-0">
                    <MDBDataTable
                        columns={datatableColumns}
                        rows={datatableRows}
                        loading={loading}
                        noFoundMessage={{
                            icon: 'history',
                            iconColor: 'text-muted',
                            title: t('auditLog.noLogs', { defaultValue: 'No audit logs to display' }),
                            subtitle: t('auditLog.noLogsHint', { defaultValue: 'Try changing filters' }),
                        }}
                        loadingMessage={{
                            text: t('auditLog.loading', { defaultValue: 'Loading audit logs...' }),
                        }}
                    />
                </MDBCardBody>
            </MDBCard>

            {/* Detail Modal */}
            <MDBModal open={detailModal.open} setOpen={(open: boolean) => setDetailModal({ open, log: open ? detailModal.log : null })} tabIndex="-1">
                <MDBModalDialog size="lg">
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>
                                <MDBIcon icon="info-circle" className="me-2 text-primary" />
                                {t('auditLog.details', { defaultValue: 'Audit Log Details' })}
                            </MDBModalTitle>
                            <MDBBtn 
                                className="btn-close" 
                                color="none" 
                                onClick={() => setDetailModal({ open: false, log: null })}
                            />
                        </MDBModalHeader>
                        <MDBModalBody>
                            {detailModal.log && (
                                <div>
                                    <MDBRow className="g-3 mb-4">
                                        <MDBCol md="6">
                                            <label className="text-muted small d-block">{t('auditLog.timestamp', { defaultValue: 'Timestamp' })}</label>
                                            <span className="fw-medium">
                                                {new Date(detailModal.log.createdAt).toLocaleString('pl-PL')}
                                            </span>
                                        </MDBCol>
                                        <MDBCol md="6">
                                            <label className="text-muted small d-block">{t('auditLog.user', { defaultValue: 'User' })}</label>
                                            <span className="fw-medium">
                                                {detailModal.log.user?.fullName || detailModal.log.user?.email || 'System'}
                                            </span>
                                        </MDBCol>
                                        <MDBCol md="6">
                                            <label className="text-muted small d-block">{t('auditLog.action', { defaultValue: 'Action' })}</label>
                                            <MDBBadge color={getActionColor(detailModal.log.action)} pill>
                                                {formatAction(detailModal.log.action)}
                                            </MDBBadge>
                                        </MDBCol>
                                        <MDBCol md="6">
                                            <label className="text-muted small d-block">{t('auditLog.entity', { defaultValue: 'Entity' })}</label>
                                            <span className="fw-medium">
                                                {detailModal.log.entityType} #{detailModal.log.entityId || '-'}
                                            </span>
                                        </MDBCol>
                                        <MDBCol md="6">
                                            <label className="text-muted small d-block">{t('auditLog.ipAddress', { defaultValue: 'IP Address' })}</label>
                                            <span className="font-monospace">{detailModal.log.ipAddress || '-'}</span>
                                        </MDBCol>
                                        <MDBCol md="6">
                                            <label className="text-muted small d-block">{t('auditLog.userAgent', { defaultValue: 'User Agent' })}</label>
                                            <span className="small text-truncate d-block" style={{ maxWidth: '100%' }}>
                                                {detailModal.log.userAgent || '-'}
                                            </span>
                                        </MDBCol>
                                    </MDBRow>
                                    
                                    {detailModal.log.changes && Object.keys(detailModal.log.changes).length > 0 && (
                                        <div>
                                            <h6 className="mb-3">
                                                <MDBIcon icon="exchange-alt" className="me-2 text-primary" />
                                                {t('auditLog.changesTitle', { defaultValue: 'Changes' })}
                                            </h6>
                                            <div className="table-responsive">
                                                <table className="table table-sm table-bordered">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>{t('auditLog.field', { defaultValue: 'Field' })}</th>
                                                            <th>{t('auditLog.oldValue', { defaultValue: 'Old Value' })}</th>
                                                            <th>{t('auditLog.newValue', { defaultValue: 'New Value' })}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(detailModal.log.changes).map(([field, change]) => (
                                                            <tr key={field}>
                                                                <td className="fw-medium">{field}</td>
                                                                <td className="text-danger">
                                                                    {JSON.stringify(change.old) || '-'}
                                                                </td>
                                                                <td className="text-success">
                                                                    {JSON.stringify(change.new) || '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {detailModal.log.metadata && Object.keys(detailModal.log.metadata).length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="mb-3">
                                                <MDBIcon icon="code" className="me-2 text-primary" />
                                                {t('auditLog.metadata', { defaultValue: 'Metadata' })}
                                            </h6>
                                            <pre className="bg-light p-3 rounded small" style={{ maxHeight: 200, overflow: 'auto' }}>
                                                {JSON.stringify(detailModal.log.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    );
};
