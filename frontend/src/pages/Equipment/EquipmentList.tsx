/**
 * Equipment List Page
 * MDBDataTable with all equipment
 * Aligned with backend API: id, name, costCenter, qrCodeData, parentEquipmentId, directWorkTime, totalWorkTime
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon, 
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBadge
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

// Type for MDBDatatable row data
interface DatatableRow {
    id: number;
    name: string;
    costCenter: number;
    qrCodeData: string;
    directWorkTime: string;
    totalWorkTime: string;
    hasParent: React.ReactNode;
    actions: React.ReactNode;
    _original: Equipment;
    [key: string]: unknown;
}

export const EquipmentList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { success, error } = useToast();

    // State
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Search filter
    const [searchTerm, setSearchTerm] = useState('');

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Equipment | null }>({
        open: false,
        item: null,
    });
    const [deleting, setDeleting] = useState(false);

    // User permissions
    const userPermissions = {
        canCreate: true,
        canEdit: true,
        canDelete: true,
    };

    // Load data
    const loadEquipment = useCallback(async () => {
        setLoading(true);
        try {
            const response = await equipmentService.getEquipmentList(1, 1000);
            const data = response.data || [];
            setEquipment(data);
        } catch (err) {
            console.error('Failed to load equipment:', err);
            error(t('equipment.loadError', { defaultValue: 'Failed to load equipment' }));
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
            success(t('equipment.deleteSuccess', { defaultValue: 'Equipment deleted successfully' }));
            setDeleteModal({ open: false, item: null });
            loadEquipment();
        } catch (err) {
            console.error('Failed to delete equipment:', err);
            error(t('equipment.deleteError', { defaultValue: 'Failed to delete equipment' }));
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

    // Filtered equipment
    const filteredEquipment = useMemo(() => {
        if (!searchTerm) return equipment;
        const term = searchTerm.toLowerCase();
        return equipment.filter(eq => 
            eq.name?.toLowerCase().includes(term) ||
            eq.costCenter?.toString().includes(term) ||
            eq.qrCodeData?.toLowerCase().includes(term)
        );
    }, [equipment, searchTerm]);

    // Prepare datatable columns
    const datatableColumns = useMemo(() => [
        { label: '#', field: 'id', sort: true, width: 60 },
        { label: t('equipment.name', { defaultValue: 'Name' }), field: 'name', sort: true, width: 200 },
        { label: t('equipment.costCenter', { defaultValue: 'Cost Center' }), field: 'costCenter', sort: true, width: 120 },
        { label: t('equipment.qrCode', { defaultValue: 'QR Code' }), field: 'qrCodeData', sort: true, width: 150 },
        { label: t('equipment.directWorkTime', { defaultValue: 'Direct Time' }), field: 'directWorkTime', sort: true, width: 120 },
        { label: t('equipment.totalWorkTime', { defaultValue: 'Total Time' }), field: 'totalWorkTime', sort: true, width: 120 },
        { label: t('equipment.parent', { defaultValue: 'Parent' }), field: 'hasParent', sort: false, width: 100 },
        { label: t('common.actions', { defaultValue: 'Actions' }), field: 'actions', sort: false, width: 140 },
    ], [t]);

    // Prepare datatable rows
    const datatableRows: DatatableRow[] = useMemo(() => {
        return filteredEquipment.map((eq) => ({
            id: eq.id,
            name: eq.name,
            costCenter: eq.costCenter || 0,
            qrCodeData: eq.qrCodeData || '-',
            directWorkTime: formatTime(eq.directWorkTime || 0),
            totalWorkTime: formatTime(eq.totalWorkTime || 0),
            hasParent: eq.parentEquipmentId ? (
                <MDBBadge color="info" pill>{t('common.yes', { defaultValue: 'Yes' })}</MDBBadge>
            ) : (
                <MDBBadge color="light" className="text-dark" pill>{t('common.no', { defaultValue: 'No' })}</MDBBadge>
            ),
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
                                navigate(`/equipment/${eq.id}/edit`);
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
                                setDeleteModal({ open: true, item: eq });
                            }}
                            title={t('common.delete', { defaultValue: 'Delete' })}
                        >
                            <MDBIcon icon="trash" />
                        </MDBBtn>
                    )}
                </div>
            ),
            _original: eq,
        }));
    }, [filteredEquipment, navigate, userPermissions, t]);

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
        withQrCode: equipment.filter(e => e.qrCodeData).length,
        totalWorkTimeSum: equipment.reduce((sum, e) => sum + (e.totalWorkTime || 0), 0),
    }), [equipment]);

    return (
        <div>
            <PageHeader
                title={t('equipment.list', { defaultValue: 'Equipment' })}
                subtitle={t('equipment.listSubtitle', { 
                    defaultValue: `Total ${stats.total} items`,
                    count: stats.total 
                })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.equipment', { defaultValue: 'Equipment' }) },
                ]}
                actions={
                    userPermissions.canCreate && (
                        <MDBBtn color="primary" onClick={() => navigate('/equipment/new')}>
                            <MDBIcon icon="plus" className="me-2" />
                            {t('equipment.create', { defaultValue: 'Add Equipment' })}
                        </MDBBtn>
                    )
                }
            />

            {/* Quick Stats */}
            <MDBRow className="mb-4 g-3">
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="cogs" size="lg" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.total}</h4>
                                <small className="text-muted">{t('equipment.total', { defaultValue: 'Total' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="sitemap" size="lg" className="text-info" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.withParent}</h4>
                                <small className="text-muted">{t('equipment.withParent', { defaultValue: 'With Parent' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="qrcode" size="lg" className="text-success" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.withQrCode}</h4>
                                <small className="text-muted">{t('equipment.withQrCode', { defaultValue: 'With QR Code' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="clock" size="lg" className="text-warning" />
                            </div>
                            <div>
                                <h4 className="mb-0">{formatTime(stats.totalWorkTimeSum)}</h4>
                                <small className="text-muted">{t('equipment.totalWorkTime', { defaultValue: 'Total Work Time' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Search Filter */}
            <MDBCard className="mb-4 shadow-sm border-0">
                <MDBCardBody>
                    <MDBRow className="g-3 align-items-end">
                        <MDBCol md="6">
                            <MDBInput
                                label={t('common.search', { defaultValue: 'Search...' })}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </MDBCol>
                        <MDBCol md="6">
                            {searchTerm && (
                                <MDBBtn 
                                    type="button" 
                                    color="light"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <MDBIcon icon="times" className="me-2" />
                                    {t('common.clearFilters', { defaultValue: 'Clear' })}
                                </MDBBtn>
                            )}
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
                        onRowClick={handleRowClick}
                        noFoundMessage={{
                            icon: 'cogs',
                            iconColor: 'text-muted',
                            title: t('equipment.noEquipment', { defaultValue: 'No equipment to display' }),
                            subtitle: t('equipment.noEquipmentHint', { defaultValue: 'Try changing filters or add new equipment' }),
                        }}
                        loadingMessage={{
                            text: t('equipment.loading', { defaultValue: 'Loading equipment...' }),
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
