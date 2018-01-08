(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global.MasonryGridModule = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
var MasonryGridService = (function () {
    function MasonryGridService(_platformId) {
        this._platformId = _platformId;
        this.isAnimate = false;
        this.docElem = window.document.documentElement;
        this.animationDefaults = {
            animationEffect: 'effect-1',
            // default animation effect-1
            // Minimum and a maximum duration of the animation (random value is chosen)
            minDuration: 0,
            maxDuration: 0,
            // The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
            // if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport.
            // If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
            viewportFactor: 0
        };
        this.masonryDefaults = {
            itemSelector: '[masonry-grid-item], masonry-grid-item' // Set default itemSelector: mandatory
        };
    }
    MasonryGridService.prototype.getViewportH = function () {
        var client = this.docElem['clientHeight'], inner = window['innerHeight'];
        if (client < inner)
            return inner;
        else
            return client;
    };
    MasonryGridService.prototype.scrollY = function () {
        return window.pageYOffset || this.docElem.scrollTop;
    };
    MasonryGridService.prototype.getOffset = function (el) {
        var offsetTop = 0, offsetLeft = 0;
        do {
            if (!isNaN(el.offsetTop)) {
                offsetTop += el.offsetTop;
            }
            if (!isNaN(el.offsetLeft)) {
                offsetLeft += el.offsetLeft;
            }
        } while (el = el.offsetParent);
        return {
            top: offsetTop,
            left: offsetLeft
        };
    };
    MasonryGridService.prototype.inViewport = function (el, h) {
        var elH = el.offsetHeight, scrolled = this.scrollY(), viewed = scrolled + this.getViewportH(), elTop = this.getOffset(el).top, elBottom = elTop + elH, 
        // if 0, the element is considered in the viewport as soon as it enters.
        // if 1, the element is considered in the viewport only when it's fully inside
        // value in percentage (1 >= h >= 0)
        h = h || 0;
        return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
    };
    MasonryGridService.prototype.extend = function (a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    };
    MasonryGridService.prototype.init = function (useAnimation, el, masonryOptions, animationOptions) {
        this.useAnimation = useAnimation;
        this.el = el;
        this.isAnimate = animationOptions ? true : false;
        this.masonryOptions = this.extend(this.masonryDefaults, masonryOptions);
        this.animationOptions = this.extend(this.animationDefaults, animationOptions); // this.extend( this.animationDefaults, animationOptions );
        return this._init();
    };
    // Initialize Masonry
    // Initialize Masonry
    MasonryGridService.prototype.initializeMasonry = 
    // Initialize Masonry
    function (_element, options) {
        var Masonry = require('masonry-layout');
        return new Masonry(_element, options);
    };
    MasonryGridService.prototype._init = function () {
        var _this = this;
        // set margin bottom of gutter length.
        if (this.masonryOptions.gutter) {
            Array.prototype.slice.call(document.querySelectorAll(this.masonryDefaults.itemSelector)).forEach(function (element) {
                element.style.marginBottom = _this.masonryOptions.gutter + 'px';
            });
        }
        if (this.useAnimation || this.isAnimate) {
            this.classie = require('desandro-classie');
            // add animation effect
            this.el.classList += " " + this.animationOptions.animationEffect;
        }
        if (common.isPlatformBrowser(this._platformId)) {
            // initialize masonry
            this._msnry = this.initializeMasonry(this.el, this.masonryOptions);
            if (this.useAnimation || this.isAnimate && !this._msnry) {
                this._msnry.on('layoutComplete', function (items) {
                    _this.items = Array.prototype.slice.call(document.querySelectorAll(_this.masonryDefaults.itemSelector));
                    _this.itemsCount = _this.items.length;
                    _this.didScroll = false;
                    _this.itemsRenderedCount = 0;
                    // the items already shown...
                    // the items already shown...
                    _this.items.forEach(function (el, i) {
                        if (_this.inViewport(el)) {
                            _this._checkTotalRendered();
                            _this.classie.add(el, 'shown');
                            _this.classie.remove(el, 'animate');
                            //setTimeout(() => {
                            //}, 1000);
                        }
                    });
                });
                // animate on scroll the items inside the viewport
                window.addEventListener('scroll', function () {
                    _this._onScrollFn();
                }, false);
                window.addEventListener('resize', function () {
                    _this._resizeHandler();
                }, false);
            }
            return this._msnry;
        }
        return null;
    };
    MasonryGridService.prototype._onScrollFn = function () {
        var self = this;
        if (!this.didScroll) {
            this.didScroll = true;
            setTimeout(function () { self._scrollPage(); }, 60);
        }
    };
    MasonryGridService.prototype._scrollPage = function () {
        var _this = this;
        var self = this;
        this.items.forEach(function (el, i) {
            if (!_this.classie.has(el, 'shown') && !_this.classie.has(el, 'animate') && _this.inViewport(el, self.animationOptions.viewportFactor)) {
                setTimeout(function () {
                    var perspY = _this.scrollY() + _this.getViewportH() / 2;
                    self.el.style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
                    self.el.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
                    self.el.style.perspectiveOrigin = '50% ' + perspY + 'px';
                    self._checkTotalRendered();
                    if (self.animationOptions.minDuration && self.animationOptions.maxDuration) {
                        var randDuration = (Math.random() * (self.animationOptions.maxDuration - self.animationOptions.minDuration) + self.animationOptions.minDuration) + 's';
                        el.style.WebkitAnimationDuration = randDuration;
                        el.style.MozAnimationDuration = randDuration;
                        el.style.animationDuration = randDuration;
                    }
                    _this.classie.add(el, 'animate');
                }, 25);
            }
        });
        this.didScroll = false;
    };
    MasonryGridService.prototype._resizeHandler = function () {
        var self = this;
        function delayed() {
            self._scrollPage();
            self.resizeTimeout = null;
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(delayed, 1000);
    };
    MasonryGridService.prototype._checkTotalRendered = function () {
        var _this = this;
        ++this.itemsRenderedCount;
        if (this.itemsRenderedCount === this.itemsCount) {
            window.removeEventListener('scroll', this._onScrollFn);
            setTimeout(function () {
                _this._msnry.layout();
            });
        }
    };
    MasonryGridService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    MasonryGridService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
    ]; };
    return MasonryGridService;
}());

