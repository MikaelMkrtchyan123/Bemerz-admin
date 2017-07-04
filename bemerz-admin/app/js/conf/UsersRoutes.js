/*******************************************************************************
 * Bemerz Software, Inc. CONFIDENTIAL AND PROPRIETARY
 * FOR USE BY AUTHORIZED PERSONS ONLY
 *
 * This is an unpublished work fully protected by the
 * United States copyright laws and is a trade secret
 * belonging to the copyright holder.
 *
 * Copyright (c) 2016 Bemerz Software Inc.
 * All Rights Reserved.
 *******************************************************************************/
var BemerzApp = angular.module('bemerzApp');

BemerzApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('main.users', {
      url: '/users',
      cache: false,
      views: {
        'mainContent': {
          templateUrl: 'templates/users/users.html',
          controller: 'UsersCtrl'
        }
      }
    })

    .state('main.users.list', {
      url: '/list',
      cache: false,
      views: {
        'usersContent': {
          templateUrl: 'templates/users/list.html',
          controller: 'UsersListCtrl'
        }
      }
    });
});
