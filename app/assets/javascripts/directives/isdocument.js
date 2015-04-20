(function () {
  'use strict';

  angular.module('mainApp.directives')
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
