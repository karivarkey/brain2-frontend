self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};

    self.registration.showNotification(data.title || "Reminder", {
        body: data.body || "You have a reminder.",
        icon: "/icons/icon-192.png"
    });
});