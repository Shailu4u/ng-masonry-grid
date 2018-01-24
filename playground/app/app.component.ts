import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <ul class="list">
      <li class="list-item" *ngFor="let item of buttons">
        <button class="btn" [ngClass]="{ 'active': item.active }" (click)="onSelect(item)">Effect {{item.index}}</button>
      </li>
    </ul>
  </div>
  <div class="container">
    <ng-masonry-grid *ngIf="showMasonry"
                  [masonryOptions]="{ transitionDuration: '0.4s', gutter: 5 }"
                  [useAnimation]="true"
                  [useImagesLoaded]="true"
                  [scrollAnimationOptions]="animOptions">
      <ng-masonry-grid-item *ngFor="let item of masonryItems; let i = index;">
        <img [src]="item" alt="No image" />
      </ng-masonry-grid-item>
    </ng-masonry-grid>
  </div>
`,
styleUrls: ['../../node_modules/ng-masonry-grid/ng-masonry-grid.css', './app.component.css'] // point to ng masonry grid css
})
export class AppComponent {

  buttons: Array<any> = [];

  showMasonry = true;

  animOptions = { animationEffect: 'effect-1' };

  masonryItems: Array<string> = [];

  constructor() {
    this.buttons = [
      { index: 1, active: true },
      { index: 2, active: false },
      { index: 3, active: false },
      { index: 4, active: false },
      { index: 5, active: false },
      { index: 6, active: false },
      { index: 7, active: false },
      { index: 8, active: false }
    ];

    const len = 40; // length of grid items

    for (let i = 0; i <= len; i++) {
      this.masonryItems.push(this.getSrc());
    }
  }

  onSelect(item: any) {
    this.showMasonry = false;
    this.buttons.forEach( (i) => i.active = false );
    item.active = true;
    this.animOptions = { animationEffect: 'effect-' + item.index };
    setTimeout(() => this.showMasonry = true, 100);
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getSrc() {
    return '../assets/images/' + this.getRandomInt(1, 15) + '.jpg';
  }
}
