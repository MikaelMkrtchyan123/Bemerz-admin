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
BemerzApp.service("BemerzMessagesUtils", function ($http, $q, API_ENDPOINT, BemerzService, CountryTimeZoneService) {
  this.messages = {};
  this.init = function () {
    //var messages = window.localStorage.getItem("bmsg");
    return $q(function (resolve, reject) {
      $http.get(API_ENDPOINT.url + '/static-messages/version').then(function (data) {
        var response = data.data;
        if(this.getVersion() == response.version){
          this.messages = JSON.parse(window.localStorage.getItem("bmsg"));
          resolve();
          return;
        }
        window.localStorage.removeItem("ug_info");
        CountryTimeZoneService.init();
        this.update(response.version).then(function () {
          resolve();
        });
      }.bind(this));
    }.bind(this));
  };

  this.update = function (version) {
    return $q(function (resolve, reject) {
      $http.get(API_ENDPOINT.url + '/static-messages/messages').then(function (data) {
        var response = data.data.messages;
        window.localStorage.setItem("bmsg_v", version);
        window.localStorage.setItem("bmsg", JSON.stringify(response));
        this.messages = response;
        resolve();
      }.bind(this));
    }.bind(this));
  };


  this.getVersion = function () {
    return window.localStorage.getItem("bmsg_v");
  };


  this.getMessageByKey = function (type, key) {
    if(typeof this.messages[type] == "undefined" || this.messages[type][key] == "undefined"){
      return {
        title: "",
        template: ""
      }
    }
    var messageObj = Object.assign({}, this.messages[type][key]);

    if(arguments[2] && typeof arguments[2] == "object"){
      for (var i in arguments[2]) {
        messageObj.message = messageObj.message.replace(new RegExp(i, "g"), arguments[2][i]);
      }
    }
    if(arguments[3] && typeof arguments[3] == "object"){
      for (var j in arguments[3]) {
        messageObj.title = messageObj.title.replace(new RegExp(j, "g"), arguments[3][j]);
      }
    }
    messageObj.message = messageObj.message.replace(new RegExp("%BEMERZ_NEXT_LINE%", "g"), "<br/><br/>");
    messageObj.message = messageObj.message.replace(new RegExp("%BEMERZ_BOLD_START%", "g"), "<strong>");
    messageObj.message = messageObj.message.replace(new RegExp("%BEMERZ_BOLD_END%", "g"), "</strong>");
    return {
      title: messageObj.title,
      template: messageObj.message
    }
  };
});