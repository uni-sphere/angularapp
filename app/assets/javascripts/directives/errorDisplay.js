(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('errorDispplay', [function() {
      return {
        restrict: 'E',
        templateUrl: 'main/error-display.html'
      };
    }]);
}());