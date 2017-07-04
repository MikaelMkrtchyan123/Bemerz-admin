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

/**
 * this controller handle user login page
 */
BemerzApp.controller('LoginCtrl', function ($scope, UserService, BemerzUtils, $state, BemerzMessagesUtils) {

  // ionicMaterialInk.displayEffect();
  $scope.user = {
    name: '',
    password: ''
  };
  $scope.login = function () {
    UserService.login($scope.user);
  };

  $scope.showPasswordIsChecked = false;
  $scope.showPassword = function () {
    if($scope.showPasswordIsChecked == true){
      $scope.showPasswordIsChecked = false;
      return;
    }
    $scope.showPasswordIsChecked = true;
  };


});


BemerzApp.controller('MobileCtrl', function ($scope, $stateParams, $state, UserService) {

  $scope.isLoginAction = $stateParams.isLoginAction;


  $scope.continueUseBrowser = function () {
    UserService.inited = false;
    UserService.initUser().then(function () {
      $state.go('main.groups');
    });
  };

  var appMarketLink = "intent://view?id=123#Intent;scheme=keedgo://test;package=com.bemerz.afterschool;end;';";

  $scope.openMobileApp = function () {
    if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)){
      location.href = "keedgo://test";
      var appstorefail = "https://itunes.apple.com/us/app/keedgo/id1109732057";
      var loadedAt = +new Date;
      setTimeout(
        function () {
          if(+new Date - loadedAt < 2000){
            window.location = appstorefail;
          }
        }
        , 100);
    }
    window.open(appMarketLink);
  };


});
BemerzApp.controller('RegisterConfirmCtrl', function ($scope, $stateParams, UserService, BemerzUtils, $state, BemerzMessagesUtils) {
  $scope.dataLoading = true;
  UserService.activateAccount($stateParams.userId, $stateParams.activationCode).then(function (msg) {
    $scope.dataLoading = false;
  }, function (errMsg) {
    $scope.dataLoading = false;
  });
});

BemerzApp.controller('DashboardCtrl', function ($rootScope, $scope, $state, UserService) {
});

BemerzApp.controller('UsersCtrl', function ($rootScope, $scope, $state, UserService) {

});


BemerzApp.controller('UsersListCtrl', function ($rootScope, $scope, $state, UserService) {
  $scope.userList = [];
  $scope.pages = [];
  $scope.activeIndex = 1;
  $scope.firstIndex = 1;
  $scope.lastIndex = 1;
  UserService.getAllUsersInPage().then(function(users) {
    $scope.userList = users.data;
    UserService.getAllUsersCount().then(function(countData) {
      var usersCount = countData.data.count;
      var userCountInOnePage = countData.data.countInOnePage;
      var pagesCount = Math.ceil(usersCount / userCountInOnePage);
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
    UserService.getAllUsersInPage(page).then(function(users) {
      $scope.activeIndex = page;
      $scope.userList = users.data;
    });
  }
});
