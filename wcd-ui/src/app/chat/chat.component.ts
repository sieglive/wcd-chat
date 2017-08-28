import { Component, Directive, Input, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

import { AccountService } from '../service/guard.service';
import { MessageService } from '../service/message.service';

import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
    public message = '';
    public message_list = [];
    public user_info: object = {};
    public start_time = 0;
    public end_time = 0;
    public chat_id: string;
    public chat_info: object = {};
    public member_list = [];
    public member_dict = {};
    public new_member = '';
    public show_message: any;

    @ViewChild('chatShow') target;

    constructor(
        private _http: HttpClient,
        private _route: ActivatedRoute,
        private _router: Router,
        private _el: ElementRef,
        public dialog: MdDialog,
        public snack_bar: MdSnackBar,
        private _account: AccountService,
        private _message: MessageService,
    ) { }

    ngOnInit() {
        console.log('init');
        this._account.info.subscribe(info => {
            this.user_info = info;
        });

        this._route.paramMap.subscribe(
            value => {
                this.chat_id = value.get('chat_id');
                this.getChatInfo(this.chat_id);
            });
        this.getMessageList();
        setInterval(() => { this.getMessageList(); }, 1000);
    }
    ngAfterViewInit() {
        // setTimeout(
        //     () => {
        //         this.target.nativeElement.scrollTop = this.target.nativeElement.scrollHeight;
        //     }, 0);
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

    getMessageList() {
        this._http.get(
            '/middle/message?chat_id=' + this.chat_id + '&start=' + this.start_time
        ).subscribe(
            data => {

                if (data['result'] === 1) {
                    const last_end_time = this.end_time;
                    if (data['data']) {
                        this._message.info = data['data']['msg_list'];
                        this.start_time = data['data']['end_time'];
                        console.log(this.start_time);
                        this.end_time = data['data']['end_time'];
                        this._message.info.subscribe(value => {
                            this.message_list = value;
                        });
                    }
                    if (last_end_time !== this.end_time) {
                        setTimeout(
                            () => {
                                this.target.nativeElement.scrollTop = this.target.nativeElement.scrollHeight;
                                console.log(this.target);
                            }, 0);
                    }
                } else if (data['status'] === 3152) {

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

    getChatInfo(chat_id) {
        const result = this._http.get(
            '/middle/chat-list?chat_id=' + chat_id
        ).subscribe(
            data => {
                this.chat_info = data['data'];
                this.member_list = this.chat_info['chat_member'];
                for (let i = 0; i < this.member_list.length; i++) {
                    this.member_dict[this.member_list[i]['user_ip']] = this.member_list[i];
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

    queryMember(event) {
        if (event && event.key !== 'Enter') {
            return event;
        }
        if (!this.new_member) {
            const message = 'Ip Adress should not be empty.';
            this.raiseSnackBar(message, 'OK', () => {
            });
            return false;
        }
        const new_ip_adress = this.new_member;
        this.new_member = '';
        this._http.get(
            '/middle/account?member_ip=' + new_ip_adress
        ).subscribe(
            data => {
                if (!data['data']) {
                    const message = 'This user not exists.';
                    this.raiseSnackBar(message, 'OK', () => {

                    });
                    return false;
                }
                const dialogRef = this.dialog.open(AppUserinfoComponent, {
                    height: '300px',
                    width: '600px',
                    data: {
                        user_ip: data['data']['user_ip'],
                        nickname: data['data']['nickname'],
                    }
                });

                dialogRef.afterClosed().subscribe(
                    res => {
                        if (res) {
                            this._http.put(
                                '/middle/chat-member', { member_ip: new_ip_adress, chat_id: this.chat_id }
                            ).subscribe(
                                add_member_data => {
                                    this.getChatInfo(this.chat_id);
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
                    });
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

    deleteMember(drop_ip_adress) {
        this._http.delete(
            '/middle/chat-member?member_ip=' + drop_ip_adress + '&chat_id=' + this.chat_id
        ).subscribe(
            drop_member_data => {
                this.getChatInfo(this.chat_id);
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

    sendMessage(event) {
        if (event && event.key !== 'Enter') {
            return event;
        } else if (event && event.key === 'Enter' && event.altKey) {
            console.log(event);
            console.log('altKey', event.altKey);
            this.message += '\n';
            return false;
        }
        console.log(typeof this.message);
        if (!this.message) {
            console.log('injudge', this.message);
            return false;
        }
        console.log(this.message);
        const new_message = this.message;
        this.message = null;
        this._http.put(
            '/middle/message',
            {
                message: new_message,
                chat_id: this.chat_id
            }
        ).subscribe(
            data => {
                this.getMessageList();
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
        return false;
    }
}

@Component({
    selector: 'app-userinfo',
    template: `
    <h2 md-dialog-title>User Info of {{data.user_ip}}</h2>
    <md-dialog-content>
        <md-list>
            <md-list-item>
                Nickname: {{data.nickname}}
            </md-list-item>
            <md-list-item>
            </md-list-item>
        </md-list>
        Confirm to add this user into the chat?
    </md-dialog-content>
    <md-dialog-actions>
        <button md-button [md-dialog-close]="false">No</button>
        <button md-button [md-dialog-close]="true">Yes</button>
    </md-dialog-actions>
    `,
    // styles: [`
    // .mat-dialog-container {
    //     box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);
    //     display: block;
    //     padding: 24px;
    //     border-radius: 2px;
    //     box-sizing: border-box;
    //     overflow: auto;
    //     max-width: 80vw;
    //     width: 100%;
    //     height: 100%;
    // }`]
})
export class AppUserinfoComponent {

    constructor(
        public dialogRef: MdDialogRef<AppUserinfoComponent>,
        @Inject(MD_DIALOG_DATA) public data: any,
    ) { }
}

@Directive({
    selector: '[appWcdAvator]',
})
export class WcdAvatorDirective implements OnInit {
    @Input() wcdAvatorColor: string;
    private _color = [
        'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue',
        'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'orange',
        'amber', 'deep-orange'
    ];
    private _color_palette = {
        'red': ['#ef5350', 'black'],
        'pink': ['#ec407a', 'black'],
        'purple': ['#ab47bc', 'white'],
        'deep-purple': ['#7e57c2', 'white'],
        'indigo': ['#5c6bc0', 'white'],
        'blue': ['#42a5f5', 'black'],
        'light-blue': ['#29b6f6', 'black'],
        'cyan': ['#26c6da', 'black'],
        'teal': ['#26a69a', 'black'],
        'green': ['#66bb6a', 'black'],
        'light-green': ['#9ccc65', 'black'],
        'lime': ['#d4e157', 'black'],
        'yellow': ['#ffee58', 'black'],
        'orange': ['#ffa726', 'black'],
        'amber': ['#ffca28', 'black'],
        'deep-orange': ['#ff7043', 'black']
    };

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.el.nativeElement.style.backgroundColor = this._color_palette[this.wcdAvatorColor][0];
        this.el.nativeElement.style.color = this._color_palette[this.wcdAvatorColor][1];
        console.log(this.el);
    }
}
