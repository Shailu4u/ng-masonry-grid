/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import { Injectable, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MasonryOptions, Masonry as IMasonry, AnimationOptions } from './ng-masonry-grid.interface';
import { ImagesLoadedNamespace } from './imagesloaded.interface';
import { Observable } from 'rxjs/Observable';
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
  imagesLoaded: ImagesLoadedNamespace.ImagesLoadedConstructor;

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
    itemSelector: '[ng-masonry-grid-item], ng-masonry-grid-item' // Set default itemSelector: mandatory
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
    animationOptions?: AnimationOptions, useImagesLoaded?: boolean): Observable<IMasonry> {
    this.useAnimation = useAnimation;
    this.el = el;
    this.isAnimate = animationOptions ? true : false;
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

  private _init(): Observable<IMasonry> {

    // set margin bottom of gutter length.
    if (this.masonryOptions.gutter) {
      Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
        element.style.marginBottom = this.masonryOptions.gutter + 'px';
      });
    }

    if (this.useAnimation || this.isAnimate) {
      this.classie = require('desandro-classie');
      // add animation effect
      this.el.classList += ' ' + this.animationOptions.animationEffect;
    }

    if (isPlatformBrowser(this._platformId)) {
      const subject = new Subject<IMasonry>();
      if (this.useImagesLoaded) {
        this.imagesLoaded = require('imagesloaded');
        this.imagesLoaded(this.el, { background: true}, (instance) => {
          console.log(instance);
          subject.next(this._initMasonry());
        });
        return subject.asObservable();
      } else {
        subject.next(this._initMasonry());
        return subject.asObservable();
      }
    }

    return null;
  }

  private _initMasonry() {
    // initialize masonry
    this._msnry = this.initializeMasonry(this.el, this.masonryOptions);

    if ((this.useAnimation || this.isAnimate) && this._msnry) {

      this._msnry.once('layoutComplete', (items: any) => {
        this._layoutComplete(items);
      });

      // animate on scroll the items inside the viewport
      window.addEventListener( 'scroll', this._onScrollHandler, false );
      window.addEventListener( 'resize', this._onResizeHandler, false );
    }

    return this._msnry;
  }

  private _layoutComplete(items: any) {
    this.items = items.map((item) => item.element);
    this.itemsCount = this.items.length;
    this.didScroll = false;
    this.itemsRenderedCount = 0;
    // the items already shown...
    this.items.forEach( ( el, i ) => {
      if ( this.inViewport( el ) ) {
        this._checkTotalRendered();
        // this.classie.add( el, 'shown' );
      }
    });
  }

  private _onScrollFn() {
    let self = this;
    if ( !this.didScroll ) {
      this.didScroll = true;
      setTimeout( () => { self._scrollPage(); }, 60 );
    }
  }

  private _scrollPage () {
    let self = this;
    if (this.items.length) {
      this.items.forEach( ( el, i ) => {
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

}
