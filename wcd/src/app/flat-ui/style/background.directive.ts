import { Directive, Input, HostBinding } from '@angular/core';
import { ColorService } from './color.service';

import * as O_O from 'underscore';

@Directive({
  selector: '[background]'
})
export class BackgroundDirective {
  @HostBinding('style.backgroundColor') backgroundColor;
  @HostBinding('style.color') color;
  @Input() set background(value: string) {
    /* value => color */
    O_O.each(this._color.dark, (val, index) => {
      if (index === value) {
        this.color = '#ffffff';
        this.backgroundColor = val;
      }
    });
    /* value => color-l */
    O_O.each(this._color.light, (val, index) => {
      if (index + '-l' === value) {
        if (index === 'silver') {
          this.color = this._color.dark.silver;
          this.backgroundColor = val;
        } else {
          this.color = '#ffffff';
          this.backgroundColor = val;
        }
      }
    });
  }
  constructor(private _color: ColorService) { }
}
