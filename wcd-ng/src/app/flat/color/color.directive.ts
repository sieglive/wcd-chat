import { Directive, Input, HostBinding } from '@angular/core';
import * as O_O from 'underscore';
import { Colors } from './colors';

@Directive({
  selector: '[fuColor]'
})
export class ColorDirective {
  @Input() set fuColor(value: string) {
    // search in the dark colors
    O_O.each(Colors.colors.dark, (val, index) => {
      if (index === value) {
        this.backgroundColor = val;
        this.color = 'white';
      }
    });
    // search in the light colors
    O_O.each(Colors.colors.light, (val, index) => {
      if (index + '-l' === value) {
        this.backgroundColor = val;
        if (index === 'silver') {
          this.color = Colors.colors.dark.silver;
        } else {
          this.color = 'white';
        }
      }
    });
  }

  @Input() set fuText(value: string) {
    // waiting for the fuColor to set color
    setTimeout(() => {
      // search in the dark colors
      O_O.each(Colors.colors.dark, (val, index) => {
        if (index === value) {
          this.color = val;
        }
      });
      // search in the light colors
      O_O.each(Colors.colors.light, (val, index) => {
        if (index + '-l' === value) {
          this.color = val;
        }
      });
    }, 0);
  }
  @HostBinding('style.backgroundColor') backgroundColor;
  @HostBinding('style.color') color;
}
