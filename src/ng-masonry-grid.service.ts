/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import { Injectable, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MasonryOptions, Masonry as IMasonry, AnimationOptions,
        ImagesLoadedConstructor, MasonryGridItem } from './ng-masonry-grid.interface';

import { Observable } from 'rxjs/Observable';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import { Subject } from 'rxjs/Subject';

declare var require: any;

@Injectable()
export class NgMasonryGridService {

  el: any;
  masonryOptions: MasonryOptions;
  animationOptions: AnimationOptions;
  items: Array<any> = [];
  itemsCount: number;
  itemsRenderedCount: number;
  didScroll: boolean;
  resizeTimeout: any;
  useAnimation: boolean;
  isAnimate = false;
  public _msnry: IMasonry;
  public classie: any;
  _onScrollHandler: any;
  _onResizeHandler: any;
  useImagesLoaded: boolean;
  imagesLoaded: ImagesLoadedConstructor;

  docElem = window.document.documentElement;

  animationDefaults: AnimationOptions = {
    animationEffect: 'effect-1', // default animation effect-1
    // Minimum and a maximum duration of the animation (random value is chosen)
    minDuration : 0,
    maxDuration : 0,
    // The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
    // if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport.
    // If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
    viewportFactor : 0
  }

  masonryDefaults: MasonryOptions = {
    // Set default itemSelector: mandatory
    itemSelector: '[ng-masonry-grid-item], ng-masonry-grid-item, [ng-masonry-grid-item].animate, ng-masonry-grid-item.animate',
    addStatus: 'append'
  }

  constructor( @Inject(PLATFORM_ID) private _platformId: any  ) {
      this._onScrollHandler = this._onScrollFn.bind(this);
      this._onResizeHandler = this._resizeHandler.bind(this);
  }


  getViewportH() {
    let client = this.docElem['clientHeight'],
      inner = window['innerHeight'];

    if ( client < inner ) {
      return inner;
    }    else {
      return client;
    }

  }

  scrollY() {
    return window.pageYOffset || this.docElem.scrollTop;
  }

  getOffset( el: any ) {
    let offsetTop = 0, offsetLeft = 0;
    do {
      if ( !isNaN( el.offsetTop ) ) {
        offsetTop += el.offsetTop;
      }
      if ( !isNaN( el.offsetLeft ) ) {
        offsetLeft += el.offsetLeft;
      }
    } while ( el = el.offsetParent )

    return {
      top : offsetTop,
      left : offsetLeft
    }
  }

  inViewport( el: any, h = 0 ) {
    let elH = el.offsetHeight,
      scrolled = this.scrollY(),
      viewed = scrolled + this.getViewportH(),
      elTop = this.getOffset(el).top,
      elBottom = elTop + elH;
      // if 0, the element is considered in the viewport as soon as it enters.
      // if 1, the element is considered in the viewport only when it's fully inside
      // value in percentage (1 >= h >= 0)
      // h = h || 0;

    return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
  }

