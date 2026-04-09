import React from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
interface ScrollbarProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * class name on container
     */
    className?: string;
    /**
     * style on container
     */
    style?: React.CSSProperties;
    /**
     * pass every option as a standalone prop instead of the `option` object
     * @deprecated
     * */
    option?: PerfectScrollbar.Options;
    /**
     * pass every option as a standalone prop instead of the `options` object
     * @deprecated
     * */
    options?: PerfectScrollbar.Options;
    /**
     * get the container ref
     */
    containerRef?: (container: HTMLElement) => void;
    /**
     * fires when the y-axis is scrolled in either direction.
     */
    onScrollY?: (container: HTMLElement) => void;
    /**
     * fires when the x-axis is scrolled in either direction.
     */
    onScrollX?: (container: HTMLElement) => void;
    /**
     * fires when scrolling upwards.
     */
    onScrollUp?: (container: HTMLElement) => void;
    /**
     * fires when scrolling downwards.
     */
    onScrollDown?: (container: HTMLElement) => void;
    /**
     * fires when scrolling to the left.
     */
    onScrollLeft?: (container: HTMLElement) => void;
    /**
     * fires when scrolling to the right.
     */
    onScrollRight?: (container: HTMLElement) => void;
    /**
     * fires when scrolling reaches the start of the y-axis.
     */
    onYReachStart?: (container: HTMLElement) => void;
    /**
     * fires when scrolling reaches the end of the y-axis (useful for infinite scroll).
     */
    onYReachEnd?: (container: HTMLElement) => void;
    /**
     * fires when scrolling reaches the start of the x-axis.
     */
    onXReachStart?: (container: HTMLElement) => void;
    /**
     * fires when scrolling reaches the end of the x-axis.
     */
    onXReachEnd?: (container: HTMLElement) => void;
    /**
     * component name
     */
    component?: string;
    tag?: React.ComponentProps<any>;
    sidenav?: boolean;
    handlers?: string[];
    wheelSpeed?: number;
    wheelPropagation?: boolean;
    swipeEasing?: boolean;
    minScrollbarLength?: number;
    maxScrollbarLength?: number;
    scrollingThreshold?: number;
    useBothWheelAxes?: boolean;
    suppressScrollX?: boolean;
    suppressScrollY?: boolean;
    scrollXMarginOffset?: number;
    scrollYMarginOffset?: number;
    scrollBarRef?: any;
}
interface EventHandlers {
    [key: string]: ((container: HTMLElement) => void) | undefined;
}
export type { ScrollbarProps, EventHandlers };
