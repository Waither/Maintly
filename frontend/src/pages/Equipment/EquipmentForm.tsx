/**
 * Equipment Form Page
 * Create and Edit equipment form with MDB components
 * Aligned with backend API: name, costCenter, parentEquipmentId
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
    MDBSelect
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    useToast
} from '../../components/ui';
import { equipmentService } from '../../services';
import { Equipment } from '../../types';

interface FormData {
    name: string;
    costCenter: string;
    parentEquipmentId: string;
}

const initialFormData: FormData = {
    name: '',
    costCenter: '',
    parentEquipmentId: '',
};

interface SelectData {
    text: string;
    value: string;
    defaultSelected?: boolean;
}

export const EquipmentForm = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const isEdit = !!id;

    // Form state
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Parent equipment options
    const [parentOptions, setParentOptions] = useState<Equipment[]>([]);
    const [loadingParents, setLoadingParents] = useState(true);

    // Load parent equipment options
    useEffect(() => {
        const loadParentOptions = async () => {
            try {
                const response = await equipmentService.getEquipmentList(1, 1000);
                // Filter out current equipment (can't be parent of itself)
                const options = id 
                    ? response.data.filter(eq => eq.id !== parseInt(id))
                    : response.data;
                setParentOptions(options);
            } catch (err) {
                console.error('Failed to load parent options:', err);
            } finally {
                setLoadingParents(false);
            }
        };
        loadParentOptions();
    }, [id]);

    // Load existing equipment for edit
    useEffect(() => {
        if (!isEdit || !id) return;

        const loadEquipment = async () => {
            try {
                const eq = await equipmentService.getEquipment(parseInt(id));
                setFormData({
                    name: eq.name || '',
                    costCenter: eq.costCenter?.toString() || '',
                    parentEquipmentId: eq.parentEquipmentId?.toString() || '',
                });
            } catch (err: unknown) {
                console.error('Failed to load equipment:', err);
                error(t('equipment.loadError', { defaultValue: 'Failed to load equipment' }));
                navigate('/equipment');
            }
        };

        loadEquipment();
    }, [isEdit, id, navigate, t, error]);

    // Validate form
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = t('validation.required', { defaultValue: 'This field is required' });
        }
        if (!formData.costCenter.trim()) {
            newErrors.costCenter = t('validation.required', { defaultValue: 'This field is required' });
        } else if (!/^\d+$/.test(formData.costCenter.trim())) {
            newErrors.costCenter = t('validation.numberOnly', { defaultValue: 'Must be a number' });
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
            const payload = {
                name: formData.name.trim(),
                costCenter: parseInt(formData.costCenter),
                parentEquipmentId: formData.parentEquipmentId ? parseInt(formData.parentEquipmentId) : null,
            };

            if (isEdit && id) {
                await equipmentService.updateEquipment(parseInt(id), payload);
                success(t('equipment.updateSuccess', { defaultValue: 'Equipment updated successfully' }));
            } else {
                await equipmentService.createEquipment(payload);
                success(t('equipment.createSuccess', { defaultValue: 'Equipment created successfully' }));
            }
            navigate('/equipment');
        } catch (err: unknown) {
            console.error('Failed to save equipment:', err);
            const axiosErr = err as { response?: { data?: { message?: string } } };
            error(axiosErr.response?.data?.message || t('equipment.saveError', { defaultValue: 'Failed to save equipment' }));
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

    // Parent select data
    const parentSelectData = useMemo((): SelectData[] => {
        const noneOption: SelectData = {
            text: t('equipment.noParent', { defaultValue: '— No parent —' }),
            value: '',
            defaultSelected: !formData.parentEquipmentId,
        };

        const options: SelectData[] = parentOptions.map(eq => ({
            text: `${eq.name} (${eq.costCenter})`,
            value: eq.id.toString(),
            defaultSelected: formData.parentEquipmentId === eq.id.toString(),
        }));

        return [noneOption, ...options];
    }, [parentOptions, formData.parentEquipmentId, t]);

    const handleParentChange = (data: unknown) => {
        const selected = Array.isArray(data) ? data[0] : data;
        const value = (selected as SelectData)?.value || '';
        setFormData(prev => ({ ...prev, parentEquipmentId: value }));
    };

    return (
        <div>
            <PageHeader
                title={isEdit ? t('equipment.edit', { defaultValue: 'Edit Equipment' }) : t('equipment.create', { defaultValue: 'Add Equipment' })}
                subtitle={isEdit ? `#${id}` : t('equipment.createSubtitle', { defaultValue: 'Fill in the details below' })}
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.equipment', { defaultValue: 'Equipment' }), path: '/equipment' },
                    { label: isEdit ? t('common.edit', { defaultValue: 'Edit' }) : t('common.new', { defaultValue: 'New' }) },
                ]}
                backLink="/equipment"
            />

            <form onSubmit={handleSubmit}>
                <MDBCard className="shadow-sm border-0 mb-4">
                    <MDBCardBody className="p-4">
                        <h5 className="mb-4">
                            <MDBIcon icon="info-circle" className="me-2 text-primary" />
                            {t('equipment.basicInfo', { defaultValue: 'Basic Information' })}
                        </h5>
                        
                        <MDBRow className="g-3">
                            <MDBCol md="6">
                                <MDBInput
                                    label={t('equipment.name', { defaultValue: 'Name' }) + ' *'}
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    className={errors.name ? 'is-invalid' : ''}
                                />
                                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                            </MDBCol>
                            <MDBCol md="6">
                                <MDBInput
                                    type="number"
                                    label={t('equipment.costCenter', { defaultValue: 'Cost Center' }) + ' *'}
                                    value={formData.costCenter}
                                    onChange={handleChange('costCenter')}
                                    className={errors.costCenter ? 'is-invalid' : ''}
                                />
                                {errors.costCenter && <div className="invalid-feedback d-block">{errors.costCenter}</div>}
                            </MDBCol>
                            <MDBCol md="12">
                                <label className="form-label small text-muted">
                                    {t('equipment.parentEquipment', { defaultValue: 'Parent Equipment' })}
                                </label>
                                {loadingParents ? (
                                    <div className="form-control bg-light d-flex align-items-center">
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        {t('common.loading', { defaultValue: 'Loading...' })}
                                    </div>
                                ) : (
                                    /* @ts-expect-error MDB types issue */
                                    <MDBSelect
                                        data={parentSelectData}
                                        onValueChange={handleParentChange}
                                        search
                                        searchLabel={t('common.search', { defaultValue: 'Search...' })}
                                    />
                                )}
                                <small className="text-muted">
                                    {t('equipment.parentHelp', { defaultValue: 'Select if this equipment is part of another' })}
                                </small>
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>

                {/* Actions */}
                <div className="d-flex gap-2 justify-content-end">
                    <MDBBtn 
                        type="button" 
                        color="light" 
                        onClick={() => navigate('/equipment')}
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
