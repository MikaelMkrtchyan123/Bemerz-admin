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

BemerzApp.controller('GroupsCtrl', function ($scope, $stateParams, $state, GroupsService) {
});

BemerzApp.controller('GroupsListCtrl', function ($scope, $stateParams, $state, GroupsService) {
  $scope.userList = [];
  GroupsService.getAllGroups().then(function(groups) {
    $scope.groupList = groups.data;
  });
});
