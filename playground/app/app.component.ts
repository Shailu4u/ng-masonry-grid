import { Component, OnDestroy } from '@angular/core';
import { Masonry, MasonryGridItem } from 'ng-masonry-grid';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <div class="div-1">
      <h2 style="text-align: center;">Angular 2 module for Masonry layout</h2>
      <ng-masonry-grid *ngIf="showMasonry"
                    [masonryOptions]="{ transitionDuration: '0.4s', gutter: 10 }"
                    [useAnimation]="true"
                    [useImagesLoaded]="true"
                    (onNgMasonryInit)="onNgMasonryInit($event)"
                    [scrollAnimationOptions]="animOptions"
                    >
        <ng-masonry-grid-item id="{{'masonry-item-'+i}}" *ngFor="let item of masonryItems; let i = index;" (click)="removeItem($event)">
        <img [src]="item.src" alt="No image" />
        </ng-masonry-grid-item>
      </ng-masonry-grid>
    </div>
    <div class="div-2">
      <div class="container-fixed">
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
    </div>
  </div>
`,
styleUrls: ['../../node_modules/ng-masonry-grid/ng-masonry-grid.css', './app.component.css'] // point to ng masonry grid css
})
export class AppComponent implements OnDestroy {

  _masonry: Masonry;
  private _removeAllSubscription: ISubscription;
  private _removeItemSubscription: ISubscription;
  private _removeFirstItemSubscription: ISubscription;

  buttons: Array<any> = [];
  count = 0;

  showMasonry = true;

  animOptions = { animationEffect: 'effect-1' };

  masonryItems: Array<any> = [];

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
      this.masonryItems.push({ src: this.getSrc(), count: this.count++});
    }
  }

  ngOnDestroy() {
    if (this._masonry) {
      this._removeAllSubscription.unsubscribe();
      this._removeItemSubscription.unsubscribe();
      this._removeFirstItemSubscription.unsubscribe();
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
    return  Math.floor( Math.random() * max + min );
  }

  getSrc() {
    // const width = this.getRandomInt( 300, 400 );
    // const height = this.getRandomInt( 300, 500 );
    // return 'http://lorempixel.com/'  + width + '/' + height + '/nature';

    return '../assets/images/' + this.getRandomInt(1, 15) + '.jpg';
  }

  onNgMasonryInit($event: Masonry) {
    console.log($event);
    this._masonry = $event;
  }

  // done without images
  removeItem($event: any) {
    if (this._masonry) {
      this._removeItemSubscription = this._masonry.removeItem($event.currentTarget)
          .subscribe((item: MasonryGridItem) => {
           if (item) {
            let id = item.element.getAttribute('id');
            let index = id.split('-')[2];
            this.masonryItems.splice(index, 1);
           }
          });
    }
  }

  prependItems() {
    let src = [{ src: this.getSrc(), count: this.count++}, { src: this.getSrc(), count: this.count++},
      { src: this.getSrc(), count: this.count++}];
    this._masonry.setAddStatus('prepend');
    this.masonryItems.splice(0, 0, ...src);
  }

  // append items to existing masonry
  appendItems() {
    let src = [{ src: this.getSrc(), count: this.count++}, { src: this.getSrc(), count: this.count++},
       { src: this.getSrc(), count: this.count++}];
    this._masonry.setAddStatus('append');
    this.masonryItems.push(...src);
  }

  addItems() {
    let src = [{ src: this.getSrc(), count: this.count++}, { src: this.getSrc(), count: this.count++},
      { src: this.getSrc(), count: this.count++}];
    this._masonry.setAddStatus('add');
    this.masonryItems.push(...src);
  }

  removeFirstItem() {
    if (this._masonry) {
      this._removeFirstItemSubscription = this._masonry.removeFirstItem()
          .subscribe( (item: MasonryGridItem) => {
            if (item) {
              let id = item.element.getAttribute('id');
              let index = id.split('-')[2];
              this.masonryItems.splice(index, 1);
            }
         });
    }
  }

  // done
  removeAllItems() {
    if (this._masonry) {
      this._removeAllSubscription =
        this._masonry.removeAllItems()
        .subscribe( (items: MasonryGridItem) => {
           // remove item from the list
           this.masonryItems = [];
        });
    }
  }
}
