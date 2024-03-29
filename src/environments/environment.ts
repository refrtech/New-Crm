// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //domain:"https://app.refr.club",
  domain: 'https://devrefrclient.web.app',
  //server:"",
  server: 'https://us-central1-refr-india.cloudfunctions.net/ind_serve',
  //server:"https://refr.club/ind_serve",
  //server:"http://localhost:5001/refr-india/us-central1/ind_serve",

  refrBot: {
    vr: 101.99991,
    web: 1.99991,
    andi: 1.99991,
    ios: 1.99991,
    env: false,
    code: 'Albatrosses',
    date: 1644195271637,
  },

  publicKey:'public_C+HVmi4u3PibyRYt5Ldz+EJ6gHk=',
  urlEndpoint:'https://ik.imagekit.io/refrclub01',
  authenticationEndpoint:'https://us-central1-refr-india.cloudfunctions.net/ind_serve',

  firebaseConfig: {
    apiKey: 'AIzaSyDH4KRqGtrYXyIQVy2pW-C9IHihoYc1akQ',
    authDomain: 'refr-india.firebaseapp.com',
    projectId: 'refr-india',
    storageBucket: 'refr',
    messagingSenderId: '471641178783',
    appId: '1:471641178783:web:9bf5a6b2df843f145f18aa',
    measurementId: 'G-3566SKDF47',
    databaseURL:
      'https://refr-india-default-rtdb.asia-southeast1.firebasedatabase.app',
    vapidKey:
      'BHvWoEqN0KY2YDZdfwX3_y5tRoUuALe9a9gJ9dOBLd56Lk7wFmMcLVk9Tylj7IBBoIGf62o76W5DWqlQJqxKBp4',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
