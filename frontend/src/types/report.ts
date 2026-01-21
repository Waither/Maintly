/**
 * Report Types
 */

import { BaseEntity } from './common';
import { User } from './user';

export type ReportType = 
    | 'maintenance'
    | 'equipment'
    | 'users'
    | 'work_orders'
    | 'custom';

export type ReportFormat = 'pdf' | 'excel' | 'csv';

export type ReportStatus = 
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';

export interface Report extends BaseEntity {
    name: string;
    reportType: ReportType;
    type?: string; // Alias for reportType from API
    format: ReportFormat;
    status: ReportStatus;
    fileName?: string;
    fileSize?: number;
    generatedBy?: User;
    generatedAt?: string;
    completedAt?: string;
    filters?: Record<string, any>;
    errorMessage?: string;
}

export interface ReportGenerateRequest {
    reportType: ReportType;
    format: ReportFormat;
    filters?: {
        dateFrom?: string;
        dateTo?: string;
        status?: string;
        equipmentIds?: number[];
        userIds?: number[];
        [key: string]: unknown;
    };
}

export interface ReportFilters {
    type?: ReportType;
    format?: ReportFormat;
    status?: ReportStatus;
    startDate?: string;
    endDate?: string;
}
