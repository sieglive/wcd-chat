import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _router: Router, private _http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const result = this._http.get('/middle/check_auth');
        const res: Subject<boolean> = new Subject<boolean>();

        const a = result.subscribe(
            data => {
                if (data['result'] === 1) {
                    res.next(true);
                } else {
                    this._router.navigate(['/login']);
                    res.next(true);
                }
            },
            error => {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        'message': 'Sorry, We can not contact chat server now.',
                        'sub_message': 'Contact Administrator to fix that.'
                    }
                };
                this._router.navigate(['/error'], navigationExtras);
                res.next(false);
            });

        return res;
    }
}
