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
var BemerzApp = angular.module('bemerzApp', ['ui.router', 'ng.httpLoader', 'angularValidator', 'validation.match', 'ngFileUpload']);

BemerzApp.run(function ($q, $rootScope, $state, GroupsService, UserService, BemerzService, BemerzMessagesUtils, $urlRouter, CountryTimeZoneService) {
  this.bermerzAppInit = false;
  this.bermerzUserInit = false;

  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
    //set title
    $(".lean-overlay").hide();
    if($state.current.title){
      document.title = $state.current.title;
    } else{
      document.title = "Keedgo";
    }
    if(this.bermerzAppInit == false){
      event.preventDefault();
      this.initBemerzAPP().then(function () {
        this.bermerzAppInit = true;
        this.handleUrlChanges(event, next, nextParams, fromState);
      }.bind(this));
      return;
    }
    this.handleUrlChanges(event, next, nextParams, fromState);

  }.bind(this));

  this.initBemerzAPP = function () {
    $("#preloaderPercent").addClass("is_active");
    return $q(function (resolve, reject) {
      BemerzService.init().then(function () {
        BemerzMessagesUtils.init().then(function () {
          $("#preloaderPercent").removeClass("is_active");
          resolve();
        });
      });
    });
  };

  this.handleUrlChanges = function (event, next, nextParams, fromState) {
    if(!UserService.isAuthenticated()){
      if(next.name.indexOf("public.") !== 0){
        event.preventDefault();

        $state.go('public.login');
      } else{
        if(event.defaultPrevented){
          $urlRouter.sync();
        }
      }
    }
    if(next.name == 'main.dashboard') {
      if(event.defaultPrevented){
        $urlRouter.sync();
      }
      return;
    }

    $state.go('main.dashboard');

  };

  setTimeout(function () {
    if($('#smartbanner').length > 0) {
      $('body').addClass('has_smartnammer');
    }
  }, 100);

});
