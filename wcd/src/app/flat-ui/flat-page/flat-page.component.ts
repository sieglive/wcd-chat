import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wcd-flat-page',
  templateUrl: './flat-page.component.html',
  styleUrls: ['./flat-page.component.scss']
})
export class FlatPageComponent implements OnInit {
  public colors = ['teal', 'green', 'blue', 'purple', 'yellow', 'orange', 'red', 'silver', 'gray', 'black'];
  constructor() { }

  ngOnInit() {
  }

}
