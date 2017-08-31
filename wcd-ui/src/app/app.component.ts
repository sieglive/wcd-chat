import { Component, OnInit } from '@angular/core';
import { ToggleService } from './service/toggle.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public message = '';
    title = 'app';

    constructor(
        private _toggle: ToggleService
    ) { }

    urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

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
                    const publicKey = 'BGQA2WKutj-hCwIWzS576InMsfDPVSDKk-dQENMqykDe-UDKdNYuSBvoTEWmbpzRvrrcYZxKI5LuBZutAfo8OTo';
                    const applicationServerKey = this.urlB64ToUint8Array(publicKey);
                    registration.pushManager.subscribe(
                        {
                            userVisibleOnly: true,
                            applicationServerKey: applicationServerKey
                        }
                    ).then(
                        PushSubscription => {
                        });
                    return true;
                }).catch(
                error => { }
                );
        }
    }
}
