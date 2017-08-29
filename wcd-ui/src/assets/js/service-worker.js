console.log('out service worker', self);

self.addEventListener('install', function(event) {
    console.log('Install event:', event);
});

self.addEventListener('activate', function(event) {
    console.log('Activate event:', event);
    const options = {
        dir: 'auto',
        lang: 'utf-8',
        tag: 'banlangen',
        icon: '/assets/xiaohei.png',
        body: '你好哈， activate'
    };
    const date = new Date().toLocaleString();
    self.registration.showNotification(date, options);
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
    // console.log('Fetch event:', event);
    // console.log(event.request);
    // console.log(event.path);
    let fragement = event.request.url.split('://');
    if (fragement.length > 1) {
        fragement = fragement.slice(0, 1).concat(fragement[1].split('/'));
    }
    if (fragement[2] === 'inner') {
        event.respondWith(
            new Response('{"asd": 123}', {
                headers: { 'Content-type': 'application/json' }
            }));
        if (fragement[3] === 'callnotification') {
            const notice = fragement.slice(4).join('');
            const body = JSON.parse(decodeURIComponent(notice));
            const options = {
                dir: 'auto',
                lang: 'utf-8',
                icon: '/assets/xiaohei.png',
                body: body['message'].join('\n')
            };
            const date = new Date(body['msg_time']).toLocaleString();
            self.registration.showNotification(date, options);
        }
    }

});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.', event);

    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            includeUncontrolled: true,
            type: 'all'
        }).then(
            function(clientList) {
                console.log(clientList);
                for (const client of clientList) {
                    let fragement = client.url.split('://');
                    if (fragement.length > 1) {
                        fragement = fragement.slice(0, 1).concat(fragement[1].split('/'));
                    }
                    if (fragement[2] === 'chat') {
                        return client.focus();
                    }
                }
            })
    );
});
console.log('service worker');