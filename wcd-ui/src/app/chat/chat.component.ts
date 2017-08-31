import {
    Component,
    Directive,
    Input,
    OnInit,
    Inject,
    ElementRef,
    ViewChild,
    AfterViewInit
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    NavigationExtras
} from '@angular/router';
import {
    MdDialog,
    MdDialogRef,
    MD_DIALOG_DATA,
    MdSnackBar
} from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../service/guard.service';
import { MessageService, WcdAvatorDirective } from '../service/message.service';
import { SnackBarService } from '../service/snack-bar.service';
import { WindowUtilsService } from '../service/window-utils.service';
import { ToggleService } from '../service/toggle.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    public user_info: object = {};
    public start_time = 0;
    public end_time = 0;
    public chat_id: string;
    public chat_info: object = {};
    public member_list = [];
    public member_dict = {};
    public new_member = '';
    public message = '';
    public message_list = [];
    public show_message: any;
    @ViewChild('chatShow') chat_show;

    constructor(
        private _http: HttpClient,
        private _route: ActivatedRoute,
        private _router: Router,
        private _el: ElementRef,
        private _snack_bar: SnackBarService,
        private _account: AccountService,
        private _message: MessageService,
        private _win_utils: WindowUtilsService,
        public toggle: ToggleService,
        public dialog: MdDialog,
    ) { }

    ngOnInit() {
        this.start_time = 0;
        this.end_time = 0;
        this.chat_info = {};
        this.member_list = [];
        this.member_dict = {};
        this.new_member = '';
        this.message = '';
        this.message_list = [];
        this._account.info.subscribe(
            info => {
                this.user_info = info;
            });

        this._route.paramMap.subscribe(
            value => {
                this.chat_id = value.get('chat_id');
                this.getChatInfo(this.chat_id);
            });
        this.getMessageList();
        setInterval(() => { this.getMessageList(); }, 3000);
    }

    getMessageList() {
        this._http.get(
            '/middle/message?chat_id=' + this.chat_id + '&start=' + this.start_time
        ).subscribe(
            data => {
                if (data['result'] === 1) {
                    const temp_start_time = this.start_time;
                    const temp_end_time = this.end_time;

                    this._message.info = data['data']['msg_list'];
                    this.start_time = data['data']['end_time'];
                    this.end_time = data['data']['end_time'];

                    this._message.info.subscribe(
                        value => {
                            const msg_list = value['msg_list'].sort((a, b) => {
                                return a['msg_time'] - b['msg_time'];
                            });
                            const last_msg = msg_list[msg_list.length - 1];
                            this.message_list = msg_list;

                            const canSendNotice = temp_start_time !== 0 &&
                                last_msg['user_ip'] !== this.user_info['user_ip'] &&
                                this._message.hasFresh() &&
                                (document.hidden || !window['window_active']);

                            if (canSendNotice) {
                                const notice_data = {
                                    title: this.member_dict[last_msg['user_ip']].nickname + ':',
                                    message: [],
                                    msg_time: last_msg['msg_time'],
                                    focus: [
                                        'chat',
                                        this.chat_info['chat_id']
                                    ]
                                };

                                if (last_msg['message'].length > 200) {
                                    notice_data['message'].push(last_msg['message'].slice(0, 200) + '...');
                                } else {
                                    notice_data['message'].push(last_msg['message']);
                                }

                                const notice_str = encodeURIComponent(JSON.stringify(notice_data));
                                this._http.get('/inner/callnotification/' + notice_str).subscribe();
                            }
                        });
                    if (temp_end_time !== this.end_time) {
                        this._win_utils.scrollBottom(this);
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
                this._win_utils.renderDocTitle(this.chat_info['chat_name']);

                this.member_list = this.chat_info['chat_member'];
                this.member_list.forEach(
                    member => {
                        this.member_dict[member['user_ip']] = member;
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

    queryMember(event) {
        if (event && event.key !== 'Enter') {
            return event;
        }
        if (!this.new_member) {
            return this._snack_bar.raiseSnackBar('Ip Adress should not be empty.');
        }

        let new_ip_adress = '';
        [new_ip_adress, this.new_member] = [this.new_member, new_ip_adress];

        this._http.get(
            '/middle/account?member_ip=' + new_ip_adress
        ).subscribe(
            data => {
                if (!data['data']) {
                    return this._snack_bar.raiseSnackBar('This user not exists.');
                }

                const dialogRef = this.dialog.open(
                    UserInfoComponent, {
                        height: '300px',
                        width: '600px',
                        data: data['data'],
                    });

                dialogRef.afterClosed().subscribe(
                    res => {
                        if (res) {
                            this.addMember(new_ip_adress);
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

    addMember(new_ip_adress) {
        this._http.put(
            '/middle/chat-member', { member_ip: new_ip_adress, chat_id: this.chat_id }
        ).subscribe(
            data => {
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

    deleteMember(drop_ip_adress) {
        this._http.delete(
            '/middle/chat-member?member_ip=' + drop_ip_adress + '&chat_id=' + this.chat_id
        ).subscribe(
            data => {
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
            this.message += '\n';
            return false;
        }
        if (!this.message) {
            return false;
        }

        let new_message = '';
        [new_message, this.message] = [this.message, new_message];

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

    setNotification(change) {
        this.toggle.showNotification = change.checked;
    }
}

@Component({
    selector: 'app-userinfo',
    templateUrl: './user-info.component.html',
})
export class UserInfoComponent {

    constructor(
        public dialogRef: MdDialogRef<UserInfoComponent>,
        @Inject(MD_DIALOG_DATA) public data: any,
    ) { }
}


