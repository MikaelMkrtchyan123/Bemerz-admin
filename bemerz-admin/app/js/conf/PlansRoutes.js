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

    .state('main.plans', {
      title: 'Plans',
      url: '/plans',
      views: {
        'mainContent': {
          templateUrl: 'templates/plans/plans.html',
          controller: 'PlansCtrl'
        }
      }
    })

    .state('main.plans.list', {
      title: 'Plans List',
      url: '/list',
      views: {
        'plansContent': {
          templateUrl: 'templates/plans/list.html',
          controller: 'PlansListCtrl'
        }
      }
    });
});
