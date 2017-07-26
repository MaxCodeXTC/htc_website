class HeaderController{
  constructor(auth, $timeout, firebaseService) {
    this.auth = auth;
    this.fb = firebaseService;
    this.$timeout = $timeout;
  }
  $onInit(){
    this.loggedIn = false;
    this.loading = true;
    this.showSignIn = false;
    this.showLogOut = false;
    this.notificationActive = false;
    this.cart = [];

    this.auth.subscribeAuthChange(res => {
      this.loggedIn = res;
      this.loading = false;

      if(this.loggedIn) {
        // TODO why does this use a callback and not a promise? Fri 21 Jul 2017 00:30:56 UTC
        this.fb.getNotifications(
          notifications => {
            this.$timeout(() => {
              this.notifications = notifications
            });
          });
      }
    });

    window.addEventListener('click', event => {
      this.$timeout(() => {
        this.notificationActive = false;
      });
    });
  }
  notificationToggle(e){
    this.stopPropagation(e);
    this.notificationActive = !this.notificationActive;
  }
  stopPropagation(e){
    e.stopPropagation();
  }
  closeSignIn(){
    this.showSignIn = false;
  }
  closeLogOut(){
    this.showLogOut = false;
  }
  cartClick(){
    window.location.href = '/checkout';
  }
  clickNotificationItem(item){
    if(!item.location.includes('#!')) item.location += '/#!/';
    this.fb.markNotificationRead(item.notif_id);
    if(item.notification_type === 'comment_reply'){
      window.location.href = item.location + '?comment=' + item.firebase_id;
    }
    this.notificationActive = !this.notificationActive;
  }
}

HeaderController.$inject = ['auth', '$timeout', 'firebaseService'];

export default HeaderController;
