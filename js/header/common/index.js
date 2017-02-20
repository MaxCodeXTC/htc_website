import angular from 'angular';
import userData from '../../common/userData';
import firebaseService from '../../common/firebaseService';
import auth from '../../common/auth';
import loginModal from '../../common/loginModal';
import logoutModal from '../../common/logoutModal';

const CommonModule = angular
  .module('header.common.module', [
    userData,
    firebaseService,
    auth,
    loginModal,
    logoutModal
  ])
  .name;

export default CommonModule;
