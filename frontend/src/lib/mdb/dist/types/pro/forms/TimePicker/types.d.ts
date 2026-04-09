/// <reference types="react" />
type TimepickerProps = {
    datetimepickerRef?: HTMLDivElement;
    isInDatetimepicker?: boolean;
    onDatetimepickerModeSwitch?: () => void;
    amLabel?: string;
    pmLabel?: string;
    btnIcon?: boolean;
    /**
     * `customValue` has no effect and will be removed soon.
     * @deprecated
     */
    customValue?: string;
    className?: string;
    clearLabel?: string;
    customIconSize?: 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x' | '2xs' | 'xs' | 'lg' | 'xl' | '2xl';
    customIcon?: string;
    cancelLabel?: string;
    defaultValue?: string | Date;
    value?: string | Date;
    inputLabel?: string;
    inputClasses?: string;
    /**
     * This prop is deprecated and will be removed soon. Validation inside the component will be removed.
     * Check out https://mdbootstrap.com/docs/react/forms/validation/ to learn more.
     * @deprecated
     */
    invalidLabel?: string;
    inline?: boolean;
    increment?: boolean;
    format: '24h' | '12h';
    justInput?: boolean;
    noIcon?: boolean;
    maxTime?: string;
    minTime?: string;
    onChange?: (value: string) => void;
    openRef?: React.RefObject<any>;
    style?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    submitLabel?: string;
    ref?: React.ForwardedRef<HTMLDivElement>;
    timePickerClasses?: string;
    inlinePickerTag?: React.ComponentProps<any>;
    onOpen?: () => void;
    onOpened?: () => void;
    onClose?: () => void;
    onClosed?: () => void;
    disablePast?: boolean;
    disableFuture?: boolean;
    disabled?: boolean;
    switchHoursToMinutesOnClick?: boolean;
    headId?: string;
    bodyId?: string;
    [rest: string]: any;
    open?: boolean;
};
declare const defaultTimepickerProps: TimepickerProps;
export { type TimepickerProps, defaultTimepickerProps };
