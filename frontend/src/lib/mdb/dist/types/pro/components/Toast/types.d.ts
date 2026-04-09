/// <reference types="react" />
import { BaseComponent } from '../../../types/baseComponent';
interface ToastProps extends BaseComponent {
    appendToBody?: boolean;
    autohide?: boolean;
    bodyClasses?: string;
    bodyContent?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'light' | 'dark' | 'info';
    containerRef?: React.MutableRefObject<any>;
    delay?: number;
    closeBtnClasses?: string;
    headerClasses?: string;
    headerContent?: React.ReactNode;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    toastRef?: React.MutableRefObject<any>;
    width?: number | string;
    defaultOpen?: boolean;
    open?: boolean;
    onOpen?: () => void;
    onOpened?: () => void;
    onClose?: () => void;
    onClosed?: () => void;
    initialAnimation?: boolean;
    animationVariants?: {
        open?: Record<string, any>;
        closed?: Record<string, any>;
    };
}
export type { ToastProps };
