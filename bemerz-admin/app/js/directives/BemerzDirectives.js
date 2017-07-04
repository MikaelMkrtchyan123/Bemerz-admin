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


BemerzApp.directive('backImg', function () {
  return function (scope, element, attibutes) {
    var url = attibutes.backImg;
    element.css({
      'background-image': 'url(' + url + ')'
    });
  };
});

BemerzApp.directive('selectRepeatDirective', function ($timeout) {
  return function (scope, element, attrs) {
    if(scope.$last){
      $timeout(function () {
        element.parent("select").material_select();
        var selectLength = element.parent().parent();
        for(var i = 0; i < selectLength.length; i++) {
          selectLength[i].childNodes[1].readOnly = true;
        }
      });
    }
  };
});

BemerzApp.directive('tsSelectFix', function () {
  return {
    link: function (scope, element, attrs) {
      var model = scope;

      // only works with model references in this format: "data.test"
      attrs.ngModel.split('.').forEach(function (part) {
        model = model[part];
      });

      scope.$watch(function () {
        return element.children().length;
      }, function () {
        scope.$evalAsync(function () {
          // iterate through <option>s
          Array.prototype.some.call(element.children(), function (child) {
            if(child.value === model.toString()){
              child.setAttribute('selected', 'selected');
            }

            // prevent select from being stuck and remove phantom option.
            // in a setTimeout to run after digest cycle.
            setTimeout(function () {
              element.triggerHandler('change');
            }, 0);
            return false;
          });
        });
      });
    }
  };
});

BemerzApp.directive("limitTodirective", [function () {
  return {
    restrict: "A",
    link: function (scope, elem, attrs) {
      var limit = parseInt(attrs.limitTo);
      angular.element(elem).on("keypress", function (e) {
        if(this.value.length == limit) e.preventDefault();
      });
    }
  }
}]);

BemerzApp.directive('navBar', function () {
  return {
    templateUrl: 'templates/main/nav_bar.html',
    controller: function ($scope, $state) {
      if($state.current.name.indexOf("main.users.list") == 0){
        $scope.isUsersActive = true;
      }
      if($state.current.name.indexOf("main.groups.list") == 0){
        $scope.isGroupsActive = true;
      }
      if($state.current.name.indexOf("main.plans.list") == 0){
        $scope.isPlansActive = true;
      }
      if($state.current.name.indexOf("main.documents") == 0){
        $scope.isDocumentsActive = true;
      }
    }
  };
});


BemerzApp.directive('validfile', function validFile(BemerzUtils) {

  var validFormats = ['jpg', 'gif', 'png'];
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      ctrl.$validators.validFile = function () {
        elem.on('change', function () {
          var value = elem.val(),
            ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
          if(validFormats.indexOf(ext) === -1){
            BemerzUtils.popup.alert({
              template: 'Please upload image file'
            });
          }
        });
      };
    }
  };
});

BemerzApp.directive('equals', function () {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, elem, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function () {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function () {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;

        // set validity
        ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
      };
    }
  }
});