import { Injectable } from '@angular/core';

import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, Route
} from '@angular/router';

import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AccountService {
    public account_info = new BehaviorSubject<object>({});

    get info(): BehaviorSubject<object> {
        return this.account_info;
    }

    set info(info) {
        this.account_info.next(info);
    }
}

@Injectable()
export class AddressGuard implements CanActivate, CanLoad {

    constructor(
        private _router: Router,
        private _http: HttpClient,
        private _account: AccountService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const result = this._http.get('/middle/address_guard');
        const res: Subject<boolean> = new Subject<boolean>();

        const a = result.subscribe(
            data => {
                if (data['result'] === 1) {
                    this._account.info = data['data'];
                    res.next(true);
                } else {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            'message': 'Sorry, Your Ip Address is not Allowed.',
                            'sub_message': 'Contact Administrator to fix that.'
                        },
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
        const result = this._http.get('/middle/address_guard');
        const res: Subject<boolean> = new Subject<boolean>();

        const a = result.subscribe(
            data => {
                if (data['result'] === 1) {
                    res.next(true);
                } else {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            'message': 'Sorry, Your Ip Address is not Allowed.',
                            'sub_message': 'Contact Administrator to fix that.'
                        },
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
}

@Injectable()
export class NickGuard implements CanActivate, CanLoad {

    constructor(private _router: Router, private _http: HttpClient) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const result = this._http.get('/middle/nick_guard');
        const res: Subject<boolean> = new Subject<boolean>();

        const a = result.subscribe(
            data => {
                if (data['result'] === 1) {
                    res.next(true);
                } else {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            'nickname': data['data']['nickname']
                        }
                    };
                    this._router.navigate(['/login'], navigationExtras);
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

@Injectable()
export class ChatGuard {

    constructor(private _router: Router, private _http: HttpClient, public snack_bar: MdSnackBar, ) { }

    raiseSnackBar(message: string, action_name: string, action) {
        const snack_ref = this.snack_bar.open(
            message,
            action_name,
            {
                duration: 2000,
            }
        );
        snack_ref.onAction().subscribe(action);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const res: Subject<boolean> = new Subject<boolean>();

        const result = this._http.get(
            '/middle/chat-member?chat_id=' + route.params.chat_id
        ).subscribe(
            data => {
                if (data['result'] === 1) {
                    res.next(true);
                } else {
                    this._router.navigate(['/chat-list']);
                    this.raiseSnackBar('Permission Deny.', 'OK', () => {
                    });
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

}
