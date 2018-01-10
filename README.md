# ng-masonry-grid

## Installation

To install this library, run:

```bash
$ npm install ng-masonry-grid --save
```

## Consuming your library

You can import Ng Masonry Grid library in any Angular application by running:

```bash
$ npm install ng-masonry-grid
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { NgMasonryGridModule } from 'ng-masonry-grid';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    NgMasonryGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<!-- Masonry grid Container -->
<ng-masonry-grid class="grid" id="grid" 
                [masonryOptions]="{ transitionDuration: '0.8s', gutter: 5 }" 
                [useAnimation]="true"
                [scrollAnimationOptions]="{ animationEffect: 'effect-6', minDuration : 0.4, maxDuration : 0.7 }">
  <!-- Masonry Grid Item -->
  <ng-masonry-grid-item class="masonry-item" *ngFor="let item of masonryItems; let i = index;"> 
     <!-- Grid Content  -->
    <img src="some_image.jpg" alt="No image" />
  </ng-masonry-grid-item>
</ng-masonry-grid>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Shailendra Kumar](mailto:shailu.snist@gmail.com)
