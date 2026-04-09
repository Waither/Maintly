import { MutableRefObject } from 'react';
type useDatepickerClickOutsideProps = {
    isOpened: boolean;
    isOpen?: boolean;
    inline?: boolean;
    popperElement: any;
    referenceElement: any;
    backdropRef: MutableRefObject<HTMLDivElement | null>;
    onCloseHandler: () => void;
};
export declare const useDatepickerClickOutside: ({ isOpened, isOpen, inline, popperElement, referenceElement, backdropRef, onCloseHandler, }: useDatepickerClickOutsideProps) => void;
export default useDatepickerClickOutside;
