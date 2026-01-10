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
    return response.data;
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
export const createWorkOrder = async (data: WorkOrderFormData): Promise<WorkOrder> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data.data || response.data;
};

/**
 * Update work order
 */
export const updateWorkOrder = async (id: number, data: Partial<WorkOrderFormData>): Promise<WorkOrder> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data.data || response.data;
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
};
