/**
 * User Form Page
 * Create and Edit user form with MDB components
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBSelect
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    useToast
} from '../../components/ui';
import { userService } from '../../services';
import { UserRole } from '../../types';

interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    confirmPassword: string;
    isActive: boolean;
    roleIds: number[];
}

const initialFormData: FormData = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isActive: true,
    roleIds: [],
};

interface SelectData {
    text: string;
    value: number;
    defaultSelected?: boolean;
}

export const UserForm = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const isEdit = !!id;

    // Form state
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Roles from API
    const [roles, setRoles] = useState<UserRole[]>([]);

    // Load roles
    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await userService.getRoles();
                setRoles(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load roles:', err);
            }
        };
        loadRoles();
    }, []);

    // Load existing user for edit
    useEffect(() => {
        if (!isEdit || !id) return;

        const loadUser = async () => {
            try {
                const user = await userService.getUser(parseInt(id));
                // Backend returns userRole (single object), not roles array
                const userRole = (user as any).userRole;
                setFormData({
                    email: user.email || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || '',
                    password: '',
                    confirmPassword: '',
                    isActive: user.isActive ?? true,
                    roleIds: userRole?.id ? [userRole.id] : [],
                });
            } catch (err: any) {
                console.error('Failed to load user:', err);
                error(t('user.loadError', { defaultValue: 'Failed to load user' }));
                navigate('/users');
            }
        };

        loadUser();
    }, [isEdit, id, navigate, t, error]);

    // Validate form
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = t('validation.required', { defaultValue: 'This field is required' });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.invalidEmail', { defaultValue: 'Invalid email address' });
        }
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = t('validation.required', { defaultValue: 'This field is required' });
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = t('validation.required', { defaultValue: 'This field is required' });
        }

        // Password required only for new users
        if (!isEdit) {
            if (!formData.password) {
                newErrors.password = t('validation.required', { defaultValue: 'This field is required' });
            } else if (formData.password.length < 8) {
                newErrors.password = t('validation.minLength', { defaultValue: 'Minimum 8 characters', min: 8 });
            }
        }
        
        // Confirm password if password is set
        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('validation.passwordMismatch', { defaultValue: 'Passwords do not match' });
        }

        if (formData.roleIds.length === 0) {
            newErrors.roles = t('validation.required', { defaultValue: 'Select at least one role' });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;

        setSaving(true);
        try {
            const payload: any = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
                isActive: formData.isActive,
                roleId: formData.roleIds[0] || null, // Backend expects single roleId
            };

            // Include password only if provided
            if (formData.password) {
                payload.password = formData.password;
            }

            if (isEdit && id) {
                await userService.updateUser(parseInt(id), payload);
                success(t('user.updateSuccess', { defaultValue: 'User updated successfully' }));
            } else {
                await userService.createUser(payload);
                success(t('user.createSuccess', { defaultValue: 'User created successfully' }));
            }
            navigate('/users');
        } catch (err: any) {
            console.error('Failed to save user:', err);
            error(err.response?.data?.message || t('user.saveError', { defaultValue: 'Failed to save user' }));
        } finally {
            setSaving(false);
        }
    };

    // Handle input change
    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Role select data
    const roleSelectData = useMemo((): SelectData[] => {
        return roles.map(r => ({
            text: r.name.replace('ROLE_', '').toLowerCase().replace(/^\w/, c => c.toUpperCase()),
            value: r.id,
            defaultSelected: formData.roleIds.includes(r.id),
        }));
    }, [roles, formData.roleIds]);

    const handleRoleChange = (data: unknown) => {
        // Single select - data is single object, not array
        const selected = data as any;
        const id = typeof selected?.value === 'number' ? selected.value : parseInt(selected?.value);
        if (!isNaN(id)) {
            setFormData(prev => ({ ...prev, roleIds: [id] }));
        }
        if (errors.roles) {
            setErrors(prev => ({ ...prev, roles: '' }));
        }
    };

    return (
        <div>
            <PageHeader
                title={isEdit ? t('user.edit', { defaultValue: 'Edit User' }) : t('user.create', { defaultValue: 'Add User' })}
                subtitle={isEdit ? `#${id}` : t('user.createSubtitle', { defaultValue: 'Fill in the details below' })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.users', { defaultValue: 'Users' }), path: '/users' },
                    { label: isEdit ? t('common.edit', { defaultValue: 'Edit' }) : t('common.new', { defaultValue: 'New' }) },
                ]}
                backLink="/users"
            />

            <form onSubmit={handleSubmit}>
                <MDBCard className="shadow-sm border-0 mb-4">
                    <MDBCardBody className="p-4">
                        <h5 className="mb-4">
                            <MDBIcon icon="user" className="me-2 text-primary" />
                            {t('user.basicInfo', { defaultValue: 'Basic Information' })}
                        </h5>
                        
                        <MDBRow className="g-3">
                            <MDBCol md="6">
                                <MDBInput
                                    label={t('user.firstName', { defaultValue: 'First Name' }) + ' *'}
                                    value={formData.firstName}
                                    onChange={handleChange('firstName')}
                                    className={errors.firstName ? 'is-invalid' : ''}
                                />
                                {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName}</div>}
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBInput
                                    label={t('user.lastName', { defaultValue: 'Last Name' }) + ' *'}
                                    value={formData.lastName}
                                    onChange={handleChange('lastName')}
                                    className={errors.lastName ? 'is-invalid' : ''}
                                />
                                {errors.lastName && <div className="invalid-feedback d-block">{errors.lastName}</div>}
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBInput
                                    type="email"
                                    label={t('user.email', { defaultValue: 'Email' }) + ' *'}
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    className={errors.email ? 'is-invalid' : ''}
                                />
                                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBInput
                                    type="tel"
                                    label={t('user.phone', { defaultValue: 'Phone' })}
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                />
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

                <MDBCard className="shadow-sm border-0 mb-4">
                    <MDBCardBody className="p-4">
                        <h5 className="mb-4">
                            <MDBIcon icon="lock" className="me-2 text-primary" />
                            {t('user.security', { defaultValue: 'Security' })}
                        </h5>
                        
                        <MDBRow className="g-3">
                            <MDBCol md="6">
                                <MDBInput
                                    type="password"
                                    label={t('user.password', { defaultValue: 'Password' }) + (!isEdit ? ' *' : '')}
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    className={errors.password ? 'is-invalid' : ''}
                                />
                                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                                {isEdit && (
                                    <small className="text-muted">
                                        {t('user.passwordHint', { defaultValue: 'Leave empty to keep current password' })}
                                    </small>
                                )}
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBInput
                                    type="password"
                                    label={t('user.confirmPassword', { defaultValue: 'Confirm Password' })}
                                    value={formData.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    className={errors.confirmPassword ? 'is-invalid' : ''}
                                />
                                {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

                <MDBCard className="shadow-sm border-0 mb-4">
                    <MDBCardBody className="p-4">
                        <h5 className="mb-4">
                            <MDBIcon icon="user-shield" className="me-2 text-primary" />
                            {t('user.rolesAndPermissions', { defaultValue: 'Roles & Permissions' })}
                        </h5>
                        
                        <MDBRow className="g-3">
                            <MDBCol md="6">
                                <label className="form-label small text-muted">
                                    {t('user.role', { defaultValue: 'Role' })} *
                                </label>
                                {/* @ts-expect-error MDB types issue */}
                                <MDBSelect
                                    data={roleSelectData}
                                    onValueChange={handleRoleChange}
                                />
                                {errors.roles && <div className="invalid-feedback d-block">{errors.roles}</div>}
                            </MDBCol>
                            <MDBCol md="6" className="d-flex align-items-center">
                                <MDBCheckbox
                                    id="isActive"
                                    label={t('user.isActive', { defaultValue: 'Active account' })}
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                />
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

                {/* Actions */}
                <div className="d-flex gap-2 justify-content-end">
                    <MDBBtn 
                        type="button" 
                        color="light" 
                        onClick={() => navigate('/users')}
                        disabled={saving}
                    >
                        <MDBIcon icon="times" className="me-2" />
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </MDBBtn>
                    <MDBBtn 
                        type="submit" 
                        color="primary"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                {t('common.saving', { defaultValue: 'Saving...' })}
                            </>
                        ) : (
                            <>
                                <MDBIcon icon="save" className="me-2" />
                                {isEdit 
                                    ? t('common.save', { defaultValue: 'Save' }) 
                                    : t('common.create', { defaultValue: 'Create' })
                                }
                            </>
                        )}
                    </MDBBtn>
                </div>
            </form>
        </div>
    );
};
