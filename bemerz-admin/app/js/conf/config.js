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

BemerzApp.config(function ($httpProvider, $injector) {

  //var BemerzUtils = $injector.get("BemerzUtils");
  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push('TokenInterceptor');
  $httpProvider.interceptors.push('bemerzHttpInterceptor');
});
BemerzApp.service('bemerzHttpInterceptor', function ($q, BemerzUtils, API_ENDPOINT, HTTP_TIMEOUT) {
  this.request = function (config) {
    if(config.url.indexOf(API_ENDPOINT.url) === 0){
      BemerzUtils.loader.open();
    }
    config.timeout = HTTP_TIMEOUT;
    return config;
  };

  this.responseError = function (response) {

    BemerzUtils.loader.close();
    return $q.reject(response);
  };
  this.response = function (response) {
    if(response.config.url.indexOf(API_ENDPOINT.url) === 0){
      BemerzUtils.loader.close();
    }
    return $q.resolve(response);
  };
});

BemerzApp.config(['httpMethodInterceptorProvider',
  function (httpMethodInterceptorProvider) {
    // httpMethodInterceptorProvider.whitelistDomain('bemerzapp-dev.us-west-2.elasticbeanstalk.com');
  }
]);