/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
import { OnInit, OnDestroy, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { MasonryOptions, Masonry as IMasonry, AnimationOptions } from './masonry-grid.interface';
import { MasonryGridService } from './masonry-grid.service';
export declare class MasonryGridComponent implements OnInit, OnDestroy, AfterViewInit {
    private _platformId;
    private _element;
    private masonryGridService;
    constructor(_platformId: any, _element: ElementRef, masonryGridService: MasonryGridService);
    _msnry: IMasonry;
    masonryOptions: MasonryOptions;
    useAnimation: boolean;
    scrollAnimationOptions: AnimationOptions;
    layoutComplete: EventEmitter<any[]>;
    removeComplete: EventEmitter<any[]>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    layout(): void;
    remove(element: HTMLElement[]): void;
    initializeMasonry(): void;
}
