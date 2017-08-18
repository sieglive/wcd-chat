import { Component, OnInit, Input, HostBinding, HostListener, ViewChild } from '@angular/core';
import * as O_O from 'underscore';

@Component({
  selector: 'button[size]',
  template: `
    <div
    class="container"
    [background]="buttonColor"
    [style.height]="buttonHeight">
      <div
      class="content"
      [style.lineHeight]="buttonHeight"
      [style.fontSize]="fontSize">
        <ng-content></ng-content>
      </div>
      <canvas #canvas></canvas>
    </div>
  `,
  styles: [`
  :host{
    border: none;
    outline: none;
    padding: 0;
    background: none;
    cursor: pointer;
  }
  .container{
    display: inline-block;
    width: 100%;
    transition: background-color 0.4s;
    border-radius: 10px;
  }
  .content{
    height: 100%;
    line-height: 100%;
    text-align: center;
    padding: 0 20px;
  }
  `]
})
export class ButtonComponent implements OnInit {
  public buttonHeight = '40px';
  public fontSize = '20px';
  public buttonColor = 'black';

  private _colorTemp = ''; // store the color state

  @HostBinding('style.width') buttonWidth = 'auto';

  private readonly sizes = { normal: ['40px', '20px'], small: ['24px', '14px'], big: ['60px', '30px'], full: ['60px', '30px'] };
  @Input() set size(value: string) {
    O_O.each(this.sizes, (val, index) => {
      if (index === value) {
        console.log(index);
        this.buttonHeight = val[0];
        this.fontSize = val[1];
        if (index === 'full') {
          this.buttonWidth = '100%';
        } else {
          this.buttonWidth = 'auto';
        }
      }
    });
  }
  @Input() set color(value: string) {
    if (value !== 'gray') {
      this._colorTemp = value;
      this.setColor(value);
    }
  }

  @Input() set disable(value: boolean) {
    if (value) {
      this.setColor('gray');
    } else {
      if (this._colorTemp.length > 0) {
        this.setColor(this._colorTemp);
      } else {
        this.setColor('black');
      }
    }
  }


  @HostListener('mouseenter') mouseenter = () => { this.buttonColor = 'black-l'; };
  @HostListener('mouseleave') mouseleave = () => { this.buttonColor = 'black'; };
  constructor() { }

  ngOnInit() {
  }

  /* set the color */
  setColor(value) {
    this.buttonColor = value;
    this.mouseenter = () => { this.buttonColor = value + '-l'; };
    this.mouseleave = () => { this.buttonColor = value; };
  }

}
