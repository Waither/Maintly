/**
 * KPI Service
 * API calls for KPI analytics page
 */

import apiClient from '../lib/axios';

export interface KpiWorkOrderStats {
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    onHold: number;
    overdue: number;
    completionRate: number;
    byPriority: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

export interface KpiTrendPoint {
    month: string;
    created: number;
    completed: number;
}

export interface KpiTopEquipment {
    id: number;
    name: string;
    count: number;
}

export interface KpiMetrics {
    mttr: number | null;
    mtbf: number | null;
    unit: string;
}

export interface KpiEquipmentWorkTime {
    id: number;
    name: string;
    directMinutes: number;
    totalMinutes: number;
}

export interface KpiStats {
    period: { from: string; to: string };
    workOrders: KpiWorkOrderStats;
    trend: KpiTrendPoint[];
    topEquipment: KpiTopEquipment[];
    kpi: KpiMetrics;
    equipment: {
        total: number;
        topByWorkTime: KpiEquipmentWorkTime[];
    };
}

export const getKpiStats = async (dateFrom: string, dateTo: string): Promise<KpiStats> => {
    const response = await apiClient.get('/kpi/stats', {
        params: { dateFrom, dateTo },
    });
    return response.data;
};
