importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDH4KRqGtrYXyIQVy2pW-C9IHihoYc1akQ',
    authDomain: 'refr-india.firebaseapp.com',
    projectId: 'refr-india',
    storageBucket: 'refr-india.appspot.com',
    messagingSenderId: '471641178783',
    appId: '1:471641178783:web:9bf5a6b2df843f145f18aa',

    measurementId: 'G-3566SKDF47',

    databaseURL:
      'https://refr-india-default-rtdb.asia-southeast1.firebasedatabase.app',
    vapidKey:
      'BHvWoEqN0KY2YDZdfwX3_y5tRoUuALe9a9gJ9dOBLd56Lk7wFmMcLVk9Tylj7IBBoIGf62o76W5DWqlQJqxKBp4',
});

const messaging = firebase.messaging();