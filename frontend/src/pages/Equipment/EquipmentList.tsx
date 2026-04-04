/**
 * Equipment List Page
 * MDBDataTable with all equipment
 * Clean design - no duplicate search, parent name shown
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon, 
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    DeleteConfirmModal,
    useToast,
    MDBDataTable
} from '../../components/ui';
import { equipmentService } from '../../services';
import { Equipment } from '../../types';
import { useAuth } from '../../contexts';

// Type for MDBDatatable row data
interface DatatableRow {
    id: number;
    name: string;
    costCenter: string;
    parent: React.ReactNode;
    directWorkTime: string;
    totalWorkTime: string;
    actions: React.ReactNode;
    _original: Equipment;
    [key: string]: unknown;
}

export const EquipmentList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { permissions } = useAuth();

    // State
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Equipment | null }>({
        open: false,
        item: null,
    });
    const [deleting, setDeleting] = useState(false);

    // Load data
    const loadEquipment = useCallback(async () => {
        setLoading(true);
        try {
            const response = await equipmentService.getEquipmentList(1, 1000);
            const data = response.data || [];
            setEquipment(data);
        } catch (err) {
            console.error('Failed to load equipment:', err);
            error(t('equipment.loadError', { defaultValue: 'Nie udało się załadować sprzętu' }));
        } finally {
            setLoading(false);
        }
    }, [t, error]);

    useEffect(() => {
        loadEquipment();
    }, [loadEquipment]);

    // Handlers
    const handleDelete = async () => {
        if (!deleteModal.item) return;
        
        setDeleting(true);
        try {
            await equipmentService.deleteEquipment(deleteModal.item.id);
            success(t('equipment.deleteSuccess', { defaultValue: 'Sprzęt został usunięty' }));
            setDeleteModal({ open: false, item: null });
            loadEquipment();
        } catch (err) {
            console.error('Failed to delete equipment:', err);
            error(t('equipment.deleteError', { defaultValue: 'Nie udało się usunąć sprzętu' }));
        } finally {
            setDeleting(false);
        }
    };

    // Format time (minutes to hours:minutes)
    const formatTime = (minutes: number): string => {
        if (!minutes) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Prepare datatable columns
    const datatableColumns = useMemo(() => [
        { label: '#', field: 'id', sort: true, width: 60 },
        { label: t('equipment.name', { defaultValue: 'Nazwa' }), field: 'name', sort: true, width: 250 },
        { label: t('equipment.costCenter', { defaultValue: 'Centrum kosztów' }), field: 'costCenter', sort: true, width: 140 },
        { label: t('equipment.parent', { defaultValue: 'Element nadrzędny' }), field: 'parent', sort: true, width: 200 },
        { label: t('equipment.directWorkTime', { defaultValue: 'Czas bezpośredni' }), field: 'directWorkTime', sort: true, width: 130 },
        { label: t('equipment.totalWorkTime', { defaultValue: 'Czas całkowity' }), field: 'totalWorkTime', sort: true, width: 130 },
        { label: t('common.actions', { defaultValue: 'Akcje' }), field: 'actions', sort: false, width: 140 },
    ], [t]);

    // Prepare datatable rows
    const datatableRows: DatatableRow[] = useMemo(() => {
        return equipment.map((eq) => ({
            id: eq.id,
            name: eq.name,
            costCenter: eq.costCenter?.toString() || '-',
            parent: eq.parentEquipmentName ? (
                <span 
                    className="text-primary" 
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (eq.parentEquipmentId) {
                            navigate(`/equipment/${eq.parentEquipmentId}`);
                        }
                    }}
                >
                    <MDBIcon icon="link" className="me-1" size="sm" />
                    {eq.parentEquipmentName}
                </span>
            ) : (
                <span className="text-muted">-</span>
            ),
            directWorkTime: formatTime(eq.directWorkTime || 0),
            totalWorkTime: formatTime(eq.totalWorkTime || 0),
            actions: (
                <div className="d-flex gap-1">
                    <MDBBtn
                        size="sm"
                        color="info"
                        floating
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            navigate(`/equipment/${eq.id}`);
                        }}
                        title={t('common.view', { defaultValue: 'Podgląd' })}
                    >
                        <MDBIcon icon="eye" />
                    </MDBBtn>
                    {permissions.canManageEquipment && (
                        <>
                            <MDBBtn
                                size="sm"
                                color="warning"
                                floating
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    navigate(`/equipment/${eq.id}/edit`);
                                }}
                                title={t('common.edit', { defaultValue: 'Edytuj' })}
                            >
                                <MDBIcon icon="edit" />
                            </MDBBtn>
                            <MDBBtn
                                size="sm"
                                color="danger"
                                floating
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setDeleteModal({ open: true, item: eq });
                                }}
                                title={t('common.delete', { defaultValue: 'Usuń' })}
                            >
                                <MDBIcon icon="trash" />
                            </MDBBtn>
                        </>
                    )}
                </div>
            ),
            _original: eq,
        }));
    }, [equipment, navigate, permissions, t]);

    // Handle row click
    const handleRowClick = (row: unknown) => {
        const typedRow = row as DatatableRow;
        if (typedRow._original) {
            navigate(`/equipment/${typedRow._original.id}`);
        }
    };

    // Stats
    const stats = useMemo(() => ({
        total: equipment.length,
        withParent: equipment.filter(e => e.parentEquipmentId).length,
        rootLevel: equipment.filter(e => !e.parentEquipmentId).length,
        totalWorkTimeSum: equipment.reduce((sum, e) => sum + (e.totalWorkTime || 0), 0),
    }), [equipment]);

    return (
        <div>
            <PageHeader
                title={t('equipment.list', { defaultValue: 'Lista sprzętu' })}
                subtitle={t('equipment.listSubtitle', { 
                    defaultValue: `Łącznie ${stats.total} elementów`,
                    count: stats.total 
                })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Pulpit' }), path: '/' },
                    { label: t('nav.equipment', { defaultValue: 'Sprzęt' }) },
                ]}
                actions={
                    permissions.canManageEquipment && (
                        <MDBBtn color="primary" onClick={() => navigate('/equipment/new')}>
                            <MDBIcon icon="plus" className="me-2" />
                            {t('equipment.create', { defaultValue: 'Dodaj sprzęt' })}
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
                                <MDBIcon icon="cogs" size="lg" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.total}</h4>
                                <small className="text-muted">{t('equipment.total', { defaultValue: 'Łącznie' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="sitemap" size="lg" className="text-info" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.rootLevel}</h4>
                                <small className="text-muted">{t('equipment.rootLevel', { defaultValue: 'Główne' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="level-down-alt" size="lg" className="text-success" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.withParent}</h4>
                                <small className="text-muted">{t('equipment.withParent', { defaultValue: 'Podrzędne' })}</small>
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
                                <h4 className="mb-0">{formatTime(stats.totalWorkTimeSum)}</h4>
                                <small className="text-muted">{t('equipment.totalWorkTime', { defaultValue: 'Łączny czas pracy' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* DataTable */}
            <MDBCard className="shadow-sm border-0">
                <MDBCardBody className="p-0 table-responsive">
                    <MDBDataTable
                        columns={datatableColumns}
                        rows={datatableRows}
                        loading={loading}
                        onRowClick={handleRowClick}
                        noFoundMessage={{
                            icon: 'cogs',
                            iconColor: 'text-muted',
                            title: t('equipment.noEquipment', { defaultValue: 'Brak sprzętu do wyświetlenia' }),
                            subtitle: t('equipment.noEquipmentHint', { defaultValue: 'Dodaj nowy sprzęt aby rozpocząć' }),
                        }}
                        loadingMessage={{
                            text: t('equipment.loading', { defaultValue: 'Ładowanie sprzętu...' }),
                        }}
                    />
                </MDBCardBody>
            </MDBCard>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, item: null })}
                onConfirm={handleDelete}
                itemName={deleteModal.item?.name || ''}
                loading={deleting}
            />
        </div>
    );
};
