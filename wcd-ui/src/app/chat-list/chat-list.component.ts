import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationExtras } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../service/guard.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

    displayedColumns = [
        'chat_name',
        'chat_creator',
        'chat_create_time',
        'chat_action'];
    exampleDatabase = new ExampleDatabase();
    dataSource: ExampleDataSource | null;
    public chat_name = '';
    public user_info: object = {};

    constructor(
        private _http: HttpClient,
        private _router: Router,
        public snack_bar: MdSnackBar,
        private _account: AccountService,
    ) { }

    ngOnInit() {
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
        const result = this._http.get('/middle/chat-list');

        this._account.info.subscribe(info => {
            this.user_info = info;
        });

        this.getChat(null);

        const a = result.subscribe(
            data => {
                console.log('chat-list', data);
                this.exampleDatabase.dataChange.next(
                    data['data']
                );
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

        // setTimeout(() => { this.getDataSource(); }, 0);
    }

    getChat(event) {
        const result = this._http.get('/middle/chat-list');

        const a = result.subscribe(
            data => {
                console.log('chat-list', data);
                this.exampleDatabase.dataChange.next(
                    data['data']
                );
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

    createChat(event) {
        if (event && event.key !== 'Enter') {
            return event;
        }
        if (!this.chat_name) {
            return event;
        }
        const result = this._http.put('/middle/chat-list', { chat_name: this.chat_name });

        this.chat_name = '';
        const a = result.subscribe(
            data => {
                console.log('add-chat-list', data);
                this.getChat(null);
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

    enterChat(chat_id) {
        this._router.navigate(['/chat/' + chat_id]);
    }

    deleteChat(chat_id) {
        const result = this._http.delete('/middle/chat-list?chat_id=' + chat_id);
        const a = result.subscribe(
            data => {
                console.log('delete-chat-list', data);
                this.getChat(null);
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

    ownThisChat(creator_ip) {
        if (!creator_ip || !this.user_info) {
            return false;
        }
        return creator_ip === this.user_info['user_ip'];
    }
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
    'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
    'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
    'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
    chat_id: string;
    chat_name: string;
    creator_ip: string;
    creator_nick: string;
    chat_secret: string;
    chat_create_time: number;
    chat_member: any;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
    get data(): UserData[] { return this.dataChange.value; }

    constructor() {
    }
}

/**
* Data source to provide what data should be rendered in the table. Note that the data source
* can retrieve its data in any way. In this case, the data source is provided a reference
* to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
* the underlying data. Instead, it only needs to take the data and send the table exactly what
* should be rendered.
*/
export class ExampleDataSource extends DataSource<any> {
    constructor(private _exampleDatabase: ExampleDatabase) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<UserData[]> {
        return this._exampleDatabase.dataChange;
    }

    disconnect() { }
}
