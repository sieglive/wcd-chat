import { Injectable } from '@angular/core';

import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, Route
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AddressGuard implements CanActivate, CanLoad {

    constructor(private _router: Router, private _http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const result = this._http.get('/middle/address');

        const navigationExtras: NavigationExtras = {
            queryParams: { 'session_id': 123456789 },
            fragment: 'anchor'
        };

        // return result.map(
        //     data => {
        //         console.log(data);
        //         if (data['result'] === 1) {
        //             return true;
        //         } else {
        //             this._router.navigate(['/error'], navigationExtras);
        //             return false;
        //         }
        //     }).catch(
        //     (error: HttpErrorResponse) => {
        //         console.log(error);
        //         this._router.navigate(['/error'], navigationExtras);
        //         return false;
        //     }
        //     );

        const a = result.subscribe(
            data => {
                console.log(data);
                if (data['result'] === 1) {
                    return true;
                } else {
                    this._router.navigate(['/error'], navigationExtras);
                    return false;
                }
            });
        console.log(a);
        return false;
    }

    canLoad(route: Route): Observable<boolean> {
        const result = this._http.get('/middle/address');

        const navigationExtras: NavigationExtras = {
            queryParams: { 'session_id': 123456789 },
            fragment: 'anchor'
        };

        return result.map(
            data => {
                console.log(data);
                if (data['result'] === 1) {
                    return true;
                } else {
                    this._router.navigate(['/error'], navigationExtras);
                    return false;
                }
            });
    }
}

@Injectable()
export class AuthGuard {

    constructor(private _router: Router, private _http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const navigationExtras: NavigationExtras = {
            queryParams: { 'session_id': 123456789 },
            fragment: 'anchor'
        };

        this._router.navigate(['/login'], navigationExtras);
        return false;
    }

}
