import React from 'react';
type SelectData = {
    disabled?: boolean;
    hidden?: boolean;
    text?: string;
    defaultSelected?: boolean;
    /**
     * Faded text displayed at the bottom of the option.
     */
    secondaryText?: React.ReactNode;
    value?: string | number;
    icon?: string;
    active?: boolean;
    optgroup?: string;
};
interface ExtendedSelectData extends SelectData {
    elementPosition: number;
}
interface SelectV2Props extends Omit<React.AllHTMLAttributes<HTMLElement>, 'size' | 'data' | 'onChange' | 'value'> {
    /**
     * Prevents selecting first option by default
     */
    preventFirstSelection?: boolean;
    /**
     * Adds a clear btn to MDBSelect
     */
    clearBtn?: boolean;
    disabled?: boolean;
    label?: string;
    /**
     * Defines a height of the options (in px).
     */
    optionHeight?: number;
    /**
     * All available options.
     * ```
     * const data = [
     *   {
     *    text: 'One',
     *    value: 1,
     *   },
     *   {
     *    text: 'Two',
     *    value: 2,
     *   },
     *   {
     *    text: 'Three',
     *    value: 3,
     *    defaultSelected: true,
     *   },
     * ]
     * <MDBSelect data={data} />
     * ```
     */
    data: SelectData[];
    inputClassName?: string;
    ref?: React.Ref<any>;
    /**
     * Use `open` prop instead as this option will be removed.
     * @deprecated
     */
    openRef?: React.RefObject<any>;
    /**
     * Number of options to be displayed in the dropdown.
     */
    visibleOptions?: number;
    /**
     * Toggle mode between single and multiple selection.
     */
    multiple?: boolean;
    /**
     * The text displayed inside the input in `multiple`, when there are more than 5 (default) options selected
     */
    optionsSelectedLabel?: string;
    /**
     * This option is deprecated and does not do anything. Will be removed soon.
     * @deprecated
     */
    optionGroups?: string[];
    /**
     * The maximum number of comma-separated list of options displayed on the Multiselect.
     * If a user selects more options than that value,
     * the X options selected text will be displayed instead.
     */
    displayedLabels?: number;
    /**
     * Displays select all option in multiselect dropdown
     */
    selectAll?: boolean;
    /**
     * Change label of select all option in `multiple` mode
     */
    selectAllLabel?: string;
    /**
     * Change label of select all option in `multiple` mode
     */
    size?: 'sm' | 'lg';
    /**
     * Adjust input colors for dark backgrounds.
     */
    contrast?: boolean;
    /**
     * `open` defines if should be opened or not.
     * ```tsx
     * const [isOpen, setIsOpen] = useState<boolean>(false);
     * <MDBSelect
     *   open={isOpen}
     *   onOpen={() => setIsOpen(true)}
     *   onClose={() => setIsOpen(false)}
     * />
     * ```
     */
    open?: boolean;
    /**
     * `onOpen` triggers when the select demands to be opened.
     * Use it to control the open state of the select.
     * ```tsx
     * const [isOpen, setIsOpen] = useState<boolean>(false);
     * <MDBSelect
     *   open={isOpen}
     *   onOpen={() => setIsOpen(true)}
     *   onClose={() => setIsOpen(false)}
     * />
     * ```
     */
    onOpen?: () => void;
    onOpened?: () => void;
    /**
     * `onClose` triggers when the select demands to be closed.
     * Use it to control the open state of the select.
     * ```tsx
     * const [isOpen, setIsOpen] = useState<boolean>(false);
     * <MDBSelect
     *   open={isOpen}
     *   onOpen={() => setIsOpen(true)}
     *   onClose={() => setIsOpen(false)}
     * />
     * ```
     */
    onClose?: () => void;
    onClosed?: () => void;
    /**
     * @deprecated this prop is deprecated and will be removed soon. Use `onChange` instead.
     */
    onValueChange?: (data: SelectData[] | SelectData) => void;
    /**
     * `onChange` triggers when the select value demands to be changed.
     * Can be used to create component with controlled value.
     * It may be helpful to verify the validity of the selected option.
     * ```
     * const [value, setValue] = useState(1);
     * <MDBSelect
     *   value={value}
     *   onChange={(data) => {
     *     setValue(data);
     *   }}
     * />
     * ```
     */
    onChange?: (data: SelectData[] | SelectData) => void;
    /**
     * Enables the options filtering.
     */
    search?: boolean;
    /**
     * Label for the search input.
     */
    searchLabel?: string;
    /**
     * A function to customize the search functionality.
     * This function is called with the current search query and the select data.
     * ```
     * searchFn={(query, data) => {
     *  const newData = data.filter((opt) => {
     *    return (
     *      opt.value == query || // check if value matches query
     *      opt.text?.toLowerCase().includes(query.toLowerCase()) ||
     *      opt.optgroup
     *    );
     *  });
     *  return newData;
     * }}
     * ```
     */
    searchFn?: (query: string, data: ExtendedSelectData[]) => ExtendedSelectData[];
    /**
     * Automatically select the first or `defaultSelected` option on first render.
     */
    autoSelect?: boolean;
    /**
     * Text to display when there are no records after the search query.
     * Only wokrs when `search` is enabled.
     * ```
     * <MDBSelect search noResultsText="No results" />
     * ```
     */
    noResultsText?: string;
    /**
     * @deprecated `toggleElement` is deprecated and will be removed soon. Use `open` to control the open state of the select.
     */
    toggleElement?: React.MutableRefObject<any>;
    /**
     * Enables basic validation for the select.
     */
    validation?: boolean;
    /**
     * Text to display when the select validation was successful.
     */
    validFeedback?: string;
    /**
     * Text to display when the select validation failed.
     */
    invalidFeedback?: string;
    /**
     *Enables controlling selected options. Pass value of the option you want to choose, or array for multiselect.
     */
    value?: Array<string | number> | string | number;
    /**
     * Customize animation variants. Accepts styles for open and closed state.
     * Example:
     * ```jsx
     * animationVariants={{
     *   open: {
     *     opacity: 1,
     *     transform: 'scale(1)',
     *     transition: {
     *       type: 'spring',
     *       duration: 0.4,
     *     },
     *   },
     *   closed: { opacity: 0, transform: 'scale(0.5)' },
     * }}
     * ```
     */
    animationVariants?: {
        open?: Record<string, any>;
        closed?: Record<string, any>;
    };
    disablePortal?: boolean;
}
export type { SelectV2Props, SelectData, ExtendedSelectData };
