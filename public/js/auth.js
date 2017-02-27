'use strict';

class Auth {
    constructor() {
        this.provider = new firebase.auth.GoogleAuthProvider();

        //make isAuthenticate private
        let isAuthenticate;

        if (document.cookie.match('erguono@gmail.com')) { isAuthenticate = true; }
        else { isAuthenticate = false; }

        this.isAuthenticate = function() {
            return isAuthenticate;
        };

        this.authenticate = function() {
            return new Promise((resolve) => {
                login().then(
                    (result) => {
                        if(result.match('erguono@gmail.com')) { isAuthenticate = true; }
                        resolve('done');
                    },
                    (error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;
                        alert(`
                            에러코드: ${errorCode} 에러 메세지: ${errorMessage} 이메일: ${email} 크레덴시알: ${credential}
                        `);
                        resolve(false);
                    });
            });
        };

        let login = function() {
            return new Promise((resolve, reject) => {
                auth.provider.addScope('https://www.googleapis.com/auth/plus.login');
                firebase.auth().signInWithPopup(auth.provider)
                    .then((result) => {
                        let user = result.user;

                        auth.setCookie(user.email, user.uid, 30);
                        resolve(user.email);
                    })
                    .catch((error) => reject(error));
            });
        };
    }



    setCookie(email, uid, expiryDays) {
        let d = new Date();
        d.setDate(d.getDate() + expiryDays);
        let expires = "expires=" + d.toUTCString();
        document.cookie = "email=" + email + ";" + "uid=" + uid + expires;
    }
}

const auth = new Auth();
