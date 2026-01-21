/**
 * Work Order Detail Page
 * View work order details with activities and assignments
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader,
    MDBBtn, 
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBBadge
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    StatusBadge, 
    PriorityBadge,
    ErrorState,
    DeleteConfirmModal,
    useToast
} from '../../components/ui';
import { workOrderService } from '../../services';
import { WorkOrder } from '../../types';

export const WorkOrderDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    
    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Mock permissions - replace with auth context
    const userPermissions = {
        canEdit: true,
        canDelete: true,
    };

    useEffect(() => {
        const loadWorkOrder = async () => {
            if (!id) return;
            
            setLoading(true);
            setLoadError(null);
            
            try {
                const data = await workOrderService.getWorkOrder(parseInt(id));
                setWorkOrder(data);
            } catch (err: any) {
                console.error('Failed to load work order:', err);
                setLoadError(err.response?.data?.message || 'Nie udało się załadować zlecenia');
            } finally {
                setLoading(false);
            }
        };

        loadWorkOrder();
    }, [id]);

    const handleDelete = async () => {
        if (!workOrder) return;
        
        setDeleting(true);
        try {
            await workOrderService.deleteWorkOrder(workOrder.id);
            success(t('workOrder.deleteSuccess', { defaultValue: 'Zlecenie zostało usunięte' }));
            navigate('/work-orders');
        } catch (err) {
            error(t('workOrder.deleteError', { defaultValue: 'Nie udało się usunąć zlecenia' }));
        } finally {
            setDeleting(false);
            setDeleteModal(false);
        }
    };

    // Show error only after loading finished and there's an error or no data
    if (!loading && (loadError || !workOrder)) {
        return (
            <ErrorState 
                message={loadError || 'Work order not found'} 
                onRetry={() => window.location.reload()}
            />
        );
    }

    // While loading, render skeleton/placeholder
    if (loading || !workOrder) {
        return (
            <div>
                <PageHeader
                    title="..."
                    subtitle=""
                    breadcrumbs={[
                        { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                        { label: t('nav.workOrders', { defaultValue: 'Work Orders' }), path: '/work-orders' },
                        { label: '...' },
                    ]}
                />
                <MDBCard className="shadow-sm border-0">
                    <MDBCardBody className="p-4 text-center text-muted">
                        <MDBIcon icon="spinner" spin size="2x" className="mb-3" />
                        <p>{t('common.loading', { defaultValue: 'Loading...' })}</p>
                    </MDBCardBody>
                </MDBCard>
            </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            <PageHeader
                title={workOrder.title}
                subtitle={`#${workOrder.id}`}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.workOrders', { defaultValue: 'Zlecenia' }), path: '/work-orders' },
                    { label: workOrder.title },
                ]}
                backLink="/work-orders"
                actions={
                    <div className="d-flex gap-2">
                        {userPermissions.canEdit && (
                            <MDBBtn 
                                color="primary" 
                                onClick={() => navigate(`/work-orders/${workOrder.id}/edit`)}
                            >
                                <MDBIcon icon="edit" className="me-2" />
                                {t('common.edit', { defaultValue: 'Edytuj' })}
                            </MDBBtn>
                        )}
                        {userPermissions.canDelete && (
                            <MDBBtn 
                                color="danger" 
                                outline
                                onClick={() => setDeleteModal(true)}
                            >
                                <MDBIcon icon="trash" className="me-2" />
                                {t('common.delete', { defaultValue: 'Usuń' })}
                            </MDBBtn>
                        )}
                    </div>
                }
            />

            <MDBRow>
                {/* Main Info */}
                <MDBCol lg="8" className="mb-4">
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold">
                                <MDBIcon icon="info-circle" className="me-2 text-primary" />
                                {t('workOrder.details', { defaultValue: 'Szczegóły zlecenia' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBRow className="mb-3">
                                <MDBCol md="6">
                                    <p className="text-muted mb-1">{t('workOrder.status', { defaultValue: 'Status' })}</p>
                                    <StatusBadge status={workOrder.status?.name || 'new'} size="lg" />
                                </MDBCol>
                                <MDBCol md="6">
                                    <p className="text-muted mb-1">{t('workOrder.priority', { defaultValue: 'Priorytet' })}</p>
                                    <PriorityBadge priority={workOrder.priority?.name || 'medium'} size="lg" />
                                </MDBCol>
                            </MDBRow>

                            <div className="mb-3">
                                <p className="text-muted mb-1">{t('workOrder.description', { defaultValue: 'Opis' })}</p>
                                <p className="mb-0">{workOrder.description || '-'}</p>
                            </div>

                            {workOrder.equipment && (
                                <div className="mb-3">
                                    <p className="text-muted mb-1">{t('workOrder.equipment', { defaultValue: 'Sprzęt' })}</p>
                                    <div className="d-flex align-items-center gap-2">
                                        <MDBIcon icon="cog" className="text-secondary" />
                                        <span className="fw-semibold">{workOrder.equipment.name}</span>
                                        <MDBBadge color="light" className="text-dark">
                                            {workOrder.equipment.code}
                                        </MDBBadge>
                                    </div>
                                </div>
                            )}
                        </MDBCardBody>
                    </MDBCard>

                    {/* Activities */}
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-bold">
                                <MDBIcon icon="history" className="me-2 text-info" />
                                {t('workOrder.activities', { defaultValue: 'Historia aktywności' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody className="p-0">
                            {workOrder.activities && workOrder.activities.length > 0 ? (
                                <MDBListGroup flush>
                                    {workOrder.activities.map((activity) => (
                                        <MDBListGroupItem key={activity.id} className="px-4 py-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <div className="fw-semibold">{activity.action}</div>
                                                    <p className="mb-1 text-muted">{activity.description}</p>
                                                    <small className="text-muted">
                                                        <MDBIcon far icon="user" className="me-1" />
                                                        {activity.user?.fullName || activity.user?.email}
                                                    </small>
                                                </div>
                                                <small className="text-muted">
                                                    {formatDate(activity.createdAt)}
                                                </small>
                                            </div>
                                        </MDBListGroupItem>
                                    ))}
                                </MDBListGroup>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <MDBIcon icon="inbox" size="2x" className="mb-2 opacity-50" />
                                    <p className="mb-0">{t('workOrder.noActivities', { defaultValue: 'Brak aktywności' })}</p>
                                </div>
                            )}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                {/* Sidebar */}
                <MDBCol lg="4">
                    {/* Dates */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h6 className="mb-0 fw-bold">
                                <MDBIcon far icon="calendar-alt" className="me-2 text-warning" />
                                {t('workOrder.dates', { defaultValue: 'Daty' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="mb-3">
                                <small className="text-muted d-block">{t('workOrder.createdAt', { defaultValue: 'Utworzono' })}</small>
                                <span>{formatDate(workOrder.createdAt)}</span>
                            </div>
                            {workOrder.dueDate && (
                                <div className="mb-3">
                                    <small className="text-muted d-block">{t('workOrder.dueDate', { defaultValue: 'Termin' })}</small>
                                    <span className={
                                        new Date(workOrder.dueDate) < new Date() && workOrder.status?.name !== 'completed'
                                            ? 'text-danger fw-semibold'
                                            : ''
                                    }>
                                        {formatDate(workOrder.dueDate)}
                                    </span>
                                </div>
                            )}
                            {workOrder.completedAt && (
                                <div>
                                    <small className="text-muted d-block">{t('workOrder.completedAt', { defaultValue: 'Ukończono' })}</small>
                                    <span className="text-success">{formatDate(workOrder.completedAt)}</span>
                                </div>
                            )}
                        </MDBCardBody>
                    </MDBCard>

                    {/* Created By */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h6 className="mb-0 fw-bold">
                                <MDBIcon far icon="user" className="me-2 text-success" />
                                {t('workOrder.createdBy', { defaultValue: 'Utworzył' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex align-items-center gap-3">
                                <div 
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px', fontSize: '14px' }}
                                >
                                    {workOrder.createdBy?.firstName?.charAt(0) || 'U'}
                                    {workOrder.createdBy?.lastName?.charAt(0) || ''}
                                </div>
                                <div>
                                    <div className="fw-semibold">
                                        {workOrder.createdBy?.fullName || workOrder.createdBy?.email}
                                    </div>
                                    <small className="text-muted">{workOrder.createdBy?.email}</small>
                                </div>
                            </div>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Assigned Users */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h6 className="mb-0 fw-bold">
                                <MDBIcon icon="users" className="me-2 text-info" />
                                {t('workOrder.assignedUsers', { defaultValue: 'Przypisani' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            {workOrder.assignedUsers && workOrder.assignedUsers.length > 0 ? (
                                <div className="d-flex flex-column gap-2">
                                    {workOrder.assignedUsers.map((assignment) => (
                                        <div key={assignment.userId} className="d-flex align-items-center gap-2">
                                            <div 
                                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: '32px', height: '32px', fontSize: '12px' }}
                                            >
                                                {assignment.user?.firstName?.charAt(0) || 'U'}
                                            </div>
                                            <span>{assignment.user?.fullName || assignment.user?.email}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted mb-0">
                                    {t('workOrder.noAssignedUsers', { defaultValue: 'Brak przypisanych użytkowników' })}
                                </p>
                            )}
                        </MDBCardBody>
                    </MDBCard>

                    {/* Tags */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h6 className="mb-0 fw-bold">
                                <MDBIcon icon="tags" className="me-2 text-primary" />
                                {t('workOrder.tags', { defaultValue: 'Tagi' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            {workOrder.tags && workOrder.tags.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {workOrder.tags.map((tagAssignment) => (
                                        <MDBBadge 
                                            key={tagAssignment.tagId} 
                                            style={{ 
                                                backgroundColor: tagAssignment.tag?.color || '#6c757d',
                                                fontSize: '0.85rem',
                                                padding: '0.5rem 0.75rem'
                                            }}
                                        >
                                            {tagAssignment.tag?.name}
                                        </MDBBadge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted mb-0">
                                    {t('workOrder.noTags', { defaultValue: 'Brak tagów' })}
                                </p>
                            )}
                        </MDBCardBody>
                    </MDBCard>

                    {/* Planned Dates */}
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-bottom py-3">
                            <h6 className="mb-0 fw-bold">
                                <MDBIcon icon="clock" className="me-2 text-secondary" />
                                {t('workOrder.plannedDates', { defaultValue: 'Planowane terminy' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="mb-3">
                                <small className="text-muted d-block">{t('workOrder.plannedStartDate', { defaultValue: 'Planowany start' })}</small>
                                <span>{formatDate(workOrder.plannedStartDate) || '-'}</span>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">{t('workOrder.plannedEndDate', { defaultValue: 'Planowany koniec' })}</small>
                                <span>{formatDate(workOrder.plannedEndDate) || '-'}</span>
                            </div>
                            {workOrder.actualStartDate && (
                                <div className="mb-3">
                                    <small className="text-muted d-block">{t('workOrder.actualStartDate', { defaultValue: 'Faktyczny start' })}</small>
                                    <span className="text-success">{formatDate(workOrder.actualStartDate)}</span>
                                </div>
                            )}
                            {workOrder.actualEndDate && (
                                <div>
                                    <small className="text-muted d-block">{t('workOrder.actualEndDate', { defaultValue: 'Faktyczny koniec' })}</small>
                                    <span className="text-success">{formatDate(workOrder.actualEndDate)}</span>
                                </div>
                            )}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={workOrder.title}
                loading={deleting}
            />
        </div>
    );
};
