(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('successDisplay', [function() {
      return {
        restrict: 'E',
        templateUrl: 'main/success-display.html',
        scope: {
          showSuccess: '=',
          success: '='
        },
        link: function(scope) {
        }
      }
  }]);
}());