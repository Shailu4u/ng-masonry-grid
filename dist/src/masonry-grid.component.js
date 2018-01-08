/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
import { Component, Input, Output, ElementRef, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { MasonryGridService } from './masonry-grid.service';
var MasonryGridComponent = (function () {
    function MasonryGridComponent(_platformId, _element, masonryGridService) {
        this._platformId = _platformId;
        this._element = _element;
        this.masonryGridService = masonryGridService;
        // Inputs
        this.masonryOptions = {};
        this.useAnimation = false;
        // Outputs
        this.layoutComplete = new EventEmitter();
        this.removeComplete = new EventEmitter();
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
        { type: Component, args: [{
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
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
        { type: ElementRef, },
        { type: MasonryGridService, },
    ]; };
    MasonryGridComponent.propDecorators = {
        "masonryOptions": [{ type: Input },],
        "useAnimation": [{ type: Input },],
        "scrollAnimationOptions": [{ type: Input },],
        "layoutComplete": [{ type: Output },],
        "removeComplete": [{ type: Output },],
    };
    return MasonryGridComponent;
}());
export { MasonryGridComponent };
//# sourceMappingURL=masonry-grid.component.js.map