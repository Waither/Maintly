/**
 * Work Order Types
 */

import { BaseEntity } from './common';
import { User } from './user';
import { Equipment } from './equipment';

export type WorkOrderStatusType = 
    | 'new' 
    | 'in_progress' 
    | 'on_hold' 
    | 'completed' 
    | 'cancelled';

export type WorkOrderPriorityType = 
    | 'low' 
    | 'medium' 
    | 'high' 
    | 'critical';

export interface WorkOrderStatus {
    id: number;
    name: string;
    code: WorkOrderStatusType;
    color: string;
    order: number;
}

export interface WorkOrderPriority {
    id: number;
    name: string;
    code: WorkOrderPriorityType;
    color: string;
    level: number;
}

export interface WorkOrderActivity extends BaseEntity {
    workOrderId: number;
    userId: number;
    user?: User;
    action: string;
    description: string;
    oldValue?: string;
    newValue?: string;
}

export interface WorkOrderAssignment {
    id: number;
    workOrderId: number;
    userId: number;
    user?: User;
    assignedAt: string;
    assignedBy?: User;
}

export interface WorkOrderFile {
    id: number;
    workOrderId: number;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
    uploadedBy?: User;
}

export interface Tag {
    id: number;
    name: string;
    color: string | null;
}

export interface WorkOrderTag {
    tagId: number;
    tag: Tag;
    assignedAt: string;
}

export interface WorkOrder extends BaseEntity {
    title: string;
    description?: string;
    status: WorkOrderStatus;
    priority: WorkOrderPriority;
    equipment?: Equipment;
    equipmentId?: number;
    createdBy: User;
    assignedUsers: WorkOrderAssignment[];
    plannedStartDate?: string;
    plannedEndDate?: string;
    actualStartDate?: string;
    actualEndDate?: string;
    dueDate?: string;
    completedAt?: string;
    estimatedHours?: number;
    actualHours?: number;
    activities?: WorkOrderActivity[];
    files?: WorkOrderFile[];
    tags?: WorkOrderTag[];
}

export interface WorkOrderFormData {
    title: string;
    description?: string;
    statusId: number;
    priorityId: number;
    equipmentId?: number;
    assignedUserIds: number[];
    plannedStartDate?: string;
    plannedEndDate?: string;
    dueDate?: string;
    estimatedHours?: number;
    tagIds?: number[];
}

export interface WorkOrderFilters {
    status?: WorkOrderStatusType;
    priority?: WorkOrderPriorityType;
    equipmentId?: number;
    assignedUserId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
}

// Stats for Dashboard
export interface WorkOrderStats {
    total: number;
    pending?: number;
    inProgress?: number;
    completed?: number;
    overdue?: number;
    byStatus?: Partial<Record<WorkOrderStatusType | 'new', number>>;
    byPriority: Record<WorkOrderPriorityType, number>;
    completedThisWeek?: number;
    overdueCount?: number;
}
