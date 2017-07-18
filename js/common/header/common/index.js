import angular from 'angular';
import ngAnimate from 'angular-animate';

import userData from '../../userData';
import firebaseService from '../../firebaseService';
import auth from '../../auth';
import loginModal from '../../loginModal';
import logoutModal from '../../logoutModal';
import trackingPixels from '../../trackingPixels';

const CommonModule = angular
  .module('header.common.module', [
    userData,
    ngAnimate,
    trackingPixels,
    firebaseService,
    auth,
    loginModal,
    logoutModal
  ])
  .name;

export default CommonModule;