/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
var MasonryGridComponent = (function () {
    function MasonryGridComponent(_platformId, _element, masonryGridService) {
        this._platformId = _platformId;
        this._element = _element;
        this.masonryGridService = masonryGridService;
        // Inputs
        this.masonryOptions = {};
        this.useAnimation = false;
        // Outputs
        this.layoutComplete = new core.EventEmitter();
        this.removeComplete = new core.EventEmitter();
    }
    MasonryGridComponent.prototype.ngOnInit = function () {
    };
    MasonryGridComponent.prototype.ngAfterViewInit = function () {
        //initialize masonry after View Initialization
        this.initializeMasonry();
    };
    MasonryGridComponent.prototype.ngOnDestroy = function () {
        if (this._msnry) {
            this._msnry.destroy();
        }
    };
    MasonryGridComponent.prototype.layout = function () {
        var _this = this;
        setTimeout(function () {
            _this._msnry.layout();
        }, 50);
    };
    // remove item from masonry
    // remove item from masonry
    MasonryGridComponent.prototype.remove = 
    // remove item from masonry
    function (element) {
        this._msnry.remove(element);
        this.layout();
    };
    MasonryGridComponent.prototype.initializeMasonry = function () {
        var _this = this;
        //initialize Masonry with Animation effects
        this._msnry = this.masonryGridService.init(this.useAnimation, this._element.nativeElement, this.masonryOptions, this.scrollAnimationOptions);
        // Bind to Masonry events
        this._msnry.on('layoutComplete', function (items) {
            _this.layoutComplete.emit(items);
        });
        this._msnry.on('removeComplete', function (items) {
            _this.removeComplete.emit(items);
        });
        this.layout();
    };
    MasonryGridComponent.decorators = [
        { type: core.Component, args: [{
                    selector: '[masonry-grid], masonry-grid',
                    template: '<ng-content></ng-content>',
                    //styleUrls: ['./masonry-grid.css']
                    styles: [
                        "\n\t\t:host {\n\t\t\tdisplay: block;\n\t\t}\n\t"
                    ]
                },] },
    ];
    /** @nocollapse */
    MasonryGridComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
        { type: core.ElementRef, },
        { type: MasonryGridService, },
    ]; };
    MasonryGridComponent.propDecorators = {
        "masonryOptions": [{ type: core.Input },],
        "useAnimation": [{ type: core.Input },],
        "scrollAnimationOptions": [{ type: core.Input },],
        "layoutComplete": [{ type: core.Output },],
        "removeComplete": [{ type: core.Output },],
    };
    return MasonryGridComponent;
}());

/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
var MasonryGridDirective = (function () {
    function MasonryGridDirective(_element, _parent, platformId) {
        this._element = _element;
        this._parent = _parent;
        this.platformId = platformId;
    }
    MasonryGridDirective.prototype.ngAfterViewInit = function () {
        if (common.isPlatformBrowser(this.platformId)) {
            this.watchForHtmlChanges();
        }
    };
    MasonryGridDirective.prototype.ngOnDestroy = function () {
        if (common.isPlatformBrowser(this.platformId)) {
            this._parent.remove(this._element.nativeElement);
        }
    };
    /** When HTML in brick changes dynamically, observe that and change layout */
    /** When HTML in brick changes dynamically, observe that and change layout */
    MasonryGridDirective.prototype.watchForHtmlChanges = /** When HTML in brick changes dynamically, observe that and change layout */
    function () {
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
            /** Watch for any changes to subtree */
            var self_1 = this;
            var observer = new MutationObserver(function (mutations, observerFromElement) {
                self_1._parent.layout();
            });
            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            observer.observe(this._element.nativeElement, {
                subtree: true,
                childList: true
            });
        }
    };
    MasonryGridDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[masonry-grid-item], masonry-grid-item'
                },] },
    ];
    /** @nocollapse */
    MasonryGridDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: MasonryGridComponent, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return MasonryGridComponent; }),] },] },
        { type: undefined, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
    ]; };
    return MasonryGridDirective;
}());

/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
var MasonryGridModule = (function () {
    function MasonryGridModule() {
    }
    MasonryGridModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    exports: [MasonryGridComponent, MasonryGridDirective],
                    declarations: [MasonryGridComponent, MasonryGridDirective],
                    providers: [MasonryGridService]
                },] },
    ];
    /** @nocollapse */
    MasonryGridModule.ctorParameters = function () { return []; };
    return MasonryGridModule;
}());

exports.MasonryGridModule = MasonryGridModule;
exports.MasonryGridComponent = MasonryGridComponent;
exports.MasonryGridDirective = MasonryGridDirective;
exports.MasonryGridService = MasonryGridService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=masonry-grid.module.umd.js.map
