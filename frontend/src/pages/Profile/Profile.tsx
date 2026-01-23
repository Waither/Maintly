/**
 * User Profile Page
 * View own profile (read-only) and change password
 */

import { useState, useEffect } from 'react';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader,
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
    useToast
} from '../../components/ui';
import { userService } from '../../services';
import { useAuth } from '../../contexts';

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const Profile = () => {
    const { t } = useTranslation();
    const { success, error } = useToast();
    const { user, loading: authLoading, refreshUser } = useAuth();

    // Password form
    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    // Refresh user data on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Validate password form
    const validatePassword = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = t('validation.required', { defaultValue: 'To pole jest wymagane' });
        }
        if (!passwordForm.newPassword) {
            newErrors.newPassword = t('validation.required', { defaultValue: 'To pole jest wymagane' });
        } else if (passwordForm.newPassword.length < 8) {
            newErrors.newPassword = t('validation.minLength', { defaultValue: 'Minimum 8 znaków', min: 8 });
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = t('validation.passwordMismatch', { defaultValue: 'Hasła nie są takie same' });
        }

        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validatePassword()) return;

        setSavingPassword(true);
        try {
            await userService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            success(t('profile.passwordSuccess', { defaultValue: 'Hasło zostało zmienione' }));
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setPasswordErrors({});
        } catch (err: any) {
            if (err.response?.status === 400) {
                setPasswordErrors({ currentPassword: t('profile.wrongPassword', { defaultValue: 'Nieprawidłowe obecne hasło' }) });
            } else {
                error(err.response?.data?.message || t('profile.passwordError', { defaultValue: 'Nie udało się zmienić hasła' }));
            }
        } finally {
            setSavingPassword(false);
        }
    };

    // Handle password input change
    const handlePasswordChange = (field: keyof PasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm(prev => ({ ...prev, [field]: e.target.value }));
        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

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
        if (!user) return '?';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || '?';
    };

    const getRoleBadgeColor = (role?: string) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'manager': return 'warning';
            case 'technician': return 'info';
            case 'provider': return 'secondary';
            case 'reporter': return 'primary';
            default: return 'light';
        }
    };

    const getRoleIcon = (role?: string) => {
        switch (role) {
            case 'admin': return 'crown';
            case 'manager': return 'user-tie';
            case 'technician': return 'tools';
            case 'provider': return 'truck';
            case 'reporter': return 'user';
            default: return 'user';
        }
    };

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case 'admin': return 'Administrator';
            case 'manager': return 'Kierownik';
            case 'technician': return 'Technik';
            case 'provider': return 'Dostawca';
            case 'reporter': return 'Zgłaszający';
            default: return role || 'Nieznana';
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <div>
                <PageHeader
                    title={t('profile.title', { defaultValue: 'Mój profil' })}
                    breadcrumbs={[
                        { label: t('nav.dashboard', { defaultValue: 'Pulpit' }), path: '/' },
                        { label: t('nav.profile', { defaultValue: 'Profil' }) },
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

    return (
        <div>
            <PageHeader
                title={t('profile.title', { defaultValue: 'Mój profil' })}
                subtitle={user?.email}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Pulpit' }), path: '/' },
                    { label: t('nav.profile', { defaultValue: 'Profil' }) },
                ]}
            />

            <MDBRow className="g-4">
                {/* Sidebar - User Info (Read-only) */}
                <MDBCol lg="4">
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardBody className="text-center py-4">
                            {/* Avatar */}
                            <div 
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white mx-auto mb-3"
                                style={{ width: 100, height: 100, fontSize: '2rem' }}
                            >
                                <span className="fw-bold">{getInitials()}</span>
                            </div>

                            {/* Name */}
                            <h4 className="mb-1">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</h4>
                            <p className="text-muted mb-3">{user?.email}</p>
                            
                            {/* Role badge */}
                            <MDBBadge 
                                color={getRoleBadgeColor(user?.role)}
                                className="py-2 px-3 mb-3"
                            >
                                <MDBIcon icon={getRoleIcon(user?.role)} className="me-2" />
                                {getRoleLabel(user?.role)}
                            </MDBBadge>
                        </MDBCardBody>
                    </MDBCard>

                    {/* User details (read-only) */}
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h6 className="mb-0">
                                <MDBIcon icon="info-circle" className="me-2 text-primary" />
                                {t('profile.details', { defaultValue: 'Dane użytkownika' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">{t('user.firstName', { defaultValue: 'Imię' })}</small>
                                <span className="fw-medium">{user?.firstName || '-'}</span>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">{t('user.lastName', { defaultValue: 'Nazwisko' })}</small>
                                <span className="fw-medium">{user?.lastName || '-'}</span>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block mb-1">{t('user.email', { defaultValue: 'Email' })}</small>
                                <span className="fw-medium">{user?.email || '-'}</span>
                            </div>
                            <div>
                                <small className="text-muted d-block mb-1">{t('user.role', { defaultValue: 'Rola' })}</small>
                                <span className="fw-medium">{getRoleLabel(user?.role)}</span>
                            </div>
                            <hr />
                            <p className="text-muted small mb-0">
                                <MDBIcon icon="info-circle" className="me-1" />
                                {t('profile.contactAdminToEdit', { defaultValue: 'Aby zmienić dane, skontaktuj się z administratorem.' })}
                            </p>
                        </MDBCardBody>
                    </MDBCard>

                    {/* Activity */}
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h6 className="mb-0">
                                <MDBIcon icon="history" className="me-2 text-primary" />
                                {t('profile.activity', { defaultValue: 'Aktywność' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">{t('user.lastLogin', { defaultValue: 'Ostatnie logowanie' })}</span>
                                <span className="small fw-medium">{formatDate((user as any)?.lastLoginAt)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">{t('common.createdAt', { defaultValue: 'Utworzono' })}</span>
                                <span className="small fw-medium">{formatDate((user as any)?.createdAt)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted small">{t('common.updatedAt', { defaultValue: 'Zaktualizowano' })}</span>
                                <span className="small fw-medium">{formatDate((user as any)?.updatedAt)}</span>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                {/* Main Content - Change Password */}
                <MDBCol lg="8">
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0">
                                <MDBIcon icon="key" className="me-2 text-primary" />
                                {t('profile.changePassword', { defaultValue: 'Zmiana hasła' })}
                            </h5>
                        </MDBCardHeader>
                        <MDBCardBody className="p-4">
                            <p className="text-muted mb-4">
                                {t('profile.passwordHint', { defaultValue: 'Wprowadź swoje obecne hasło oraz nowe hasło (minimum 8 znaków).' })}
                            </p>

                            <form onSubmit={handleChangePassword}>
                                <MDBRow className="g-3">
                                    <MDBCol md="12">
                                        <MDBInput
                                            type="password"
                                            label={t('profile.currentPassword', { defaultValue: 'Obecne hasło' }) + ' *'}
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange('currentPassword')}
                                            className={passwordErrors.currentPassword ? 'is-invalid' : ''}
                                        />
                                        {passwordErrors.currentPassword && (
                                            <div className="invalid-feedback d-block">{passwordErrors.currentPassword}</div>
                                        )}
                                    </MDBCol>
                                    <MDBCol md="6">
                                        <MDBInput
                                            type="password"
                                            label={t('profile.newPassword', { defaultValue: 'Nowe hasło' }) + ' *'}
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange('newPassword')}
                                            className={passwordErrors.newPassword ? 'is-invalid' : ''}
                                        />
                                        {passwordErrors.newPassword && (
                                            <div className="invalid-feedback d-block">{passwordErrors.newPassword}</div>
                                        )}
                                    </MDBCol>
                                    <MDBCol md="6">
                                        <MDBInput
                                            type="password"
                                            label={t('profile.confirmPassword', { defaultValue: 'Potwierdź hasło' }) + ' *'}
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange('confirmPassword')}
                                            className={passwordErrors.confirmPassword ? 'is-invalid' : ''}
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <div className="invalid-feedback d-block">{passwordErrors.confirmPassword}</div>
                                        )}
                                    </MDBCol>
                                </MDBRow>
                                
                                <div className="d-flex justify-content-end mt-4">
                                    <MDBBtn 
                                        type="submit" 
                                        color="primary"
                                        disabled={savingPassword}
                                    >
                                        {savingPassword ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                {t('common.saving', { defaultValue: 'Zapisywanie...' })}
                                            </>
                                        ) : (
                                            <>
                                                <MDBIcon icon="key" className="me-2" />
                                                {t('profile.changePassword', { defaultValue: 'Zmień hasło' })}
                                            </>
                                        )}
                                    </MDBBtn>
                                </div>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </div>
    );
};
