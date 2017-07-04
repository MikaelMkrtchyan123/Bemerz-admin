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

    .state('main.groups', {
      title: 'Groups',
      url: '/groups',
      views: {
        'mainContent': {
          templateUrl: 'templates/groups/groups.html',
          controller: 'GroupsCtrl'
        }
      }
    })

    .state('main.groups.list', {
      title: 'Groups List',
      url: '/list',
      views: {
        'groupsContent': {
          templateUrl: 'templates/groups/list.html',
          controller: 'GroupsListCtrl'
        }
      }
    });
});
