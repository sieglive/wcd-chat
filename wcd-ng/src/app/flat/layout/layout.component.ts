import {
  Component, Directive, OnInit, AfterContentInit,
  HostBinding, Input, ContentChild, ContentChildren,
  QueryList, ElementRef
} from '@angular/core';
import * as O_O from 'underscore';

@Directive({
  selector: '[fuContent]'
})
export class ContentDirective implements OnInit {
  @HostBinding('style.letterSpacing') letterSpacing = '0.1em';
  @HostBinding('style.fontSize') fontSize = '100%';
  @HostBinding('style.padding') padding = '1em 2em';
  @HostBinding('style.boxsizing') boxsizing = 'border-box';
  @HostBinding('style.width') width = '100%';
  @HostBinding('style.height') height = '100%';
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.verticalAlign') verticalAlign = 'middle';
  @Input() set fuContent(value: string) {
    /* if ths input value is in the range of 12 */
    if (O_O.contains(O_O.range(12), parseInt(value, 10))) {
      this.padding = '0';
      this.boxsizing = 'content-box';
      this.width = (100 / 12) * parseInt(value, 10) + '%';
      this.display = 'inline-block';
    } else if (value === 'page') {
      /* if content element to be the page content */
      this.width = '1200px';
      this._el.nativeElement.style.margin = '0 auto';
    }
  }
  constructor(private _el: ElementRef) { }
  ngOnInit() {

  }
}

@Directive({
  selector: '[fuContainer]'
})
export class ContainerDirective implements AfterContentInit {
  @HostBinding('style.letterSpacing') letterSpacing = 0;
  @ContentChildren(ContentDirective) content: QueryList<ContentDirective>;
  constructor(private _el: ElementRef) { }
  ngAfterContentInit() {
    let fontSize = this._el.nativeElement.style.fontSize;
    if (fontSize === '') {
      fontSize = '1rem';
    }
    this.content.forEach((res) => {
      res.fontSize = fontSize;
    });
    this._el.nativeElement.style.fontSize = 0;
  }
}


