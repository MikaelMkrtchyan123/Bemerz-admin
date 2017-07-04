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
BemerzApp.service("BemerzUtils", function ($q) {
  this.popup = {
    alert: function (params, hasPopupOverlay) {
      var modalElem = $('#modalConfirm');
      if(hasPopupOverlay){ 
        modalElem.parent().addClass("has_overlay");
      }
      modalElem.find(".f_title").html(params.title);
      modalElem.find(".f_description").html(params.template);
      modalElem.openModal();
    },
    confirm: function (params, hasCheckbox) {
      var modalElem = $('#modalDelete');
      modalElem.find('.f_modal-checkbox').addClass('is_hidden');
      modalElem.find('#modalCheckbox').prop('checked', false);
      modalElem.find(".f_title").html(params.title);
      modalElem.find(".f_description").html(params.template);
      if(hasCheckbox){
        modalElem.find('.f_modal-checkbox').removeClass('is_hidden');
        modalElem.find(".f_modal-checkbox-desc").html(hasCheckbox.checkboxDesc);
      }
      return $q(function (resolve, reject) {
        modalElem.openModal({
          complete: function (evt) {
            reject()
          }
        });
        modalElem.find(".f_yesBtn").unbind('click').click(function () {
          modalElem.closeModal({
            out_duration: 0,
            complete: function (evt) {
              $('body').removeAttr('style');
              var isChecked = modalElem.find('#modalCheckbox').is(':checked');
              if(hasCheckbox){
              var params = {
                status: true,
                isChecked: isChecked
              };
              resolve(params);
              }
              resolve(true);
            }
          });

        });

      });
    },
    overlayClose: function () {
      $(".modal-close").click(function () {
        $(this).parents("#modalConfirm").parent().removeClass("has_overlay");
      });
    }

  };
  this.toast = {
    show: function (message) {
      Materialize.toast(message, 2500);
    }
  };
  this.history = {
    clearCache: function () {
      return $q(function (resolve, reject) {
        resolve();
      });
    },
    clearHistory: function () {
      return $q(function (resolve, reject) {
        resolve();
      });
    }
  };
  this.modal = {};

  this.loader = {
    open: function () {
      $("#overlay").addClass("is_active");

    },
    updateProgress: function (percent) {
      if(!percent){
        return;
      }
      $("#loaderPercent").html(percent + "%");
      $("#loaderPercent").show();
    },
    close: function () {
      $("#overlay").removeClass("is_active");
      $("#loaderPercent").hide();
    }
  };

  this.convertTo24Hour = function (time) {
    var hours = parseInt(time.substr(0, 2));
    if(time.indexOf('AM') != -1 && hours == 12){
      time = time.replace('12', '0');
    }
    if(time.indexOf('PM') != -1 && hours < 12){
      time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(AM|PM)/, '');
  };

  this.convertPMAMtoTime = function (time) {
    var hours = parseInt(time.substr(0, 2));
    if(hours == 24){
      hours = 0;
    }
    var minute = time.substr(3, 5);
    minute = minute ? minute : '00';
    minute = parseInt(minute);
    minute = minute < 10 ? '0' + minute : minute;
    var deltaHours = hours - 12;
    if(deltaHours < 0){
      if(hours == 0){
        hours = 12;
      }
      return hours + ':' + minute + " AM";
      console.log(deltaHours + ':' + minute + " AM");
    }
    if(deltaHours == 0){
      deltaHours = 12;
    }
    console.log(deltaHours + ':' + minute + " PM");
    return deltaHours + ':' + minute + " PM";
  };

  this.convertToDate = function (date) {
    if(!date){
      return "";
    }
    var dateFormat = date.slice(0, 10).split('-');
    return dateFormat[1] + '/' + dateFormat[2] + '/' + dateFormat[0];
  };
  
  this.convertDateToObject = function (date) {
    if(!date){
      return "";
    }
    var dateFormat = date.split('/');
    return dateFormat[0] + ',' + dateFormat[1] + ',' + dateFormat[2];
  };

  this.convertDuration = function (duration) {

    if(!duration){
      return "";
    }
    var hour = Math.floor(duration / 60);
    duration -= hour * 60;
    var minute = Math.floor(duration);
    if (minute < 10) {
      minute = "0" + minute;
    }
    return hour + ':' + minute;
  }
});

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}