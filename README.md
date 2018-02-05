# ng-masonry-grid

Angular 2+ masonry grid component with CSS animations on scroll.

[![npm version](https://badge.fury.io/js/ng-masonry-grid.svg)](https://badge.fury.io/js/ng-masonry-grid)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/Shailu4u/ng-masonry-grid.svg)](https://beta.gemnasium.com/projects/github.com/Shailu4u/ng-masonry-grid)

Preview: https://ng-masonry-grid-demo.herokuapp.com/ 

## Installation

First install Peer dependencies

```bash
$ npm install masonry-layout imagesloaded --save
```

To install ng-masonry-grid library, run:

```bash
$ npm install ng-masonry-grid --save
```

## Consuming NgMasonryGridModule

You can import `NgMasonryGridModule` Module in any Angular application `AppModule` as shown below:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import NgMasonryGridModule
import { NgMasonryGridModule } from 'ng-masonry-grid';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify NgMasonryGrid library as an import
    NgMasonryGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### Example usage

Once NgMasonryGridModule Module is imported, you can use its components and directives in your Angular application:

```typescript
// In your Angular Component
@Component({
  selector: 'app-root',
  template: `
    <!-- You can now use ng-masonry-grid component in app.component.html -->
    <!-- Masonry grid Container -->
    <ng-masonry-grid
                    [masonryOptions]="{ transitionDuration: '0.8s', gutter: 5 }" 
                    [useAnimation]="true"
                    [useImagesLoaded]="true"
                    [scrollAnimationOptions]="{ animationEffect: 'effect-4', minDuration : 0.4, maxDuration : 0.7 }">
      <!-- Masonry Grid Item -->
      <ng-masonry-grid-item id="{{'masonry-item-'+i}}" *ngFor="let item of masonryItems; let i = index;" (click)="removeItem($event)"> 
        <!-- Grid Content  -->
        <img src="some_image.jpg" alt="No image" />
      </ng-masonry-grid-item>
    </ng-masonry-grid>
  `,
  styleUrls: ['Path_to/node_modules/ng-masonry-grid/ng-masonry-grid.css'] // point to ng-masonry-grid CSS file (required)
})
```

Note: 'id' on ng-masonry-grid-item is required for removeItem, removeAllItems functionality

## Ng Masonry Grid Options

```typescript
scrollAnimationOptions = {
  /* animation effect class will added on ng-masonry-grid-item on scroll, you can choose animation effect class from the predefined list: 
     ["effect-1","effect-2","effect-3","effect-4","effect-5","effect-6","effect-7","effect-8"] or else you can add your own custom class as you wish */
  animationEffect: 'effect-1', // String: (default: 'effect-1')
  // Integer: Minimum and a maximum duration of the animation 
  minDuration : 0,
  maxDuration : 0,
  // The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
  // if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport.
  // If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
  viewportFactor : 0
}

// or

useAnimation = true;  // true/false  default: true,  default animation options will be applied if you do not provide scrollAnimationOptions

masonryOptions = {
   addStatus: 'append', // default: 'append', values from: ['append', 'prepend', 'add'], set status of adding grid items to Masonry
   transitionDuration: '0.4s', // Duration of the transition when items change position or appearance, set in a CSS time format. Default: transitionDuration: '0.4s'
   ...
   // More masonry options available in (http://masonry.desandro.com/options.html)
} 

// Unloaded images can throw off Masonry layouts and cause item elements to overlap. imagesLoaded plugin resolves this issue. 

useImagesLoaded = "true"; // default: false, use true incase if of any images to be loaded in grid items

```
More masonry options available in [Masonry options by David DeSandro](http://masonry.desandro.com/options.html)

## [Masonry Events](http://masonry.desandro.com/events.html)
#### layoutComplete: `EventEmitter<any[]>`
Triggered after a layout and all positioning transitions have completed.

#### removeComplete: `EventEmitter<any[]>`
Triggered after an ng-masonry-grid-item element has been removed.

#### onNgMasonryInit: `EventEmitter<Masonry>`
Get an instance of Masonry after intialization, so that you can use all [Masonry Methods](https://masonry.desandro.com/methods.html) such as layout(), reloadItems() etc.

### Example
```html
<ng-masonry-grid
    (onNgMasonryInit)="onNgMasonryInit($event)"
    (layoutComplete)="layoutComplete($event)" 
    (removeComplete)="removeGridItem($event)">
    <ng-masonry-grid-item 
        id="{{'masonry-item-'+i}}" 
        *ngFor="let item of masonryItems; let i = index;" 
        (click)="removeItem($event)">
    </ng-masonry-grid-item>
</ng-masonry-grid>
```
## Ng Masonry Grid Methods
```typescript
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'; // import necessary datatypes

_masonry: Masonry;
masonryItems: any[]; // NgMasonryGrid Grid item list

// Get ng masonry grid instance first
onNgMasonryInit($event: Masonry) {
  this._masonry = $event;
}

// Append items to NgMasonryGrid
appendItems() {
  if (this._masonry) { // Check if Masonry instance exists
    this._masonry.setAddStatus('append'); // set status to 'append'
    this.masonryItems.push(...items); // some grid items: items
  }
}

// Prepend grid items to NgMasonryGrid
prependItems() {
  if (this._masonry) {
    // set status to 'prepend' before adding items to NgMasonryGrid otherwise default: 'append' will applied
    this._masonry.setAddStatus('prepend');
    this.masonryItems.splice(0, 0, ...items);
  }
}

// Add items to NgMasonryGrid
addItems() {  
  if (this._masonry) {
    this._masonry.setAddStatus('add'); // set status to 'add'
    this.masonryItems.push(...items);
  }
}

// Remove selected item from NgMasonryGrid, For example, (click)="removeItem($event)" event binding on grid item
// Note: 'id' on ng-masonry-grid is required to remove actual item from the list
removeItem($event: any) {
  if (this._masonry) {
    this._masonry.removeItem($event.currentTarget)  // removeItem() expects actual DOM (ng-masonry-grid-item element)
        .subscribe((item: MasonryGridItem) => { // item: removed grid item DOM from NgMasonryGrid
          if (item) {
            let id = item.element.getAttribute('id'); // Get id attribute and then find index 
            let index = id.split('-')[2];
            // remove grid item from Masonry binding using index (because actual Masonry items order is different from this.masonryItems items) 
            this.masonryItems.splice(index, 1); 
          }
        });
  }
}

// Remove first item from NgMasonryGrid
removeFirstItem() {
  if (this._masonry) {
    this._masonry.removeFirstItem()
        .subscribe( (item: MasonryGridItem) => {
          if (item) {
            let id = item.element.getAttribute('id');
            let index = id.split('-')[2];
            this.masonryItems.splice(index, 1);
          }
        });
  }
}

// Remove all items from NgMasonryGrid
removeAllItems() {
if (this._masonry) {
  if (this._masonry) {
    this._masonry.removeAllItems()
        .subscribe( (items: MasonryGridItem) => {
            // remove all items from the list
            this.masonryItems = [];
        });
  }
}

```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To run demo... 
  1. From the ng-masonry-grid/dist directory, create a symlink in the global node_modules directory to the dist directory of ng-masonry-grid:

  ```bash
  $ cd dist
  $ npm link
  ```

  2. Navigate to ng-masonry-grid/playground directory:

  ```bash
  $ cd playground
  $ npm link ng-masonry-grid
  ```

  3. Now run the demo (from ng-masonry-grid) directory:

  ```bash
  $ npm run demo
  ```

## Credits
This Angular 2+ Component is created based on Masonry Layout by [David DeSandro](http://masonry.desandro.com/)

## License

MIT © [Shailendra Kumar](mailto:shailu.snist@gmail.com)
