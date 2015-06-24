(function () {
  
  angular.module('mainApp.directives').directive('slide3', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide3.html',
      scope: {
        desactivateSpinner: '=',
        activateSpinner: '=',
        sandbox: '=',
        home: '='
      },
      link: function(scope) {
        // scope.displayError("This is just a test version. You can't download files");
      }
    }
  }]);
}());
