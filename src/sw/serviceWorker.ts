import { skipWaiting, clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

skipWaiting();
clientsClaim();

registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));
