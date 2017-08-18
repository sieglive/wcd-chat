import { Directive, Input, ElementRef } from '@angular/core';
import { ColorService } from './color.service';
import * as O_O from 'underscore';

@Directive({
  selector: '[color]'
})
export class ColorDirective {
  private _colorSetting = '#ffffff';
  private timer: any;
  @Input() set color(value: string) {
    /* value => color */
    O_O.each(this._color.dark, (val, index) => {
      if (index === value) {
        this._colorSetting = val;
      }
    });
    /* value => color-l */
    O_O.each(this._color.light, (val, index) => {
      if (index + '-l' === value) {
        this._colorSetting = val;
      }
    });

    /* waiting for background to edit color */
    setTimeout(() => {
      this._el.nativeElement.style.color = this._colorSetting;
    }, 0);
  }
  constructor(private _color: ColorService, private _el: ElementRef) { }
}
