/**
 * Toast Notifications
 * Toast container and hook for notifications
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import { Toast, ToastType } from '../../types';

// Toast Context
interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Toast Provider
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const toast: Toast = { id, type, message, duration };
        
        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message: string) => addToast('success', message), [addToast]);
    const error = useCallback((message: string) => addToast('error', message, 8000), [addToast]);
    const warning = useCallback((message: string) => addToast('warning', message), [addToast]);
    const info = useCallback((message: string) => addToast('info', message), [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toasts
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast Container Component
interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
    if (toasts.length === 0) return null;

    return (
        <div 
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 9999, maxWidth: '400px' }}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

// Single Toast Item
interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const toastConfig: Record<ToastType, { bg: string; icon: string; iconColor: string }> = {
    success: { bg: 'bg-success', icon: 'check-circle', iconColor: 'text-white' },
    error: { bg: 'bg-danger', icon: 'times-circle', iconColor: 'text-white' },
    warning: { bg: 'bg-warning', icon: 'exclamation-triangle', iconColor: 'text-dark' },
    info: { bg: 'bg-info', icon: 'info-circle', iconColor: 'text-white' },
};

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
    const config = toastConfig[toast.type];

    return (
        <div 
            className={`${config.bg} text-white rounded shadow mb-2 d-flex align-items-center p-3`}
            role="alert"
            style={{ 
                animation: 'slideIn 0.3s ease-out',
                minWidth: '250px'
            }}
        >
            <MDBIcon icon={config.icon} className={`${config.iconColor} me-2`} size="lg" />
            <span className="flex-grow-1">{toast.message}</span>
            <button 
                className="btn-close btn-close-white ms-2" 
                onClick={() => onRemove(toast.id)}
                aria-label="Zamknij"
            />
        </div>
    );
};

// CSS Animation (add to global styles)
const styles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}
