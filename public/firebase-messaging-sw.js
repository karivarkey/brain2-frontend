importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDWQFfJfmohUgLsYxaMC3vkAbg_sek9Y-U",
    authDomain: "brain2-5802c.firebaseapp.com",
    projectId: "brain2-5802c",
    storageBucket: "brain2-5802c.firebasestorage.app",
    messagingSenderId: "537301917080",
    appId: "1:537301917080:web:3c9cf90d987ad952321fed"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    self.registration.showNotification(
        payload.notification?.title || "Reminder",
        {
            body: payload.notification?.body || "",
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: "reminder"
        }
    );
});