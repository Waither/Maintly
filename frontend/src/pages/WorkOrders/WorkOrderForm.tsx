/**
 * Work Order Form Page
 * Create and Edit work order form with MDB components
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBBtn, 
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBTextArea,
    MDBSelect,
    MDBDateTimepicker
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import { 
    PageHeader, 
    useToast
} from '../../components/ui';
import { workOrderService, equipmentService, userService } from '../../services';
import { WorkOrderStatus, WorkOrderPriority, Equipment, User } from '../../types';

interface FormData {
    title: string;
    description: string;
    statusId: number | '';
    priorityId: number | '';
    equipmentId: number | '';
    plannedStartDate: string;
    plannedEndDate: string;
    assignedUserIds: number[];
}

const initialFormData: FormData = {
    title: '',
    description: '',
    statusId: '',
    priorityId: '',
    equipmentId: '',
    plannedStartDate: '',
    plannedEndDate: '',
    assignedUserIds: [],
};

export const WorkOrderForm = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const isEdit = !!id;

    // Form state
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reference data
    const [statuses, setStatuses] = useState<WorkOrderStatus[]>([]);
    const [priorities, setPriorities] = useState<WorkOrderPriority[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Load reference data
    useEffect(() => {
        const loadReferenceData = async () => {
            try {
                const [statusesData, prioritiesData, equipmentResponse, usersResponse] = await Promise.all([
                    workOrderService.getWorkOrderStatuses(),
                    workOrderService.getWorkOrderPriorities(),
                    equipmentService.getEquipmentList(1, 100),
                    userService.getUsers(1, 100),
                ]);
                
                // Services now return normalized PaginatedResponse<T> with data array
                setStatuses(Array.isArray(statusesData) ? statusesData : []);
                setPriorities(Array.isArray(prioritiesData) ? prioritiesData : []);
                setEquipment(equipmentResponse.data || []);
                setUsers(usersResponse.data || []);

                // Set default values for new work order
                if (!isEdit && statusesData.length > 0 && prioritiesData.length > 0) {
                    const defaultStatus = statusesData[0];
                    const defaultPriority = prioritiesData.find(p => p.name === 'medium') || prioritiesData[0];
                    setFormData(prev => ({
                        ...prev,
                        statusId: defaultStatus.id,
                        priorityId: defaultPriority.id,
                    }));
                }
            } catch (err) {
                console.error('Failed to load reference data:', err);
                error(t('common.loadError', { defaultValue: 'Failed to load data' }));
            }
        };

        loadReferenceData();
    }, [isEdit, t, error]);

    // Load existing work order for edit
    useEffect(() => {
        if (!isEdit || !id) return;

        const loadWorkOrder = async () => {
            try {
                const workOrder = await workOrderService.getWorkOrder(parseInt(id));
                setFormData({
                    title: workOrder.title,
                    description: workOrder.description || '',
                    statusId: workOrder.status?.id || '',
                    priorityId: workOrder.priority?.id || '',
                    equipmentId: workOrder.equipment?.id || '',
                    plannedStartDate: workOrder.dueDate ? workOrder.dueDate.split('T')[0] : '',
                    plannedEndDate: '',
                    assignedUserIds: workOrder.assignedUsers?.map(a => a.userId) || [],
                });
            } catch (err) {
                console.error('Failed to load work order:', err);
                error(t('workOrder.loadError', { defaultValue: 'Failed to load work order' }));
                navigate('/work-orders');
            }
        };

        loadWorkOrder();
    }, [isEdit, id, navigate, t, error]);

    // Form handlers
    const handleChange = (field: keyof FormData, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = t('validation.required', { defaultValue: 'To pole jest wymagane' });
        }
        if (!formData.statusId) {
            newErrors.statusId = t('validation.required', { defaultValue: 'To pole jest wymagane' });
        }
        if (!formData.priorityId) {
            newErrors.priorityId = t('validation.required', { defaultValue: 'To pole jest wymagane' });
        }
        if (!formData.equipmentId) {
            newErrors.equipmentId = t('validation.required', { defaultValue: 'To pole jest wymagane' });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;

        setSaving(true);
        try {
            const payload = {
                title: formData.title,
                description: formData.description || undefined,
                statusId: formData.statusId as number,
                priorityId: formData.priorityId as number,
                equipmentId: formData.equipmentId as number,
                plannedStartDate: formData.plannedStartDate || undefined,
                plannedEndDate: formData.plannedEndDate || undefined,
                assignedUserIds: formData.assignedUserIds,
            };

            if (isEdit) {
                await workOrderService.updateWorkOrder(parseInt(id!), payload);
                success(t('workOrder.updateSuccess', { defaultValue: 'Work order updated successfully' }));
            } else {
                const newWorkOrder = await workOrderService.createWorkOrder(payload);
                success(t('workOrder.createSuccess', { defaultValue: 'Work order created successfully' }));
                navigate(`/work-orders/${newWorkOrder.id}`);
                return;
            }
            
            navigate(`/work-orders/${id}`);
        } catch (err: unknown) {
            console.error('Failed to save work order:', err);
            const errorMessage = err instanceof Error && 'response' in err 
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
                : undefined;
            error(
                errorMessage || 
                t('workOrder.saveError', { defaultValue: 'Failed to save work order' })
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <PageHeader
                title={isEdit 
                    ? t('workOrder.edit', { defaultValue: 'Edit Work Order' })
                    : t('workOrder.create', { defaultValue: 'New Work Order' })
                }
                breadcrumbs={[
                    { label: t('nav.dashboard', { defaultValue: 'Dashboard' }), path: '/' },
                    { label: t('nav.workOrders', { defaultValue: 'Zlecenia' }), path: '/work-orders' },
                    { label: isEdit ? t('workOrder.edit', { defaultValue: 'Edycja' }) : t('workOrder.create', { defaultValue: 'Nowe' }) },
                ]}
                backLink="/work-orders"
            />

            <MDBCard className="shadow-sm border-0">
                <MDBCardBody className="p-4">
                    <form onSubmit={handleSubmit}>
                        <MDBRow className="g-4">
                            {/* Title */}
                            <MDBCol md={12}>
                                <MDBInput
                                    label={t('workOrder.title', { defaultValue: 'Title' }) + ' *'}
                                    value={formData.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
                                    className={errors.title ? 'is-invalid' : ''}
                                />
                                {errors.title && (
                                    <div className="text-danger small mt-1">{errors.title}</div>
                                )}
                            </MDBCol>

                            {/* Description */}
                            <MDBCol md={12}>
                                <MDBTextArea
                                    label={t('workOrder.description', { defaultValue: 'Description' })}
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                                    rows={4}
                                />
                            </MDBCol>

                            {/* Status */}
                            <MDBCol md={6}>
                                {/* @ts-expect-error MDB types issue with required props */}
                                <MDBSelect
                                    key={`status-${statuses.length}`}
                                    label={t('workOrder.status', { defaultValue: 'Status' }) + ' *'}
                                    data={statuses.length > 0 ? [
                                        { text: t('common.select', { defaultValue: 'Select...' }), value: 0, disabled: true, hidden: true },
                                        ...statuses.map(s => ({
                                            text: t(`status.${s.name}`, { defaultValue: s.name }),
                                            value: s.id,
                                            defaultSelected: formData.statusId === s.id,
                                        }))
                                    ] : []}
                                    onValueChange={(data: unknown) => {
                                        const selected = Array.isArray(data) ? data[0] : data;
                                        if (selected?.value && selected.value !== 0) {
                                            handleChange('statusId', Number(selected.value));
                                        }
                                    }}
                                    className={errors.statusId ? 'is-invalid' : ''}
                                />
                                {errors.statusId && (
                                    <div className="text-danger small mt-1">{errors.statusId}</div>
                                )}
                            </MDBCol>

                            {/* Priority */}
                            <MDBCol md={6}>
                                {/* @ts-expect-error MDB types issue with required props */}
                                <MDBSelect
                                    key={`priority-${priorities.length}`}
                                    label={t('workOrder.priority', { defaultValue: 'Priorytet' }) + ' *'}
                                    data={priorities.length > 0 ? [
                                        { text: t('common.select', { defaultValue: 'Wybierz...' }), value: 0, disabled: true, hidden: true },
                                        ...priorities.map(p => ({
                                            text: t(`priority.${p.name}`, { defaultValue: p.name }),
                                            value: p.id,
                                            defaultSelected: formData.priorityId === p.id,
                                        }))
                                    ] : []}
                                    onValueChange={(data: unknown) => {
                                        const selected = Array.isArray(data) ? data[0] : data;
                                        if (selected?.value && selected.value !== 0) {
                                            handleChange('priorityId', Number(selected.value));
                                        }
                                    }}
                                    className={errors.priorityId ? 'is-invalid' : ''}
                                />
                                {errors.priorityId && (
                                    <div className="text-danger small mt-1">{errors.priorityId}</div>
                                )}
                            </MDBCol>

                            {/* Equipment */}
                            <MDBCol md={6}>
                                {/* @ts-expect-error MDB types issue with required props */}
                                <MDBSelect
                                    key={`equipment-${equipment.length}`}
                                    label={t('workOrder.equipment', { defaultValue: 'Equipment' }) + ' *'}
                                    data={equipment.length > 0 ? [
                                        { text: t('common.select', { defaultValue: 'Select...' }), value: 0, disabled: true },
                                        ...equipment.map(eq => ({
                                            text: `${eq.name} (${eq.code})`,
                                            value: eq.id,
                                            defaultSelected: formData.equipmentId === eq.id,
                                        }))
                                    ] : []}
                                    search
                                    onValueChange={(data: unknown) => {
                                        const selected = Array.isArray(data) ? data[0] : data;
                                        if (selected?.value && selected.value !== 0) {
                                            handleChange('equipmentId', Number(selected.value));
                                        }
                                    }}
                                    className={errors.equipmentId ? 'is-invalid' : ''}
                                />
                                {errors.equipmentId && (
                                    <div className="text-danger small mt-1">{errors.equipmentId}</div>
                                )}
                            </MDBCol>

                            {/* Planned Start Date - MDBDatetimepicker */}
                            <MDBCol md={6}>
                                <MDBDateTimepicker
                                    label={t('workOrder.plannedStartDate', { defaultValue: 'Planned start date' })}
                                    format="yyyy-mm-dd"
                                    value={formData.plannedStartDate}
                                    onChange={(date: string) => handleChange('plannedStartDate', date)}
                                    inputToggle
                                />
                            </MDBCol>

                            {/* Planned End Date - MDBDatepicker */}
                            <MDBCol md={6}>
                                <MDBDateTimepicker
                                    label={t('workOrder.plannedEndDate', { defaultValue: 'Planned end date' })}
                                    format="yyyy-mm-dd"
                                    value={formData.plannedEndDate}
                                    onChange={(date: string) => handleChange('plannedEndDate', date)}
                                    inputToggle
                                />
                            </MDBCol>

                            {/* Assigned Users - Multiple Select */}
                            <MDBCol md={6}>
                                {/* @ts-expect-error MDB types issue with required props */}
                                <MDBSelect
                                    key={`users-${users.length}`}
                                    label={t('workOrder.assignedUsers', { defaultValue: 'Assigned users' })}
                                    data={users.map(u => ({
                                        text: u.fullName || u.email,
                                        value: u.id,
                                        defaultSelected: formData.assignedUserIds.includes(u.id),
                                    }))}
                                    multiple
                                    search
                                    onValueChange={(data: unknown) => {
                                        const selectedItems = Array.isArray(data) ? data : [data];
                                        const selectedIds = selectedItems
                                            .filter((item: { value?: unknown }) => item?.value)
                                            .map((item: { value: unknown }) => Number(item.value));
                                        handleChange('assignedUserIds', selectedIds);
                                    }}
                                />
                            </MDBCol>
                        </MDBRow>

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                            <MDBBtn 
                                type="button" 
                                color="light"
                                onClick={() => navigate('/work-orders')}
                                disabled={saving}
                            >
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
                </MDBCardBody>
            </MDBCard>
        </div>
    );
};
