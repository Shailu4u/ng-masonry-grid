import { MasonryOptions, Masonry as IMasonry, AnimationOptions } from './masonry-grid.interface';
export declare class MasonryGridService {
    private _platformId;
    el: any;
    masonryOptions: MasonryOptions;
    animationOptions: AnimationOptions;
    items: Array<any>;
    itemsCount: number;
    itemsRenderedCount: number;
    didScroll: boolean;
    resizeTimeout: any;
    useAnimation: boolean;
    isAnimate: boolean;
    _msnry: IMasonry;
    classie: any;
    docElem: HTMLElement;
    animationDefaults: AnimationOptions;
    masonryDefaults: MasonryOptions;
    constructor(_platformId: any);
    getViewportH(): number;
    scrollY(): number;
    getOffset(el: any): {
        top: number;
        left: number;
    };
    inViewport(el: any, h?: any): boolean;
    extend(a: any, b: any): any;
    init(useAnimation: boolean, el: any, masonryOptions: MasonryOptions, animationOptions: AnimationOptions): IMasonry;
    initializeMasonry(_element: any, options: MasonryOptions): IMasonry;
    private _init();
    private _onScrollFn();
    private _scrollPage();
    private _resizeHandler();
    private _checkTotalRendered();
}
