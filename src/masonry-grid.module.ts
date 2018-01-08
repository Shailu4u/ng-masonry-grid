/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasonryGridComponent } from './masonry-grid.component';
import { MasonryGridDirective } from './masonry-grid.directive';
import { MasonryGridService } from './masonry-grid.service';

@NgModule({
  imports: [CommonModule],
  exports: [MasonryGridComponent, MasonryGridDirective],
  declarations: [MasonryGridComponent, MasonryGridDirective],
  providers: [MasonryGridService]
})
export class MasonryGridModule {}
