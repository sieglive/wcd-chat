var EXTRA_FILES = [
    "/xjs/_/js/k=xjs.ntp.en_US.A5Wz-HYZn4g.O/m=sx,jsa,ntp,d,csi/am=CIgB/rt=j/d=1/t=zcms/rs=ACT90oH5ltQFhlJV0227Ni7Heo6bMxUBzg",
];
var CHECKSUM = "y5r5mt";

var BLACKLIST = [
    '/gen_204\?',
    '/async/',
];

var FILES = [
    '/' +
    '/ssl.gstatic.com/chrome/components/doodle-notifier-01.html'
].concat(EXTRA_FILES || []);

var CACHENAME = 'newtab-static-' + CHECKSUM;

self.addEventListener('install', function(event) {
    event.waitUntil(caches.open(CACHENAME).then(function(cache) {
        return cache.addAll(FILES);
    }));
});

self.addEventListener('activate', function(event) {
    return event.waitUntil(caches.keys().then(function(keys) {
        return Promise.all(keys.map(function(k) {
            if (k != CACHENAME && k.indexOf('newtab-static-') == 0) {
                return caches.delete(k);
            } else {
                return Promise.resolve();
            }
        }));
    }));
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(function(response) {
                var shouldCache = response.ok;

                for (var i = 0; i < BLACKLIST.length; ++i) {
                    var b = new RegExp(BLACKLIST[i]);
                    if (b.test(event.request.url)) {
                        shouldCache = false;
                        break;
                    }
                }

                if (event.request.method == 'POST') {
                    shouldCache = false;
                }

                if (shouldCache) {
                    return caches.open(CACHENAME).then(function(cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                } else {
                    return response;
                }
            });
        })
    );
});



if (!Cache.prototype.add) {

    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}

if (!Cache.prototype.addAll) {

    Cache.prototype.addAll = function addAll(requests) {
        var cache = this;

        function NetworkError(message) {
            this.name = 'NetworkError';
            this.code = 19;
            this.message = message;
        }
        NetworkError.prototype = Object.create(Error.prototype);

        return Promise.resolve()
            .then(function() {
                if (arguments.length < 1) throw new TypeError();

                requests = requests.map(function(request) {
                    if (request instanceof Request) {
                        return request;
                    } else {
                        return String(request);
                    }
                });

                return Promise.all(requests.map(function(request) {
                    if (typeof request === 'string') {
                        request = new Request(request);
                    }

                    return fetch(request.clone());
                }));
            })
            .then(function(responses) {
                return Promise.all(responses.map(function(response, i) {
                    return cache.put(requests[i], response);
                }));
            })
            .then(function() {
                return undefined;
            });
    };
}

if (!CacheStorage.prototype.match) {

    CacheStorage.prototype.match = function match(request, opts) {
        var caches = this;
        return caches.keys().then(function(cacheNames) {
            var match;
            return cacheNames.reduce(function(chain, cacheName) {
                return chain.then(function() {
                    return match || caches.open(cacheName).then(function(cache) {
                        return cache.match(request, opts);
                    }).then(function(response) {
                        match = response;
                        return match;
                    });
                });
            }, Promise.resolve());
        });
    };
}