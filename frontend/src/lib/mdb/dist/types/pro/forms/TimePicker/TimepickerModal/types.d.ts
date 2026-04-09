import React from 'react';
interface TimepickerModalProps extends React.HTMLAttributes<HTMLDivElement> {
    inline?: boolean;
    isOpen: boolean;
    wrapperRef: React.RefObject<HTMLDivElement>;
    referenceElement: HTMLDivElement | null;
    onOpened: () => void;
    onClosed: () => void;
}
export type { TimepickerModalProps };
