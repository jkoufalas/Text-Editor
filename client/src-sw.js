const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");
// importing all the caching strategies, recipies etc for use in setting up the service worker
// offline would be used if i had an offline.html page to use if the website wet offline, but as the required objects are cached its not required

//used by inject manifest for the service worker to include pre cache manifest
precacheAndRoute(self.__WB_MANIFEST);

//cach strateg using cachefirst
const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
      //cache any requests with a status code of 0 or 200.
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
      //sets expiration
    }),
  ],
});

//used to load the urls in the service workers install phase
warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);
//navigate is used to cache when navigating between two documents and only by HTML navigation

// Asset caching for css, js and service worker
registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new CacheFirst({
    // Name of the cache storage.
    cacheName: "asset-cache",
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
        //cache any requests with a status code of 0 or 200.
      }),
    ],
  })
);
