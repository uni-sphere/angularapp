(function () {
  
  angular.module('mainApp.directives')
    .directive('successDisplay', [function() {
      return {
        restrict: 'E',
        templateUrl: 'main/success-display.html',
        scope: {
          showSuccesspop: '=',
          success: '=',
        },
        link: function(scope) {
        }
      }
  }]);
}());