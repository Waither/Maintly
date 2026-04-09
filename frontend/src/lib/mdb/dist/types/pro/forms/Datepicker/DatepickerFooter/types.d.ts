/// <reference types="react" />
type DatepickerFooterProps = {
    clearBtnText?: React.ReactNode;
    cancelBtnText?: React.ReactNode;
    okBtnText?: React.ReactNode;
    setValue: React.SetStateAction<any>;
    selectDate: (date: Date) => void;
    onClose?: () => void;
};
export type { DatepickerFooterProps };
