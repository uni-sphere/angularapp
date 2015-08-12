(function () {

  angular.module('mainApp.directives').directive('slide3', ['Restangular', function(Restangular) {
    return {
      restrict: 'E',
      templateUrl: 'home/slide3.html',
      scope: {
        sandbox: '=',
        home: '='
      },
      link: function(scope) {
      }
    }
  }]);
}());
