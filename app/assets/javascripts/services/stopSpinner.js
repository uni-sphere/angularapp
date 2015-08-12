(function () {
  'use strict';
  angular.module('mainApp.directives').service('stopSpinner', ['usSpinnerService', function(usSpinnerService) {
    return function() {
      usSpinnerService.stop('spinner-1');
      $('#grey-background').css('visibility', 'hidden')
    }
  }]);
}());
