(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('uiTreePerso', [function() {
      return {
        restrict: 'E',
        templateUrl: 'main/view-document.html'
      };
    }]);
}());


