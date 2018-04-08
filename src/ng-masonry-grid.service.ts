/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MasonryOptions, Masonry as IMasonry, AnimationOptions,
        ImagesLoadedConstructor, MasonryGridItem } from './ng-masonry-grid.interface';

import { Observable } from 'rxjs/Observable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { Subscriber } from 'rxjs/Subscriber';

declare var require: any;

@Injectable()
export class NgMasonryGridService {

  el: any;
  masonryOptions: MasonryOptions;
  animationOptions: AnimationOptions;
  items: Array<any> = [];
  itemsCount: number = 0;
  itemsRenderedCount: number = 0;
  didScroll: boolean;
  resizeTimeout: any;
  useAnimation: boolean;
  isAnimate = false;
  public _msnry: IMasonry;
  _onScrollHandler: any;
  _onResizeHandler: any;
  useImagesLoaded: boolean;
  imagesLoaded: ImagesLoadedConstructor;

  docElem = window.document.documentElement;

  /**
   * Default animation options of grid items on scroll
   */
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

  /**
   * Default masonry options
   */
  masonryDefaults: MasonryOptions = {
    // Set default itemSelector: mandatory
    itemSelector: '[ng-masonry-grid-item], ng-masonry-grid-item, [ng-masonry-grid-item].animate, ng-masonry-grid-item.animate',
    initLayout: false,
    addStatus: 'append' // 'prepend' or 'add' or 'reorder'
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

  /**
   * Initialize and extend all options
   * @param el: Masonry Container DOM Element
   * @param masonryOptions: User defined Masonry Options
   * @param useAnimation: User defined Animation (Boolean)
   * @param animationOptions: User defined Animation options
   * @param useImagesLoaded: User defined imagesloaded (Boolean)
   */
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
      // add animation effect
      this.el.classList.add(this.animationOptions.animationEffect);
    }

    // get imagesloaded libary instance
    if (this.useImagesLoaded) {
       this.imagesLoaded = require('imagesloaded');
    }

    // check if browser and then intialize Masonry
    if (isPlatformBrowser(this._platformId)) {
      return this._initMasonry();
    }

