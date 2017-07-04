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

BemerzApp.service('CountryTimeZoneService', function ($q, $http, ROOT, API_ENDPOINT, API_HTTP_HOST) {
  this.inited = false;

  this.init = function (force) {
    return $q(function (resolve, reject) {
      if(!window.localStorage.getItem("ug_info") && !force){
        $.getJSON('https://geoip.nekudo.com/api/', function (result) {
          this.userCountry = result;
          this.selectedCountry = {};
          $http.get(API_HTTP_HOST.url + '/CountryTZ.json').then(function (response) {
            this.countries = {};
            this.timezones = {};
            for (var i in response.data) {
              var tmpObj = {};
              tmpObj.active = false;
              tmpObj.id = response.data[i].id;
              tmpObj.name = response.data[i].name;
              if(tmpObj.name.toLowerCase() == result.country.name.toLowerCase()){
                this.selectedCountry = {id: tmpObj.id, name: tmpObj.name};
                window.localStorage.setItem("ug_selct", JSON.stringify(this.selectedCountry));
                tmpObj.active = true;
              }
              this.timezones[tmpObj.id] = response.data[i].tz;
              this.countries[tmpObj.id] = (tmpObj);
            }
            window.localStorage.setItem("ug_tmz", JSON.stringify(this.timezones));
            window.localStorage.setItem("ug_ct", JSON.stringify(this.countries));
            resolve(this.countries);
          }.bind(this));
          window.localStorage.setItem("ug_info", JSON.stringify(result));
        }.bind(this));
      } else{
        // Retrieve the object from storage
        var retrievedObject = localStorage.getItem('ug_info');
        this.userCountry = JSON.parse(retrievedObject);
        this.timezones = JSON.parse(window.localStorage.getItem("ug_tmz"));
        this.countries = JSON.parse(window.localStorage.getItem("ug_ct"));
        this.selectedCountry = JSON.parse(window.localStorage.getItem("ug_selct"));
        resolve(this.countries);
      }
    }.bind(this));

  };


  this.getCoutries = function () {
    return $q(function (resolve, reject) {

      if(this.countries){
        resolve(this.countries);
      }else{
        this.init().then(function(result){
          this.countries = result;
          resolve(result);
        }.bind(this));
      }
    }.bind(this));
  };

  this.getSelectedCountry = function () {
    return this.selectedCountry;
  };

  this.getCountryById = function (id) {
    if(this.countries[id]){
      return this.countries[id];
    }
    return null;
  };

  this.getTimeZone = function(countryId, id){
    if(!this.timezones){
      this.timezones = JSON.parse(window.localStorage.getItem("ug_tmz"));
    }
    if(this.timezones[countryId]){
      for(var i=0; i<this.timezones[countryId].length;i++ ){
        if(this.timezones[countryId][i].id == id){
          return this.timezones[countryId][i];
        }
      }
    }
    return null;
  };

  if(this.inited == false){
    this.init();
  }

  this.getTimezones = function (countryId) {
    if(this.timezones[countryId]){
      return this.timezones[countryId];
    }
    return this.timezones;
  };
});
