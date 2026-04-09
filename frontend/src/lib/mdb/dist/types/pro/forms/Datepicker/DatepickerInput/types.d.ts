import { SetStateAction, ReactNode, CSSProperties } from 'react';
type DatepickerInputProps = {
    labelText?: ReactNode;
    inline?: boolean;
    setReferenceElement: SetStateAction<any>;
    inputClasses?: string;
    value: string;
    style?: CSSProperties;
    inputStyle?: CSSProperties;
    format?: string;
    icon?: string;
    input: any;
    inputId?: string;
    inputToggle?: boolean;
    setDatepickerValue: SetStateAction<any>;
    onOpenHandler?: () => void;
};
export type { DatepickerInputProps };
