/**
 * Notification Types
 */

import { BaseEntity } from './common';

export type NotificationType = 
    | 'work_order_assigned'
    | 'work_order_updated'
    | 'work_order_completed'
    | 'equipment_maintenance'
    | 'report_ready'
    | 'system'
    | 'info'
    | 'warning'
    | 'error';

export interface Notification extends BaseEntity {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    readAt?: string;
    data?: Record<string, any>;
    link?: string;
}

export interface NotificationFilters {
    isRead?: boolean;
    type?: NotificationType;
    startDate?: string;
    endDate?: string;
}

export interface UnreadCountResponse {
    count: number;
}
