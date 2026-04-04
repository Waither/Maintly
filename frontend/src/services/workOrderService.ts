/**
 * Work Order Service
 * API calls for work order management
 */

import apiClient from '../lib/axios';
import { 
    WorkOrder, 
    WorkOrderFormData, 
    WorkOrderFilters, 
    WorkOrderStatus, 
    WorkOrderPriority,
    PaginatedResponse 
} from '../types';

const BASE_URL = '/work-orders';

export interface WorkOrderMutationResult {
    data: unknown;
    status: number;
    queued: boolean;
}

/**
 * Get all work orders with pagination and filters
 */
export const getWorkOrders = async (
    page: number = 1, 
    limit: number = 10, 
    filters?: WorkOrderFilters
): Promise<PaginatedResponse<WorkOrder>> => {
    const params = { page, limit, ...filters };
    const response = await apiClient.get(BASE_URL, { params });
    const raw = response.data;

    // Backend may return:
    // - WorkOrder[]
    // - { status: 'success', data: WorkOrder[] }
    // - { data: WorkOrder[], pagination?: ... }
    // - { data: { data: WorkOrder[] } }
    const dataCandidate =
        Array.isArray(raw) ? raw :
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw?.data?.data) ? raw.data.data :
        Array.isArray(raw?.workOrders) ? raw.workOrders :
        Array.isArray(raw?.data?.workOrders) ? raw.data.workOrders :
        [];

    const total = dataCandidate.length;

    return {
        data: dataCandidate,
        pagination: {
            page,
            limit,
            total,
            totalPages: limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1,
        },
    };
};

/**
 * Get single work order by ID
 */
export const getWorkOrder = async (id: number): Promise<WorkOrder> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
};

/**
 * Create new work order
 */
export const createWorkOrder = async (data: WorkOrderFormData): Promise<WorkOrderMutationResult> => {
    const response = await apiClient.post(BASE_URL, data);
    return {
        data: response.data.data || response.data,
        status: response.status,
        queued: Boolean(response.data?.queued),
    };
};

/**
 * Update work order
 */
export const updateWorkOrder = async (id: number, data: Partial<WorkOrderFormData>): Promise<WorkOrderMutationResult> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return {
        data: response.data.data || response.data,
        status: response.status,
        queued: Boolean(response.data?.queued),
    };
};

/**
 * Delete work order
 */
export const deleteWorkOrder = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Get all work order statuses
 */
export const getWorkOrderStatuses = async (): Promise<WorkOrderStatus[]> => {
    const response = await apiClient.get(`${BASE_URL}/statuses`);
    return response.data.data || response.data;
};

/**
 * Get all work order priorities
 */
export const getWorkOrderPriorities = async (): Promise<WorkOrderPriority[]> => {
    const response = await apiClient.get(`${BASE_URL}/priorities`);
    return response.data.data || response.data;
};

/**
 * Update work order status
 */
export const updateWorkOrderStatus = async (id: number, statusId: number): Promise<WorkOrder> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/status`, { statusId });
    return response.data.data || response.data;
};

/**
 * Assign user to work order
 */
export const assignUser = async (workOrderId: number, userId: number): Promise<void> => {
    await apiClient.post(`${BASE_URL}/${workOrderId}/assign`, { userId });
};

/**
 * Unassign user from work order
 */
export const unassignUser = async (workOrderId: number, userId: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${workOrderId}/assign/${userId}`);
};

/**
 * Add activity to work order
 */
export const addActivity = async (
    workOrderId: number, 
    action: string, 
    description: string
): Promise<void> => {
    await apiClient.post(`${BASE_URL}/${workOrderId}/activities`, { action, description });
};

/**
 * Get all available tags
 */
export const getTags = async (): Promise<{ id: number; name: string; color: string | null }[]> => {
    const response = await apiClient.get('/tags');
    return response.data.data || response.data;
};

export default {
    getWorkOrders,
    getWorkOrder,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getWorkOrderStatuses,
    getWorkOrderPriorities,
    updateWorkOrderStatus,
    assignUser,
    unassignUser,
    addActivity,
    getTags,
};
