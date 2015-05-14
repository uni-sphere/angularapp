(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('errorDisplay', [function() {
      return {
        restrict: 'E',
        templateUrl: 'main/error-display.html',
        scope: {
          listError: '=',
          showError: '='
        },
        link: function(scope) {
          scope.hideError = function(){
            scope.listError = [];
            scope.showError = false;
          }
        }
      }
  }]);
}());