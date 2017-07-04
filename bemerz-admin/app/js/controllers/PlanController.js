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

BemerzApp.controller('PlansCtrl', function ($scope, $stateParams, $state, GroupsService) {
});

BemerzApp.controller('PlansListCtrl', function ($scope, $stateParams, $state, PaymentsService) {
  $scope.userList = [];
  $scope.pages = [];
  $scope.activeIndex = 1;
  $scope.firstIndex = 1;
  $scope.lastIndex = 1;
  PaymentsService.getAllPlansInPage().then(function(plansData) {
    $scope.planList = plansData.data;
    PaymentsService.getAllPlansCount().then(function(countData) {
      var plansCount = countData.data.count;
      var plansCountInOnePage = countData.data.countInOnePage;
      var pagesCount = Math.ceil(plansCount / plansCountInOnePage);
      $scope.lastIndex = pagesCount;
      for(var i=1; i<=pagesCount; i++) {
        $scope.pages.push(i);
      }
    });
  });

  $scope.openPage = function(page) {
    if(page > $scope.lastIndex || page < $scope.firstIndex) {
      return;
    }
    PaymentsService.getAllPlansInPage(page).then(function(users) {
      $scope.activeIndex = page;
      $scope.userList = users.data;
    });
  }
});
