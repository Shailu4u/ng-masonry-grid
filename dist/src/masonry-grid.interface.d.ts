export interface MasonryOptions {
    itemSelector?: string;
    columnWidth?: any;
    percentPosition?: boolean;
    gutter?: any;
    stamp?: string;
    fitWidth?: boolean;
    originLeft?: boolean;
    originTop?: boolean;
    containerStyle?: {};
    transitionDuration?: any;
    resize?: boolean;
    initLayout?: boolean;
}
export declare class Masonry {
    constructor(selector: string | Element, options?: MasonryOptions);
    masonry?(): void;
    masonry?(eventName: string, listener: any): void;
    items?: any[];
    layout?(): void;
    layoutItems?(items: any[], isStill?: boolean): void;
    stamp?(elements: any[]): void;
    unstamp?(elements: any[]): void;
    appended?(elements: any[]): void;
    prepended?(elements: any[]): void;
    addItems?(elements: any[]): void;
    remove?(elements: any[]): void;
    on?(eventName: string, listener: any): void;
    off?(eventName: string, listener: any): void;
    once?(eventName: string, listener: any): void;
    reloadItems?(): void;
    destroy?(): void;
    getItemElements?(): any[];
    data?(element: Element): Masonry;
}
export interface AnimationOptions {
    animationEffect?: string;
    minDuration?: number;
    maxDuration?: number;
    viewportFactor?: number;
}
