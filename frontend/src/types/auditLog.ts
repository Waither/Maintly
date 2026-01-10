/**
 * Audit Log Types
 */

import { User } from './user';

export interface AuditLog {
    id: number;
    user?: User;
    action: string;
    entityType: string;
    entityId?: number;
    changes?: Record<string, { old: any; new: any }>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface AuditLogFilters {
    userId?: number;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    ipAddress?: string;
}

export interface AuditLogStats {
    byAction: Record<string, number>;
    byUser: Array<{
        userId: number;
        userEmail: string;
        count: number;
    }>;
    total: number;
}
