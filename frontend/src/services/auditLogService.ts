/**
 * Audit Log Service
 * API calls for audit log management (Admin only)
 */

import apiClient from '../lib/axios';
import { AuditLog, AuditLogFilters, AuditLogStats, PaginatedResponse } from '../types';

const BASE_URL = '/audit-logs';

/**
 * Get all audit logs with pagination and filters
 */
export const getAuditLogs = async (
    page: number = 1, 
    limit: number = 20, 
    filters?: AuditLogFilters
): Promise<PaginatedResponse<AuditLog>> => {
    const params = { page, limit, ...filters };
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
};

/**
 * Get single audit log by ID
 */
export const getAuditLog = async (id: number): Promise<AuditLog> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data.data || response.data;
};

/**
 * Get audit log statistics
 */
export const getAuditLogStats = async (filters?: AuditLogFilters): Promise<AuditLogStats> => {
    const response = await apiClient.get(`${BASE_URL}/stats`, { params: filters });
    return response.data.data || response.data;
};

/**
 * Get available action types for filtering
 */
export const getActionTypes = async (): Promise<string[]> => {
    // Common actions - could be fetched from API
    return [
        'user.login',
        'user.logout',
        'work_order.created',
        'work_order.updated',
        'work_order.deleted',
        'equipment.created',
        'equipment.updated',
        'equipment.deleted',
        'report.generated',
        'settings.updated',
    ];
};

/**
 * Get available entity types for filtering
 */
export const getEntityTypes = async (): Promise<string[]> => {
    return [
        'User',
        'WorkOrder',
        'Equipment',
        'Report',
        'Notification',
        'Settings',
    ];
};

export default {
    getAuditLogs,
    getAuditLog,
    getAuditLogStats,
    getActionTypes,
    getEntityTypes,
};
