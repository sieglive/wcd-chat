import { Component, OnInit } from '@angular/core';
import { ToggleService } from 'service/toggle.service';

@Component({
    selector: 'wcd-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public message = '';
    title = 'app';

    constructor(
        private _toggle: ToggleService
    ) { }

    ngOnInit() {
        if (Notification && Notification['permission'] !== 'granted') {
            Notification.requestPermission(
                status => {
                    if (Notification['permission'] !== status) {
                        Notification['permission'] = status;
                    }
                });
        }

        window.onfocus = function () {
            window['window_active'] = true;
        };

        window.onblur = function () {
            window['window_active'] = false;
        };

        this._toggle.fixStateOfshowNotification();

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register(
                'service-worker.js', {
                    scope: '/'
                }).then(
                registration => {
                    return true;
                }).catch(
                error => { }
                );
        }
    }
}
