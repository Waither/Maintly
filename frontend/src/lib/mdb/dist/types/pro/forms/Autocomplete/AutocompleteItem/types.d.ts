import { ReactNode } from 'react';
import { ItemDataType } from '../types';
type AutocompleteItemProps = {
    className?: string;
    isActive: boolean;
    children: ReactNode;
    onSelect: (value: string, itemData: ItemDataType) => void;
    value: string;
    itemData: ItemDataType;
};
export type { AutocompleteItemProps };
