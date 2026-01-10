/**
 * Loading Spinner Component
 * Displays a centered loading spinner
 */

import { MDBSpinner } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

export const LoadingSpinner = ({ 
    size = 'md', 
    text, 
    fullScreen = false,
    color = 'primary'
}: LoadingSpinnerProps) => {
    const { t } = useTranslation();
    
    const spinnerSize = size === 'sm' ? 'sm' : undefined;
    const displayText = text || t('common.loading', { defaultValue: 'Ładowanie...' });

    const content = (
        <div className="d-flex flex-column align-items-center justify-content-center gap-2">
            <MDBSpinner 
                color={color} 
                size={spinnerSize}
                style={size === 'lg' ? { width: '3rem', height: '3rem' } : undefined}
            >
                <span className="visually-hidden">{displayText}</span>
            </MDBSpinner>
            {text !== '' && (
                <span className="text-muted">{displayText}</span>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div 
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 9999 }}
            >
                {content}
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center py-5">
            {content}
        </div>
    );
};
