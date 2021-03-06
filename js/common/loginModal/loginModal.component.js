import controller from './loginModal.controller';

const loginModal = {
  controller,
  bindings: {
    closeModal: '&'
  },
  template: `
    <div class="login-modal-container"
      ng-if="!$ctrl.showForgotPass"
      ng-click="$ctrl.hideModalMarkup($event)">
        <htc-sign-in
          forgot-pass="$ctrl.forgotPass()"
          hide="$ctrl.closeModal()">
        </htc-sign-in>
    </div>
  `
};

    export default loginModal;
