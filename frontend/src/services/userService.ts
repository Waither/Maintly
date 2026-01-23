/**
 * User Service
 * API calls for user management
 */

import apiClient from '../lib/axios';
import { User, UserFormData, UserRole, PaginatedResponse } from '../types';

const BASE_URL = '/users';

/**
 * Get all users with pagination
 */
export const getUsers = async (
    page: number = 1, 
    limit: number = 10, 
    search?: string
): Promise<PaginatedResponse<User>> => {
    const params = { page, limit, search };
    const response = await apiClient.get(BASE_URL, { params });
    
    // Handle nested API response: { status, code, data: { users: [...], pagination } }
    const apiData = response.data?.data || response.data;
    const users = apiData?.users || apiData?.data || [];
    const pagination = apiData?.pagination || { page, limit, total: users.length, totalPages: 1 };
    
    return {
        data: Array.isArray(users) ? users : [],
        pagination: {
            page: pagination.currentPage || pagination.page || page,
            limit: pagination.itemsPerPage || pagination.limit || limit,
            total: pagination.totalItems || pagination.total || 0,
            totalPages: pagination.totalPages || 1,
        }
    };
};

/**
 * Get single user by ID
 */
export const getUser = async (id: number): Promise<User> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get('/me');
    return response.data.data || response.data;
};

/**
 * Create new user
 */
export const createUser = async (data: UserFormData): Promise<User> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data.data || response.data;
};

/**
 * Update user
 */
export const updateUser = async (id: number, data: Partial<UserFormData>): Promise<User> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data.data || response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Get all roles for select/dropdown
 */
export const getRoles = async (): Promise<UserRole[]> => {
    const response = await apiClient.get('/roles/select');
    // Response: { status: 'success', data: [{ value: 1, label: 'admin' }, ...] }
    const data = response.data?.data || response.data;
    // Map from { value, label } to { id, name }
    if (Array.isArray(data)) {
        return data.map((item: any) => ({
            id: item.value || item.id,
            name: item.label || item.name,
        }));
    }
    return [];
};

/**
 * Change current user's password (uses /me/password)
 */
export const changePassword = async (
    currentPassword: string, 
    newPassword: string
): Promise<void> => {
    await apiClient.patch('/me/password', { 
        currentPassword, 
        newPassword 
    });
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (id: number): Promise<User> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/toggle-status`);
    return response.data.data || response.data;
};

/**
 * Toggle user active status (alias)
 */
export const toggleActive = toggleUserStatus;

export default {
    getUsers,
    getUser,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser,
    getRoles,
    changePassword,
    toggleUserStatus,
    toggleActive,
};
