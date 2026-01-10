/**
 * Status Badge Component
 * Colored badge for displaying status
 */

import { MDBBadge } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface StatusBadgeProps {
    status: string;
    color?: BadgeColor;
    pill?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

// Status to color mapping
const statusColorMap: Record<string, BadgeColor> = {
    // Work Order statuses
    new: 'info',
    in_progress: 'primary',
    on_hold: 'warning',
    completed: 'success',
    cancelled: 'secondary',
    
    // Equipment statuses
    active: 'success',
    inactive: 'secondary',
    maintenance: 'warning',
    retired: 'dark',
    
    // Report statuses
    pending: 'warning',
    processing: 'info',
    failed: 'danger',
    
    // Priority
    low: 'light',
    medium: 'info',
    high: 'warning',
    critical: 'danger',
    
    // Generic
    success: 'success',
    error: 'danger',
    warning: 'warning',
    info: 'info',
};

// Status translations
const statusTranslations: Record<string, string> = {
    // Work Order statuses
    new: 'Nowe',
    in_progress: 'W trakcie',
    on_hold: 'Wstrzymane',
    completed: 'Zakończone',
    cancelled: 'Anulowane',
    
    // Equipment statuses
    active: 'Aktywny',
    inactive: 'Nieaktywny',
    maintenance: 'W konserwacji',
    retired: 'Wycofany',
    
    // Report statuses
    pending: 'Oczekuje',
    processing: 'Przetwarzanie',
    failed: 'Błąd',
    
    // Priority
    low: 'Niski',
    medium: 'Średni',
    high: 'Wysoki',
    critical: 'Krytyczny',
};

export const StatusBadge = ({ 
    status, 
    color, 
    pill = true, 
    size = 'md',
    className = ''
}: StatusBadgeProps) => {
    const { t } = useTranslation();
    
    const badgeColor = color || statusColorMap[status.toLowerCase()] || 'secondary';
    const displayText = t(`status.${status}`, { defaultValue: statusTranslations[status.toLowerCase()] || status });
    
    const sizeClass = size === 'sm' ? 'fs-7' : size === 'lg' ? 'fs-6' : '';

    return (
        <MDBBadge 
            color={badgeColor} 
            pill={pill}
            className={`${sizeClass} ${className}`.trim()}
        >
            {displayText}
        </MDBBadge>
    );
};

// Specialized variants
export const WorkOrderStatusBadge = ({ status, ...props }: Omit<StatusBadgeProps, 'status'> & { status: string }) => (
    <StatusBadge status={status} {...props} />
);

interface PriorityBadgeProps extends Omit<StatusBadgeProps, 'status'> {
    priority: string;
}

export const PriorityBadge = ({ priority, ...props }: PriorityBadgeProps) => {
    const { t } = useTranslation();
    
    const priorityColorMap: Record<string, BadgeColor> = {
        low: 'success',
        medium: 'info',
        high: 'warning',
        critical: 'danger',
    };
    
    const priorityTranslations: Record<string, string> = {
        low: 'Niski',
        medium: 'Średni',
        high: 'Wysoki',
        critical: 'Krytyczny',
    };
    
    const badgeColor = props.color || priorityColorMap[priority.toLowerCase()] || 'secondary';
    const displayText = t(`priority.${priority}`, { defaultValue: priorityTranslations[priority.toLowerCase()] || priority });
    
    const sizeClass = (props.size || 'md') === 'sm' ? 'fs-7' : (props.size || 'md') === 'lg' ? 'fs-6' : '';

    return (
        <MDBBadge 
            color={badgeColor} 
            pill={props.pill !== false}
            className={`${sizeClass} ${props.className || ''}`.trim()}
        >
            {displayText}
        </MDBBadge>
    );
};

export const EquipmentStatusBadge = ({ status, ...props }: Omit<StatusBadgeProps, 'status'> & { status: string }) => (
    <StatusBadge status={status} {...props} />
);
