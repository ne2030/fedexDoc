'use strict';

class Auth {
  constructor() {

    // // mobile test code
    // this.test = document.getElementById('testData');
    // document.getElementById('info').innerHTML = navigator.userAgent;
    //
    // this.test.appendChild(this.template('쿠키', document.cookie));



    this.provider = new firebase.auth.GoogleAuthProvider();
    this.isAuthenticate = undefined;
  }

  authenticate() {
    let cookie = document.cookie;
    if (cookie != '') {
      this.isRoot(cookie);
    } else {
      this.login().then(
        (result) => { this.isRoot(cookie); },
        (error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          alert(`
            에러코드: ${errorCode} 에러 메세지: ${errorMessage} 이메일: ${email} 크레덴시알: ${credential}`
          );
      });
    }
  }

  isRoot(cookie) {
    if (cookie.match('erguono@gmail.com')) { this.isAuthenticate = true; }
    else { this.isAuthenticate = false; }
  }

  template(title, data) {
    let item = document.createElement('tr');
    item.innerHTML = `
    <td> ${title} </td>
    <td> ${data} </td>
    `;
    return item;
  }

  login() {
    return new Promise((resolve, reject) => {
      this.provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithPopup(this.provider)
      .then((result) => {
        let user = result.user;
        this.setCookie(user.email, 30);
        resolve('done');
        // this.test.appendChild(this.template('로그인', '성공'));
        // this.test.appendChild(this.template('쿠키', document.cookie));
      })
      .catch((error) => reject(error));
    });
  }

  setCookie(email, expiryDays) {
    let d = new Date();
    d.setDate(d.getDate() + expiryDays);
    let expires = "expires=" + d.toUTCString();
    document.cookie = "email=" + email + ";" + expires;
  }
}

const auth = new Auth();
