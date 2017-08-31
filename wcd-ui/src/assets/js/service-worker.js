console.log('out service worker', self);

var showNotification = true;

self.addEventListener('install', function(event) {
    // console.log('Install event:', event);
});

self.addEventListener('activate', function(event) {
    // console.log('Activate event:', event);
});

self.addEventListener('push', function(event) {
    console.log('Push event:', event);
    const options = {
        dir: 'auto',
        lang: 'utf-8',
        tag: 'banlangen',
        icon: '/assets/xiaohei.png',
        body: '你好哈， push'
    };
    const date = new Date().toLocaleString();
    self.registration.showNotification(date, options);
});

self.addEventListener('fetch', event => {
    let fragement = event.request.url.split('://');
    if (fragement.length > 1) {
        fragement = fragement.slice(0, 1).concat(fragement[1].split('/'));
    }
    if (fragement[2] === 'inner') {
        if (fragement[3] === 'callnotification' && showNotification) {
            event.respondWith(
                new Response('{"asd": 123}', {
                    headers: { 'Content-type': 'application/json' }
                }));
            const notice = JSON.parse(decodeURIComponent(fragement.slice(4).join('')));
            const options = {
                dir: 'auto',
                lang: 'utf-8',
                badge: '/assets/xiaohei.png',
                icon: '/assets/xiaohei.png',
                body: notice['message'].join('\n'),
                data: notice
            };
            self.registration.showNotification(notice['title'], options);
        } else if (fragement[3] === 'set-notice-toggle') {
            const notice = JSON.parse(decodeURIComponent(fragement.slice(4).join('')));
            showNotification = notice.notice;

            const res_data = {
                notice: showNotification
            };
            const res_str = JSON.stringify(res_data);

            event.respondWith(
                new Response(res_str, {
                    headers: { 'Content-type': 'application/json' }
                }));
            console.log(showNotification);
        } else if (fragement[3] === 'get-notice-toggle') {
            const res_data = {
                notice: showNotification
            };
            const res_str = JSON.stringify(res_data);

            event.respondWith(
                new Response(res_str, {
                    headers: { 'Content-type': 'application/json' }
                }));
            console.log(showNotification);
        }
    }

});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.', event);

    event.notification.close();

    var focus_list = event.notification.data.focus;

    event.waitUntil(
        clients.matchAll({
            includeUncontrolled: true,
            type: 'all'
        }).then(
            clientList => {
                for (const client of clientList) {
                    var fragement = splitUrl(client.url);
                    if (matchFocus(focus_list, fragement.slice(2))) {
                        return client.focus();
                    }
                }
                for (const client of clientList) {
                    var fragement = splitUrl(client.url);
                    if (fragement[2] === 'chat' || fragement[2] === 'chat-list') {
                        return client.focus();
                    }
                }
            })
    );
});

function splitUrl(url) {
    var fragement = url.split('://');
    if (fragement.length > 1) {
        fragement = fragement.slice(0, 1).concat(fragement[1].split('/'));
    }
    return fragement;
}

function matchFocus(focus_list, match_list) {
    if (match_list.length < focus_list.length) {
        return false;
    }
    for (i = 0; i < focus_list.length; i++) {
        if (match_list[i] !== focus_list[i]) {
            return false;
        }
    }
    return true;
}

console.log('service worker');