import { Dispatch, RefObject, SetStateAction } from 'react';
type UseAutocompleteClosesProps = {
    isOpened: boolean;
    dropdownEl: HTMLDivElement | null;
    inputRef: RefObject<HTMLInputElement>;
    setOpenState: Dispatch<SetStateAction<boolean>>;
    onClose?: () => void;
};
declare const useAutocompleteClose: ({ isOpened, inputRef, dropdownEl, setOpenState, onClose, }: UseAutocompleteClosesProps) => void;
export default useAutocompleteClose;
