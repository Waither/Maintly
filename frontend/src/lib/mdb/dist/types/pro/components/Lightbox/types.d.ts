import React from 'react';
import { BaseComponent } from '../../../types/baseComponent';
interface LightboxProps extends BaseComponent {
    zoomLevel?: number;
    lightboxRef?: React.MutableRefObject<any>;
    tag?: React.ComponentProps<any>;
    disablePortal?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onSlide?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
}
export type { LightboxProps };
