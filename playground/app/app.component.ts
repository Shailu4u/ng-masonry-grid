import { Component } from '@angular/core';
import { Masonry } from 'ng-masonry-grid';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <h2>Angular 2 module for Masonry layout</h2>
    <ul class="list">
      <li class="list-item">
        <button class="btn" (click)="addItems()">Add Items</button>
      </li>
      <li class="list-item">
        <button class="btn" (click)="appendItems()">Append Items</button>
      </li>
      <li class="list-item">
        <button class="btn" (click)="prependItems()">Prepend Items</button>
      </li>
      <li class="list-item">
        <button class="btn" (click)="removeFirstItem()">Remove First Item</button>
      </li>
      <li class="list-item">
        <button class="btn" (click)="removeAllItems()">Remove All Items</button>
      </li>
      <li class="list-item" *ngFor="let item of buttons">
        <button class="btn" [ngClass]="{ 'active': item.active }" (click)="onSelect(item)">Effect {{item.index}}</button>
      </li>
    </ul>
  </div>
  <div class="container">
    <ng-masonry-grid *ngIf="showMasonry"
                  [masonryOptions]="{ transitionDuration: '0.4s', gutter: 5 }"
                  [useAnimation]="true"
                  [useImagesLoaded]="false"
                  (onNgMasonryInit)="onNgMasonryInit($event)"
                  [scrollAnimationOptions]="animOptions"
                  >
      <ng-masonry-grid-item *ngFor="let item of masonryItems; let i = index;" (click)="removeItem($event)">
        <img [src]="item" alt="No image" />
      </ng-masonry-grid-item>
    </ng-masonry-grid>
  </div>
`,
styleUrls: ['../../node_modules/ng-masonry-grid/ng-masonry-grid.css', './app.component.css'] // point to ng masonry grid css
})
export class AppComponent {

  _masonry: Masonry;

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

    const len = 10; // length of grid items

    for (let i = 0; i < len; i++) {
      this.masonryItems.push(this.getSrc());
    }
  }

  onSelect(item: any) {
    this.showMasonry = false;
    this.buttons.forEach( (i) => i.active = false );
    item.active = true;
    this.animOptions = { animationEffect: 'effect-' + item.index };
    this._masonry.setAddStatus('append');
    setTimeout(() => this.showMasonry = true, 100);
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getSrc() {
    return '../assets/images/' + this.getRandomInt(1, 15) + '.jpg';
  }

  onNgMasonryInit($event: Masonry) {
    console.log($event);
    this._masonry = $event;
  }

  removeItem($event: any) {
    if (this._masonry) {
      this._masonry.removeAnimation(); // remove custom animations first and then remove using masonry instance
      this._masonry.remove($event.currentTarget);
    }
  }

  prependItems() {
    let src = [this.getSrc(), this.getSrc(), this.getSrc()];
    this._masonry.setAddStatus('prepend');
    this.masonryItems.push(...src);
  }

  // append items to existing masonry
  appendItems() {
    let src = [this.getSrc(), this.getSrc(), this.getSrc()];
    this._masonry.setAddStatus('append');
    this.masonryItems.splice(0, 0, ...src);
  }

  addItems() {
    let src = [this.getSrc(), this.getSrc(), this.getSrc()];
    this._masonry.setAddStatus('add');
    this.masonryItems.push(...src);
  }

  removeFirstItem() {
    if (this._masonry) {
      this._masonry.removeFirstItem();
    }
  }

  removeAllItems() {
    if (this._masonry) {
      this._masonry.removeAllItems();
    }
  }
}
