/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
import { ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MasonryGridComponent } from './masonry-grid.component';
export declare class MasonryGridDirective implements OnDestroy, AfterViewInit {
    private _element;
    private _parent;
    private platformId;
    constructor(_element: ElementRef, _parent: MasonryGridComponent, platformId: any);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** When HTML in brick changes dynamically, observe that and change layout */
    private watchForHtmlChanges();
}
