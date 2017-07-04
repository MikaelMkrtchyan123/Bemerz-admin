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
BemerzApp.service('Image', function ($http, API_ENDPOINT, BemerzUtils) {
  this.getImage = function (type, img, updated) {
    var timestamp = "";
    if(updated){
      timestamp = "?" + updated;
    }
    return API_ENDPOINT.url + '/img/' + type + '/' + img + timestamp;
  };
  this.currentUploadedImageB64Data = "";
  this.imageUploadHandler = function (element, callback) {
    var ext = element.value.match(/\.([^\.]+)$/)[1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        //alert('allowed');
        break;
      default:
        BemerzUtils.popup.alert({
          template: 'Please upload image file'
        });
        $("#uploadImageBtn").val("");
        return;
    }
    var f = element.files[0];
    if(f.size > 20971520){
      var confirmPopup = BemerzUtils.popup.alert({
        title: 'Error',
        template: "That image is too large, please select an image that's less than 1MB"
      });
      $("#uploadImageBtn").val("");
      return;
    }

    loadImage.parseMetaData(f, function (data) {
      var options = {canvas: true};
      if(data.exif){
        options.orientation = data.exif.get('Orientation')
      }
      loadImage(
        f,
        function (img) {
          var base64Img = img.toDataURL();
          $("#previewImage").css("background-image", 'url("' + base64Img + '")');
          this.currentUploadedImageB64Data = base64Img;
          callback(base64Img.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, ""));
        }.bind(this),
        options
      );
    }.bind(this));

  };

  this.getCurrentUploadedImageB64Data = function () {
    return this.currentUploadedImageB64Data;
  }

});

BemerzApp.service('BemerzService', function ($q, $http, API_ENDPOINT, API_HTTP_HOST, BemerzUtils, $injector) {
  this.appConfig = {};

  this.init = function () {
    return $q(function (resolve, reject) {
      $http.get(API_HTTP_HOST.url + '/app_config.json').then(function (data) {
        this.appConfig = data.data;
        resolve();
      }.bind(this));
    }.bind(this));
  };

  this.getAppConfig = function () {
    return this.appConfig;
  };

  //handle for old api
  this.v1_httpSuccessCallbackHandler = function (result) {
    return $q(function (resolve, reject) {
      if(result.data.success){
        resolve(result.data.data);
        BemerzUtils.loader.close();
        return;
      }
      reject(result.data);
      BemerzUtils.loader.close();
    });
  };
  //handle for rest api
  this.httpSuccessCallbackHandler = function (result) {
    return $q(function (resolve, reject) {
      if(result.status >= 200 && result.status < 210){
        resolve(result.data);
        BemerzUtils.loader.close();
        return;
      }
      reject(result.data);
      BemerzUtils.loader.close();
    });
  };

  this.httpErrorCallbackHandler = function (result) {
    return $q(function (resolve, reject) {
      if(result.status == "-1"){
        BemerzUtils.loader.close();
        var msg = "Hmm... keedgo is having a hard time with this operation. Please try again later.";
        if(!navigator.onLine){
          msg = "Hmm... Looks like we lost our connection to the mothership. Please try again later.";
        }
        BemerzUtils.popup.alert({
          template: msg
        }, true);
        reject();
        return;
      }
      if(result.status == 401){
        var userService = $injector.get("UserService");
        userService.logout();
        return;
      }
      if(result.status == 404 || result.status == 408 || result.status == 500 || result.status == 413){
        BemerzUtils.loader.close();
        var alertPopup = BemerzUtils.popup.alert({
          template: "Oops! This operation failed. Please try again later."
        });
        reject();
        return;
      }
      reject(result);
    });
  };
});

BemerzApp.service('TokenInterceptor', function ($injector) {
  this.request = function (config) {
    var userService = $injector.get("UserService");
    config.headers['Authorization'] = userService.getUserToken();
    config.headers['X-KEEDGO-VERSION'] = BEMERZ_VERSION;
    return config;
  };
});

BemerzApp.service('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  this.responseError = function (response) {
    $rootScope.$broadcast({
      401: AUTH_EVENTS.notAuthenticated
    }[response.status], response);
    return $q.reject(response);
  };
});
