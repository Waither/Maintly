/**
 * Common TypeScript Types
 * Shared types used across the application
 */

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

// Table Types
export interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

export interface TableFilters {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    [key: string]: any;
}

// Form Types
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

// Date Range
export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

// Generic CRUD Types
export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string;
}

// Loading State
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Toast/Alert Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}
