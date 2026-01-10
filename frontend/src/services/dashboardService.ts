/**
 * Dashboard Service
 * API calls for dashboard statistics
 */

import apiClient from '../lib/axios';
import { WorkOrderStats, EquipmentStats, WorkOrder } from '../types';

export interface DashboardStats {
    workOrders: WorkOrderStats;
    equipment: EquipmentStats;
    users: {
        total: number;
        active: number;
    };
    reports: {
        total: number;
        pending: number;
    };
}

export interface DashboardData {
    stats: DashboardStats;
    recentWorkOrders: WorkOrder[];
    upcomingMaintenance: Array<{
        id: number;
        equipmentName: string;
        scheduledDate: string;
        type: string;
    }>;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data || response.data;
};

/**
 * Get recent work orders for dashboard
 */
export const getRecentWorkOrders = async (limit: number = 5): Promise<WorkOrder[]> => {
    const response = await apiClient.get('/work-orders', {
        params: { limit, sortBy: 'createdAt', sortOrder: 'desc' }
    });
    return response.data.data || response.data;
};

/**
 * Get upcoming maintenance for dashboard
 */
export const getUpcomingMaintenance = async (limit: number = 5): Promise<any[]> => {
    const response = await apiClient.get('/equipment/maintenance/upcoming', {
        params: { limit }
    });
    return response.data.data || response.data;
};

export default {
    getDashboardStats,
    getRecentWorkOrders,
    getUpcomingMaintenance,
};
