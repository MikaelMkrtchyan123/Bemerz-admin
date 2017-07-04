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

BemerzApp.service('GroupsService', function ($http, $q, Image, Upload, API_ENDPOINT, BemerzService, UserService) {

  this.getAllGroups = function(page) {
    page = page ? page : 1;
    return $q(function (resolve, reject) {
      /*if(!UserService.isAuthenticated()){
        return;
      }*/
      $http.get(API_ENDPOINT.url + '/groups/list/' + page).then(function (result) {
        if(result.data.success){
          resolve(result.data);
        } else{
          reject(result);
        }
      }.bind(this), BemerzService.httpErrorCallbackHandler);
    }.bind(this));
  };
});
