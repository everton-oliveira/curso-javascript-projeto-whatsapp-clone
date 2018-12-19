const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor() {
         

        this._config = {            
            apiKey: "AIzaSyAq58gwQ9oGdPXM-wCusxdD1_fa2x_tK3o",
            authDomain: "whatsapp-clone-curso-hcode.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-curso-hcode.firebaseio.com",
            projectId: "whatsapp-clone-curso-hcode",
            storageBucket: "gs://whatsapp-clone-curso-hcode.appspot.com",
            messagingSenderId: "366027962057"
          };
        
        this.init();
    }

    init() {

        if (!window._initializedFirebase) {
            // Initialize Firebase
            firebase.initializeApp(this._config);        
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;    
        }
    }

    static db() {
        return firebase.firestore();
    }

    static hd() {
        return firebase.storage();
    }

    initAuth() {
        return new Promise((s, f) => {
            let provider = new firebase.auth.GoogleAuthProvider();
            
            firebase.auth().signInWithPopup(provider).then(result => {
                let token = result.credential.accessToken;
                let user = result.user;

                s({
                    user,
                    token
                });
            });
        });
    }
}