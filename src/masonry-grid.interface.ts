export interface MasonryOptions {
    // layout
    itemSelector?: string;
    columnWidth?: any;
    percentPosition?: boolean;
    gutter?: any;
    stamp?: string;
    fitWidth?: boolean;
    originLeft?: boolean;
    originTop?: boolean;

    // setup
    containerStyle?: {};
    transitionDuration?: any;
    resize?: boolean;
    initLayout?: boolean;
}

export class Masonry {
    constructor(selector: string | Element, options?: MasonryOptions) {};

    masonry?(): void;
    masonry?(eventName: string, listener: any): void;
    items?: any[];

    // layout
    layout?(): void;
    layoutItems?(items: any[], isStill?: boolean): void;
    stamp?(elements: any[]): void;
    unstamp?(elements: any[]): void;

    // add and remove items
    appended?(elements: any[]): void;
    prepended?(elements: any[]): void;
    addItems?(elements: any[]): void;
    remove?(elements: any[]): void;

    // events
    on?(eventName: string, listener: any): void;
    off?(eventName: string, listener: any): void;
    once?(eventName: string, listener: any): void;

    // utilities
    reloadItems?(): void;
    destroy?(): void;
    getItemElements?(): any[];
    data?(element: Element): Masonry;
}

export interface AnimationOptions {
    animationEffect?: string,
    minDuration?: number;
    maxDuration?: number;  
    viewportFactor?: number;
}
