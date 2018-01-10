/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */

import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  PLATFORM_ID,
  Inject,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var require: any;

import { MasonryOptions, Masonry as IMasonry, AnimationOptions } from './ng-masonry-grid.interface';
import { NgMasonryGridService } from './ng-masonry-grid.service';

@Component({
  selector: '[ng-masonry-grid], ng-masonry-grid',
  template: '<ng-content></ng-content>',
  styles: [
    `
		:host {
			display: block;
		}
	`
  ]
})
export class NgMasonryGridComponent implements OnInit, OnDestroy, AfterViewInit {

  public _msnry: IMasonry;

  // Inputs
  @Input() public masonryOptions: MasonryOptions = {};
  @Input() public useAnimation = false;
  @Input() public scrollAnimationOptions: AnimationOptions;

  // Outputs
  @Output() layoutComplete: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() removeComplete: EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(
    @Inject(PLATFORM_ID) private _platformId: any,
    private _element: ElementRef,
    private masonryGridService: NgMasonryGridService
  ) {}

  ngOnInit() { }

  ngAfterViewInit() {
    // initialize masonry after View Initialization
    this.initializeMasonry();
  }

  ngOnDestroy() {
    if (this._msnry) {
      this._msnry.destroy();
    }
  }

  public layout() {
    setTimeout(() => {
      this._msnry.layout();
    }, 50);
  }

  // remove item from masonry
  public remove(element: HTMLElement[]) {
    this._msnry.remove(element);
    this.layout();
  }

  public initializeMasonry() {
    // initialize Masonry with Animation effects
    this._msnry = this.masonryGridService.init(this.useAnimation, this._element.nativeElement,
      this.masonryOptions, this.scrollAnimationOptions);

    // Bind to Masonry events
    this._msnry.on('layoutComplete', (items: any) => {
     this.layoutComplete.emit(items);
    });
    this._msnry.on('removeComplete', (items: any) => {
     this.removeComplete.emit(items);
    });

    this.layout();
  }
}