    return null;
  }

  private _initMasonry() {
    // initialize masonry
    this._msnry = this.initializeMasonry(this.el, this.masonryOptions);

    // use animation options if useAnimation is true
    if (this.isAnimate && this._msnry) {

      // animate on scroll the items inside the viewport
      window.addEventListener( 'scroll', this._onScrollHandler, false );
      window.addEventListener( 'resize', this._onResizeHandler, false );

      /**
       * Remove scroll animations to remove conflicts between Masonry Transitions and Scroll Animations
       */
      this._msnry.on('layoutComplete', (items: any) => {
        Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
          element.classList.remove('animate');
        });
      });

      this._msnry.on('removeComplete', (items: any) => {
        Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
          element.classList.remove('animate');
        });
        this._msnry.layout();
      });
    }

    return this._msnry;
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
          // setTimeout( () => {
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
            el.classList.add('animate');
         // }, 25 );
        } else {
           el.classList.remove('animate');
        }
      });
    }

    this.didScroll = false;
  }

  private _resizeHandler() {
    let self = this;
    Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
      element.classList.remove('animate');
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

  /**
   * Check if total grid items are redered in the DOM
   */
  private _checkTotalRendered() {
    ++this.itemsRenderedCount;
    if ( this.itemsRenderedCount === this.itemsCount ) {
      window.removeEventListener( 'scroll', this._onScrollHandler, false );
    }
  }

  /**
   * On Destroy remove Scroll and Resize event Listeners
   */
  public onDestory() {
    window.removeEventListener( 'scroll', this._onScrollHandler, false );
    window.removeEventListener( 'resize', this._onResizeHandler, false );
  }

  /**
   * Remove scroll animations
   */
  public removeAnimation() {
    if (this.isAnimate) {
      Array.prototype.slice.call(this.el.children).forEach( (element: any) => {
        element.classList.remove('animate');
      });
    }
  }

  /**
   * Add Each grid item to Masonry based on Masony addStatus property
   * @param element Element - Grid item
   */
  public add(element) {
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
          ++this.itemsRenderedCount;
          this.items.push(element);
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

  public addOrderItem(element) {
    let addStatus = this.masonryOptions.addStatus.toLowerCase();

    // set margin bottom of gutter value.
    if (this.masonryOptions.gutter) {
      element.style.marginBottom = this.masonryOptions.gutter + 'px';
    }

    if (this.useImagesLoaded) {
      setTimeout( () => {
        this.imagesLoaded(element, (instance: any) => {

        });
      }, 0);


    } else {

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

  public reorderMasonryItems() {
    if (this.itemsRenderedCount === this.itemsCount) {
      let reorderItems = this.items.sort( (a: any, b: any) => {
        return a.dataset.count - b.dataset.count;
      });
      while (this.el.hasChildNodes()) {
          this.el.removeChild(this.el.lastChild);
      }

      setTimeout( ()=> {
        reorderItems.forEach( (item) => {
          this.el.appendChild(item);
          this._msnry.appended(item);
        });
        if (this._msnry) {
          this._msnry.reloadItems();
          this._msnry.layout();
        }
      }, 100);
    }
  }

  /**
   * Set add status to Masonry before adding or appending
   * @param value 'append' or 'prepend' or 'add'
   */
  public setAddStatus(value: string) {
    this.masonryOptions.addStatus = value;
  }

  /**
   * Remove grid item from Masonry
   * @param item Element: Removed Grid Item DOM
   */
  public removeItem(item: any): Observable<MasonryGridItem> {
    this.removeAnimation();
    if (item) {
      item.classList.remove('animate');
      const obsv = new Observable(observer => {
        let count = item.getAttribute('data-count');
        let index = this._msnry.items.findIndex( (masonryItem: any) => {
            return masonryItem.element.getAttribute('data-count') === count;
        });
        setTimeout(() => {
          const elem = this._msnry.items[index].element;
          this._onTransitionEnd(observer, elem);
          const indx = this.items.findIndex( (element) => {
            return element.dataset.count === item.dataset.count;
          });
          this.items.splice(indx, 1);
          this.itemsCount -= 1;
          this.itemsRenderedCount -= 1;
        }, 10);
      });
      return obsv;
    }

    return new EmptyObservable();
  }

  /**
   * Remove first grid item from the Masonry List
   */
  public removeFirstItem(): Observable<MasonryGridItem> {
    this.removeAnimation();
    if (this._msnry.items.length) {
      this._msnry.items[0].element.classList.remove('animate');
      const obsv = new Observable(observer => {
        setTimeout(() => {
          this._onTransitionEnd(observer, this._msnry.items[0].element);
          this.items.splice(0, 1);
          this.itemsCount -= 1;
          this.itemsRenderedCount -= 1;
        }, 10);
      });
      return obsv;
    }

    return new EmptyObservable();
  }

  /**
   * Empty the Masonry list
   */
  public removeAllItems(): Observable<MasonryGridItem> {
    this.removeAnimation();
    const obsv = new Observable(observer => {
      setTimeout(() => {
        let items: MasonryGridItem[] = [];
        this._msnry.items.forEach( (masonryItem: any, index: number) => {
          items.push({ element: masonryItem.element, index });
          this.addTransition(masonryItem.element);
        });
        const elem = this._msnry.items[this._msnry.items.length - 1].element;
        const transitionEnd = () => {
          observer.next(items);
          setTimeout(() => {
            this._msnry.reloadItems();
            this._msnry.layout();
            this.items = [];
            this.itemsCount = 0;
            this.itemsRenderedCount = 0;
          }, 10);
          elem.removeEventListener('transitionend', transitionEnd, false);
        };
        elem.addEventListener('transitionend', transitionEnd , false);

        if (this.masonryOptions.transitionDuration === "0") {
            transitionEnd()
        }
      }, 10);
    });

    return obsv;
  }

  /**
   * Add transition effect on DOM Node removal
   * @param elem: Grid item DOM element
   */
  public addTransition(elem: any) {
    elem.style.transition = 'transform ' + this.masonryOptions.transitionDuration + ', opacity ' + this.masonryOptions.transitionDuration;
    elem.style.transform = 'scale(0.001)';
    elem.style.opacity = '0';
  }

  /**
   * On transition End, remove eventListener
   * @param observer Subscriber<MasonryGridItem>
   * @param elem: Grid item DOM element
   */
  private _onTransitionEnd(observer: Subscriber<MasonryGridItem>, elem: Element) {
    if (elem) {
      this.addTransition(elem);
      const transitionEnd = () => {
        let isindex = Array.prototype.slice.call(this.el.children).findIndex( (element: any) => {
          return element.getAttribute('data-count') === elem.getAttribute('data-count');
        });
        if (isindex !== -1) {
          observer.next({ element: elem, index: isindex });
        }
        setTimeout(() => {
          this._msnry.reloadItems();
          this._msnry.layout();
        }, 10);
        elem.removeEventListener('transitionend', transitionEnd, false);
      };
      elem.addEventListener('transitionend', transitionEnd , false);
    }
  }
}