  extend( a: any, b: any ) {
    for ( let key in b ) {
      if ( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }

  public init(el: any, masonryOptions: MasonryOptions, useAnimation?: boolean,
    animationOptions?: AnimationOptions, useImagesLoaded?: boolean): IMasonry {
    this.useAnimation = useAnimation;
    this.el = el;
    this.isAnimate = this.useAnimation || (animationOptions ? true : false);
    this.useImagesLoaded = useImagesLoaded;
    this.masonryOptions = this.extend(this.masonryDefaults, masonryOptions);
    this.animationOptions = this.extend(this.animationDefaults, animationOptions)

    return this._init();
  }

  // Initialize Masonry
  public initializeMasonry(_element: any, options: MasonryOptions): IMasonry {
    const Masonry = require('masonry-layout');
    return new Masonry(_element, options);
  }

  private _init(): IMasonry {

    if (this.isAnimate) {
      this.classie = require('desandro-classie');
      // add animation effect
      this.el.classList += ' ' + this.animationOptions.animationEffect;
    }

    if (this.useImagesLoaded) {
       this.imagesLoaded = require('imagesloaded');
    }

    if (isPlatformBrowser(this._platformId)) {
      return this._initMasonry();
    }

    return null;
  }

  private _initMasonry() {
    // initialize masonry
    this._msnry = this.initializeMasonry(this.el, this.masonryOptions);

    if ((this.useAnimation || this.isAnimate) && this._msnry) {

      // this._msnry.once('layoutComplete', (items: any) => {
      //   this._layoutComplete(items);
      // });

      // animate on scroll the items inside the viewport
      window.addEventListener( 'scroll', this._onScrollHandler, false );
      window.addEventListener( 'resize', this._onResizeHandler, false );

      this._msnry.on('layoutComplete', (items: any) => {
        Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
          this.classie.remove( element, 'animate' );
        });
      });

      this._msnry.on('removeComplete', (items: any) => {
        Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
          this.classie.remove( element, 'animate' );
        });
        this._msnry.layout();
      });
    }

    return this._msnry;
  }

  private _layoutComplete(items: any) {
    let self = this;
    this.items = items.map((item) => item.element);
    this.itemsCount = this.items.length;
    this.didScroll = false;
    this.itemsRenderedCount = 0;
    // the items already shown...
    this.items.forEach( ( el, i ) => {
      if ( this.inViewport( el ) ) {
        this._checkTotalRendered();
      }
      // setTimeout(() => {
      //   el.addEventListener('webkitAnimationEnd', (event) => {
      //     self.classie.remove( el, 'animate' );
      //   }, false);
      // }, 500);
    });
  }

  private _onScrollFn() {
    let self = this;
    if ( !this.didScroll ) {
      this.didScroll = true;
      setTimeout( () => { self._scrollPage(); }, 100 );
    }
  }

  private _scrollPage () {
    let self = this;
    let items = this._msnry.items.map((item) => item.element);
    if (items.length) {
      items.forEach( ( el, i ) => {
        if ( this.inViewport( el, self.animationOptions.viewportFactor ) ) {
          setTimeout( () => {
            let perspY = this.scrollY() + this.getViewportH() / 2;
            self.el.style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
            self.el.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
            self.el.style.perspectiveOrigin = '50% ' + perspY + 'px';

            if ( self.animationOptions.minDuration && self.animationOptions.maxDuration ) {
              let randDuration = ( Math.random() * ( self.animationOptions.maxDuration - self.animationOptions.minDuration )
              + self.animationOptions.minDuration ) + 's';
              el.style.WebkitAnimationDuration = randDuration;
              el.style.MozAnimationDuration = randDuration;
              el.style.animationDuration = randDuration;
            }

            this.classie.add( el, 'animate' );
            // setTimeout( () => {
            //   this.classie.remove( el, 'animate' );
            // }, 1000);
            // el.addEventListener('webkitAnimationEnd', (event) => {
            //    setTimeout( () => {
            //     self.classie.remove( el, 'animate' );
            //   }, 2000);
            // }, false);
          }, 25 );
        } else {
           this.classie.remove( el, 'animate' );
        }
      });
    }

    this.didScroll = false;
  }

  private _resizeHandler() {
    let self = this;
    Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
      self.classie.remove( element, 'animate' );
    });

    function delayed() {
      self._scrollPage();
      self.resizeTimeout = null;
    }
    if ( this.resizeTimeout ) {
      clearTimeout( this.resizeTimeout );
    }
    this.resizeTimeout = setTimeout( delayed, 500 );
  }

  private _checkTotalRendered() {
    ++this.itemsRenderedCount;
    if ( this.itemsRenderedCount === this.itemsCount ) {
      window.removeEventListener( 'scroll', this._onScrollHandler, false );
    }
  }

  public onDestory() {
    window.removeEventListener( 'scroll', this._onScrollHandler, false );
    window.removeEventListener( 'resize', this._onResizeHandler, false );
  }

  public removeAnimation() {
    if (this.isAnimate) {
      Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
        this.classie.remove( element, 'animate' );
      });
    }
  }

  public add(element, count) {
    let addStatus = this.masonryOptions.addStatus.toLowerCase();

    // set margin bottom of gutter value.
    if (this.masonryOptions.gutter) {
      element.style.marginBottom = this.masonryOptions.gutter + 'px';
    }

    if (this.el.hasChildNodes() && this.el.contains(element)) {
      this.el.removeChild(element);
    }

    if (this.useImagesLoaded) {
      setTimeout( () => {
        this.imagesLoaded(element, (instance: any) => {
          // append or prepend based on masonry option
          if (addStatus === 'prepend') {
            if (this._msnry.items.length !== 0) {
              this.el.insertBefore(element, this._msnry.items[0].element);
              this._msnry.prepended(element);
            } else {
              this.el.appendChild(element);
              this._msnry.appended(element);
            }
          } else if (addStatus === 'append') {
            this.el.appendChild(element);
            this._msnry.appended(element);
          } else {
            this.el.appendChild(element);
            this._msnry.addItems(element);
          }
          this._msnry.layout();
        });
      }, 0);
    } else {
     // this.el.removeChild(element);
      if (addStatus === 'prepend') {
        if (this._msnry.items.length !== 0) {
          this.el.insertBefore(element, this._msnry.items[0].element);
          this._msnry.prepended(element);
        } else {
          this.el.appendChild(element);
          this._msnry.appended(element);
        }
      } else if (addStatus === 'append') {
          this.el.appendChild(element);
          this._msnry.appended(element);
      } else {
        this.el.appendChild(element);
        this._msnry.addItems(element);
      }

      this._msnry.layout();
    }

  }

  public setAddStatus(value: string) {
    this.masonryOptions.addStatus = value;
  }

  public removeItem(item: Element): Observable<MasonryGridItem> {
    this.removeAnimation();
    if (item) {
      const obsv = new Observable(observer => {
        let count = item.getAttribute('data-count');
        let index = this._msnry.items.findIndex( (masonryItem: any) => {
           return masonryItem.element.getAttribute('data-count') === count;
        });
        observer.next({ element: this._msnry.items[index].element });
        this._msnry.remove(this._msnry.items[index].element);
        setTimeout( () => {
          this._msnry.layout();
        });
      });

      return obsv;
    }

    return new EmptyObservable();
  }

  public removeFirstItem(): Observable<MasonryGridItem> {
    this.removeAnimation();
    if (this._msnry.items.length) {
      const obsv = new Observable(observer => {
        let count = this._msnry.items[0].element.getAttribute('data-count');
        let index = Array.prototype.slice.call(this.el.children).findIndex( (element: any) => {
           return element.getAttribute('data-count') === count;
        });
        // this._msnry.remove(this._msnry.items[0].element);
        observer.next({ element: this._msnry.items[0].element, index: index });
        setTimeout( () => {
          this._msnry.layout();
        });
      });

      return obsv;
    }

    return new EmptyObservable();
  }

  public removeAllItems(): Observable<MasonryGridItem> {
    this.removeAnimation();
    const obsv = new Observable(observer => {
      let items: MasonryGridItem[] = [];
      Array.prototype.slice.call(this.el.children).forEach( (element: any, index: number) => {
        items.push({ element, index });
        this._msnry.remove(element);
      });
      if (this._msnry.items.length === 0) {
        observer.next(items);
      }

    });

    return obsv;
  }
}
