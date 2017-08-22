import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public dynamic_height = true;
    public result: any;
    public user_time: number;
    public pattern = {
        email: /^([\w-]+)@([\w-]+)(\.([\w-]+))+$/,
        password: /^[0-9A-Za-z`~!@#$%^&*()_+\-=\{\}\[\]:;"'<>,.\\|?/ ]{6,24}$/,
        nickname: /^[\w\-\u4e00-\u9fa5]{1,24}$/,
    };

    public sign_in_data = {
        nickname: '',
        password: '',
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

        this.sign_in_data.nickname = this.sign_in_data.nickname.trim();
        let message = '';
        let not_regular = false;
        if (!this.sign_in_data.nickname.match(this.pattern.nickname)) {
            message = 'Invalid Email.';
            not_regular = true;
        } else if (!this.sign_in_data.password.match(this.pattern.password)) {
            message = 'Invalid Password.';
            not_regular = true;
        }
        if (not_regular) {
            this.raiseSnackBar(message, 'OK', () => {
                console.log('The snack-bar action was triggered!');
            });
            return false;
        }
        const result = this._http.post(
            '/middle/account',
            {
                nickname: this.sign_in_data.nickname,
                password: this.sign_in_data.password
            });
        result.subscribe(
            data => {
                if (data['result'] === 1) {
                    this._router.navigate(['/chat-list']);
                } else {
                    this.raiseSnackBar(data['msg'], 'OK', () => {
                        console.log('Got it.');
                    });
                    console.log(data);
                    return false;
                }
            });
    }

    skipSignIn(event) {
        if (event && event.key !== 'Enter') {
            return event;
        }

        this.sign_in_data.nickname = this.sign_in_data.nickname.trim();
        let message = '';
        let not_regular = false;
        if (!this.sign_in_data.nickname.match(this.pattern.nickname)) {
            message = 'Invalid Email.';
            not_regular = true;
        } else if (!this.sign_in_data.password.match(this.pattern.password)) {
            message = 'Invalid Password.';
            not_regular = true;
        }
        if (not_regular) {
            this.raiseSnackBar(message, 'OK', () => {
                console.log('The snack-bar action was triggered!');
            });
            return false;
        }
        const result = this._http.post(
            '/middle/account/signin',
            {
                email: this.sign_in_data.nickname,
                password: this.sign_in_data.password
            });
        result.subscribe(
            data => {
                if (data['result'] === 1) {
                    this._router.navigate(['/home']);
                } else {
                    this.raiseSnackBar(data['msg'], 'OK', () => {
                        console.log('Got it.');
                    });
                    console.log(data);
                    return false;
                }
            });
    }
}
