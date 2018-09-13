/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import {
    Directive,
    Inject,
    ElementRef,
    forwardRef,
    OnDestroy,
    AfterViewInit,
    PLATFORM_ID,
    OnInit
} from '@angular/core';

import { NgMasonryGridComponent } from './ng-masonry-grid.component';
import { isPlatformBrowser } from '@angular/common';
import { NgMasonryGridService } from './ng-masonry-grid.service';

interface MutationWindow extends Window {
  MutationObserver: any;
  WebKitMutationObserver: any;
}

declare var window: MutationWindow;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ng-masonry-grid-item], ng-masonry-grid-item'
})
export class NgMasonryGridDirective implements OnDestroy, AfterViewInit, OnInit {

  constructor(
    private _element: ElementRef,
    @Inject(forwardRef(() => NgMasonryGridComponent))
    private _parent: NgMasonryGridComponent,
    @Inject(PLATFORM_ID) private platformId: any,
    private masonryGridService: NgMasonryGridService
  ) {}

  ngOnInit() {
    // this._parent.add(this._element.nativeElement);
  }

  /**
   * Add Masonry grid item after view initialization
   */
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.masonryGridService.itemsCount++;
      // set count attribute for every grid item
      this._element.nativeElement.setAttribute('data-count', this.masonryGridService.itemsCount);
      // if (this.masonryGridService.masonryOptions.horizontalOrder) {
      //   this.masonryGridService.addOrderItem(this._element.nativeElement);
      // } else {
      //   this._parent.add(this._element.nativeElement);
      // }
      this._parent.add(this._element.nativeElement);
      this.watchForHtmlChanges();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this._parent.remove(this._element.nativeElement);
    }
  }

  /** When HTML in brick changes dynamically, observe that and change layout */
  private watchForHtmlChanges(): void {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (MutationObserver) {
      /** Watch for any changes to subtree */
      let self = this;
      let observer = new MutationObserver((
        mutations,
        observerFromElement
      ) => {
        self._parent.layout();
      });

      // define what element should be observed by the observer
      // and what types of mutations trigger the callback
      observer.observe(this._element.nativeElement, {
        subtree: true,
        childList: true
      });
    }
  }
}
