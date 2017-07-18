import angular from 'angular';
import ngAnimate from 'angular-animate';

import userData from '../../common/userData';
import firebaseService from '../../common/firebaseService';
import dataService from '../../common/dataService';
import analytics from '../../common/analytics';

import header from '../../common/header';
import spinner from '../../common/spinner';

const CommonModule = angular
  .module('checkout.common.module', [
    userData,
    ngAnimate,
    firebaseService,
    header,
    spinner,
    dataService,
    analytics
  ])
  .name;

export default CommonModule;
