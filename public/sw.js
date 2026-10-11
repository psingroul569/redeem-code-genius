// Service worker shared by two push senders:
//   1. Our own "new code" alerts (send-push edge function).
//   2. Monetag push ads (zone 9477480), loaded via importScripts below.
// Our listeners are registered first and stop propagation for our own
// pushes/clicks, so Monetag's handlers only ever see Monetag traffic.
// No offline caching — that's a separate concern from alerts.

const OWN_TAG = "ff-new-code";

/** True when a push payload came from our send-push function. */
const isOwnPayload = (data) =>
  !!data && (data.source === "ffcodes" || (typeof data.title === "string" && data.title.startsWith("New Free Fire Code")));

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = null;
  try {
    data = event.data ? event.data.json() : null;
  } catch {
    data = null;
  }
  if (!isOwnPayload(data)) return; // Monetag's handler takes it from here.

  event.stopImmediatePropagation();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body || "A new redeem code just went live.",
      icon: "/logo.png",
      badge: "/logo.png",
      data: { url: data.url || "/" },
      tag: OWN_TAG,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  if (event.notification.tag !== OWN_TAG) return; // Monetag notification.

  event.stopImmediatePropagation();
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});

// Monetag push (zone 9477480).
self.options = {
  domain: "3nbf4.com",
  zoneId: 9477480,
};
self.lary = "";
importScripts("https://3nbf4.com/act/files/service-worker.min.js?r=sw");
