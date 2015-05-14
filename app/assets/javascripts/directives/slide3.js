(function () {
  'use strict';
  angular.module('mainApp.directives').directive('slide3', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide3.html',
      scope: {
        displayError: '='
      },
      link: function(scope) {
        // scope.displayError("This is just a test version. You can't download files");
      }
    }
  }]);
}());