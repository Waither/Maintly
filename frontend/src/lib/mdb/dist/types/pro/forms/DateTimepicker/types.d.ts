import { BaseComponent } from '../../../types/baseComponent';
import { CSSProperties, RefObject } from 'react';
export interface DateTimepickerProps extends BaseComponent {
    label?: string;
    labelStyle?: CSSProperties;
    labelClass?: string;
    labelRef?: RefObject<HTMLLabelElement>;
    /**
     * `inputRef` prop will be removed. Use `ref` instead to get the input element reference.
     * @deprecated
     */
    inputRef?: RefObject<HTMLInputElement>;
    inputClass?: string;
    inline?: boolean;
    disabled?: boolean;
    defaultTime?: string;
    defaultDate?: string;
    value?: string;
    /**
     * This prop will be removed soon.
     * Visit https://mdbootstrap.com/docs/react/forms/validation/ to learn more about validation.
     * @deprecated
     */
    invalidLabel?: string;
    inputToggle?: boolean;
    timepickerOptions?: {
        [key: string]: any;
    };
    datepickerOptions?: {
        [key: string]: any;
    };
    showFormat?: boolean;
    /**
     * This option will be removed soon.
     * Use `datepickerOptions` instead.
     * @deprecated
     */
    dateFormat?: string;
    /**
     * This option will be removed soon.
     * Use `timepickerOptions` instead.
     * @deprecated
     */
    timeFormat?: '12h' | '24h';
    /**
     * This option will be removed soon.
     * Visit https://mdbootstrap.com/docs/react/forms/validation/ to learn more about validation.
     * @deprecated
     */
    appendValidationInfo?: boolean;
    onChange?: (val?: string) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onDatepickerOpen?: () => void;
    onDatepickerClose?: () => void;
    onTimepickerOpen?: () => void;
    onTimepickerClose?: () => void;
}
