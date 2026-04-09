/// <reference types="react" />
type DatepickerModalContainerProps = {
    dropdown?: boolean;
    pickerRef?: HTMLDivElement;
    style?: React.CSSProperties;
    children: React.ReactNode;
    className?: string;
    styles: {
        [key: string]: React.CSSProperties;
    };
    attributes: {
        [key: string]: {
            [key: string]: string;
        } | undefined;
    };
    setPopperElement: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
    onClosed?: () => void;
    onOpened?: () => void;
};
export type { DatepickerModalContainerProps };
