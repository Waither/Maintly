/**
 * Equipment Service
 * API calls for equipment management
 */

import apiClient from '../lib/axios';
import { 
    Equipment, 
    EquipmentFormData, 
    EquipmentFilters, 
    EquipmentCustomField,
    PaginatedResponse 
} from '../types';

const BASE_URL = '/equipment';

/**
 * Get all equipment with pagination and filters
 */
export const getEquipmentList = async (
    page: number = 1, 
    limit: number = 10, 
    filters?: EquipmentFilters
): Promise<PaginatedResponse<Equipment>> => {
    const params = { page, limit, ...filters };
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
};

/**
 * Get single equipment by ID
 */
export const getEquipment = async (id: number): Promise<Equipment> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
};

/**
 * Create new equipment
 */
export const createEquipment = async (data: EquipmentFormData): Promise<Equipment> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data.data || response.data;
};

/**
 * Update equipment
 */
export const updateEquipment = async (id: number, data: Partial<EquipmentFormData>): Promise<Equipment> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data.data || response.data;
};

/**
 * Delete equipment
 */
export const deleteEquipment = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Get equipment custom fields
 */
export const getCustomFields = async (): Promise<EquipmentCustomField[]> => {
    const response = await apiClient.get(`${BASE_URL}/custom-fields`);
    return response.data.data || response.data;
};

/**
 * Get equipment categories
 */
export const getCategories = async (): Promise<string[]> => {
    const response = await apiClient.get(`${BASE_URL}/categories`);
    return response.data.data || response.data;
};

/**
 * Get equipment locations
 */
export const getLocations = async (): Promise<string[]> => {
    const response = await apiClient.get(`${BASE_URL}/locations`);
    return response.data.data || response.data;
};

/**
 * Get equipment hierarchy (tree structure)
 */
export const getEquipmentTree = async (): Promise<Equipment[]> => {
    const response = await apiClient.get(`${BASE_URL}/tree`);
    return response.data.data || response.data;
};

/**
 * Upload file to equipment
 */
export const uploadFile = async (equipmentId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    
    await apiClient.post(`${BASE_URL}/${equipmentId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

/**
 * Delete file from equipment
 */
export const deleteFile = async (equipmentId: number, fileId: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${equipmentId}/files/${fileId}`);
};

/**
 * Get equipment maintenance history
 */
export const getMaintenanceHistory = async (equipmentId: number): Promise<any[]> => {
    const response = await apiClient.get(`${BASE_URL}/${equipmentId}/maintenance`);
    return response.data.data || response.data;
};

export default {
    getEquipmentList,
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getCustomFields,
    getCategories,
    getLocations,
    getEquipmentTree,
    uploadFile,
    deleteFile,
    getMaintenanceHistory,
};
