import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[fuLayout]'
})
export class LayoutDirective {
  @Input() set fuLayout(value:string){
    
  }
  constructor() { }

}
