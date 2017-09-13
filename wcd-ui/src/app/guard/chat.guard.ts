import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChatGuard implements CanActivate {

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
