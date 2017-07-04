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
    .state('main', {
      url: '/main',
      abstract: true,
      controller: "MainCtrl",
      templateUrl: 'templates/main/main.html'
    })
    .state('main.dashboard', {
      url: '/dashboard',
      views: {
        'mainContent': {
          templateUrl: 'templates/main/dashboard.html',
          controller: 'DashboardCtrl'
        }
      }
    });


  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("main.dashboard");
  });
});
