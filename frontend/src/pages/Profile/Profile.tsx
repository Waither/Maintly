/**
 * User Profile Page
 * Current user profile view and edit
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
    MDBBadge,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    useToast
} from '../../components/ui';
import { userService } from '../../services';
import { User } from '../../types';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const Profile = () => {
    const { t } = useTranslation();
    const { success, error } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    
    // Profile form
    const [profileForm, setProfileForm] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

    // Password form
    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    // Load current user
    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                const data = await userService.getCurrentUser();
                setUser(data);
                setProfileForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (err: any) {
                console.error('Failed to load user:', err);
                error(t('profile.loadError', { defaultValue: 'Failed to load profile' }));
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [t, error]);

    // Validate profile form
    const validateProfile = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!profileForm.firstName.trim()) {
            newErrors.firstName = t('validation.required', { defaultValue: 'This field is required' });
        }
        if (!profileForm.lastName.trim()) {
            newErrors.lastName = t('validation.required', { defaultValue: 'This field is required' });
        }
        if (!profileForm.email.trim()) {
            newErrors.email = t('validation.required', { defaultValue: 'This field is required' });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
            newErrors.email = t('validation.invalidEmail', { defaultValue: 'Invalid email address' });
        }

        setProfileErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate password form
    const validatePassword = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = t('validation.required', { defaultValue: 'This field is required' });
        }
        if (!passwordForm.newPassword) {
            newErrors.newPassword = t('validation.required', { defaultValue: 'This field is required' });
        } else if (passwordForm.newPassword.length < 8) {
            newErrors.newPassword = t('validation.minLength', { defaultValue: 'Minimum 8 characters', min: 8 });
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = t('validation.passwordMismatch', { defaultValue: 'Passwords do not match' });
        }

        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle profile save
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateProfile() || !user) return;

        setSavingProfile(true);
        try {
            await userService.updateUser(user.id, {
                firstName: profileForm.firstName,
                lastName: profileForm.lastName,
                phone: profileForm.phone || undefined,
            });
            success(t('profile.updateSuccess', { defaultValue: 'Profile updated successfully' }));
            
            // Reload user data
            const data = await userService.getCurrentUser();
            setUser(data);
        } catch (err: any) {
            error(err.response?.data?.message || t('profile.updateError', { defaultValue: 'Failed to update profile' }));
        } finally {
            setSavingProfile(false);
        }
    };

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validatePassword() || !user) return;

        setSavingPassword(true);
        try {
            await userService.changePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
            success(t('profile.passwordSuccess', { defaultValue: 'Password changed successfully' }));
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            if (err.response?.status === 401) {
                setPasswordErrors({ currentPassword: t('profile.wrongPassword', { defaultValue: 'Current password is incorrect' }) });
            } else {
                error(err.response?.data?.message || t('profile.passwordError', { defaultValue: 'Failed to change password' }));
            }
        } finally {
            setSavingPassword(false);
        }
    };

    // Handle profile input change
    const handleProfileChange = (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm(prev => ({ ...prev, [field]: e.target.value }));
        if (profileErrors[field]) {
            setProfileErrors(prev => ({ ...prev, [field]: '' }));
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
        if (!user) return '';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    // Loading state
    if (loading) {
        return (
            <div>
                <PageHeader
                    title={t('profile.title', { defaultValue: 'Profile' })}
                    breadcrumbs={[
                        { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                        { label: t('nav.profile', { defaultValue: 'Profile' }) },
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

    return (
        <div>
            <PageHeader
                title={t('profile.title', { defaultValue: 'Profile' })}
                subtitle={user?.email}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.profile', { defaultValue: 'Profile' }) },
                ]}
            />

            <MDBRow className="g-4">
                {/* Sidebar - User Info */}
                <MDBCol lg="4">
                    <MDBCard className="shadow-sm border-0 mb-4">
                        <MDBCardBody className="text-center py-4">
                            <div 
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white mx-auto mb-3"
                                style={{ width: 100, height: 100, fontSize: '2rem' }}
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.fullName} className="rounded-circle" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                ) : (
                                    <span className="fw-bold">{getInitials()}</span>
                                )}
                            </div>
                            <h4 className="mb-1">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</h4>
                            <p className="text-muted mb-3">{user?.email}</p>
                            
                            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                                {user?.roles?.map((role) => (
                                    <MDBBadge 
                                        key={role.id} 
                                        color={role.name === 'ROLE_ADMIN' ? 'danger' : role.name === 'ROLE_MANAGER' ? 'warning' : 'info'}
                                        className="py-2 px-3"
                                    >
                                        <MDBIcon 
                                            icon={role.name === 'ROLE_ADMIN' ? 'crown' : role.name === 'ROLE_MANAGER' ? 'user-tie' : 'user'} 
                                            className="me-2" 
                                        />
                                        {role.name.replace('ROLE_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                                    </MDBBadge>
                                ))}
                            </div>

                            <MDBBadge color={user?.isActive ? 'success' : 'secondary'} pill className="px-3 py-2">
                                <MDBIcon icon={user?.isActive ? 'check-circle' : 'times-circle'} className="me-2" />
                                {user?.isActive 
                                    ? t('user.active', { defaultValue: 'Active' }) 
                                    : t('user.inactive', { defaultValue: 'Inactive' })
                                }
                            </MDBBadge>
                        </MDBCardBody>
                    </MDBCard>

                    <MDBCard className="shadow-sm border-0">
                        <MDBCardHeader className="bg-white border-0 py-3">
                            <h6 className="mb-0">
                                <MDBIcon icon="history" className="me-2 text-primary" />
                                {t('profile.activity', { defaultValue: 'Activity' })}
                            </h6>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">{t('user.lastLogin', { defaultValue: 'Last Login' })}</span>
                                <span className="small fw-medium">{formatDate(user?.lastLoginAt)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">{t('common.createdAt', { defaultValue: 'Created' })}</span>
                                <span className="small fw-medium">{formatDate(user?.createdAt)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted small">{t('common.updatedAt', { defaultValue: 'Updated' })}</span>
                                <span className="small fw-medium">{formatDate(user?.updatedAt)}</span>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

                {/* Main Content - Tabs */}
                <MDBCol lg="8">
                    <MDBCard className="shadow-sm border-0">
                        <MDBCardBody className="p-4">
                            <MDBTabs className="mb-4">
                                <MDBTabsItem>
                                    <MDBTabsLink 
                                        onClick={() => setActiveTab('profile')} 
                                        active={activeTab === 'profile'}
                                    >
                                        <MDBIcon icon="user" className="me-2" />
                                        {t('profile.editProfile', { defaultValue: 'Edit Profile' })}
                                    </MDBTabsLink>
                                </MDBTabsItem>
                                <MDBTabsItem>
                                    <MDBTabsLink 
                                        onClick={() => setActiveTab('password')} 
                                        active={activeTab === 'password'}
                                    >
                                        <MDBIcon icon="lock" className="me-2" />
                                        {t('profile.changePassword', { defaultValue: 'Change Password' })}
                                    </MDBTabsLink>
                                </MDBTabsItem>
                            </MDBTabs>

                            <MDBTabsContent>
                                {/* Profile Tab */}
                                <MDBTabsPane open={activeTab === 'profile'}>
                                    <form onSubmit={handleSaveProfile}>
                                        <MDBRow className="g-3">
                                            <MDBCol md="6">
                                                <MDBInput
                                                    label={t('user.firstName', { defaultValue: 'First Name' }) + ' *'}
                                                    value={profileForm.firstName}
                                                    onChange={handleProfileChange('firstName')}
                                                    className={profileErrors.firstName ? 'is-invalid' : ''}
                                                />
                                                {profileErrors.firstName && <div className="invalid-feedback d-block">{profileErrors.firstName}</div>}
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <MDBInput
                                                    label={t('user.lastName', { defaultValue: 'Last Name' }) + ' *'}
                                                    value={profileForm.lastName}
                                                    onChange={handleProfileChange('lastName')}
                                                    className={profileErrors.lastName ? 'is-invalid' : ''}
                                                />
                                                {profileErrors.lastName && <div className="invalid-feedback d-block">{profileErrors.lastName}</div>}
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <MDBInput
                                                    type="email"
                                                    label={t('user.email', { defaultValue: 'Email' }) + ' *'}
                                                    value={profileForm.email}
                                                    onChange={handleProfileChange('email')}
                                                    className={profileErrors.email ? 'is-invalid' : ''}
                                                    disabled
                                                />
                                                {profileErrors.email && <div className="invalid-feedback d-block">{profileErrors.email}</div>}
                                                <small className="text-muted">
                                                    {t('profile.emailHint', { defaultValue: 'Contact admin to change email' })}
                                                </small>
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <MDBInput
                                                    type="tel"
                                                    label={t('user.phone', { defaultValue: 'Phone' })}
                                                    value={profileForm.phone}
                                                    onChange={handleProfileChange('phone')}
                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        
                                        <div className="d-flex justify-content-end mt-4">
                                            <MDBBtn 
                                                type="submit" 
                                                color="primary"
                                                disabled={savingProfile}
                                            >
                                                {savingProfile ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        {t('common.saving', { defaultValue: 'Saving...' })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <MDBIcon icon="save" className="me-2" />
                                                        {t('common.save', { defaultValue: 'Save' })}
                                                    </>
                                                )}
                                            </MDBBtn>
                                        </div>
                                    </form>
                                </MDBTabsPane>

                                {/* Password Tab */}
                                <MDBTabsPane open={activeTab === 'password'}>
                                    <form onSubmit={handleChangePassword}>
                                        <MDBRow className="g-3">
                                            <MDBCol md="12">
                                                <MDBInput
                                                    type="password"
                                                    label={t('profile.currentPassword', { defaultValue: 'Current Password' }) + ' *'}
                                                    value={passwordForm.currentPassword}
                                                    onChange={handlePasswordChange('currentPassword')}
                                                    className={passwordErrors.currentPassword ? 'is-invalid' : ''}
                                                />
                                                {passwordErrors.currentPassword && <div className="invalid-feedback d-block">{passwordErrors.currentPassword}</div>}
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <MDBInput
                                                    type="password"
                                                    label={t('profile.newPassword', { defaultValue: 'New Password' }) + ' *'}
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordChange('newPassword')}
                                                    className={passwordErrors.newPassword ? 'is-invalid' : ''}
                                                />
                                                {passwordErrors.newPassword && <div className="invalid-feedback d-block">{passwordErrors.newPassword}</div>}
                                            </MDBCol>
                                            <MDBCol md="6">
                                                <MDBInput
                                                    type="password"
                                                    label={t('profile.confirmPassword', { defaultValue: 'Confirm Password' }) + ' *'}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordChange('confirmPassword')}
                                                    className={passwordErrors.confirmPassword ? 'is-invalid' : ''}
                                                />
                                                {passwordErrors.confirmPassword && <div className="invalid-feedback d-block">{passwordErrors.confirmPassword}</div>}
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
                                                        {t('common.saving', { defaultValue: 'Saving...' })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <MDBIcon icon="key" className="me-2" />
                                                        {t('profile.changePassword', { defaultValue: 'Change Password' })}
                                                    </>
                                                )}
                                            </MDBBtn>
                                        </div>
                                    </form>
                                </MDBTabsPane>
                            </MDBTabsContent>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </div>
    );
};
