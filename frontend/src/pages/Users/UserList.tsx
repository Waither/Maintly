/**
 * User List Page
 * MDBDataTable with all users and search
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
    MDBBadge
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    DeleteConfirmModal,
    useToast,
    MDBDataTable
} from '../../components/ui';
import { userService } from '../../services';
import { User } from '../../types';
import { useAuth, ROLE_LEVELS } from '../../contexts';

// Type for MDBDatatable row data
interface DatatableRow {
    id: number;
    avatar: React.ReactNode;
    fullName: string;
    email: string;
    phone: string;
    roles: React.ReactNode;
    status: React.ReactNode;
    lastLogin: string;
    actions: React.ReactNode;
    _original: User;
    [key: string]: unknown;
}

export const UserList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { user: currentUser, permissions } = useAuth();

    // State
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Delete modal
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null,
    });
    const [deleting, setDeleting] = useState(false);

    // Helper to check if current user can manage target user
    const canManageUser = (targetUser: User): boolean => {
        if (!currentUser || !permissions.canManageUsers) return false;
        
        const targetRole = (targetUser as any).userRole;
        const targetRoleName = targetRole?.name || '';
        const targetRoleLevel = ROLE_LEVELS[targetRoleName.toLowerCase() as keyof typeof ROLE_LEVELS];
        const currentRoleLevel = ROLE_LEVELS[currentUser.role];
        
        // Can only manage users with LOWER privilege level
        return targetRoleLevel > currentRoleLevel;
    };

    // Check if trying to delete self
    const isSelf = (targetUser: User): boolean => {
        return currentUser?.id === targetUser.id;
    };

    // Load data
    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers(1, 1000);
            setUsers(response.data || []);
        } catch (err) {
            console.error('Failed to load users:', err);
            error(t('user.loadError', { defaultValue: 'Failed to load users' }));
        } finally {
            setLoading(false);
        }
    }, [t, error]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Handlers
    const handleDelete = async () => {
        if (!deleteModal.user) return;
        
        setDeleting(true);
        try {
            await userService.deleteUser(deleteModal.user.id);
            success(t('user.deleteSuccess', { defaultValue: 'User deleted successfully' }));
            setDeleteModal({ open: false, user: null });
            loadUsers();
        } catch (err) {
            error(t('user.deleteError', { defaultValue: 'Failed to delete user' }));
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleActive = async (user: User) => {
        try {
            await userService.toggleActive(user.id);
            success(
                user.isActive 
                    ? t('user.deactivated', { defaultValue: 'User deactivated' })
                    : t('user.activated', { defaultValue: 'User activated' })
            );
            loadUsers();
        } catch (err) {
            error(t('user.toggleError', { defaultValue: 'Failed to toggle user status' }));
        }
    };

    // Prepare datatable columns
    const datatableColumns = useMemo(() => [
        { label: '', field: 'avatar', sort: false, width: 50 },
        { label: t('user.fullName', { defaultValue: 'Full Name' }), field: 'fullName', sort: true, width: 180 },
        { label: t('user.email', { defaultValue: 'Email' }), field: 'email', sort: true, width: 200 },
        { label: t('user.phone', { defaultValue: 'Phone' }), field: 'phone', sort: true, width: 130 },
        { label: t('user.roles', { defaultValue: 'Roles' }), field: 'roles', sort: false, width: 150 },
        { label: t('user.status', { defaultValue: 'Status' }), field: 'status', sort: false, width: 100 },
        { label: t('user.lastLogin', { defaultValue: 'Last Login' }), field: 'lastLogin', sort: true, width: 140 },
        { label: t('common.actions', { defaultValue: 'Actions' }), field: 'actions', sort: false, width: 160 },
    ], [t]);

    // Stats calculation
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter((u: User) => u.isActive).length;
        const inactive = users.filter((u: User) => !u.isActive).length;
        const admins = users.filter((u: User) => {
            const userRole = (u as any).userRole;
            const roleName = userRole?.name || (u.roles?.[0]?.name) || '';
            return roleName === 'admin' || roleName === 'ROLE_ADMIN';
        }).length;
        return { total, active, inactive, admins };
    }, [users]);

    // Row click handler
    const handleRowClick = (row: any) => {
        navigate(`/users/${row.id}`);
    };

    // Prepare datatable rows
    const datatableRows: DatatableRow[] = useMemo(() => {
        return users.map((user: User) => {
            // Backend returns userRole as single object, not roles array
            const userRole = (user as any).userRole;
            const roleName = userRole?.name || (user.roles?.[0]?.name) || '';
            const roleDisplayName = roleName.replace('ROLE_', '').toLowerCase();
            const roleColor = roleName === 'admin' || roleName === 'ROLE_ADMIN' ? 'danger' 
                            : roleName === 'manager' || roleName === 'ROLE_MANAGER' ? 'warning' 
                            : 'info';

            return {
                id: user.id,
                avatar: (
                    <div 
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                        style={{ width: 36, height: 36 }}
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName} className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                        ) : (
                            <span className="fw-bold">{user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}</span>
                        )}
                    </div>
                ),
                fullName: user.fullName || `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone || '-',
                roles: (
                    <MDBBadge 
                        color={roleColor} 
                        pill
                        className="text-capitalize"
                    >
                        {roleDisplayName || '-'}
                    </MDBBadge>
                ),
                status: (
                    <MDBBadge color={user.isActive ? 'success' : 'secondary'} pill>
                        {user.isActive 
                            ? t('user.active', { defaultValue: 'Active' }) 
                            : t('user.inactive', { defaultValue: 'Inactive' })
                        }
                    </MDBBadge>
                ),
                lastLogin: user.lastLoginAt 
                    ? new Date(user.lastLoginAt).toLocaleDateString('pl-PL', { 
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) 
                    : '-',
                actions: (
                    <div className="d-flex gap-1">
                        <MDBBtn
                            size="sm"
                            color="info"
                            floating
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                navigate(`/users/${user.id}`);
                            }}
                            title={t('common.view', { defaultValue: 'View' })}
                        >
                            <MDBIcon icon="eye" />
                        </MDBBtn>
                        {canManageUser(user) && (
                            <>
                                <MDBBtn
                                    size="sm"
                                    color="warning"
                                    floating
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        navigate(`/users/${user.id}/edit`);
                                    }}
                                    title={t('common.edit', { defaultValue: 'Edit' })}
                                >
                                    <MDBIcon icon="edit" />
                                </MDBBtn>
                                <MDBBtn
                                    size="sm"
                                    color={user.isActive ? 'secondary' : 'success'}
                                    floating
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleToggleActive(user);
                                    }}
                                    title={user.isActive 
                                        ? t('user.deactivate', { defaultValue: 'Deactivate' }) 
                                        : t('user.activate', { defaultValue: 'Activate' })
                                    }
                                >
                                    <MDBIcon icon={user.isActive ? 'user-slash' : 'user-check'} />
                                </MDBBtn>
                            </>
                        )}
                        {canManageUser(user) && !isSelf(user) && (
                            <MDBBtn
                                size="sm"
                                color="danger"
                                floating
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setDeleteModal({ open: true, user });
                                }}
                                title={t('common.delete', { defaultValue: 'Delete' })}
                            >
                                <MDBIcon icon="trash" />
                            </MDBBtn>
                        )}
                    </div>
                ),
                _original: user,
            };
        });
    }, [users, navigate, t, handleToggleActive, canManageUser, isSelf]);

    return (
        <div className="p-4">
            <PageHeader
                title={t('user.list', { defaultValue: 'Users' })}
                subtitle={t('user.listSubtitle', { 
                    defaultValue: `Total ${stats.total} users`,
                    count: stats.total 
                })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.users', { defaultValue: 'Users' }) },
                ]}
                actions={
                    permissions.canManageUsers && (
                        <MDBBtn color="primary" onClick={() => navigate('/users/new')}>
                            <MDBIcon icon="user-plus" className="me-2" />
                            {t('user.create', { defaultValue: 'Add User' })}
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
                                <MDBIcon icon="users" size="lg" className="text-primary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.total}</h4>
                                <small className="text-muted">{t('user.total', { defaultValue: 'Total' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="user-check" size="lg" className="text-success" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.active}</h4>
                                <small className="text-muted">{t('user.activeUsers', { defaultValue: 'Active' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="user-shield" size="lg" className="text-danger" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.admins}</h4>
                                <small className="text-muted">{t('user.admins', { defaultValue: 'Administrators' })}</small>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md="3" sm="6" className="stat-card">
                    <MDBCard className="border-0 shadow-sm h-100">
                        <MDBCardBody className="d-flex align-items-center">
                            <div className="rounded-circle bg-secondary bg-opacity-10 p-3 me-3">
                                <MDBIcon icon="user-slash" size="lg" className="text-secondary" />
                            </div>
                            <div>
                                <h4 className="mb-0">{stats.inactive}</h4>
                                <small className="text-muted">{t('user.inactiveUsers', { defaultValue: 'Inactive' })}</small>
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
                            icon: 'users',
                            iconColor: 'text-muted',
                            title: t('user.noUsers', { defaultValue: 'No users to display' }),
                            subtitle: t('user.noUsersHint', { defaultValue: 'Add a new user to get started' }),
                        }}
                        loadingMessage={{
                            text: t('user.loading', { defaultValue: 'Loading users...' }),
                        }}
                    />
                </MDBCardBody>
            </MDBCard>

            {/* Delete Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, user: null })}
                onConfirm={handleDelete}
                itemName={deleteModal.user?.fullName || deleteModal.user?.email || ''}
                loading={deleting}
            />
        </div>
    );
};
