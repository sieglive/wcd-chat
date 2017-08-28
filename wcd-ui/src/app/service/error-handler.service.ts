import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationExtras
} from '@angular/router';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private _route: ActivatedRoute,
  ) { }

}
