import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ToggleService {

    public showNotice = true;

    constructor(
        private _http: HttpClient
    ) { }

    set showNotification(value: boolean) {
        this.showNotice = value;
        const notice_data = {
            notice: value
        };
        const notice_str = encodeURIComponent(JSON.stringify(notice_data));
        this._http.get('/inner/set-notice-toggle/' + notice_str).subscribe();
    }

    get showNotification(): boolean {
        return this.showNotice;
    }

    fixStateOfshowNotification() {
        this._http.get('/inner/get-notice-toggle').subscribe(
            data => {
                this.showNotice = data['notice'];
            });
    }

}
