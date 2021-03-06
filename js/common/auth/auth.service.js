class Auth{
  constructor(firebaseService, analytics) {
    this.fb = firebaseService;
    this.analytics = analytics;

    this.authSubs = [];
    this.loggedIn = false;

    this.isLoggedIn();
  }
  isLoggedIn() {
    this.fb.api.checkForJWT();
    const token = JSON.parse(localStorage.getItem('htca')) || '';
    if (token) {
      this.loggedIn = true;
    }

    return this.fb.isLoggedIn()
      .then(res => {
        this.authSubs.forEach(fn => fn(res));
        this.loggedIn = res;
        return this.loggedIn;
      });
  }
  signOut() {
    return this.fb.logOut()
      .then(res => {
        this.authSubs.forEach(fn => fn(false));
        this.loggedIn = false;
        return res;
      });
  }
  subscribeAuthChange(fn) {
    this.authSubs.push(fn);
    if (this.loggedIn) {
      setTimeout(() => {
        fn(true);
      }, 0);
    }
    return () => {
      const index = this.authSubs.indexOf(fn);

      if (index > -1) {
        this.authSubs.splice(index, 1);
      }
    }
  }
}

Auth.$inject = ['firebaseService', 'analyticsService'];

export default Auth;
