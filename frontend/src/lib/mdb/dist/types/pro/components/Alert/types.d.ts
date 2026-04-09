/// <reference types="react" />
import { BaseComponent } from '../../../types/baseComponent';
import { backgroundColor } from '../../../types/colors';
interface AlertProps extends BaseComponent {
    appendToBody?: boolean;
    alertRef?: React.MutableRefObject<any>;
    autohide?: boolean;
    color?: backgroundColor;
    containerRef?: React.MutableRefObject<any>;
    delay?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    width?: number | string;
    defaultOpen?: boolean;
    open?: boolean;
    onOpen?: () => void;
    onOpened?: () => void;
    onClose?: () => void;
    onClosed?: () => void;
    animationVariants?: {
        open?: Record<string, any>;
        closed?: Record<string, any>;
    };
    initialAnimation?: boolean;
    dismissBtn?: boolean;
}
export type { AlertProps };
