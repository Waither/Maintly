/// <reference types="react" />
import type { ExtendedSelectData, SelectData } from './types';
export declare const isArraysEqual: (arr1: ExtendedSelectData[], arr2: ExtendedSelectData[]) => boolean;
export declare const prepareData: (data: SelectData[]) => {
    elementPosition: number;
    disabled?: boolean | undefined;
    hidden?: boolean | undefined;
    text?: string | undefined;
    defaultSelected?: boolean | undefined;
    secondaryText?: import("react").ReactNode;
    value?: string | number | undefined;
    icon?: string | undefined;
    active?: boolean | undefined;
    optgroup?: string | undefined;
}[];
