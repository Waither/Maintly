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
    return response.data;
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
    const response = await apiClient.get(`${BASE_URL}/me`);
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
 * Get all roles
 */
export const getRoles = async (): Promise<UserRole[]> => {
    const response = await apiClient.get('/user-roles');
    return response.data.data || response.data;
};

/**
 * Change user password
 */
export const changePassword = async (
    userId: number, 
    currentPassword: string, 
    newPassword: string
): Promise<void> => {
    await apiClient.patch(`${BASE_URL}/${userId}/password`, { 
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
};
