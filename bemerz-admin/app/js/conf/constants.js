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


if(BEMERZ_ENV == "prod"){
  if(window.location.protocol != "https:"){
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
  }

  BemerzApp.constant('API_ENDPOINT', {
    url: '//api.keedgo.com/api/v1'
  })
    .constant('API_HTTP_HOST', {
      url: '//api.keedgo.com'
    });
} else{
  BemerzApp.constant('API_ENDPOINT', {
    url: 'http://10.10.10.50:3000/api/v1'
  })
  .constant('API_HTTP_HOST', {
    url: 'http://10.10.10.50:3000'
  });

}

BemerzApp.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
}).constant('ROOT', {
  path: window.location.origin + '/'
}).constant('VERSION', {
  version: BEMERZ_VERSION
}).constant('HTTP_TIMEOUT', 30000);

