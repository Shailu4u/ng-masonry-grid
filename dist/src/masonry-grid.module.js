/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasonryGridComponent } from './masonry-grid.component';
import { MasonryGridDirective } from './masonry-grid.directive';
import { MasonryGridService } from './masonry-grid.service';
var MasonryGridModule = (function () {
    function MasonryGridModule() {
    }
    MasonryGridModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [MasonryGridComponent, MasonryGridDirective],
                    declarations: [MasonryGridComponent, MasonryGridDirective],
                    providers: [MasonryGridService]
                },] },
    ];
    /** @nocollapse */
    MasonryGridModule.ctorParameters = function () { return []; };
    return MasonryGridModule;
}());
export { MasonryGridModule };
//# sourceMappingURL=masonry-grid.module.js.map