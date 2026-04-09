import React, { SetStateAction } from 'react';
type useDatepickerKeydownProps = {
    closeOnEsc: boolean;
    isOpen: boolean;
    activeDate: Date;
    setActiveDate: SetStateAction<any>;
    min?: Date;
    max?: Date;
    view: 'months' | 'days' | 'years';
    setView?: SetStateAction<any>;
    setSelectedDate: SetStateAction<any>;
    filter?: (date: Date) => boolean;
    setInlineDate: (date: Date) => void;
    disableFuture?: boolean;
    disablePast?: boolean;
    onClose?: () => void;
};
export declare const useDatepickerKeydown: ({ closeOnEsc, isOpen, activeDate, setActiveDate, min, max, view, setView, setSelectedDate, filter, setInlineDate, disableFuture, disablePast, onClose, }: useDatepickerKeydownProps) => {
    tabCount: number;
    modalRef: React.MutableRefObject<HTMLDivElement | null>;
};
export default useDatepickerKeydown;
