/**
 * Equipment Types
 */

import { BaseEntity } from './common';
import { User } from './user';

export interface EquipmentTag {
    id: number;
    name: string;
    color: string;
}

export interface EquipmentCustomField {
    id: number;
    name: string;
    fieldType: 'text' | 'number' | 'date' | 'select' | 'boolean';
    options?: string[]; // For select type
    required: boolean;
    order: number;
}

export interface EquipmentCustomValue {
    fieldId: number;
    field: EquipmentCustomField;
    value: string | number | boolean | null;
}

export interface EquipmentFile {
    id: number;
    equipmentId?: number;
    fileName: string;
    originalName?: string;
    mimeType?: string;
    fileType?: string;
    fileSize?: number;
    size?: number;
    uploadedAt?: string;
    uploadedBy?: User;
}

export interface Equipment extends BaseEntity {
    name: string;
    costCenter?: number;
    qrCodeData?: string;
    parentEquipmentId?: number;
    parentEquipment?: Equipment;
    directWorkTime?: number;
    totalWorkTime?: number;
    children?: Equipment[];
    tags?: EquipmentTag[];
    files?: EquipmentFile[];
    // Legacy fields (may not be returned by backend)
    code?: string;
    description?: string;
    location?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate?: string;
    warrantyExpiration?: string;
    status?: 'active' | 'inactive' | 'maintenance' | 'retired';
    category?: string;
    parentId?: number;
    parent?: Equipment;
    customValues?: EquipmentCustomValue[];
    maintenanceHistory?: MaintenanceRecord[];
    qrCode?: string;
    image?: string;
}

export interface MaintenanceRecord {
    id: number;
    equipmentId: number;
    type: 'preventive' | 'corrective' | 'inspection';
    description: string;
    performedAt: string;
    performedBy?: User;
    nextMaintenanceDate?: string;
    cost?: number;
    notes?: string;
}

export interface EquipmentFormData {
    name: string;
    costCenter?: number;
    parentEquipmentId?: number | null;
    // Legacy optional fields
    code?: string;
    description?: string;
    location?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate?: string;
    warrantyExpiration?: string;
    status?: 'active' | 'inactive' | 'maintenance' | 'retired';
    category?: string;
    parentId?: number;
    tagIds?: number[];
    customValues?: Record<number, string | number | boolean>;
}

export interface EquipmentFilters {
    status?: 'active' | 'inactive' | 'maintenance' | 'retired';
    category?: string;
    location?: string;
    search?: string;
    hasParent?: boolean;
}

// Stats for Dashboard
export interface EquipmentStats {
    total: number;
    byStatus: {
        active: number;
        inactive: number;
        maintenance: number;
        retired: number;
    };
    requiresMaintenance: number;
    warrantyExpiringSoon: number;
}
