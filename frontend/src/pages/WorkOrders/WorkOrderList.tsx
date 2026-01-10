/**
 * Work Order List Page
 * MDBDataTable with all work orders, filters using MDBSelect, and actions based on permissions
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon, 
    MDBRow,
    MDBCol,
    MDBSelect
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    StatusBadge, 
    PriorityBadge,
    DeleteConfirmModal,
    useToast,
    MDBDataTable
} from '../../components/ui';
import { workOrderService } from '../../services';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../types';

// Type for MDBDatatable row data
interface DatatableRow {
    id: number;
    title: string;
    status: React.ReactNode;
    priority: React.ReactNode;
    equipment: string;
    createdBy: string;
    createdAt: string;
    dueDate: React.ReactNode;
    actions: React.ReactNode;
    _original: WorkOrder;
    [key: string]: unknown;
}

// Type for MDBSelect data
interface SelectData {
    text: string;
    value: string;
    defaultSelected?: boolean;
}

export const WorkOrderList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; workOrder: WorkOrder | null }>({
        open: false,
        workOrder: null,
    });
    const [deleting, setDeleting] = useState(false);

    // Statuses and priorities for filters
    const [statuses, setStatuses] = useState<WorkOrderStatus[]>([]);
    const [priorities, setPriorities] = useState<WorkOrderPriority[]>([]);

    // Mock user permissions - will be replaced with auth context
    const userPermissions = {
        canCreate: true,
        canEdit: true, // admin, manager, technician, provider (own)
        canDelete: true, // only admin, manager
    };

    // Load data
    const loadWorkOrders = useCallback(async () => {
        setLoading(true);
        try {
            const filters: Record<string, string> = {};
            if (statusFilter) filters.status = statusFilter;
            if (priorityFilter) filters.priority = priorityFilter;

            // Load all work orders for client-side datatable filtering
            const response = await workOrderService.getWorkOrders(1, 1000, filters);
            setWorkOrders(response.data || []);
        } catch (err) {
            console.error('Failed to load work orders:', err);
            error(t('workOrder.loadError', { defaultValue: 'Failed to load work orders' }));
        } finally {
            setLoading(false);
        }
    }, [statusFilter, priorityFilter, t, error]);

    // Load statuses and priorities
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [statusesData, prioritiesData] = await Promise.all([
                    workOrderService.getWorkOrderStatuses(),
                    workOrderService.getWorkOrderPriorities(),
                ]);
                setStatuses(Array.isArray(statusesData) ? statusesData : []);
                setPriorities(Array.isArray(prioritiesData) ? prioritiesData : []);
            } catch (err) {
                console.error('Failed to load filters:', err);
            }
        };
        loadFilters();
    }, []);

    useEffect(() => {
        loadWorkOrders();
    }, [loadWorkOrders]);

    // Update URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (priorityFilter) params.set('priority', priorityFilter);
        setSearchParams(params);
    }, [statusFilter, priorityFilter, setSearchParams]);

    // Handlers
    const handleDelete = async () => {
        if (!deleteModal.workOrder) return;
        
        setDeleting(true);
        try {
            await workOrderService.deleteWorkOrder(deleteModal.workOrder.id);
            success(t('workOrder.deleteSuccess', { defaultValue: 'Work order deleted successfully' }));
            setDeleteModal({ open: false, workOrder: null });
            loadWorkOrders();
        } catch (err) {
            error(t('workOrder.deleteError', { defaultValue: 'Failed to delete work order' }));
        } finally {
            setDeleting(false);
        }
    };

    const clearFilters = () => {
        setStatusFilter('');
        setPriorityFilter('');
    };

    // Prepare MDBSelect data for statuses
    const statusSelectData = useMemo((): SelectData[] => {
        const allOption: SelectData = {
            text: t('workOrder.allStatuses', { defaultValue: 'Wszystkie statusy' }),
            value: '',
            defaultSelected: statusFilter === '',
        };
        
        const statusOptions: SelectData[] = statuses.map(s => ({
            text: t(`status.${s.name}`, { defaultValue: s.name }),
            value: s.name,
            defaultSelected: statusFilter === s.name,
        }));

        return [allOption, ...statusOptions];
    }, [statuses, statusFilter, t]);

    // Prepare MDBSelect data for priorities
    const prioritySelectData = useMemo((): SelectData[] => {
        const allOption: SelectData = {
            text: t('workOrder.allPriorities', { defaultValue: 'Wszystkie priorytety' }),
            value: '',
            defaultSelected: priorityFilter === '',
        };
        
        const priorityOptions: SelectData[] = priorities.map(p => ({
            text: t(`priority.${p.name}`, { defaultValue: p.name }),
            value: p.name,
            defaultSelected: priorityFilter === p.name,
        }));

        return [allOption, ...priorityOptions];
    }, [priorities, priorityFilter, t]);

    // Handle select changes - using unknown type to match MDB callback signature
    const handleStatusChange = (data: unknown) => {
        const selected = Array.isArray(data) ? data[0] : data;
        const value = (selected as SelectData)?.value || '';
        setStatusFilter(value);
    };

    const handlePriorityChange = (data: unknown) => {
        const selected = Array.isArray(data) ? data[0] : data;
        const value = (selected as SelectData)?.value || '';
        setPriorityFilter(value);
    };

    // Prepare datatable columns
    const datatableColumns = useMemo(() => [
        { label: '#', field: 'id', sort: true, width: 60 },
        { label: t('workOrder.title', { defaultValue: 'Title' }), field: 'title', sort: true, width: 250 },
        { label: t('workOrder.status', { defaultValue: 'Status' }), field: 'status', sort: false, width: 120 },
        { label: t('workOrder.priority', { defaultValue: 'Priority' }), field: 'priority', sort: false, width: 110 },
        { label: t('workOrder.equipment', { defaultValue: 'Equipment' }), field: 'equipment', sort: true, width: 150 },
        { label: t('workOrder.createdBy', { defaultValue: 'Created by' }), field: 'createdBy', sort: true, width: 150 },
        { label: t('workOrder.createdAt', { defaultValue: 'Date' }), field: 'createdAt', sort: true, width: 110 },
        { label: t('workOrder.dueDate', { defaultValue: 'Due date' }), field: 'dueDate', sort: true, width: 120 },
        { label: t('common.actions', { defaultValue: 'Actions' }), field: 'actions', sort: false, width: 140 },
    ], [t]);

    // Prepare datatable rows
    const datatableRows: DatatableRow[] = useMemo(() => {
        return workOrders.map((wo) => {
            const isOverdue = wo.dueDate && new Date(wo.dueDate) < new Date() && wo.status?.name !== 'completed';
            
            return {
                id: wo.id,
                title: wo.title,
                status: <StatusBadge status={wo.status?.name || 'new'} />,
                priority: <PriorityBadge priority={wo.priority?.name || 'medium'} />,
                equipment: wo.equipment?.name || '-',
                createdBy: wo.createdBy?.fullName || wo.createdBy?.email || '-',
                createdAt: new Date(wo.createdAt).toLocaleDateString('pl-PL'),
                dueDate: wo.dueDate ? (
                    <span className={isOverdue ? 'text-danger fw-semibold' : ''}>
                        {new Date(wo.dueDate).toLocaleDateString('pl-PL')}
                        {isOverdue && <MDBIcon icon="exclamation-circle" className="ms-1" />}
                    </span>
                ) : '-',
                actions: (
                    <div className="d-flex gap-1">
                        <MDBBtn
                            size="sm"
                            color="info"
                            floating
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                navigate(`/work-orders/${wo.id}`);
                            }}
                            title={t('common.view', { defaultValue: 'View' })}
                        >
                            <MDBIcon icon="eye" />
                        </MDBBtn>
                        {userPermissions.canEdit && (
                            <MDBBtn
                                size="sm"
                                color="warning"
                                floating
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    navigate(`/work-orders/${wo.id}/edit`);
                                }}
                                title={t('common.edit', { defaultValue: 'Edit' })}
                            >
                                <MDBIcon icon="edit" />
                            </MDBBtn>
                        )}
                        {userPermissions.canDelete && (
                            <MDBBtn
                                size="sm"
                                color="danger"
                                floating
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setDeleteModal({ open: true, workOrder: wo });
                                }}
                                title={t('common.delete', { defaultValue: 'Delete' })}
                            >
                                <MDBIcon icon="trash" />
                            </MDBBtn>
                        )}
                    </div>
                ),
                _original: wo,
            };
        });
    }, [workOrders, navigate, userPermissions, t]);

    // Handle row click
    const handleRowClick = (row: unknown) => {
        const typedRow = row as DatatableRow;
        if (typedRow._original) {
            navigate(`/work-orders/${typedRow._original.id}`);
        }
    };

    return (
        <div>
            <PageHeader
                title={t('workOrder.list', { defaultValue: 'Work Orders' })}
                subtitle={t('workOrder.listSubtitle', { 
                    defaultValue: `Total ${workOrders.length} orders`,
                    count: workOrders.length 
                })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.workOrders', { defaultValue: 'Work Orders' }) },
                ]}
                actions={
                    userPermissions.canCreate && (
                        <MDBBtn color="primary" onClick={() => navigate('/work-orders/new')}>
                            <MDBIcon icon="plus" className="me-2" />
                            {t('workOrder.create', { defaultValue: 'Nowe zlecenie' })}
                        </MDBBtn>
                    )
                }
            />

            {/* Quick Stats */}
            <MDBRow className="mb-4 g-3 stats-row">
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="clipboard-list" size="lg" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{workOrders.length}</h4>
                                <small className="text-muted">{t('workOrder.total', { defaultValue: 'Wszystkie' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="clock" size="lg" className="text-warning" />
                            </div>
                            <div>
                                <h4 className="mb-0">
                                    {workOrders.filter(wo => wo.status?.name === 'in_progress').length}
                                </h4>
                                <small className="text-muted">{t('workOrder.inProgress', { defaultValue: 'W trakcie' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="exclamation-triangle" size="lg" className="text-danger" />
                            </div>
                            <div>
                                <h4 className="mb-0">
                                    {workOrders.filter(wo => wo.priority?.name === 'critical').length}
                                </h4>
                                <small className="text-muted">{t('workOrder.critical', { defaultValue: 'Krytyczne' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="calendar-times" size="lg" className="text-danger" />
                            </div>
                            <div>
                                <h4 className="mb-0">
                                    {workOrders.filter(wo => 
                                        wo.dueDate && 
                                        new Date(wo.dueDate) < new Date() && 
                                        wo.status?.name !== 'completed'
                                    ).length}
                                </h4>
                                <small className="text-muted">{t('workOrder.overdue', { defaultValue: 'Przeterminowane' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Filters with MDBSelect */}
            <MDBCard className="mb-4 shadow-sm border-0 filter-section">
                <MDBCardBody>
                    <MDBRow className="g-3 align-items-end">
                        <MDBCol lg="4" md="6" sm="12">
                            <label className="form-label small text-muted">
                                {t('workOrder.filterByStatus', { defaultValue: 'Filtruj wg statusu' })}
                            </label>
                            {/* @ts-expect-error MDB types missing some required props */}
                            <MDBSelect
                                data={statusSelectData}
                                onValueChange={handleStatusChange}
                                search
                                searchLabel={t('common.search', { defaultValue: 'Szukaj...' })}
                            />
                        </MDBCol>
                        <MDBCol lg="4" md="6" sm="12">
                            <label className="form-label small text-muted">
                                {t('workOrder.filterByPriority', { defaultValue: 'Filtruj wg priorytetu' })}
                            </label>
                            {/* @ts-expect-error MDB types missing some required props */}
                            <MDBSelect
                                data={prioritySelectData}
                                onValueChange={handlePriorityChange}
                                search
                                searchLabel={t('common.search', { defaultValue: 'Search...' })}
                            />
                        </MDBCol>
                        <MDBCol lg="4" md="12" sm="12">
                            <MDBBtn 
                                type="button" 
                                color="light"
                                onClick={clearFilters}
                                disabled={!statusFilter && !priorityFilter}
                                className="w-100 w-lg-auto"
                            >
                                <MDBIcon icon="times" className="me-2" />
                                {t('common.clearFilters', { defaultValue: 'Clear filters' })}
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

            {/* MDB DataTable Component */}
            <MDBCard className="shadow-sm border-0">
                <MDBCardBody className="p-0 table-responsive">
                    <MDBDataTable
                        columns={datatableColumns}
                        rows={datatableRows}
                        loading={loading}
                        onRowClick={handleRowClick}
                        noFoundMessage={{
                            icon: 'clipboard-list',
                            iconColor: 'text-muted',
                            title: t('workOrder.noWorkOrders', { defaultValue: 'No work orders to display' }),
                            subtitle: t('workOrder.noWorkOrdersHint', { defaultValue: 'Try changing filters or add a new order' }),
                        }}
                        loadingMessage={{
                            text: t('workOrder.loadingOrders', { defaultValue: 'Loading orders...' }),
                        }}
                    />
                </MDBCardBody>
            </MDBCard>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, workOrder: null })}
                onConfirm={handleDelete}
                itemName={deleteModal.workOrder?.title || ''}
                loading={deleting}
            />
        </div>
    );
};
