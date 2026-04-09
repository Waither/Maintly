type MultiRangeProps = {
    className?: string;
    defaultValues?: [first: number, second: number];
    values?: [first: number, second: number];
    /**
     * This prop is deprecated and will be removed soon. Use `onChange` instead.
     * @deprecated
     */
    getValues?: (values: {
        first?: number;
        second?: number;
    }) => void;
    onChange?: (values: [first: number, second: number]) => void;
    min?: string | number;
    max?: string | number;
    step?: string;
    tooltips?: boolean;
};
export type { MultiRangeProps };
