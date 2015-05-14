(function () {
  'use strict';
  angular.module('mainApp.directives')
    .directive('dragndropView', [function() {
      return {
        restrict: 'E',
        templateUrl: 'webapp/dragndrop-view.html'
      };
    }]);
}());