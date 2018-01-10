/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgMasonryGridComponent } from './ng-masonry-grid.component';
import { NgMasonryGridDirective } from './ng-masonry-grid.directive';
import { NgMasonryGridService } from './ng-masonry-grid.service';

@NgModule({
  imports: [CommonModule],
  exports: [NgMasonryGridComponent, NgMasonryGridDirective],
  declarations: [NgMasonryGridComponent, NgMasonryGridDirective],
  providers: [NgMasonryGridService]
})
export class NgMasonryGridModule {}
