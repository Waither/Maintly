/// <reference types="react" />
import { BaseComponent } from '../../../types/baseComponent';
import { AlertProps } from '../Alert/types';
interface StackProps extends BaseComponent {
    children: React.ReactElement<AlertProps>[] | React.ReactElement<AlertProps>;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}
export type { StackProps };
