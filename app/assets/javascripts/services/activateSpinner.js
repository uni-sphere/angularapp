(function () {
  'use strict';
  angular.module('mainApp.directives').service('activateSpinner', ['usSpinnerService', function(usSpinnerService) {
    return function() {
      usSpinnerService.spin('spinner-1');
      $('#grey-background').fadeIn()
    }
  }]);
}());
