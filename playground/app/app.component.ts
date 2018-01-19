import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <ng-masonry-grid
                  [masonryOptions]="{ transitionDuration: '0.4s', gutter: 5 }"
                  [useAnimation]="true"
               >
      <ng-masonry-grid-item *ngFor="let item of masonryItems; let i = index;">
        <img src="../assets/images/{{ (i+1) >  15 ? masonryItems.length - i: i+1 }}.jpg" alt="No image" />
      </ng-masonry-grid-item>
    </ng-masonry-grid>
  </div>
`,
styleUrls: ['../../node_modules/ng-masonry-grid/ng-masonry-grid.css'] // point to ng masonry grid css
})
export class AppComponent {

  masonryItems: Array<number> = [];

  constructor() {
    this.masonryItems.length = 30;
  }
}
