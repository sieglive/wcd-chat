import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AccountService } from 'service/account.service';

@Injectable()
export class AddressGuard implements CanActivate {

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
}
