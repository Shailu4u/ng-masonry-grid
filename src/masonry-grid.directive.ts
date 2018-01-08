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
    PLATFORM_ID
  } from '@angular/core';
  
  import { MasonryGridComponent } from './masonry-grid.component';
  import { isPlatformBrowser } from '@angular/common';
  
  interface MutationWindow extends Window {
    MutationObserver: any;
    WebKitMutationObserver: any;
  }
  
  declare var window: MutationWindow;
  
  @Directive({
    selector: '[masonry-grid-item], masonry-grid-item'
  })
  export class MasonryGridDirective implements OnDestroy, AfterViewInit {
    constructor(
      private _element: ElementRef,
      @Inject(forwardRef(() => MasonryGridComponent))
      private _parent: MasonryGridComponent,
      @Inject(PLATFORM_ID) private platformId: any
    ) {}
  
    ngAfterViewInit() {
      if (isPlatformBrowser(this.platformId)) {        
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
        let observer = new MutationObserver(function(
          mutations,
          observerFromElement
        ) {
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
  