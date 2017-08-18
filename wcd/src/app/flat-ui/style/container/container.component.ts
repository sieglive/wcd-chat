import { Component } from '@angular/core';

@Component({
  selector: '[container]',
  template: `
    <div class="container">
        <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .container{
      width: 100%;
      height: 100%;
      padding: 20px 10%;
      box-sizing: border-box;
    }
  `]
})
export class ContainerComponent {
  constructor() { }
}
