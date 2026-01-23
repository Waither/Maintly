/**
 * User Detail Page
 * View user details and activity
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
import { userService } from '../../services';
import { User } from '../../types';

export const UserDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const [user, setUser] = useState<User | null>(null);
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
        const loadUser = async () => {
            if (!id) return;
            
            setLoading(true);
            setLoadError(null);
            
            try {
                const data = await userService.getUser(parseInt(id));
                setUser(data);
            } catch (err: any) {
                console.error('Failed to load user:', err);
                setLoadError(err.response?.data?.message || 'Failed to load user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    const handleDelete = async () => {
        if (!user) return;
        
        setDeleting(true);
        try {
            await userService.deleteUser(user.id);
            success(t('user.deleteSuccess', { defaultValue: 'User deleted successfully' }));
            navigate('/users');
        } catch (err) {
            error(t('user.deleteError', { defaultValue: 'Failed to delete user' }));
        } finally {
            setDeleting(false);
            setDeleteModal(false);
        }
    };

    const handleToggleActive = async () => {
        if (!user) return;
        
        try {
            await userService.toggleActive(user.id);
            success(
                user.isActive 
                    ? t('user.deactivated', { defaultValue: 'User deactivated' })
                    : t('user.activated', { defaultValue: 'User activated' })
            );
            // Reload user data
            const data = await userService.getUser(user.id);
            setUser(data);
        } catch (err) {
            error(t('user.toggleError', { defaultValue: 'Failed to toggle user status' }));
        }
    };

    // Show error only after loading finished
    if (!loading && (loadError || !user)) {
        return (
            <ErrorState 
                message={loadError || 'User not found'} 
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Loading skeleton
    if (loading || !user) {
        return (
            <div>
                <PageHeader
                    title="..."
                    subtitle=""
                    breadcrumbs={[
                        { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                        { label: t('nav.users', { defaultValue: 'Users' }), path: '/users' },
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

    const getInitials = () => {
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <div>
            <PageHeader
                title={user.fullName || `${user.firstName} ${user.lastName}`}
                subtitle={user.email}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.users', { defaultValue: 'Users' }), path: '/users' },
                    { label: user.fullName || user.email },
                ]}
                backLink="/users"
                actions={
                    <div className="d-flex gap-2">
                        {userPermissions.canEdit && (
                            <>
                                <MDBBtn 
                                    color={user.isActive ? 'secondary' : 'success'}
                                    outline
                                    onClick={handleToggleActive}
                                >
                                    <MDBIcon icon={user.isActive ? 'user-slash' : 'user-check'} className="me-2" />
                                    {user.isActive 
                                        ? t('user.deactivate', { defaultValue: 'Deactivate' })
                                        : t('user.activate', { defaultValue: 'Activate' })
                                    }
                                </MDBBtn>
                                <MDBBtn 
                                    color="primary" 
                                    onClick={() => navigate(`/users/${user.id}/edit`)}
                                >
                                    <MDBIcon icon="edit" className="me-2" />
                                    {t('common.edit', { defaultValue: 'Edit' })}
                                </MDBBtn>
                            </>
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
                                <MDBIcon icon="user" className="me-2 text-primary" />
                                {t('user.basicInfo', { defaultValue: 'Basic Information' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBRow className="g-3">
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('user.firstName', { defaultValue: 'First Name' })}
                                        </label>
                                        <span className="fw-medium">{user.firstName}</span>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('user.lastName', { defaultValue: 'Last Name' })}
                                        </label>
                                        <span className="fw-medium">{user.lastName}</span>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('user.email', { defaultValue: 'Email' })}
                                        </label>
                                        <a href={`mailto:${user.email}`} className="fw-medium">
                                            {user.email}
                                        </a>
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">
                                            {t('user.phone', { defaultValue: 'Phone' })}
                                        </label>
                                        {user.phone ? (
                                            <a href={`tel:${user.phone}`} className="fw-medium">
                                                {user.phone}
                                            </a>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>

                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="user-shield" className="me-2 text-primary" />
                                {t('user.rolesAndPermissions', { defaultValue: 'Roles & Permissions' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex flex-wrap gap-2">
                                {(() => {
                                    const role = (user as any).userRole;
                                    if (!role) {
                                        return <span className="text-muted">{t('user.noRoles', { defaultValue: 'No role assigned' })}</span>;
                                    }
                                    const roleName = role.name || '';
                                    const isAdmin = roleName === 'admin' || roleName === 'ROLE_ADMIN';
                                    const isManager = roleName === 'manager' || roleName === 'ROLE_MANAGER';
                                    const displayName = roleName.replace('ROLE_', '').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase());
                                    
                                    return (
                                        <MDBBadge 
                                            color={isAdmin ? 'danger' : isManager ? 'warning' : 'info'}
                                            className="py-2 px-3"
                                        >
                                            <MDBIcon 
                                                icon={isAdmin ? 'crown' : isManager ? 'user-tie' : 'user'} 
                                                className="me-2" 
                                            />
                                            {displayName}
                                        </MDBBadge>
                                    );
                                })()}
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                {/* Sidebar */}
                <MDBCol lg="4">
                    {/* Avatar & Status */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardBody className="text-center py-4">
                            <div 
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white mx-auto mb-3"
                                style={{ width: 80, height: 80, fontSize: '1.5rem' }}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.fullName} className="rounded-circle" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                                ) : (
                                    <span className="fw-bold">{getInitials()}</span>
                                )}
                            </div>
                            <h5 className="mb-1">{user.fullName || `${user.firstName} ${user.lastName}`}</h5>
                            <p className="text-muted mb-3">{user.email}</p>
                            <MDBBadge color={user.isActive ? 'success' : 'secondary'} pill className="px-3 py-2">
                                <MDBIcon icon={user.isActive ? 'check-circle' : 'times-circle'} className="me-2" />
                                {user.isActive 
                                    ? t('user.active', { defaultValue: 'Active' }) 
                                    : t('user.inactive', { defaultValue: 'Inactive' })
                                }
                            </MDBBadge>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Activity */}
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="history" className="me-2 text-primary" />
                                {t('user.activity', { defaultValue: 'Activity' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBListGroup flush>
                                <MDBListGroupItem className="d-flex justify-content-between border-0 px-0">
                                    <span className="text-muted">{t('user.lastLogin', { defaultValue: 'Last Login' })}</span>
                                    <span className="fw-medium">{formatDate(user.lastLoginAt)}</span>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between border-0 px-0">
                                    <span className="text-muted">{t('common.createdAt', { defaultValue: 'Created' })}</span>
                                    <span className="fw-medium">{formatDate(user.createdAt)}</span>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between border-0 px-0">
                                    <span className="text-muted">{t('common.updatedAt', { defaultValue: 'Updated' })}</span>
                                    <span className="fw-medium">{formatDate(user.updatedAt)}</span>
                                </MDBListGroupItem>
                            </MDBListGroup>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={user.fullName || user.email}
                loading={deleting}
            />
        </div>
    );
};
