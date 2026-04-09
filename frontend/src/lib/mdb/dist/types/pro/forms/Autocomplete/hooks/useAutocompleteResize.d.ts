import { RefObject } from 'react';
type UseAutocompleteClosesProps = {
    dropdownEl: HTMLDivElement | null;
    inputRef: RefObject<HTMLInputElement>;
};
declare const useAutocompleteResize: ({ inputRef, dropdownEl }: UseAutocompleteClosesProps) => void;
export default useAutocompleteResize;
