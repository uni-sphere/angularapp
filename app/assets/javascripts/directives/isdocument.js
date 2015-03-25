(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('isdocument', [function() {
      return {
        restrict: 'EA',
        scope: {
          branch: '='
        },
        link: function(scope) {

        }
      };
    }]);
}());
