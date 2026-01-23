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
    
    // Backend may return various formats
    const raw = response.data;
    const apiData = raw?.data ?? raw;

    const logs =
        Array.isArray(apiData) ? apiData :
        Array.isArray(apiData?.auditLogs) ? apiData.auditLogs :
        Array.isArray(apiData?.logs) ? apiData.logs :
        Array.isArray(apiData?.data) ? apiData.data :
        [];

    const pagination = apiData?.pagination || { page, limit, total: logs.length, totalPages: 1 };
    
    return {
        data: Array.isArray(logs) ? logs : [],
        pagination: {
            page: pagination.currentPage || pagination.page || page,
            limit: pagination.itemsPerPage || pagination.limit || limit,
            total: pagination.totalItems || pagination.total || 0,
            totalPages: pagination.totalPages || 1,
        }
    };
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
 * Get available action types for filtering (from API)
 */
export const getActionTypes = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/meta/actions`);
        return response.data.data || response.data || [];
    } catch (err) {
        console.error('Failed to fetch action types:', err);
        return [];
    }
};

/**
 * Get available entity types for filtering (from API)
 */
export const getEntityTypes = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/meta/entities`);
        return response.data.data || response.data || [];
    } catch (err) {
        console.error('Failed to fetch entity types:', err);
        return [];
    }
};

export default {
    getAuditLogs,
    getAuditLog,
    getAuditLogStats,
    getActionTypes,
    getEntityTypes,
};
