/**
 * Equipment Detail Page
 * Beautiful equipment view with all information
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader,
    MDBBtn, 
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBBadge,
    MDBTable,
    MDBTableHead,
    MDBTableBody
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
import { useAuth } from '../../contexts';

export const EquipmentDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { permissions } = useAuth();

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    
    // Delete modal
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
                setLoadError(err.response?.data?.message || 'Nie udało się załadować sprzętu');
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
            success(t('equipment.deleteSuccess', { defaultValue: 'Sprzęt został usunięty' }));
            navigate('/equipment');
        } catch (err) {
            error(t('equipment.deleteError', { defaultValue: 'Nie udało się usunąć sprzętu' }));
        } finally {
            setDeleting(false);
            setDeleteModal(false);
        }
    };

    // Show error only after loading finished
    if (!loading && (loadError || !equipment)) {
        return (
            <ErrorState 
                message={loadError || 'Nie znaleziono sprzętu'} 
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
                        { label: t('nav.dashboard', { defaultValue: 'Pulpit' }), path: '/' },
                        { label: t('nav.equipment', { defaultValue: 'Sprzęt' }), path: '/equipment' },
                        { label: '...' },
                    ]}
                />
                <MDBCard className="shadow-sm border-0">
                    <MDBCardBody className="p-4 text-center text-muted">
                        <MDBIcon icon="spinner" spin size="2x" className="mb-3" />
                        <p>{t('common.loading', { defaultValue: 'Ładowanie...' })}</p>
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

    const formatTime = (minutes?: number): string => {
        if (!minutes) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div>
            <PageHeader
                title={equipment.name}
                subtitle={equipment.costCenter ? `Centrum kosztów: ${equipment.costCenter}` : undefined}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Pulpit' }), path: '/' },
                    { label: t('nav.equipment', { defaultValue: 'Sprzęt' }), path: '/equipment' },
                    { label: equipment.name },
                ]}
                backLink="/equipment"
                actions={
                    permissions.canManageEquipment && (
                        <div className="d-flex gap-2">
                            <MDBBtn 
                                color="primary" 
                                onClick={() => navigate(`/equipment/${equipment.id}/edit`)}
                            >
                                <MDBIcon icon="edit" className="me-2" />
                                {t('common.edit', { defaultValue: 'Edytuj' })}
                            </MDBBtn>
                            <MDBBtn 
                                color="danger" 
                                outline
                                onClick={() => setDeleteModal(true)}
                            >
                                <MDBIcon icon="trash" className="me-2" />
                                {t('common.delete', { defaultValue: 'Usuń' })}
                            </MDBBtn>
                        </div>
                    )
                }
            />

            <MDBRow className="g-4">
                {/* Main Content */}
                <MDBCol lg="8">
                    {/* Hero Card */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardBody className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div 
                                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white me-3"
                                    style={{ width: 64, height: 64, fontSize: '1.5rem', fontWeight: 600 }}
                                >
                                    {getInitials(equipment.name)}
                                </div>
                                <div>
                                    <h3 className="mb-1">{equipment.name}</h3>
                                    <div className="text-muted">
                                        ID: {equipment.id} • Centrum kosztów: {equipment.costCenter || '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <MDBRow className="g-3">
                                <MDBCol md="3" sm="6">
                                    <div className="bg-light rounded p-3 text-center">
                                        <MDBIcon icon="clock" className="text-primary mb-2" size="lg" />
                                        <div className="fw-bold">{formatTime(equipment.directWorkTime)}</div>
                                        <small className="text-muted">Czas bezpośredni</small>
                                    </div>
                                </MDBCol>
                                <MDBCol md="3" sm="6">
                                    <div className="bg-light rounded p-3 text-center">
                                        <MDBIcon icon="hourglass-half" className="text-success mb-2" size="lg" />
                                        <div className="fw-bold">{formatTime(equipment.totalWorkTime)}</div>
                                        <small className="text-muted">Czas całkowity</small>
                                    </div>
                                </MDBCol>
                                <MDBCol md="3" sm="6">
                                    <div className="bg-light rounded p-3 text-center">
                                        <MDBIcon icon="sitemap" className="text-info mb-2" size="lg" />
                                        <div className="fw-bold">{equipment.childrenCount || 0}</div>
                                        <small className="text-muted">Elementy podrzędne</small>
                                    </div>
                                </MDBCol>
                                <MDBCol md="3" sm="6">
                                    <div className="bg-light rounded p-3 text-center">
                                        <MDBIcon icon="clipboard-list" className="text-warning mb-2" size="lg" />
                                        <div className="fw-bold">{equipment.workOrdersCount || 0}</div>
                                        <small className="text-muted">Zlecenia</small>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Parent Equipment */}
                    {equipment.parentEquipmentId && (
                        <MDBCard className="shadow-sm border-0 mb-4">
                            <MDBCardHeader className="bg-white border-0 py-3">
                                <h5 className="mb-0">
                                    <MDBIcon icon="level-up-alt" className="me-2 text-primary" />
                                    Element nadrzędny
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <Link 
                                    to={`/equipment/${equipment.parentEquipmentId}`}
                                    className="d-flex align-items-center text-decoration-none"
                                >
                                    <div 
                                        className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                                        style={{ width: 48, height: 48 }}
                                    >
                                        <MDBIcon icon="cog" className="text-info" />
                                    </div>
                                    <div>
                                        <div className="fw-medium text-dark">{equipment.parentEquipmentName || `ID: ${equipment.parentEquipmentId}`}</div>
                                        <small className="text-muted">Kliknij aby przejść</small>
                                    </div>
                                    <MDBIcon icon="chevron-right" className="ms-auto text-muted" />
                                </Link>
                            </MDBCardBody>
                        </MDBCard>
                    )}

                    {/* Children Equipment */}
                    {equipment.children && equipment.children.length > 0 && (
                        <MDBCard className="shadow-sm border-0 mb-4">
                            <MDBCardHeader className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <MDBIcon icon="sitemap" className="me-2 text-primary" />
                                    Elementy podrzędne ({equipment.children.length})
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody className="p-0">
                                <MDBTable hover className="mb-0">
                                    <MDBTableHead light>
                                        <tr>
                                            <th>Nazwa</th>
                                            <th>Centrum kosztów</th>
                                            <th></th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {equipment.children.map((child) => (
                                            <tr key={child.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/equipment/${child.id}`)}>
                                                <td className="fw-medium">{child.name}</td>
                                                <td>{child.costCenter || '-'}</td>
                                                <td className="text-end">
                                                    <MDBIcon icon="chevron-right" className="text-muted" />
                                                </td>
                                            </tr>
                                        ))}
                                    </MDBTableBody>
                                </MDBTable>
                            </MDBCardBody>
                        </MDBCard>
                    )}

                    {/* Tags */}
                    {equipment.tags && equipment.tags.length > 0 && (
                        <MDBCard className="shadow-sm border-0 mb-4">
                            <MDBCardHeader className="bg-white border-0 py-3">
                                <h5 className="mb-0">
                                    <MDBIcon icon="tags" className="me-2 text-primary" />
                                    Tagi
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <div className="d-flex flex-wrap gap-2">
                                    {equipment.tags.map((tag) => (
                                        <MDBBadge 
                                            key={tag.id} 
                                            style={{ backgroundColor: tag.color || '#6c757d' }}
                                            className="py-2 px-3"
                                        >
                                            {tag.name}
                                        </MDBBadge>
                                    ))}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    )}

                    {/* Files */}
                    {equipment.files && equipment.files.length > 0 && (
                        <MDBCard className="shadow-sm border-0">
                            <MDBCardHeader className="bg-white border-0 py-3">
                                <h5 className="mb-0">
                                    <MDBIcon icon="paperclip" className="me-2 text-primary" />
                                    Załączniki ({equipment.files.length})
                                </h5>
                            </MDBCardHeader>
                            <MDBCardBody className="p-0">
                                <MDBTable hover className="mb-0">
                                    <MDBTableHead light>
                                        <tr>
                                            <th>Nazwa pliku</th>
                                            <th>Typ</th>
                                            <th>Rozmiar</th>
                                            <th>Data</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {equipment.files.map((file) => (
                                            <tr key={file.id}>
                                                <td>
                                                    <MDBIcon icon="file-alt" className="me-2 text-muted" />
                                                    {file.fileName}
                                                </td>
                                                <td><MDBBadge color="light" className="text-dark">{file.fileType || '-'}</MDBBadge></td>
                                                <td>{file.fileSize ? `${Math.round(file.fileSize / 1024)} KB` : '-'}</td>
                                                <td>{formatDate(file.uploadedAt)}</td>
                                            </tr>
                                        ))}
                                    </MDBTableBody>
                                </MDBTable>
                            </MDBCardBody>
                        </MDBCard>
                    )}
                </MDBCol>

                {/* Sidebar */}
                <MDBCol lg="4">
                    {/* Info Card */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="info-circle" className="me-2 text-primary" />
                                Informacje
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="mb-3 pb-3 border-bottom">
                                <small className="text-muted d-block mb-1">Nazwa</small>
                                <span className="fw-medium">{equipment.name}</span>
                            </div>
                            <div className="mb-3 pb-3 border-bottom">
                                <small className="text-muted d-block mb-1">Centrum kosztów</small>
                                <span className="fw-medium font-monospace">{equipment.costCenter || '-'}</span>
                            </div>
                            <div className="mb-3 pb-3 border-bottom">
                                <small className="text-muted d-block mb-1">Kod QR</small>
                                <span className="font-monospace">{equipment.qrCodeData || '-'}</span>
                            </div>
                            <div>
                                <small className="text-muted d-block mb-1">Element nadrzędny</small>
                                {equipment.parentEquipmentName ? (
                                    <Link to={`/equipment/${equipment.parentEquipmentId}`} className="text-primary">
                                        {equipment.parentEquipmentName}
                                    </Link>
                                ) : (
                                    <span className="text-muted">Brak (element główny)</span>
                                )}
                            </div>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Dates Card */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="calendar-alt" className="me-2 text-primary" />
                                Daty
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Utworzono</span>
                                <span className="fw-medium">{formatDate(equipment.createdAt)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Zaktualizowano</span>
                                <span className="fw-medium">{formatDate(equipment.updatedAt)}</span>
                            </div>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Quick Actions */}
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="bolt" className="me-2 text-primary" />
                                Szybkie akcje
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody className="d-grid gap-2">
                            <MDBBtn 
                                color="primary" 
                                outline
                                onClick={() => navigate(`/work-orders/new?equipmentId=${equipment.id}`)}
                            >
                                <MDBIcon icon="plus" className="me-2" />
                                Nowe zlecenie
                            </MDBBtn>
                            <MDBBtn 
                                color="info" 
                                outline
                                onClick={() => navigate(`/work-orders?equipmentId=${equipment.id}`)}
                            >
                                <MDBIcon icon="clipboard-list" className="me-2" />
                                Zobacz zlecenia
                            </MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
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
