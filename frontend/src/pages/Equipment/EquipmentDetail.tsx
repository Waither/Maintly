/**
 * Equipment Detail Page
 * View equipment details - aligned with backend API
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
    ErrorState,
    DeleteConfirmModal,
    useToast
} from '../../components/ui';
import { equipmentService } from '../../services';
import { Equipment } from '../../types';

export const EquipmentDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    
    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // User permissions
    const userPermissions = {
        canEdit: true,
        canDelete: true,
    };

    useEffect(() => {
        const loadEquipment = async () => {
            if (!id) return;
            
            setLoading(true);
            setLoadError(null);
            
            try {
                const data = await equipmentService.getEquipment(parseInt(id));
                setEquipment(data);
            } catch (err: any) {
                console.error('Failed to load equipment:', err);
                setLoadError(err.response?.data?.message || 'Failed to load equipment');
            } finally {
                setLoading(false);
            }
        };

        loadEquipment();
    }, [id]);

    const handleDelete = async () => {
        if (!equipment) return;
        
        setDeleting(true);
        try {
            await equipmentService.deleteEquipment(equipment.id);
            success(t('equipment.deleteSuccess', { defaultValue: 'Equipment deleted successfully' }));
            navigate('/equipment');
        } catch (err) {
            error(t('equipment.deleteError', { defaultValue: 'Failed to delete equipment' }));
        } finally {
            setDeleting(false);
            setDeleteModal(false);
        }
    };

    // Show error only after loading finished
    if (!loading && (loadError || !equipment)) {
        return (
            <ErrorState 
                message={loadError || 'Equipment not found'} 
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Loading skeleton
    if (loading || !equipment) {
        return (
            <div>
                <PageHeader
                    title="..."
                    subtitle=""
                    breadcrumbs={[
                        { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                        { label: t('nav.equipment', { defaultValue: 'Equipment' }), path: '/equipment' },
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
        });
    };

    // Format time (minutes to hours:minutes)
    const formatTime = (minutes?: number): string => {
        if (!minutes) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div>
            <PageHeader
                title={equipment.name}
                subtitle={`Cost Center: ${equipment.costCenter || '-'}`}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.equipment', { defaultValue: 'Equipment' }), path: '/equipment' },
                    { label: equipment.name },
                ]}
                backLink="/equipment"
                actions={
                    <div className="d-flex gap-2">
                        {userPermissions.canEdit && (
                            <MDBBtn 
                                color="primary" 
                                onClick={() => navigate(`/equipment/${equipment.id}/edit`)}
                            >
                                <MDBIcon icon="edit" className="me-2" />
                                {t('common.edit', { defaultValue: 'Edit' })}
                            </MDBBtn>
                        )}
                        {userPermissions.canDelete && (
                            <MDBBtn 
                                color="danger" 
                                outline
                                onClick={() => setDeleteModal(true)}
                            >
                                <MDBIcon icon="trash" className="me-2" />
                                {t('common.delete', { defaultValue: 'Delete' })}
                            </MDBBtn>
                        )}
                    </div>
                }
            />

            <MDBRow className="g-4">
                {/* Main Info */}
                <MDBCol lg="8">
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="info-circle" className="me-2 text-primary" />
                                {t('equipment.basicInfo', { defaultValue: 'Basic Information' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBRow className="g-3">
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('equipment.name', { defaultValue: 'Name' })}
                                        </label>
                                        <span className="fw-medium">{equipment.name}</span>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('equipment.costCenter', { defaultValue: 'Cost Center' })}
                                        </label>
                                        <span className="fw-medium font-monospace">{equipment.costCenter || '-'}</span>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('equipment.qrCode', { defaultValue: 'QR Code' })}
                                        </label>
                                        <span className="font-monospace">{equipment.qrCodeData || '-'}</span>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('equipment.parent', { defaultValue: 'Parent Equipment' })}
                                        </label>
                                        {equipment.parentEquipmentId ? (
                                            <MDBBadge color="info" pill>
                                                ID: {equipment.parentEquipmentId}
                                            </MDBBadge>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>

                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="clock" className="me-2 text-primary" />
                                {t('equipment.workTime', { defaultValue: 'Work Time' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBRow className="g-3">
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('equipment.directWorkTime', { defaultValue: 'Direct Work Time' })}
                                        </label>
                                        <span className="fw-medium fs-5">{formatTime(equipment.directWorkTime)}</span>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('equipment.totalWorkTime', { defaultValue: 'Total Work Time' })}
                                        </label>
                                        <span className="fw-medium fs-5">{formatTime(equipment.totalWorkTime)}</span>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Tags */}
                    {equipment.tags && equipment.tags.length > 0 && (
                        <MDBCard className="shadow-sm border-0">
                            <MDBCardHeader className="bg-white border-0 py-3">
                                <h5 className="mb-0">
                                    <MDBIcon icon="tags" className="me-2 text-primary" />
                                    {t('equipment.tags', { defaultValue: 'Tags' })}
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <div className="d-flex flex-wrap gap-2">
                                    {equipment.tags.map((tag) => (
                                        <MDBBadge 
                                            key={tag.id} 
                                            style={{ backgroundColor: tag.color || '#6c757d' }}
                                        >
                                            {tag.name}
                                        </MDBBadge>
                                    ))}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    )}
                </MDBCol>

                {/* Sidebar */}
                <MDBCol lg="4">
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="calendar-alt" className="me-2 text-primary" />
                                {t('equipment.dates', { defaultValue: 'Dates' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBListGroup flush>
                                <MDBListGroupItem className="d-flex justify-content-between border-0 px-0">
                                    <span className="text-muted">{t('common.createdAt', { defaultValue: 'Created' })}</span>
                                    <span className="fw-medium">{formatDate(equipment.createdAt)}</span>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between border-0 px-0">
                                    <span className="text-muted">{t('common.updatedAt', { defaultValue: 'Updated' })}</span>
                                    <span className="fw-medium">{formatDate(equipment.updatedAt)}</span>
                                </MDBListGroupItem>
                            </MDBListGroup>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Files */}
                    {equipment.files && equipment.files.length > 0 && (
                        <MDBCard className="shadow-sm border-0">
                            <MDBCardHeader className="bg-white border-0 py-3">
                                <h5 className="mb-0">
                                    <MDBIcon icon="file" className="me-2 text-primary" />
                                    {t('equipment.files', { defaultValue: 'Files' })}
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody className="p-0">
                                <MDBListGroup flush>
                                    {equipment.files.map((file) => (
                                        <MDBListGroupItem key={file.id} className="py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <MDBIcon icon="file-alt" className="me-2 text-muted" />
                                                    <span className="fw-medium">{file.fileName}</span>
                                                </div>
                                                <small className="text-muted">
                                                    {(file.fileSize || file.size) ? `${Math.round((file.fileSize || file.size || 0) / 1024)} KB` : ''}
                                                </small>
                                            </div>
                                        </MDBListGroupItem>
                                    ))}
                                </MDBListGroup>
                            </MDBCardBody>
                        </MDBCard>
                    )}
                </MDBCol>
            </MDBRow>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={equipment.name}
                loading={deleting}
            />
        </div>
    );
};
