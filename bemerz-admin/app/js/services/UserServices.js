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
var BEMERZUSER = {};
BemerzApp.service('UserService', function ($q, $http, $state, $rootScope, API_ENDPOINT, BemerzService, Image, BemerzUtils, BemerzMessagesUtils) {
  var LOCAL_TOKEN_KEY = 'tokenKey';
  this.authToken = false;
  this.activeUser = false;
  this.localUser = null;
  this.afterLogout = false;
  //TODO temp solutions
  this.loginedUserMemberId = null;
  this.loginedMemberUser = null;

  this.setUserToken = function (token) {
    this.authToken = token;
  };

  this.getUserToken = function () {
    if(this.authToken !== false){
      return this.authToken;
    }
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if(!token){
      token = null;
    }
    this.setUserToken(token);
    return this.authToken;
  };

  this.register = function (user) {
    return $q(function (resolve, reject) {
      $http.post(API_ENDPOINT.url + '/users/signup', user).then(function (result) {
        if(result.data.success){
          resolve(result.data.msg);
        } else{
          reject(result.data.msg);
        }
      });
    });
  };

  this.getAllUsersInPage = function(page) {
    page = page ? page : 1;
    return $q(function (resolve, reject) {
      if(!this.isAuthenticated()){
        return;
      }
      $http.get(API_ENDPOINT.url + '/users/list/' + page).then(function (result) {
        if(result.data.success){
          resolve(result.data);
        } else{
          reject(result);
        }
      }.bind(this), BemerzService.httpErrorCallbackHandler);
    }.bind(this));
  };

  this.getAllUsersCount = function() {
    return $q(function (resolve, reject) {
      if(!this.isAuthenticated()){
        return;
      }
      $http.get(API_ENDPOINT.url + '/users/count').then(function (result) {
        if(result.data.success){
          resolve(result.data);
        } else{
          reject(result);
        }
      }.bind(this), BemerzService.httpErrorCallbackHandler);
    }.bind(this));
  };

  this.login = function (user) {
    this.inited = false;
    return $http.jsonp(API_ENDPOINT.url + '/users/auth?name=' + user.name + '&password=' + user.password + '&callback=JSON_CALLBACK').then(function (result) {
      if(result.data.success){
        window.localStorage.setItem(LOCAL_TOKEN_KEY, result.data.token);
        this.setUserToken(result.data.token);
        if(isMobile()){
          $state.go('public.mobile-welcome', {groupName: '', isLoginAction: true});
          return;
        }
        //init user
        this.initUser().then(function () {
          $state.go('main.groups');
        });
      } else{
        BemerzUtils.popup.alert(BemerzMessagesUtils.getMessageByKey("user", "error_login"));
      }
    }.bind(this), BemerzService.httpErrorCallbackHandler);
  };

  this.doLogout = function () {
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    document.cookie = 'authorization=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.setUserToken(null);
    this.inited = false;
  };

  this.logout = function () {
    this.doLogout();
    if(this.localUser != null){
      this.localUser = null;
      window.location.reload();
    } else{
      $state.go("public.login", {}, {reload: true});
    }

  };

  this.isAuthenticated = function () {
    if(this.getUserToken() != null){
      return true;
    }
    return false;
  };

  this.init = function () {
    return this.getUser;
  };

  this.getUser = function () {
    return $q(function (resolve, reject) {
      if(!this.isAuthenticated()){
        return;
      }
      $http.get(API_ENDPOINT.url + '/users').then(function (result) {
        if(result.data.success){
          this.localUser = result.data;
          this.localUser.picture = Image.getImage('user', this.localUser._id, Date.now());
          resolve(result.data);
        } else{
          this.logout();
          reject(result);
        }
      }.bind(this), BemerzService.httpErrorCallbackHandler);
    }.bind(this));

  };
  this.getUserInfo = function (force) {
    return this.localUser.data;
  };

  this.isNewAccount = function () {
    return this.localUser.newAccount;

  };

  this.isUserHasGroup = function () {
    return this.localUser.hasGroup;
  };

  this.isUserHasPin = function () {
    return this.localUser.pin;

  };

  this.addUserInfo = function (user, type) {
    return $http.put(API_ENDPOINT.url + '/users', user).then(function (result) {
      if(result.data.success){
        for (var i in user) {
          this.localUser.data[i] = user[i];
        }
        this.localUser.newAccount = false;
        $rootScope.user = this.getUserInfo();
        if(type == "add"){
          if(this.isUserHasPin()){
            this.localUser.data.pin = this.localUser.pin;
          }
          this.initUser().then(function () {
            $state.go('main.groups');
          });
        }
      }

    }.bind(this), BemerzService.httpErrorCallbackHandler);
  };

  this.activateAccount = function (userId, activationCode) {
    return $http.get(API_ENDPOINT.url + '/users/emailVerif?id=' + userId + "&code=" + activationCode).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.checkStatus = function (memberId, email) {
    return $http.get(API_ENDPOINT.url + '/users/checkStatus?memberId=' + memberId + "&email=" + email).then(BemerzService.httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.joinGroup = function (member) {
    return $http.post(API_ENDPOINT.url + '/users/joinGroup', member).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.joinUserToGroup = function (memberId) {
    var params = {
      memberId: memberId
    };
    return $http.post(API_ENDPOINT.url + '/users/join-user-to-group', params).then(BemerzService.httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.changePasswordAction = function (password, newPassword) {
    return $http.post(API_ENDPOINT.url + '/users/changePassword', {
      password: password,
      newPassword: newPassword
    }).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.forgotPasswordAction = function (email) {
    return $http.post(API_ENDPOINT.url + '/users/sendResetPassword', {
      email: email
    }).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.lostInvitationAction = function (email) {
    return $http.post(API_ENDPOINT.url + '/users/send-new-invitation', {
      email: email
    }).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.resetPasswordAction = function (userId, password, verifcode) {
    return $http.post(API_ENDPOINT.url + '/users/resetPassword', {
      userId: userId,
      password: password,
      verifCode: verifcode
    }).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.changePinAction = function (pin, newPin) {
    return $http.post(API_ENDPOINT.url + '/users/changePin', {
      pin: pin,
      newPin: newPin
    }).then(BemerzService.v1_httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.getIncompleteMembers = function (userId, password, verifcode) {
    return $http.get(API_ENDPOINT.url + '/users/getIncompleteMembers').then(BemerzService.httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.sendReferralAction = function (params) {
    return $http.post(API_ENDPOINT.url + '/users/sendReferral', params).then(BemerzService.httpSuccessCallbackHandler, BemerzService.httpErrorCallbackHandler);
  };

  this.isActiveUser = function () {
    return this.activeUser;
  };

  this.activateLocalUser = function () {
    this.activeUser = true;
  };
  this.inited = false;
  this.initUser = function () {

    return $q(function (resolve, reject) {
      if(this.inited){
        reject();
        return;
      }
      this.inited = true;
      var handleUserRegisterComplate = function () {
        if(this.isNewAccount()){
          this.inited = false;
          this.initNewAccount();
          return;
        }
        if(!this.isUserHasGroup()){
          this.inited = false;
          this.initUserCreateGroup();
          return;
        }
        this.getIncompleteMembers().then(function (data) {
          if(data.incompleteMemberIds.length > 0){
            this.activateLocalUser();
            $state.go('main.groups.group.roster.join', {
              "groupId": data.incompleteMemberIds[0].groupId,
              "memberId": data.incompleteMemberIds[0].memberId,
              "firstName": $rootScope.user.firstName,
              "lastName": $rootScope.user.lastName,
              "memberPhone": $rootScope.user.phone
            }, {reload: true});
            reject();
          } else{
            this.activateLocalUser();
            resolve();
          }
        }.bind(this));

      }.bind(this);
      if(this.localUser == null){
        this.getUser().then(function () {
          $rootScope.userId = this.getUserInfo()._id;
          $rootScope.user = this.getUserInfo();
          handleUserRegisterComplate();
        }.bind(this));
        return;
      }
      handleUserRegisterComplate();
    }.bind(this));
  };


  this.initNewAccount = function () {
    $state.go('main.add_user_info', {newAccount: true});
  };

  this.initUserCreateGroup = function () {
    $state.go('main.groups.create', {newAccount: true});
    this.isActiveUser();
  };

  this.initUserInCompleteMembers = function () {

    this.getIncompleteMembers().then(function (data) {
      if(data.incompleteMemberIds.length > 0){
        $state.go('main.groups.group.roster.join', {
          "groupId": BEMERZUSER.data.incompleteMemberIds[0].groupId,
          "memberId": BEMERZUSER.data.incompleteMemberIds[0].memberId,
          "firstName": BEMERZUSER.data.data.firstName,
          "lastName": BEMERZUSER.data.data.lastName,
          "memberPhone": BEMERZUSER.data.data.phone
        });

      }
      this.activateLocalUser();
      this.isActiveUser();
      resolve();
    }.bind(this));
  };

});