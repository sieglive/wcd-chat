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
import { Subject } from 'rxjs/Subject';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AddressGuard implements CanActivate, CanLoad {

    constructor(private _router: Router, private _http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const result = this._http.get('/middle/address_guard');
        const res: Subject<boolean> = new Subject<boolean>();



        const a = result.subscribe(
            data => {
                console.log(data);
                if (data['result'] === 1) {
                    res.next(true);
                } else {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            'message': 'Sorry, Your Ip Address is not Allowed.',
                            'sub_message': 'Contact Administrator to fix that.'
                        }
                    };
                    this._router.navigate(['/error'], navigationExtras);
                    res.next(false);
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

    canLoad(route: Route): Observable<boolean> {
        const res: Subject<boolean> = new Subject<boolean>();
        return res;
    }
}

@Injectable()
export class NickGuard implements CanActivate, CanLoad {

    constructor(private _router: Router, private _http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const result = this._http.get('/middle/nick_guard');
        const res: Subject<boolean> = new Subject<boolean>();



        const a = result.subscribe(
            data => {
                console.log(data);
                if (data['result'] === 1) {
                    res.next(true);
                } else {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            'nickname': data['data']['nickname']
                        }
                    };
                    this._router.navigate(['/chat-list'], navigationExtras);
                    res.next(false);
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

    canLoad(route: Route): Observable<boolean> {
        const res: Subject<boolean> = new Subject<boolean>();
        return res;
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
