/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
import { Directive, Inject, ElementRef, forwardRef, PLATFORM_ID } from '@angular/core';
import { MasonryGridComponent } from './masonry-grid.component';
import { isPlatformBrowser } from '@angular/common';
var MasonryGridDirective = (function () {
    function MasonryGridDirective(_element, _parent, platformId) {
        this._element = _element;
        this._parent = _parent;
        this.platformId = platformId;
    }
    MasonryGridDirective.prototype.ngAfterViewInit = function () {
        if (isPlatformBrowser(this.platformId)) {
            this.watchForHtmlChanges();
        }
    };
    MasonryGridDirective.prototype.ngOnDestroy = function () {
        if (isPlatformBrowser(this.platformId)) {
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
        { type: Directive, args: [{
                    selector: '[masonry-grid-item], masonry-grid-item'
                },] },
    ];
    /** @nocollapse */
    MasonryGridDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: MasonryGridComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return MasonryGridComponent; }),] },] },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    ]; };
    return MasonryGridDirective;
}());
export { MasonryGridDirective };
//# sourceMappingURL=masonry-grid.directive.js.map