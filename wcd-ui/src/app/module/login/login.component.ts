import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'wcd-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public dynamic_height = true;
    public result: any;
    public user_time: number;
    public nick_not_exists = true;
    public pattern = {
        email: /^([\w-]+)@([\w-]+)(\.([\w-]+))+$/,
        password: /^[0-9A-Za-z`~!@#$%^&*()_+\-=\{\}\[\]:;"'<>,.\\|?/ ]{6,24}$/,
        nickname: /^[\w\-\u4e00-\u9fa5]{1,24}$/,
    };

    public user_data = {
        nickname: '',
        password: '',
        cf_password: '',
    };

    public form_data = {
        email_tooltip: 'Enter Your Email',
        pass_tooltip: `Password should contain 6-24 characters.
                                Charaters include number, letter, and most of the other characters on keyboard.`,
        nick_tooltip: 'Nickname should contain 6-24 characters. Accept most chinese word and English word, include "-" and "_"',
        confirm_tooltip: 'Confirm Your Password'
    };

    position = 'right';

    constructor(
        private _http: HttpClient,
        private _router: Router,
        public snack_bar: MdSnackBar,
    ) { }

    ngOnInit() {
        this._http.get('/middle/check_auth').subscribe(
            data => {
                if (data['result'] === 1) {
                    this._router.navigate(['/chat-list']);
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
            });

        this._http.get('/middle/nick_guard').subscribe(
            data => {
                if (data['result'] === 1) {
                    this.nick_not_exists = true;
                    this.user_data.nickname = '';
                } else {
                    this.nick_not_exists = !data['data']['nickname'];
                    this.user_data.nickname = data['data']['nickname'];
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
            });

    }

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

    signIn(event) {
        if (event && event.key !== 'Enter') {
            return event;
        }

        this.user_data.nickname = this.user_data.nickname.trim();
        let message = '';
        let not_regular = false;
        if (this.nick_not_exists && !this.user_data.nickname.match(this.pattern.nickname)) {
            message = 'Invalid Nick Name.';
            not_regular = true;
        } else if (!this.nick_not_exists && !this.user_data.nickname.match(this.pattern.nickname)) {
            message = 'Pull off a nick name is not good.';
            not_regular = true;
        } else if (!this.user_data.password.match(this.pattern.password)) {
            message = 'Invalid Password.';
            not_regular = true;
        } else if (this.nick_not_exists && this.user_data.password !== this.user_data.cf_password) {
            message = 'Password is inconsistent';
            not_regular = true;
        }

        if (not_regular) {
            this.raiseSnackBar(message, 'OK', () => {
            });
            return false;
        }

        const result = this._http.post(
            '/middle/account',
            {
                nickname: this.user_data.nickname,
                password: this.user_data.password
            });
        result.subscribe(
            data => {
                if (data['result'] === 1) {
                    this._router.navigate(['/chat-list']);
                } else {
                    this.raiseSnackBar(data['msg'], 'OK', () => {
                    });
                    return false;
                }
            });
    }
}
